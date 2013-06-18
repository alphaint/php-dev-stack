(function ($) {

function fullScreen() {
	if (isMobileSafari()) {
		// Find better way to adjust height
		var height = $(window).height() + 60;
	}
	else {
		var height = $(window).height();
	}
	
	if (height < 640) {
  	height = 640;
	}
	
	if ($(window).width() < 768) {
  	$('body').addClass('mobile');
	}
	else {
  	$('body').removeClass('mobile');
	}
	
  $('body:not(.mobile) #sections .section').css({
    width: $(window).width(),
    height: height
  });
  
  $("body:not(.mobile) #dynamic-content").css({
    width: 300,
    height: height
  });
  
  whatRatio();
}

function getBodyPart(className) {
  if (className == 'head') {
    return 0;
  }
  else if (className == 'body') {
    return 1;
  }
  else if (className == 'legs') {
    return 2;
  }
  else {
    return 3;
  }
}

function whatRatio() {
  // What are we scaling to height or width?
  var widthScale = $(window).width() / 16;
  var heightScale = $(window).height() / 9;
  var videoWidth = 0;
  var videoHeight = 0;
  
  if (widthScale > heightScale) {
    videoWidth = $(window).width();
    videoHeight = ( $(window).width() / 16 ) * 9;
    var scaleTo = 'width';
  }
  else {
    videoWidth = ( $(window).height() / 9 ) * 16;
    videoHeight = $(window).height();
    var scaleTo = 'height';
  }
  
  var topMargin = - ( videoHeight / 2 );
  var leftMargin = - ( videoWidth / 2 );
  
  $("#section-0 .video .inner").css({
    width: videoWidth,
    height: videoHeight,
    marginTop: topMargin,
    marginLeft: leftMargin
  });
  
}

function stopIntroVideo() {
  document.getElementById('intro-video').pause();
  document.getElementById('intro-video').currentTime = 0;
  $("#section-0 .video img").show();
  $("#section-0 .video .play").show();
  $("#section-0 .video .stop").hide();
}


function isMobileSafari() {
  return ((navigator.userAgent.toLowerCase().indexOf("iphone") > -1) || (navigator.userAgent.toLowerCase().indexOf("ipod") > -1));
}

function isMobileDevice() {
  return ((navigator.userAgent.toLowerCase().indexOf("iphone") > -1) || (navigator.userAgent.toLowerCase().indexOf("ipod") > -1) || (navigator.userAgent.toLowerCase().indexOf("ipad") > -1));
}


$(document).ready(function(){
  var sections = $("#sections").children().length;
  sections = sections - 1;
  var section = 0;
  var newSection = 0;
  
  $("#section-0 .video .play").click(function(){
    if ($('html').hasClass('video')) {
      document.getElementById('intro-video').play();
      
      document.getElementById('intro-video').addEventListener('ended', function() {
        setTimeout(stopIntroVideo, 500);
        var position = $('#section-1').position();
        $('body,html').animate({scrollTop: position.top});
      }, false);
    } else {
    	
    	alert('no video');
    	
    }
    $("#section-0 .video img").hide();
    $("#section-0 .video .play").hide();
    $("#section-0 .video .stop").show();
    
    return false;
  });
  
  $("#section-0 .video .stop").click(function(){
    stopIntroVideo();
    return false;
  });
  
  $("#section-0 .video .stop").hide();
  
  // Hide play button if no HTML 5 or Flash support
  if( $('#section-0 .video p').is(':visible') ) {
    $("#section-0 .video .play").hide();
  }
  
  $(".boxshadow .nav-0").addClass('active').css('paddingLeft', 200);
  //$(".no-boxshadow").css({backgroundSize: "cover"});
  
  // Screen sliding
  $('#side-nav a').click(function(){
    var name = $(this).attr('href');
    var position = $(name).position();
    $('body,html').animate({scrollTop: position.top});
    return false;
  });
  
  // Jump to Find a Course
  $('#bottom-nav a.find-a-course').click(function(){
    var position = $('#section-5').position();
    $('body,html').animate({scrollTop: position.top});
    return false;
  });
  
  // Side navigation slide out on hover
  $('.boxshadow #side-nav').hover(function(){
    $('#side-nav').addClass('hover');
    $('#side-nav a:not(.active)').animate({paddingLeft: 200}, 200);
  },function(){
    $('#side-nav').removeClass('hover');
    $('#side-nav a:not(.active)').animate({paddingLeft: 0}, 200);
  });

  // Full screen
  $(window).resize(function() {
    fullScreen();         
  });

  fullScreen();
  
  // Mobile support
  if (isMobileSafari()) {
    window.scrollTo(0,1);
  }
  
  //var firstScroll = false;
  
  // Detect scrolling
  $(window).scroll(function() {
    var halfVertical = $(window).height() / 2;
    
    var sectionZeroPos = $("#section-0").offset();
    var sectionOnePos = $("#section-1").offset();
    var sectionTwoPos = $("#section-2").offset();
    var sectionThreePos = $("#section-3").offset();
    var sectionFourPos = $("#section-4").offset();
    var sectionFivePos = $("#section-5").offset();
    var sectionSixPos = $("#section-6").offset();
    var currentVerticalPos = $(window).scrollTop() + 300;
    
    switch (true) {
      case (currentVerticalPos > sectionSixPos.top):
        newSection = 6;
        break;
      case (currentVerticalPos > sectionFivePos.top):
        newSection = 5;
        break;
      case (currentVerticalPos > sectionFourPos.top):
        newSection = 4;
        break;
      case (currentVerticalPos > sectionThreePos.top):
        newSection = 3;
        break;
      case (currentVerticalPos > sectionTwoPos.top):
        newSection = 2;
        break;
      case (currentVerticalPos > sectionOnePos.top):
        newSection = 1;
        break;
      default:
        newSection = 0;
        break;
    }
    
    if (newSection != section) {
      
      if (newSection == sections) {
        $("#bottom-nav").animate({bottom: -62}, 200, function(){ $("#bottom-nav").hide(); });
      }
      
      if (section == sections) {
        $("#bottom-nav").show();
        $("#bottom-nav").animate({bottom: 0}, 200);
      }
      
      $('.boxshadow #side-nav:not(.hover) .nav-'+section).animate({paddingLeft: 0}, 200);
      $('.nav-'+section).removeClass('active');
      
      section = newSection;
      
      var newText = 'Next: ' + $('.nav-'+(section+1)).html();
      
      if (newText != 'Next: null') {
        $('.next-text').html(newText);
      }
      
      $('.boxshadow #side-nav:not(.hover) .nav-'+section).animate({paddingLeft: 200}, 200);
      $('.nav-'+section).addClass('active');
      
      if ($.support.transition && !isMobileDevice()) {
        $("#section-1 .icons").css({left: -200, opacity: 0});
        $("#section-2 .excludes").css({left: 200, opacity: 0});
        $("#section-3 .words > div").css({left: 200, opacity: 0});
        $("#wos-video-1").css({scale: 0.5, opacity: 0});
        $("#wos-video-2").css({scale: 0.6, opacity: 0});
        $("#wos-video-3").css({scale: 0.5, opacity: 0});
        $("#wos-video-4").css({scale: 0.2, opacity: 0});
        $("#wos-quote-1").css({scale: 0.5, opacity: 0});
        $("#wos-quote-2").css({scale: 0.4, opacity: 0});
        $("#wos-quote-3").css({scale: 0.6, opacity: 0});
        $("#wos-blank-1").css({scale: 0.5, opacity: 0});
        $("#wos-blank-2").css({scale: 0.6, opacity: 0});
        $("#wos-blank-3").css({scale: 0.5, opacity: 0});
        $("#wos-blank-4").css({scale: 0.2, opacity: 0});
        $("#wos-blank-5").css({scale: 0.5, opacity: 0});
        $("#wos-blank-6").css({scale: 0.4, opacity: 0});
        $("#section-5 h2").css({top: -100, opacity: 0});
        $("#wtc-video-1").css({scale: 0.5, opacity: 0});
        $("#wtc-video-2").css({scale: 0.6, opacity: 0});
        $("#wtc-video-3").css({scale: 0.5, opacity: 0});
        $("#wtc-video-4").css({scale: 0.2, opacity: 0});
        $("#wtc-video-5").css({scale: 0.5, opacity: 0});
        $("#wtc-video-6").css({scale: 0.4, opacity: 0});
        $("#wtc-blank-1").css({scale: 0.5, opacity: 0});
        $("#wtc-blank-2").css({scale: 0.6, opacity: 0});
        $("#wtc-blank-3").css({scale: 0.5, opacity: 0});
        $("#wtc-blank-4").css({scale: 0.2, opacity: 0});
        $("#wtc-blank-5").css({scale: 0.5, opacity: 0});
        $("#wtc-blank-6").css({scale: 0.4, opacity: 0});
          
        // Animations
        if (newSection == 1) {
          // Section one (What is Alpha?)
          $("#section-1 .first span").delay(200)
            .transition({ scale: 1.1, rotate: 10, easing: 'in-out', duration: 400 })
            .transition({ scale: 1, rotate: -10, easing: 'in-out', duration: 700 });
          
          $("#section-1 .icons").delay(200)
            .transition({ left: 0, opacity: 1, easing: 'in-out', duration: 1000 });
        }
        else if (newSection == 2) {
          // Section two (What happens?)
          $("#section-2 .food").delay(200)
            .transition({ scale: 1.1, rotate: 12, easing: 'in-out', duration: 400 })
            .transition({ scale: 1, rotate: 0, easing: 'in-out', duration: 700 });
          
          $("#section-2 .talk").delay(500)
            .transition({ scale: 1.1, rotate: 0, easing: 'in-out', duration: 400 })
            .transition({ scale: 1, rotate: 0, easing: 'in-out', duration: 700 });
            
          $("#section-2 .thoughts").delay(800)
            .transition({ scale: 1.1, rotate: -12, easing: 'in-out', duration: 400 })
            .transition({ scale: 1, rotate: 0, easing: 'in-out', duration: 700 });
          
          $("#section-2 .excludes").delay(500)
            .transition({ left: 0, opacity: 1, easing: 'in-out', duration: 1000 });
        }
        else if (newSection == 3) {
          // Section three (Is Alpha for me?)
          $("#section-3 .first").delay(200)
            .transition({ left: 0, opacity: 1, easing: 'in-out', duration: 1000 });
          
          $("#section-3 .second").delay(300)
            .transition({ left: 0, opacity: 1, easing: 'in-out', duration: 1200 });
            
          $("#section-3 .third").delay(400)
            .transition({ left: 0, opacity: 1, easing: 'in-out', duration: 1500 });
        }
        else if (newSection == 4) {
          // Section four (What others say?)
          $("#wos-video-1").delay(200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-video-2").delay(1000)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-video-3").delay(600)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-video-4").delay(1200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-quote-1").delay(400)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-quote-2").delay(800)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });

          $("#wos-quote-3").delay(800)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });

          $("#wos-blank-1").delay(200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-blank-2").delay(1000)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-blank-3").delay(600)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-blank-4").delay(1200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-blank-5").delay(400)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wos-blank-6").delay(800)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
        }
        else if (newSection == 5) {
          // Section five (Find a Course?)
          $("#section-5 h2").delay(200)
            .transition({ top: 0, opacity: 1, easing: 'in-out', duration: 1000 });
        }
        else if (newSection == 6) {
          // Section six (Watch talk clips?)
          $("#wtc-video-1").delay(200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-video-2").delay(1000)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-video-3").delay(600)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-video-4").delay(1200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-video-5").delay(400)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-video-6").delay(800)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });

          $("#wtc-blank-1").delay(200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-blank-2").delay(1000)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-blank-3").delay(600)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-blank-4").delay(1200)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-blank-5").delay(400)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
            
          $("#wtc-blank-6").delay(800)
            .transition({ scale: 1, opacity: 1, easing: 'in-out', duration: 1000 });
        }
      }
    }
  
  });
  
  $("#bottom-nav .next").click(function(){
    var next = section + 1;
    
    if (next > sections) {
      return false;
    }
    
    var position = $('#section-'+next).position();
    $('body,html').animate({scrollTop: position.top});
    return false;
  });
  
  // Sliding Tab
  $("#dynamic-content .tab").hover(function(){
    $('#dynamic-content:not(.visible)').animate({paddingLeft: 15}, 200);
  },function(){
    $('#dynamic-content:not(.visible)').animate({paddingLeft: 0}, 200);
  })
  
  $("#dynamic-content .tab").click(function(){
    $("#dynamic-content").toggleClass('visible');
    $('#dynamic-content.visible').animate({paddingLeft: 300}, 200);
    $('#dynamic-content:not(.visible)').animate({paddingLeft: 0}, 200);
    return false;
  });

  // Pop out dynamic
  $('#dynamic-content').delay(500).animate({paddingLeft: 15}, 200, 'swing', function(){
    $('#dynamic-content').delay(300).animate({paddingLeft: 0}, 200, 'swing');
  });
  
  // MOBILE MENU
  
  $("a.menu").click(function(){
    $("#nav").toggleClass('expanded');
    $(".inner-page").toggle();
    return false;
  });
  
  // Game
  if ( $(".game").length ) {
    $("#section-3 .success").css({scale: 0.2, opacity: 0, rotate: 50, display: 'block'});
  
    var heads = [];
    heads[0] = 0;
    heads[1] = 30;
    heads[2] = 2;
    heads[3] = 3;
    heads[4] = 4;
    heads[5] = 5;
    heads[6] = 6;
    heads[7] = 7;
    heads[8] = 8;
    heads[9] = 9;
    heads[10] = 10;
    heads[11] = 11;
    heads[12] = 12;
    heads[13] = 13;
    heads[14] = 14;
    heads[15] = 15;

    
    var bodies = [];
    bodies[0] = 10;
    bodies[1] = 1;
    bodies[2] = 14;
    bodies[3] = 12;
    bodies[4] = 15;
    bodies[5] = 7;
    bodies[6] = 0;
    bodies[7] = 3;
    bodies[8] = 13;
    bodies[9] = 11;
    bodies[10] = 5;
    bodies[11] = 6;
    bodies[12] = 9;
    bodies[13] = 8;
    bodies[14] = 4;
    bodies[15] = 2;

    
    var legs = [];
    legs[0] = 4;
    legs[1] = 7;
    legs[2] = 5;
    legs[3] = 3;
    legs[4] = 2;
    legs[5] = 14;
    legs[6] = 12;
    legs[7] = 9;
    legs[8] = 1;
    legs[9] = 10;
    legs[10] = 8;
    legs[11] = 13;
    legs[12] = 15;
    legs[13] = 11;
    legs[14] = 6;
    legs[15] = 0;
    
    var onPart = [0,0,0];
    
    var arrowSlide = false;
    $(".game .arrow").click(function(){
      if ( arrowSlide == true) { return false; }
      
      arrowSlide = true;
      var currentPosition = parseFloat($(this).parent().children(".slider").css('background-position-x'));
      
      if (isNaN(currentPosition)) {
        currentPosition = parseFloat($(this).parent().children(".slider").css('background-position'));
        
        if ( $(this).hasClass("next") ) {
          var newPosition = currentPosition-200;
          $(this).parent().children(".slider").animate({'background-position': newPosition+"px 0"}, 200, function(){ arrowSlide = false; });
          var bodyPart = getBodyPart($(this).parent().attr('class'));
          ++onPart[bodyPart];
        }
        else {
          var newPosition = currentPosition+200;
          $(this).parent().children(".slider").animate({'background-position': newPosition+"px 0"}, 200, function(){ arrowSlide = false; });
          var bodyPart = getBodyPart($(this).parent().attr('class'));
          --onPart[bodyPart];
        }
        
      }
      else {
        if ( $(this).hasClass("next") ) {
          var newPosition = currentPosition-200;
          $(this).parent().children(".slider").animate({'background-position-x': newPosition}, 200, function(){ arrowSlide = false; });
          var bodyPart = getBodyPart($(this).parent().attr('class'));
          ++onPart[bodyPart];
        }
        else {
          var newPosition = currentPosition+200;
          $(this).parent().children(".slider").animate({'background-position-x': newPosition}, 200, function(){ arrowSlide = false; });
          var bodyPart = getBodyPart($(this).parent().attr('class'));
          --onPart[bodyPart];
        }
      }
      
      // Reset loops
      if (onPart[0] == 16) {
        onPart[0] = 0;
      }
      else if (onPart[0] == -1) {
        onPart[0] = 15;
      }
      
      if (onPart[1] == 16) {
        onPart[1] = 0;
      }
      else if (onPart[1] == -1) {
        onPart[1] = 15;
      }
      
      if (onPart[2] == 16) {
        onPart[2] = 0;
      }
      else if (onPart[2] == -1) {
        onPart[2] = 15;
      }
      
      if ($('#section-3 .success').css('opacity') == 1) {
        $("#section-3 .success").transition({ scale: 0.2, opacity: 0, rotate: 50, easing: 'in-out', duration: 500 });
      }
      
      if ((heads[onPart[0]] == bodies[onPart[1]]) && (bodies[onPart[1]] == legs[onPart[2]])) {
        $("#section-3 .success").delay(100).transition({ scale: 1, opacity: 1, rotate: 0, easing: 'in-out', duration: 500 });
        $("#cheer-audio")[0].play();
      }
      
      
      return false;
    });
  }

  // What Others Says
  $('#section-4 > .inner > a').click(function(){
    var identifier = $(this).attr('id');
    $('#section-4 .infills > div').hide();
    $('#section-4 .infills .placeholder').html('');
    $('.'+identifier).show();
    
    if( $(this).is('#wos-video-1') ) {
      $('.wos-video-1 .placeholder').html("<iframe src='http://player.vimeo.com/video/28772001?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wos-video-2') ) {
      $('.wos-video-2 .placeholder').html("<iframe src='http://player.vimeo.com/video/47170749?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wos-video-3') ) {
      $('.wos-video-3 .placeholder').html("<iframe src='http://player.vimeo.com/video/28774074?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wos-video-4') ) {
      $('.wos-video-4 .placeholder').html("<iframe src='http://player.vimeo.com/video/28775305?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    
    return false;
  });
  
  $('#section-4 .infills a').click(function(){
    $('#section-4 .infills > div').hide();
    $('#section-4 .infills .placeholder').html('');
    return false;
  });
  
  // Watch Talk Clips
  $('#section-6 > .inner > a').click(function(){
    var identifier = $(this).attr('id');
    $('#section-6 .infills > div').hide();
    $('#section-6 .infills .placeholder').html('');
    $('.'+identifier).show();
    
    if( $(this).is('#wtc-video-1') ) {
      $('.wtc-video-1 .placeholder').html("<iframe src='http://player.vimeo.com/video/47943862?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wtc-video-2') ) {
      $('.wtc-video-2 .placeholder').html("<iframe src='http://player.vimeo.com/video/47944876?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wtc-video-3') ) {
      $('.wtc-video-3 .placeholder').html("<iframe src='http://player.vimeo.com/video/47942755?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wtc-video-4') ) {
      $('.wtc-video-4 .placeholder').html("<iframe src='http://player.vimeo.com/video/47944017?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wtc-video-5') ) {
      $('.wtc-video-5 .placeholder').html("<iframe src='http://player.vimeo.com/video/47944681?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    else if( $(this).is('#wtc-video-6') ) {
      $('.wtc-video-6 .placeholder').html("<iframe src='http://player.vimeo.com/video/47943663?autoplay=1' width='464' height='261' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    }
    
    return false;
  });
  
  $('#section-6 .infills a').click(function(){
    $('#section-6 .infills > div').hide();
    $('#section-6 .infills .placeholder').html('');
    return false;
  });
    
  // Find a Course Checkboxes
  
  if ( $('.page-find-a-course-results #ai-find-a-course-search-form').length) {
    $('#ai-find-a-course-search-form .form-checkboxes').children('div').each(function () {
      if ($(this).children('input').attr('checked')) {
        $(this).children('label').addClass('checked');
      }
    });
    
    $(":checkbox").change(function(){
      if($(this).attr("checked"))
      {
        $(this).parent().children('label').toggleClass('checked');
      }
      else
      {
        $(this).parent().children('label').toggleClass('checked');
      }
    });
    
    $(".form-checkboxes label").hover(function(){
      var infoClass = '.' + $(this).attr('for');
      $(infoClass).show();
    }, function(){
      var infoClass = '.' + $(this).attr('for');
      $(infoClass).hide();
    });
  }
  
  // Lookback Video
  $('.page-node-2 .video-placeholder a').click(function(){
    $(this).parent().html("<iframe src='http://player.vimeo.com/video/41786003?autoplay=1' width='280' height='158' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
    return false;
  });
  
});

}(jQuery));