#!/usr/bin/env bash
#
# 一键部署脚本 —— 在阿里云服务器上执行：
#
#   ./build.sh              拉取代码 + 重新构建 + 重启容器
#   ./build.sh --no-pull    跳过 git pull（部署当前工作区的代码）
#   ./build.sh --rollback   回滚到上一个镜像
#   ./build.sh --logs       查看容器日志
#
# 设计要点：先构建成临时标签，只有构建成功、健康检查通过之后才切换容器。
# 构建失败时旧容器完全不受影响，网站不会中断。

set -euo pipefail

# ---------------------------------------------------------------- 配置
APP_NAME="huazeno"
IMAGE="${APP_NAME}:latest"
IMAGE_PREV="${APP_NAME}:previous"
IMAGE_NEW="${APP_NAME}:building"
HOST_PORT="${HOST_PORT:-3000}"
CONTAINER_PORT=3000
ENV_FILE=".env.production"
HEALTH_PATH="/"
HEALTH_TIMEOUT=60          # 等待容器就绪的最长秒数

cd "$(dirname "$0")"

# ---------------------------------------------------------------- 输出
if [ -t 1 ]; then
  R=$'\e[31m'; G=$'\e[32m'; Y=$'\e[33m'; B=$'\e[1m'; N=$'\e[0m'
else
  R=''; G=''; Y=''; B=''; N=''
fi
say()  { printf '%s\n' "${B}==>${N} $*"; }
ok()   { printf '%s\n' "${G}  ✓${N} $*"; }
warn() { printf '%s\n' "${Y}  !${N} $*"; }
die()  { printf '%s\n' "${R}  ✗${N} $*" >&2; exit 1; }

# ---------------------------------------------------------------- 子命令
docker_ok() { command -v docker >/dev/null 2>&1 || die "未找到 docker"; }

case "${1:-}" in
  --logs)
    docker_ok; exec docker logs -f --tail 200 "$APP_NAME"
    ;;
  --rollback)
    docker_ok
    docker image inspect "$IMAGE_PREV" >/dev/null 2>&1 \
      || die "没有可回滚的镜像（${IMAGE_PREV} 不存在）"
    say "回滚到上一个镜像"
    docker tag "$IMAGE_PREV" "$IMAGE"
    docker rm -f "$APP_NAME" >/dev/null 2>&1 || true
    # shellcheck disable=SC2046
    docker run -d --name "$APP_NAME" -p "${HOST_PORT}:${CONTAINER_PORT}" \
      $( [ -f "$ENV_FILE" ] && printf '%s' "--env-file $ENV_FILE" ) \
      --restart unless-stopped "$IMAGE" >/dev/null
    ok "已回滚，容器已启动"
    exit 0
    ;;
esac

NO_PULL=0
[ "${1:-}" = "--no-pull" ] && NO_PULL=1

docker_ok

# ---------------------------------------------------------------- 1. 拉代码
if [ "$NO_PULL" -eq 0 ]; then
  say "拉取最新代码"
  if [ -d .git ]; then
    BEFORE=$(git rev-parse --short HEAD 2>/dev/null || echo none)
    git pull --ff-only
    AFTER=$(git rev-parse --short HEAD 2>/dev/null || echo none)
    if [ "$BEFORE" = "$AFTER" ]; then
      ok "代码无变化（${AFTER}）—— 仍会重新构建，确保镜像与代码一致"
    else
      ok "${BEFORE} → ${AFTER}"
    fi
  else
    warn "当前目录不是 git 仓库，跳过 pull"
  fi
else
  say "跳过 git pull（--no-pull）"
fi

# ---------------------------------------------------------------- 2. 环境检查
if [ -f "$ENV_FILE" ]; then
  ok "找到 ${ENV_FILE}"
else
  warn "缺少 ${ENV_FILE} —— 联系表单发信会失败。"
  warn "参考 .env.example 在服务器上手动创建（该文件不会随 git 同步）。"
fi

[ -f .dockerignore ] || warn "缺少 .dockerignore —— 构建会把 node_modules 一起打进去"

# ---------------------------------------------------------------- 3. 构建
say "构建镜像（首次较慢，之后有层缓存）"
if ! docker build -t "$IMAGE_NEW" . ; then
  docker image rm -f "$IMAGE_NEW" >/dev/null 2>&1 || true
  die "构建失败 —— 线上容器未受影响，网站仍在正常运行"
fi
ok "构建成功"

# ---------------------------------------------------------------- 4. 切换容器
# 保留当前镜像作为回滚点
if docker image inspect "$IMAGE" >/dev/null 2>&1; then
  docker tag "$IMAGE" "$IMAGE_PREV"
  ok "已保存回滚点 ${IMAGE_PREV}"
fi
docker tag "$IMAGE_NEW" "$IMAGE"
docker image rm -f "$IMAGE_NEW" >/dev/null 2>&1 || true

say "重启容器"
docker rm -f "$APP_NAME" >/dev/null 2>&1 || true
# shellcheck disable=SC2046
docker run -d --name "$APP_NAME" -p "${HOST_PORT}:${CONTAINER_PORT}" \
  $( [ -f "$ENV_FILE" ] && printf '%s' "--env-file $ENV_FILE" ) \
  --restart unless-stopped "$IMAGE" >/dev/null
ok "容器已启动"

# ---------------------------------------------------------------- 5. 健康检查
say "健康检查 http://localhost:${HOST_PORT}${HEALTH_PATH}"
deadline=$(( $(date +%s) + HEALTH_TIMEOUT ))
healthy=0
while [ "$(date +%s)" -lt "$deadline" ]; do
  code=$(curl -s -o /dev/null -m 5 -w '%{http_code}' \
          "http://localhost:${HOST_PORT}${HEALTH_PATH}" 2>/dev/null || echo 000)
  if [ "$code" = "200" ]; then healthy=1; break; fi
  if ! docker ps --format '{{.Names}}' | grep -qx "$APP_NAME"; then
    warn "容器已退出，日志如下："
    docker logs --tail 40 "$APP_NAME" 2>&1 | sed 's/^/    /'
    break
  fi
  sleep 2
done

if [ "$healthy" -ne 1 ]; then
  warn "健康检查未通过"
  docker logs --tail 40 "$APP_NAME" 2>&1 | sed 's/^/    /' || true
  printf '\n%s\n' "${Y}如需回滚：${N} ./build.sh --rollback"
  exit 1
fi
ok "返回 200，服务正常"

# ---------------------------------------------------------------- 6. 清理
say "清理悬空镜像"
freed=$(docker image prune -f 2>/dev/null | tail -1 || true)
ok "${freed:-已清理}"

printf '\n%s\n' "${G}${B}部署完成${N}"
printf '%s\n' "  容器 : $(docker ps --filter "name=${APP_NAME}" --format '{{.Status}}')"
printf '%s\n' "  端口 : ${HOST_PORT} → ${CONTAINER_PORT}"
printf '%s\n' "  日志 : ./build.sh --logs"
printf '%s\n' "  回滚 : ./build.sh --rollback"
