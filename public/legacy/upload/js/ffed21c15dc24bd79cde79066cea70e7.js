$require(['swiper'], function () {
    var special_a = new Swiper('.special_a', {
        speed: 1200,
        parallax: true,
        autoplay: {
            delay: 7000,
            pauseOnMouseEnter: true,
        },
        navigation: {
            nextEl: '.special_a .p_btn_next',
            prevEl: '.special_a .p_btn_prev',
        },
        pagination: {
            el: '.special_a .p_pagenation',
        },
    })

    //6.6.2之前的版本需要通过代码实现此功能
    special_a.el.onmouseover = function () {
        special_a.autoplay.stop();
    }
    special_a.el.onmouseout = function () {
        special_a.autoplay.start();
    }
})

$(function () {
    // 播放
    $(".p_videoInfo a").attr("href", "javascript:;");
    $(".p_videoInfo a").click(function () {
        $(this).parents(".p_videoInfo").addClass("out");
        $(this).parents(".p_videoInfo").prev().find(".videoContent").addClass("in");

        let viBOx = $(this).parents(".p_videoInfo").prev().find("video")[0];
        $(viBOx).attr('playsinline', 'true');
        $(viBOx).attr('webkit-playsinline', 'true');
        if (viBOx.paused == true) {
            viBOx.play();
        } else {
            viBOx.pause();
        }
    });

    // 暂停
    $('.gb').click(function () {
        $(this).parents(".p_video").next().removeClass("out");
        $(this).parents(".videoContent").removeClass("in");

        let viBOx = $(this).prev().find('.video')[0];
        if (viBOx.paused == true) {
            viBOx.play();
        } else {
            viBOx.pause();
        }
    });
});