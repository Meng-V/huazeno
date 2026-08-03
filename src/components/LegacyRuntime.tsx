'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, Parallax, Thumbs } from 'swiper/modules';

// The mirror never captured Swiper's own stylesheet: the SaaS bundle injected it
// from a CDN at runtime. Without it every slide stacks vertically.
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const SENT = 'Thank you — your message has been sent. We will reply shortly.';
const FAILED = 'Sorry, the message could not be sent. Please email admin@huazeno.com.';

export default function LegacyRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    cleanups.push(
      wireNavigation(),
      wireForms(),
      wireReveals(),
      wireRollNumbers(),
      wireMagnifier(),
      wireLightbox(),
      wireFlightMap(),
    );
    cleanups.push(...wireSwipers());
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

function wireNavigation() {
  const drawer = document.querySelector<HTMLElement>('.p_navContent');
  const openButton = document.querySelector<HTMLElement>('.p_navButton .p_openIcon');
  const closeButton = document.querySelector<HTMLElement>('.p_navContent .p_closeIcon');

  const open = () => drawer?.classList.add('is-open');
  const close = () => drawer?.classList.remove('is-open');

  openButton?.addEventListener('click', open);
  closeButton?.addEventListener('click', close);

  // On phones the arrow next to a top-level item opens its submenu instead of
  // navigating, exactly as the original bundle did.
  const arrows = Array.from(document.querySelectorAll<HTMLElement>('.p_menu1Item > .p_jtIcon'));
  const toggle = (event: Event) => {
    if (window.innerWidth > 768) return;
    event.preventDefault();
    const item = (event.currentTarget as HTMLElement).closest('.p_level1Item');
    item?.querySelector('.p_level2Box')?.classList.toggle('is-open');
  };
  arrows.forEach((arrow) => arrow.addEventListener('click', toggle));

  return () => {
    openButton?.removeEventListener('click', open);
    closeButton?.removeEventListener('click', close);
    arrows.forEach((arrow) => arrow.removeEventListener('click', toggle));
  };
}

function wireSwipers() {
  const instances: Swiper[] = [];

  // Pages carry both spellings: `.swiper` (banner) and the older
  // `.swiper-container` (galleries, thumb strips). Swiper 11 styles `.swiper`,
  // so tag the old ones before initialising.
  const carousels = Array.from(document.querySelectorAll<HTMLElement>('.swiper, .swiper-container'));
  carousels.forEach((element) => element.classList.add('swiper'));

  const thumbs = new Map<HTMLElement, Swiper>();

  carousels
    .filter((element) => element.classList.contains('gallery-thumbs'))
    .forEach((element) => {
      const instance = new Swiper(element, {
        modules: [Navigation, Thumbs],
        slidesPerView: 4,
        spaceBetween: 10,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
      });
      thumbs.set(element, instance);
      instances.push(instance);
    });

  carousels.forEach((element) => {
    if (element.classList.contains('gallery-thumbs')) return;
    // Skip anything a more specific initialiser (e.g. the effect showcase)
    // already turned into a Swiper.
    if (element.classList.contains('swiper-initialized')) return;
    if (element.querySelectorAll('.swiper-slide').length < 2) return;

    const paired = element.classList.contains('gallery-top')
      ? Array.from(thumbs.values())[0]
      : undefined;

    // Without `loop`, Swiper stops at the last slide and the only way back is
    // animating in reverse through every slide. Cloning gives a continuous
    // one-direction cycle instead. Thumb-paired galleries are excluded: the
    // clones break the active-thumb mapping.
    const infinite = !paired && element.querySelectorAll('.swiper-slide').length > 1;

    instances.push(
      new Swiper(element, {
        modules: [Navigation, Pagination, Autoplay, Parallax, Thumbs],
        speed: 1200,
        loop: infinite,
        parallax: element.classList.contains('special_a'),
        autoplay: element.classList.contains('special_a')
          ? { delay: 7000, pauseOnMouseEnter: true }
          : false,
        navigation: {
          nextEl: element.querySelector('.p_btn_next, .swiper-button-next') as HTMLElement,
          prevEl: element.querySelector('.p_btn_prev, .swiper-button-prev') as HTMLElement,
        },
        pagination: {
          el: element.querySelector('.p_pagenation, .swiper-pagination') as HTMLElement,
          clickable: true,
        },
        thumbs: paired ? { swiper: paired } : undefined,
      }),
    );
  });

  return instances.map((instance) => () => instance.destroy(true, true));
}

