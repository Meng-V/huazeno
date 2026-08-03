$(function(){
  	var h = `<div class="fixBox">
              <div class="kuangbx">
                <iframe src="javascript:;"></iframe>
                <div class="close_button">关闭</div>
              </div>
             </div>`;
	$('.fix-box-click').click(function(){
  		let link = $(this).attr('data-href');
      	$('body').append(`${h}`);
      	setTimeout(function(){
            $('.fixBox').removeClass('overlay-close').addClass('overlay');
            $('.fixBox iframe').attr('src',link);
        },250);
  	});
  	$(document).on('click','.fixBox,.close_button',function(){
  		$('.fixBox').removeClass('overlay').addClass('overlay-close');
  		$('.fixBox iframe').attr('src','javascript:;');
      	setTimeout(function(){
            $('.fixBox').remove();
        },250);
    })
});