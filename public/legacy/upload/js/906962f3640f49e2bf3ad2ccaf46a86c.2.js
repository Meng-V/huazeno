$(function () {
    setTimeout(function () {
        let tuimgb = $(".gallery-top .swiper-slide:nth-child(1) img").attr("src");//获取图集类名下 swiper第一张图片的属性src（链接）
        $(".e_input-85 input").val(tuimgb);//获取src给85input（这个根据你拖入输入框的类名而自行更改）输入框赋值
        let tutextb = $(".e_h1-47").text();//获取页面中H1的标题
        $(".e_input-86 input").val(tutextb);//给86input（根据你拖入文本框的类名而自行更改）输入框赋值
    }, 1000);//延迟1s加载
    $(".e_button-82").bind("click touch", function () {
        $('html,body').animate({ scrollTop: ($($(this).attr('href')).offset().top) }, 300);
    });
})
//如果想获取其他属性，例如产品编号等，那在详情里面加文字元素，绑定对应属性，在表单容器里面添加文本框，按照上面js逻辑进行赋值即可，后台邮件自然就会有对应的标题、图片、编号等插入信息。
//例如下面：
//
//   let tutextb = $(".编号类名").text();
//   $(".输入框类名 input").val(tutextb);
//