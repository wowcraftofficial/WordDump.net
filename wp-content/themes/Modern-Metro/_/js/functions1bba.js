(function($) {

$(document).ready(function (){
	window.mmLoaded = false;
	
	wasMobile = true;
	window.modeChanged = true;
	window.resized = false;
	window.mmHeight = $(window).height();
	window.mmWidth = $(window).width();
	window.blockResize = false; //its to avoid twice resizing event by some browsers
	
	
	window.MMcontent = $('#contentholder').html();
	mmdraw();
	
	if(!isMobile){
		$('#contentholder').strethDown(80);
		$('.verticalScroll,.singleColumn,.fullHeight').height($('#contentholder').height()-70);
		$('body.home .verticalScroll').not('nav').strethDown(100,160);
		$('nav').strethDown(80);
	} else {
		$('body').width($(window).width()-70);
		$('nav').strethDown(80);
	}
	
	$('.verticalScroll').resize(); //vertical scrolls needs to be reinitialized after layout change
	
	$('.navbar-hide-button').click(function(){
		$('#navbar').trigger('mouseleave');
	});
	
	//$(window).resize(); //removed in v1.01
	
	
	////////////////////////////////////////

});


$(window).resize(function(e,t) {	
	if (window.blockResize) return;	
	console.log('MM resize - reinit');
	
	var scrollLeft = $(this).scrollLeft();//remember horizontal scroll before action to set it again in new columnized content	
	
	//redraw function
	var mmredraw = function(){
		
		if ( $('body.mm-orientation-vertical').length ) { return;} //dont redraw if vertical type page
		
		if (!window.mmHasResized) {	//on the first time need to redraw twice
			window.mmHasResized = true;
			$('#contentholder').html('').html(window.MMcontent);
			mmdraw();
		}
		window.modeChanged = false;	//change mode need to be set true before first redraw on some browsers, now set it to false
		
		$('#contentholder').html('').html(window.MMcontent);	//clear old content and set oryginal one
		mmdraw();	//then draw it (columnize, etc)
		$('html,body').animate({'scrollLeft':scrollLeft},0);	//set old scrollletf
		
		$(window).load();	//trigger load
	}
	
	
	
	var wasMobile = isMobile;	//remember if it was mobile before resize.	
	isMobile = $.isMobile();
	
	var wasHeight = window.mmHeight
	window.mmHeight = $(window).height();
	var changedHeight = Math.abs(window.mmHeight-wasHeight);
	
	var wasWidth = window.mmWidth;
	window.mmWidth = $(window).width();
	var changedWidth = Math.abs(window.mmWidth-wasWidth);	
	
	
	if(!isMobile){
		var cacheMarginHome = $('.single-group').css('margin-top');
		var cacheMarginBlog = $('.sorting-options h3').css('margin-top');
		
		$('.sorting-options h3,.single-group').css('margin-top',0);//reset vertical centering
		
		$('#contentholder,.verticalScroll,.singleColumn,.fullHeight').strethDown(100);
		$('body.home .verticalScroll:not(nav), body.home .singleColumn').strethDown(100,160);
		$(' #blog .singleColumn').strethDown(100,320);
		$('#gallerry .singleColumn').strethDown(100,210);
		$('#portfolio .singleColumn').strethDown(100,160);
		
		//set vertical centering for blog and gallerry page, 1.102 and portfolio page
		if ( $('#blog, #gallerry, #portfolio').length ){
			var fullHeight = $('#contentholder').height();
			var tilesHeight = $('.singleColumn').height() + $('.sorting-options').height();
			var topMargin = Math.floor((fullHeight-tilesHeight)/2);
			topMargin *= 0.7;
			$('.sorting-options h3').css('margin-top',cacheMarginBlog).animate({'margin-top':topMargin},750,'easeOutExpo');
		}
		
		
		
		//homepage vertical center
		if( $('body').hasClass('home') ) {
			var fullHeight = $('#contentholder').height();
			var tilesHeight = $('.single-group:not(.welcome-column)').height();
			var topMargin = Math.floor((fullHeight-tilesHeight)/2);
			topMargin *= 0.7;
			$('.single-group').css('margin-top',cacheMarginHome).animate({'margin-top':topMargin},750,'easeOutExpo');
		}
		
	} else {
		$('body').width($(window).width()-70);
		$('nav').strethDown(100);
	}
	
	
	if ( $.needRedraw() ) {
	    $.clearChartsIntervals();
	    mmredraw();
	}


	if (($.browser.msie && $.browser.version < 8) && $('#indexContent .singleColumn').length) {
		var columnsWidth = 0;
		$('#indexContent .singleColumn').each(function(){
			columnsWidth+=$(this).outerWidth()+80;//width of column + 80px margin			
		});
		$('body').width(columnsWidth+800)
	}
	
	setTimeout(function(){
		$('.isotope').isotope('reLayout');	//thats for case when some media query css changes on responsive and tiles size is different after isotope relayout	//inspect different sol v1.01
	},300);
	
	//dont allow next resize for 200ms
    window.blockResize = true;
    setTimeout(function(){window.blockResize = false},200);	
	
});


$(window).load(function() {
	//avoid columnizer bug
	setTimeout(function(){
		if ($('.columnContent').length && !$('.column').length) { mmdraw(); }	
	},300);
});

})(jQuery);