// The template hides most text with `visibility:hidden;opacity:0` and the SaaS
// bundle revealed it on scroll. Hover panels and dropdowns are hidden the same
// way, so only reveal elements that sit in normal document flow.
function wireReveals() {
  const hidden = Array.from(document.querySelectorAll<HTMLElement>('.main *')).filter((element) => {
    const style = getComputedStyle(element);
    if (style.visibility !== 'hidden' || style.opacity !== '0') return false;
    if (style.position !== 'static' && style.position !== 'relative') return false;
    return !element.closest('.p_navContent, .p_level2Box, .p_level3Box');
  });

  // Reveal the outermost hidden element only; children come along with it.
  const targets = hidden.filter((element) => !hidden.some((other) => other !== element && other.contains(element)));

  targets.forEach((element) => {
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    element.style.transform = 'translateY(24px)';
  });

  const reveal = (element: HTMLElement) => {
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  targets.forEach((element) => observer.observe(element));

  // Anything still hidden when the page is printed or scripted away should not
  // stay invisible for good.
  const failsafe = window.setTimeout(() => targets.forEach(reveal), 6000);

  return () => {
    observer.disconnect();
    window.clearTimeout(failsafe);
  };
}

// The homepage stat block (2000 / 240 / 700 / 1300) counts up from zero when it
// scrolls into view — the vendor did this via `use-rollnum` markers.
function wireRollNumbers() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[use-rollnum]'));
  if (targets.length === 0) return () => {};

  const run = (el: HTMLElement) => {
    const end = Number(el.getAttribute('data-num') ?? el.textContent ?? '0');
    if (!Number.isFinite(end) || end <= 0) return;
    const duration = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(end * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

// Product-detail magnifier.
//
// The template ships the whole apparatus — `.images-cover` (main image),
// `.move-view` (the lens that tracks the cursor) and `.image-bigger` (the
// zoomed panel) — but the vendor JS that drove it was never captured, so
// previously only the thumbnail swap worked and hovering magnified nothing.
// This implements the lens/zoom pair and the prev/next thumb buttons.
const ZOOM = 2.5;

function wireMagnifier() {
  const cleanups: (() => void)[] = [];

  document.querySelectorAll<HTMLElement>('.magnifier').forEach((root) => {
    const cover = root.querySelector<HTMLElement>('.images-cover');
    const container = root.querySelector<HTMLElement>('.magnifier-container');
    const lens = root.querySelector<HTMLElement>('.move-view');
    const panel = root.querySelector<HTMLElement>('.image-bigger');
    const thumbs = Array.from(root.querySelectorAll<HTMLElement>('.small-img'));
    if (!cover || !container) return;

    let image = cover.querySelector('img');
    if (!image) {
      image = document.createElement('img');
      image.style.maxWidth = '100%';
      image.style.maxHeight = '100%';
      image.style.objectFit = 'contain';
      cover.appendChild(image);
    }
    const main = image;

    let current = '';
    const show = (url: string | null | undefined, thumb?: HTMLElement) => {
      if (!url) return;
      current = url;
      main.src = url;
      if (panel) panel.style.backgroundImage = `url("${url}")`;
      thumbs.forEach((other) => other.classList.toggle('active', other === thumb));
    };

    const urlOf = (thumb: HTMLElement) =>
      thumb.getAttribute('data-url') || thumb.querySelector('img')?.getAttribute('src');

    thumbs.forEach((thumb) => {
      const pick = () => show(urlOf(thumb), thumb);
      thumb.addEventListener('mouseenter', pick);
      thumb.addEventListener('click', pick);
      cleanups.push(() => {
        thumb.removeEventListener('mouseenter', pick);
        thumb.removeEventListener('click', pick);
      });
    });

    show(thumbs.length ? urlOf(thumbs[0]) : main.getAttribute('src'), thumbs[0]);

    // ---- lens + zoom panel -------------------------------------------------
    if (lens && panel) {
      const hide = () => {
        lens.style.display = 'none';
        panel.style.display = 'none';
      };
      hide();
      panel.style.backgroundRepeat = 'no-repeat';
      const icon = panel.querySelector<HTMLElement>('.add-icon');
      if (icon) icon.style.display = 'none';

      const move = (event: MouseEvent) => {
        const box = container.getBoundingClientRect();
        if (!box.width || !box.height || !current) return;

        lens.style.display = 'block';
        panel.style.display = 'block';

        const lensW = box.width / ZOOM;
        const lensH = box.height / ZOOM;
        lens.style.width = `${lensW}px`;
        lens.style.height = `${lensH}px`;

        // keep the lens inside the image
        const x = Math.min(Math.max(event.clientX - box.left - lensW / 2, 0), box.width - lensW);
        const y = Math.min(Math.max(event.clientY - box.top - lensH / 2, 0), box.height - lensH);
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;

        panel.style.backgroundSize = `${box.width * ZOOM}px ${box.height * ZOOM}px`;
        panel.style.backgroundPosition = `-${x * ZOOM}px -${y * ZOOM}px`;
      };

      container.addEventListener('mousemove', move);
      container.addEventListener('mouseleave', hide);
      cleanups.push(() => {
        container.removeEventListener('mousemove', move);
        container.removeEventListener('mouseleave', hide);
      });
    }

    // ---- thumbnail strip prev/next -----------------------------------------
    const strip = root.querySelector<HTMLElement>('.magnifier-assembly .small-img-list, .magnifier-assembly ul');
    const step = (dir: number) => () => {
      const active = thumbs.findIndex((t) => t.classList.contains('active'));
      const next = thumbs[(active + dir + thumbs.length) % thumbs.length];
      if (next) {
        show(urlOf(next), next);
        next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      void strip;
    };
    (
      [
        ['.magnifier-btn-left', -1],
        ['.magnifier-btn-right', 1],
      ] as const
    ).forEach(([selector, dir]) => {
      const button = root.querySelector<HTMLElement>(selector);
      if (!button || thumbs.length === 0) return;
      const handler = step(dir);
      button.style.cursor = 'pointer';
      button.addEventListener('click', handler);
      cleanups.push(() => button.removeEventListener('click', handler));
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

// Click-to-enlarge for gallery images.
//
// The markup is already tagged for it — factory/honours/permit tiles carry
// `fancyboxHz` / `fancyImg`, because the original site used fancybox. That
// vendor script was never captured, so the tiles were dead to clicks. This
// provides the same behaviour: a full-size overlay that steps through every
// image in the same list, with keyboard and click-out dismissal.
function wireLightbox() {
  const groups = new Map<Element, string[]>();
  const cleanups: (() => void)[] = [];

  const candidates = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      '.fancyboxHz img, .fancyImg img, .p_loopitem .s_img img',
    ),
  ).filter((img) => {
    // skip icons, logos and anything inside a link that already navigates
    if (img.closest('a')) return false;
    const src = img.getAttribute('src') || '';
    return !!src && !src.endsWith('.svg');
  });
  if (candidates.length === 0) return () => {};

  candidates.forEach((img) => {
    const list = img.closest('.p_list') ?? img.closest('.s_list') ?? document.body;
    const urls = groups.get(list) ?? [];
    if (!urls.includes(img.src)) urls.push(img.src);
    groups.set(list, urls);
  });

  // ---- overlay ------------------------------------------------------------
  const overlay = document.createElement('div');
  overlay.className = 'hz-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <button class="hz-lb-close" aria-label="Close">&times;</button>
    <button class="hz-lb-prev" aria-label="Previous image">&#8249;</button>
    <figure class="hz-lb-figure"><img alt=""><figcaption></figcaption></figure>
    <button class="hz-lb-next" aria-label="Next image">&#8250;</button>
  `;
  document.body.appendChild(overlay);

  const picture = overlay.querySelector('img') as HTMLImageElement;
  const caption = overlay.querySelector('figcaption') as HTMLElement;
  let list: string[] = [];
  let index = 0;
  let captions: string[] = [];

  const render = () => {
    picture.src = list[index] ?? '';
    caption.textContent = captions[index] ?? '';
    const many = list.length > 1;
    overlay.querySelector<HTMLElement>('.hz-lb-prev')!.style.display = many ? '' : 'none';
    overlay.querySelector<HTMLElement>('.hz-lb-next')!.style.display = many ? '' : 'none';
  };
  const open = () => {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const move = (dir: number) => {
    index = (index + dir + list.length) % list.length;
    render();
  };

  candidates.forEach((img) => {
    const trigger = (img.closest('.fancyboxHz') as HTMLElement) ?? img;
    trigger.style.cursor = 'zoom-in';
    const onClick = (event: Event) => {
      event.preventDefault();
      const owner = img.closest('.p_list') ?? img.closest('.s_list') ?? document.body;
      list = groups.get(owner) ?? [img.src];
      captions = list.map((url) => {
        const match = candidates.find((c) => c.src === url);
        return match?.getAttribute('title') || match?.getAttribute('alt') || '';
      });
      index = Math.max(list.indexOf(img.src), 0);
      render();
      open();
    };
    trigger.addEventListener('click', onClick);
    cleanups.push(() => trigger.removeEventListener('click', onClick));
  });

  const onOverlayClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.hz-lb-prev')) return move(-1);
    if (target.closest('.hz-lb-next')) return move(1);
    // clicking the backdrop (not the picture) dismisses
    if (!target.closest('.hz-lb-figure') || target.tagName === 'FIGURE') close();
  };
  const onKey = (event: KeyboardEvent) => {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  };

  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKey);

  return () => {
    cleanups.forEach((fn) => fn());
    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    document.body.style.overflow = '';
  };
}

// The homepage sales-network map.
//
// `#ceshi8` is an echarts world map with animated flight paths. The content
// pipeline stripped the four <script> tags that fed it (and script tags injected
// via innerHTML never execute anyway), so the container rendered empty. Load the
// original chain in order: jQuery -> echarts -> world geo data -> map config.
const MAP_SCRIPTS = [
  '/legacy/npublic/libs/core/ceccjquery.min.js,require.min.js,lib.min.js,page.min.js',
  '/legacy/upload/js/5821e1a250c3425c8cede2febaa5a241.js',
  '/legacy/upload/js/5271338b5bc5488a88c993e8f22cf1a2.js',
  '/legacy/upload/js/20d28298bdd14cd0830e1ccdc5100802.js',
];

function wireFlightMap() {
  if (!document.getElementById('ceshi8')) return () => {};

  let cancelled = false;
  const load = (src: string) =>
    new Promise<void>((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[data-hz="${src}"]`);
      if (existing) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.hz = src;
      script.onload = () => resolve();
      script.onerror = () => resolve(); // keep the chain going; the map just stays empty
      document.head.appendChild(script);
    });

  (async () => {
    for (const src of MAP_SCRIPTS) {
      if (cancelled) return;
      await load(src);
    }
  })();

  return () => {
    cancelled = true;
  };
}

// NOTE: the homepage quick-link tiles (`c_effect_062`) used to be converted into
// a Swiper here. That was wrong — the source page never marks this module as a
// carousel, and its own stylesheet lays it out as a plain flex row:
//
//   .e_loop-50 .p_list    { display: flex; flex-wrap: wrap }
//   .e_loop-50 .p_loopitem { flex: 0 0 33.3% }
//
// Swiper-ifying it overrode that with `slidesPerView: 1.2`, which collapsed the
// row to ~179px and left the tiles the wrong size. Leaving the markup alone lets
// the original CSS render the row as intended.

function wireForms() {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('form.hz-form'));
  const handlers = new Map<HTMLFormElement, (event: Event) => void>();

  forms.forEach((form) => {
    const status = form.querySelector<HTMLElement>('.hz-form-status');
    const button = form.querySelector<HTMLButtonElement>('.hz-submit');
    const label = button?.innerHTML ?? '';

    const value = (field: string) => {
      const element = form.elements.namedItem(field);
      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
        ? element.value
        : '';
    };

    const setStatus = (text: string, kind?: 'success' | 'error') => {
      if (!status) return;
      status.textContent = text;
      status.className = `hz-form-status${kind ? ` is-${kind}` : ''}`;
    };

    const showErrors = (errors: Record<string, string> = {}) => {
      form.querySelectorAll<HTMLElement>('.hz-field-error').forEach((node) => {
        node.textContent = errors[node.dataset.for ?? ''] ?? '';
      });
    };

    const busy = (on: boolean) => {
      if (!button) return;
      button.disabled = on;
      button.innerHTML = on ? '<span>Sending…</span>' : label;
    };

    const onSubmit = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      showErrors();
      setStatus('');

      const payload = {
        name: value('name'),
        email: value('email'),
        phone: value('phone'),
        company: value('company'),
        message: value('message'),
        website: value('website'),
        page: window.location.href,
      };

      if (!payload.name.trim() || !payload.email.trim() || payload.message.trim().length < 5) {
        showErrors({
          name: payload.name.trim() ? '' : 'Please enter your name.',
          email: payload.email.trim() ? '' : 'Please enter your email address.',
          message: payload.message.trim().length >= 5 ? '' : 'Please tell us a little more.',
        });
        setStatus('Please complete the required fields.', 'error');
        return;
      }

      busy(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await response.json().catch(() => ({}));

        if (response.ok && body.ok) {
          form.reset();
          setStatus(SENT, 'success');
        } else {
          showErrors(body.errors);
          setStatus(body.error ?? FAILED, 'error');
        }
      } catch {
        setStatus('Network error. Please try again, or email admin@huazeno.com.', 'error');
      } finally {
        busy(false);
      }
    };

    handlers.set(form, onSubmit);
    form.addEventListener('submit', onSubmit);
  });

  return () => handlers.forEach((handler, form) => form.removeEventListener('submit', handler));
}
