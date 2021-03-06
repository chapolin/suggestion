var postData = {};
var ua = navigator.userAgent;
var clear = true;
const FIELD_LABEL_NEXT_STEP = "Prosseguir >";
const FIELD_LABEL_REGISTER = "Cadastrar";

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

var setServiceValueFromSuggestion = function(obj) {
	var id = obj.getAttribute("data-id"),
		name = obj.getAttribute("data-name");

	buildPostData("service", id, name);

	$(".first-step .btn-step-2").html(FIELD_LABEL_NEXT_STEP);
};

var setServiceValueFromButton = function(value) {
	if (value && ((postData.hasOwnProperty("service") &&
			postData.service.hasOwnProperty("name") &&
			postData.service.name.toLocaleLowerCase().trim() != value.toLocaleLowerCase().trim())) || !postData.hasOwnProperty("service")) {

		buildPostData("service", 0, value);
	}
};

var setEstablishmentValueFromSuggestion = function(obj) {
	var id = obj.getAttribute("data-id"),
	name = obj.getAttribute("data-name");

	buildPostData("establishment", id, name);
};

var setEstablishmentValueFromButton = function(value) {
	if (value && ((postData.hasOwnProperty("establishment") &&
			postData.establishment.hasOwnProperty("name") &&
			postData.establishment.name.toLocaleLowerCase().trim() != value.toLocaleLowerCase().trim())) || !postData.hasOwnProperty("establishment")) {

		buildPostData("establishment", 0, value);
	}
};

var buildPostData = function(key, id, value) {
	postData[key] = {
		id : id,
		name : value
	}
};

var sendData = function() {
    $.ajax({
        url: '/services',
        type: 'POST',
        data: postData,
        dataType: 'json'
    });
};

var showErrorMessage = function(message) {
	$(".warning-message").show();
	$(".arrow-down-message").show();
	$(".warning-message").html(message);

	clear = false;
};

var hideErrorMessage = function() {
	$(".warning-message").hide();
	$(".arrow-down-message").hide();
	$(".warning-message").html("");

	clear = true;
};

var changeCircleStep = function(indice) {
	$(".stepwizard-step .btn-circle").removeClass("btn-primary").addClass("btn-default");
	$(".stepwizard-step .btn-circle").eq(indice).removeClass("btn-default").addClass("btn-primary");
};

var firstStep = function() {
	$(document.body).scrollTop(0);

	// $("#first-step").show();
	// $("#second-step").hide();
	// $("#third-step").hide();

	$("#first-step").addClass("come-back");
	$("#second-step").addClass("come-back");
	$("#third-step").addClass("come-back").removeClass("show");

	$('input[name="_service"]').val("");
	$('input[name="_place"]').val("");
	$('input[name="_value"]').val("");

	$(".first-step .btn-step-2").html(FIELD_LABEL_REGISTER);

	postData = {};

	changeCircleStep(0);
};

var secondStep = function() {
	if($('input[name="_service"]').val().trim() == "") {
		if(clear == true) {
			showErrorMessage("<strong>Atenção:</strong> Este campo é obrigatório!");

				setTimeout(hideErrorMessage, 5000);
		}
	} else {
		$(document.body).scrollTop(0);

		$("#first-step").addClass("go-away").removeClass("show");
		$("#second-step").addClass("show");

			setServiceValueFromButton($('input[name="_service"]').val());

			changeCircleStep(1);
	}
};

var thirdStep = function() {
	$(document.body).scrollTop(0);

	$("#second-step").addClass("go-away").removeClass("show");
	$("#third-step").addClass("show");

	setEstablishmentValueFromButton($('input[name="_place"]').val());

	postData.value = $('input[name="_value"]').val();

	changeCircleStep(2);

	sendData();
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

		// Configurando o primeiro passo
		$(".btn-step-1").click(firstStep);

		// Configurando o segundo passo
		$(".btn-step-2").click(secondStep);

		// Configurando o terceiro passo
    $(".btn-step-3").click(thirdStep);

    $(".panel-list-services").click(function(){
        $(".panel-list-services").removeClass("active");
        $(this).addClass("active");
    });

    $("input[name=_service], input[name=_place]").focus(function() {
    	var offset = $(this).offset();

    	$(document.body).scrollTop(offset.top -  $(this).height());
    });
});
