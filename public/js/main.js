var postData = {};
var ua = navigator.userAgent;

var device = {
	Android: function() {
	    return /Android/i.test(ua);
	}, BlackBerry: function() {
	    return /BlackBerry/i.test(ua);
	}, iOS: function() {
	    return /iPhone|iPad|iPod/i.test(ua);
	}, Windows: function() {
	    return /IEMobile/i.test(ua);
	}, isAndroid: function() {
	    return (this.Android() && (!this.BlackBerry() && !this.iOS() && !this.Windows()));
	}
};

$(document).ready(function () {
    if(".navbar-toggle .slide-active" === true){
        $("#first-step").addClass(".hidden");
    }

    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar-inverse').after($('<div class="inverse" id="navbar-height-col"></div>'));
  
    $('#slide-nav.navbar-default').after($('<div id="navbar-height-col"></div>'));  

    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '0%';
    var menuneg = '-100%';
    var slideneg = '-80%';


    $("#slide-nav").on("click", toggler, function (e) {

        var selected = $(this).hasClass('slide-active');

        $('#slidemenu').stop().animate({
            left: selected ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
            left: selected ? slideneg : '0px'
        });

        $(pagewrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });

        $(navigationwrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });


        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');


        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
    });

    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';

    $(window).on("resize", function () {

        if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
            $(selected).removeClass('slide-active');
        }
    });

    $(".btn-step-1").click(function() {
    	$(document.body).scrollTop(0);
    	
    	$("#first-step").show();
    	$("#second-step").hide();
    	$("#third-step").hide();
    	
    	$('input[name="_service"]').val("");
    	$('input[name="_place"]').val("");
    	$('input[name="_value"]').val("");
    	
    	postData = {};
    });
    
    $(".btn-step-2").click(function() {
    	$(document.body).scrollTop(0);
    	
    	$("#first-step").hide();
    	$("#second-step").show();
    	
    	postData.service = $('input[name="_service"]').val(); 
    });
    
    $(".btn-step-3").click(function() {
    	$(document.body).scrollTop(0);
    	
    	$("#second-step").hide();
    	$("#third-step").show();
    	
    	postData.value = $('input[name="_value"]').val();
    	postData.place = $('input[name="_place"]').val();
    });
    
    $(".panel-list-services").click(function(){
        $(".panel-list-services").removeClass("active");
        $(this).addClass("active");
    });
    
    $("input[name=_service], input[name=_place]").focus(function() {
    	var offset = $(this).offset();
    	
    	$(document.body).scrollTop(offset.top -  $(this).height());
    });
    
    if(device.isAndroid()) {
    	$('.container-device').before("Android<br />");
    	$('.container-device').before(ua);
    	
    	$('.money').maskMoney();
    } else {
    	$('.container-device').before("Others<br />");
    	$('.container-device').before(ua);
    	
    	$('.money').mask({currencySymbol: ''});
    }
});