(function($) {


$.mmIsMobile = function() {
	return !$('.small-hide').is(':visible');
}

$.fn.slideShow = function(time,easing,func) { 
	//$(this).children().show().css('opacity',1);
	$(this).animate({height:'show','margin-top':'show','margin-bottom':'show','padding-top':'show','padding-bottom':'show',opacity:1},time,easing,func);		
}
$.fn.highest = function() {
	var height=0;
	$('> *',this).each(function(){height=$(this).height()>height?$(this).height():height})
	return height;
}

$.fn.slideHide = function(time,easing,func) { 
	$(this).animate({height:'hide','margin-top':'hide','margin-bottom':'hide','padding-top':'hide','padding-bottom':'hide',opacity:0},time,easing,func);
	//$(this).children().animate({height:'hide','margin-top':'hide','margin-bottom':'hide','padding-top':'hide','padding-bottom':'hide',opacity:0},time,easing);
}
$.fn.vSlideToggle = function(time,easing) {
	if($(this).is(":visible"))
	{
		$(this).slideHide(time,easing);
	}
	else
	{
		$(this).slideShow(time,easing);
	}
}

//at first time just return object to next operations, but when fired 2nd time on same elem, returns false - allows some actions to be done only once per element
$.fn.once = function()
{
	//if ( reset ) $(this).data('doneOnce',false);
	if ( !$(this).data('doneOnce') ) {
		$(this).data('doneOnce',true);
		return $(this);
	} else {
		return $();
	}
};

//values with given key will return true for given ammount of time
var timer = null;
$.timeBid = function(callback,time)
{
	time = time || 1000;
	clearTimeout(timer);
	timer = setTimeout(callback, 1000);

};

$.mmError = function(error, multiple) {
	
	multiple = multiple || false;
	if (!multiple && !$('html').oncekey(error,2).length) return;
	
	$('.mm-error #error-text').html(error);
	$('.mm-error').fadeIn(100);
	$('.mm-error #error-text').delay(200).fadeSlideIn(750,'easeOutQuart',50);
	$('.mm-error, .button').click(function(e){$('.mm-error').fadeOut(100);e.stopPropagation();});
	$('#mm_dialog').click(function(){event.stopPropagation();});
}
//same as above, but done once per key, not per element. if times var is given, it will do something n times. If times = -1, will do normally.
$.fn.oncekey = function(key,times){
	
	times = times || 1;
	if (times == -1) return $(this);
	
	key = key.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');//remove whitespaces	
	
	if ( !$('html').data('doneOnce' + key) ) $('html').data('doneOnce' + key,0);//initival value of count = 0
	var count = $('html').data('doneOnce' + key);	//get it
	
	if ( count < times ) { //if havent done nothing on it even once
		$('html').data('doneOnce' + key, count + 1);		
		return $(this);
	} else {
		return $(); //return empty jquery elem
	}
}

$.fn.mouseHold = function(func,time) {
	$(this).each(function(){
		var timeoutId = 0;
		var time = time || 1000;
		$(this).mousedown(function() {
			timeoutId = setTimeout(func, time);
		}).bind('mouseup mouseleave', function() {
			clearTimeout(timeoutId);
		});	
	});
	return $(this);

}

$.fn.prevOrLast = function(selector)
{
	var prev = this.prev(selector);
	return (prev.length) ? prev : this.nextAll(selector).last();
};

$.fn.nextOrFirst = function(selector)
{
	var next = this.next(selector);
	return (next.length) ? next : this.prevAll(selector).last();
};

$.isMobile = function() {
    return !$('.small-hide').eq(0).is(':visible');
}

$.needRedraw = function() {
	
	var wasMobile = window.mmWasMobile;
	wasMobile = typeof wasMobile == "undefined" ? true : wasMobile;
	var isMobile = $.isMobile();
	var need = false;
		


	if (!wasMobile && !isMobile && !$('#indexContent, #blog, #gallerry, #portfolio').length){
		need = true;
	}
	
	//if switched from non-mobile to mobile
	if (!wasMobile && isMobile && !$('#indexContent, #blog, #gallerry, #portfolio').length){
		need = true;
	}
	
	//if switched from mobile to non-mobile
	if (wasMobile && !isMobile){
	    if ( !$('.singleColumn').eq(0).hasClass('isotope') ) {
		need = true;
	    }
	}

	
	window.mmWasMobile = $.isMobile();
	
	return need;
   
}

//slides feature images on tile
$.fn.metroSlide = function()
{
	return $(this).each(function(){
		var elem = $(this);
		var slides = $('.slide',elem);
		
		if(slides.length<2) return; //continue only if there is at least 2 slides.
		
		var itemH = elem.outerHeight();
		
		var random = Math.floor(Math.random() * 2000)+1000;	//from 1 to 3 sec's to avoid many tiles sliding at the same time
		var down = Math.floor(Math.random() * 2);	//		
		
		var slide = function(down){
				
				var current = $('.slide.current',elem);
				var next = current.nextOrFirst('.slide');
				if ( down ) {
					current.animate({'top':itemH},2000,'easeOutExpo',function(){$(this).css({'top':(-1)*itemH})}).removeClass('current');
					next.animate({'top':'0px'},2000,'easeOutExpo').addClass('current');
				}	else {
					current.animate({'top':-1*itemH},2000,'easeOutExpo',function(){$(this).css({'top':itemH})}).removeClass('current');
					next.animate({'top':'0px'},2000,'easeOutExpo').addClass('current');				
				}
		}
	
		slides.removeClass('current').eq(0).addClass('current');//set first slide as 'current'
		
		if(down) {slides.not('.current').css({'top':(-1)*itemH});}
		else{slides.not('.current').css({'top':(1)*itemH});}
		
		setTimeout(function(){
		
			slide(down);	//after random 0-2 sec's time make first slide

			
			setInterval(function(){	
				
				slide(down);
			},4500);
		},random);	
	});


};

//opens navbar and start to write in searchbar
$.keyboardSearch = function(){
	$(document).keypress(function(e){ //key event
		//check if any input is focused, if so, dont continue
		var isFocus = false;
		$('input,textarea').each(function(){
			if ($(this).is(":focus")) isFocus = true;
		});
		if (isFocus) return;
		
		
		var key = e.which;		
		key = String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
		if(parseInt($('#navbar').css('left')) != 0 ) {
			$('#navbar').mouseenter();
			$('#s').focus();
		}
	});	
}

$.fn.contentHeight = function()
{
	var height=0;
	$('.tile').each(function(){
		var bottom = $(this).offset().top + $(this).outerHeight();		
		height = Math.max(height,bottom);

	});
	height-=$(this).offset().top;
	//////////////////////////////
	var it = $(this);
	var offset = it.offset().top;
	var winHeight = $(window).height();	
	var freeSpace = (winHeight - offset - height);
	var margin=freeSpace/2*0.8;
	$(this).css({'top':margin+'px'});

	return height;	
}

$.stringsSimilarity = function (pattern, test) {
	//set lowercase
	var pattern = pattern.toLowerCase();
	var test = test.toLowerCase();
	
	var similarity = 0;
	var actual = 0;
	
	//now we will check every possible substring of test and we will save similarity as longest found substring that is inside pattern
	for (var i=0;i<test.length;i++){
		actual = 0;
		for (var j=i+1;j<test.length+1;j++){			
			if ( pattern.indexOf( test.substring(i, j) ) != -1 ) {
				actual++;
			}			
		}
		similarity = Math.max(actual,similarity);		
	}
	return similarity;

}


$.fn.strethDown = function(marginDown,multiply)
{
	return $(this).each(function(){
		if (!$(this).length) return $();
		var height=$(window).height() - $(this).offset().top - marginDown;
		if (multiply) height = height - height%multiply;
		$(this).height(height);	
		return height;	
	});
}

//streth down to parent bottom
$.fn.strethDownRelative = function(marginDown,multiply,parent)
{
	
	marginDown = parseInt(marginDown || 0);
	multiply = parseInt(multiply || 1);
	
	return $(this).each(function(){
		
		if (!$(this).length) return $();
		$(this).css('overflow','hidden');
		var height=$(this).parents(parent).height() - $(this).position().top - marginDown;
		if (multiply) height = height - height%multiply;
		$(this).height(height);	

	});
}




$.fn.widthStep = function(step)
{
	var elem = $(this);
	elem.css('max-width',elem.width() - elem.width()%step-5);
	$(window).resize(function() {
		var cachew = elem.css('max-width');
		elem.css('max-width',1920);
		var maxw = elem.width() - elem.width()%step-5;
		elem.css('max-width',cachew);
		elem.animate({'max-width':maxw},550,'easeOutQuart');		
	});
}

$.fn.limitTextLines = function(lines) {
	var lines = lines || 3;
	$(this).each(function(){
		var lineHeight = $(this).css('line-height');
		lineHeight = lineHeight.replace('px','');
		var maxHeight = lineHeight*lines;		
		$(this).css({'max-height':maxHeight,'overflow':'hidden'});
	});
}

$.fn.hoverData = function()
{
	$(this).hover(
		function() { $(this).data('hover', true); },
		function() { $(this).data('hover', false); }
	);
}


$.fn.bgalpha = function(alpha)
{
	return $(this).each(function(){
		if (!$.Color(this,'background-color').alpha()) return;
		$(this).css('background-color', $.Color(this,'background-color').alpha(alpha).toRgbaString());		
	});	
}


$.fn.horizontalScroll = function(time,easing,mobile)
{	
	var isMobileMode = $.mmIsMobile(); //dynamic check - v 1.107

	var multipler=1;
	$(this).mousewheel(function(event, delta) {	
	
			isMobileMode = $.mmIsMobile(); //dynamic check - v 1.107
			
			var dontScroll = false;
			
			$('.verticalScroll').each(function(){
				var scrollVisible = ($('.mCSB_scrollTools',this).css('opacity')>0.5);
				var scrollActive = $('.mCS_no_scrollbar').length == 0;
				if (scrollVisible && scrollActive) {
					dontScroll = true;
				}
			});
			
			if(dontScroll && !isMobileMode) return false;//dont scroll if scrolling div is hovered	
			
			
			
			var distance = 4*((-1)*delta * 60);	
			
			
			
			if (!isMobileMode){
				var scrollTo=$(this).scrollLeft()+multipler*distance;
				
				
				//if scrolled to begin of page and scroll up, show navbar. if navbar is visible and scroll down, hide navbar (non mobile mode only)
				if ( $('body').hasClass('mm-non-mobile') ) {
					if ( delta && $(window).scrollLeft() < 20){				
						//$('#navbar').mouseenter();
					}
					if ( delta == -1) {
						//$('#navbar').mouseleave();
					}				
				}


				
				scrollTo=scrollTo<0?0:scrollTo;//smoothing scrolling if scrolled to begining of page
				scrollTo=scrollTo>($(document).width()-$(window).width())?($(document).width()-$(window).width()):scrollTo;//smoothing scrolling if scrolled to end of page	


				
				$(this).stop().animate({'scrollLeft': scrollTo}, time,easing,function(){multipler=1});
				
				multipler+=0.02;
				multipler=multipler>5?5:multipler;	
				
				
			} else {
				var scrollTo=$(this).scrollTop()+multipler*distance;
				scrollTo=scrollTo<0?0:scrollTo;//smoothing scrolling if scrolled to begining of page
				scrollTo=scrollTo>($(document).height()-$(window).height())?($(document).height()-$(window).height()):scrollTo;//smoothing scrolling if scrolled to end of page	

				$(this).stop().animate({'scrollTop': scrollTo}, time,easing,function(){multipler=1});
				
				multipler+=0.04;
				multipler=multipler>5?5:multipler;			
			}
			
			event.preventDefault();	

		
	});
}


$.fn.mmsort = function(what){
	$(this).css('overflow','visible');
	$(this).each(function(){
	
		var elem = $(this);
		var tiles = elem.find(what).parent();
		
		var groupId = elem.parent().attr('id');
		groupId = groupId.replace("group-","sort-");
		var sortInput = $('#' + groupId);
		
		var setOrder = function(){
			$('.sorttilesbutton').fadeIn();
			sortInput.val('');
			var number = 0;
			elem.find(what).parent().each(function(){
				$(this).attr('order', number);
				elem.isotope('updateSortData', $(this));
				var postID = $(this).attr('topost');
				sortInput.val(sortInput.val() + postID + ',');
				number++;
			});				
		}
		
		var redraw = function(){
			elem.eq(0).isotope({sortBy:'order'});
		}	
		
		elem.sortable({
			change: function(){setOrder();redraw();},
			stop: function(){setOrder();redraw();},
			tolerance: "pointer",
			distance: 60,
			opacity: 0.9,
			helper: "clone"
		}).disableSelection();	
		
	});
	
}
//auto adds little background gradient to bg
$.fn.tileBg = function(difference){

	var rgbToHex = function(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1,7);
	}	
	
	var lighten = function(color,diff) {
		var distance = 255 - color;
		
		if(isNaN(distance)) return 0;
		
		return (diff/100)*distance + color;
	}
	
	$(this).each(function(){

		var elem = $(this);
		var bgColor = elem.css('background-color');
		
		var bgImgCSS = elem.css('background-image');		
		var bgImg = bgImgCSS == "none" ? "" : bgImgCSS + ",";

		//change bgcolor css attrtibute to array of 3 values
		bgColor=bgColor.replace("rgb(","");
		bgColor=bgColor.replace(")","");
		bgColor=bgColor.replace(" ","");
		bgColor=bgColor.replace(" ","");
		var rgb = bgColor.split(',');
		
		
		var r = parseInt(rgb[0]);
		var g = parseInt(rgb[1]);
		var b = parseInt(rgb[2]);

		//save as hex from rgb values actual bgcolor
		var oldBg = rgbToHex(r, g, b);		

		//lighten r,g,b
		r=lighten(r,difference);
		g=lighten(g,difference);
		b=lighten(b,difference);

		//limit colors to 0-255
		r = r>255?255:r;
		r = r<0?0:r;
		
		g = g>255?255:g;
		g = g<0?0:g;
		
		b = b>255?255:b;
		b = b<0?0:b;
		//
		
		//combine new r,g,b values to new hex (lighter) color
		var newBg = rgbToHex(r, g, b);
		
		//gradient cross-browser css
		elem.css({"background-image" : bgImgCSS}) //callback for oldies browsers
			.css({"background-image" : bgImg + '-webkit-linear-gradient(left, ' + oldBg + ' 0%, ' + newBg + ' 100%)'})
			.css({"background-image" : bgImg + '-moz-linear-gradient(left, ' + oldBg + ' 0%, ' + newBg + ' 100%)'})
			.css({"background-image" : bgImg + '-ms-linear-gradient(left, ' + oldBg + ' 0%, ' + newBg + ' 100%)'})
			.css({"background-image" : bgImg + '-o-linear-gradient(left, ' + oldBg + ' 0%, ' + newBg + ' 100%)'})
			.css({"background-image" : bgImg + 'linear-gradient(left, ' + oldBg + ' 0%, ' + newBg + ' 100%)'});	
	});	
}


//adds perspective effect to page background image on page scrolling
$.fn.parallaxBg = function(mobile){	//mobile attr mean if parallax horizontally or vertically
	$(this).scroll(function(){
	
		
	
		var contentW = $(document).width();
		var windowW = $(window).width();
		
		//ratio is calculated as mathematical hiperbol - for example if you got bg img 3000px wide, window 1500px wide and content 1600px wide you can scroll 100px and during scrolling you would see bg scrolling for 1500px and it look bad. It slows its dramatically when window width get similar to body width
		var ratio = contentW/windowW;
		ratio = Math.pow(ratio,.6);
		ratio = 0.3/(ratio-1)+1;
		
		var scrollableWidth = contentW-windowW;
		scrollableWidth *= ratio;
		
		
		var scrollLeft = $(this).scrollLeft();
		var scrollPercent = scrollLeft/scrollableWidth*100;		
		
		scrollPercent=isNaN(scrollPercent)?0:scrollPercent;

		var scrollableHeight = $(document).height()-$(window).height();		
		var scrollTop = $(this).scrollTop();
		var scrollTopPercent = scrollTop/scrollableHeight*100;


		
		if (mobile) {
			scrollPercent=50;
			
		} else {
			scrollTopPercent=50;
		}

		
		$('body').css('background-position' , scrollPercent+'% ' + scrollTopPercent + '%');
		
		
	});

}


$.fn.accordion = function()
{
	$(this).find('.title').click(function(){	
		var content = $(this).parent().find('.tabContent');	//content handler	
		var image = $(this).parent().find('img:first');		//img handler
		var imgsrc = image.attr('src');						//img src
		var isplus = (imgsrc.indexOf("app_add") != -1);		//is img app_add icon
		
		content.stop(true,true).vSlideToggle(450,'easeOutQuart');	//toggle content
					
		if(isplus) {imgsrc=imgsrc.replace("app_add","app_minus");}	//chenge + icon to - 
		else {imgsrc=imgsrc.replace("app_minus","app_add");}		//or - to +
		image.attr({src: imgsrc});									//apply change		
	});	
}

//set input placeholder
$.fn.defaultValue = function(defVal){
	var defVal = defVal==='undefined'?'Input':defVal;
	if (typeof $(this).val() != 'undefined') { defVal = $(this).val()} 
	$(this).focus(function(){	
		if($(this).val()==defVal) {$(this).val('');$(this).next('div').hide()}	
	});
	$(this).blur(function(){	
		if($(this).val()=='') {$(this).val(defVal);}	
	});	
	$(this).val(defVal);
}
//adds cross to clear search input
$.fn.inputCencelButton = function(clss){
	var t=$(this);	
	t.wrap('<div style="position:relative;"></div>');
	t.after('<div style="position:absolute; right:0;top:0;" class="'+clss+'">&nbsp;</div>');
	var searchBtn = t.next('div');
	var btnWidth = searchBtn.width();
	searchBtn.css('right',0);
	searchBtn.click(function(){t.val('');$(this).fadeOut(100);t.focus();});
	if(t.val()=='') searchBtn.hide();
	t.keyup(function(){
		var value = t.val();
		if (value=='') {searchBtn.hide();return;}
		searchBtn.fadeIn(100);
	});

}
$.fn.fadeSlideIn = function(time,easing,distance){
	var distance=distance==='undefined'?50:distance;	
	$(this).show().css({'position':'relative','left':distance,'opacity':0}).animate({'left':0,'opacity':1},time,easing);
}

$.fn.showHidden = function(){
	$(this).show().css('opacity',0);
	return $(this);
}
a = function(mess) { alert(mess); }
clog = function(mess) {console.log(mess);}

$.fn.metroLightbox = function(){
	
	$(this).click(function(){
		
		var elem=$(this);
		var postid = elem.attr('id');
		var fullsrc = elem.attr('fullimage');
		var name = elem.attr('name');
		var nextimg = $(this).nextOrFirst('.mmlightbox');
		var previmg = $(this).prevOrLast('.mmlightbox');
		
		//this can make something like : 'Image 3 of 20'
		var count = $('.mmlightbox').length;
		var indexof = $('.mmlightbox').index(elem)+1;
		
		
		$('.fullscreenbg').fadeIn(200).click(function(){
			$(this).fadeOut(200);
			$(document).unbind('keydown');
		});
		
		
		$('.mmlightboxcontainer #gallery-lightbox-image').html('');
		$('.mmlightboxcontainer #gallery-lightbox-image').html('');
		//$('.mmlightboxcontainer').html('');
		
		$('.mmlightboxcontainer #gallery-lightbox-image').append("<table><tr><td><div class='preloaderbubble white'></div><img class='lightboxSingle' src='" + fullsrc + "' alt='" + name + "'/></td></tr></table>");
		
		
		$('.preloaderbubble').hide().delay(200).fadeIn(550);
		
		$("img.lightboxSingle").css('opacity',1).hide();
		$("img.lightboxSingle").one('load', function() {
			
			$('.preloaderbubble').stop().hide();
			$("img.lightboxSingle").fadeIn(400).click(function(e){e.stopPropagation()});
			
		}).each(function() {
		  if(this.complete) $(this).load();
		});	
		
		//keyboard support (left/right arrow nav)
		$(document).keydown(function(e){			
			if(e.keyCode == 37 || e.keyCode == 38) {//left
				$(this).unbind('keydown');
				previmg.trigger('click');
			}	
			if(e.keyCode == 39 || e.keyCode == 40) {//right
				$(this).unbind('keydown');
				nextimg.trigger('click');
			}
			if(e.keyCode == 27) {//escape key
				$(this).unbind('keydown');
				$('.mmlightboxcontainer').fadeOut(200);
			}				
		});		

		//buttons navigation
		
		//prev
		$('.metro-lightbox-nav-left').unbind('click').click(function(e){
			previmg.trigger('click');
			e.stopPropagation();
		});		
		//next
		$('.metro-lightbox-nav-right').unbind('click').click(function(e){
			nextimg.trigger('click');
			e.stopPropagation();
		});
				
		
		return false;
	});
}


////////////////////
window.mmChartsIntervals = new Array();
$.fn.mmChart = function(data) {
	
	var defaults = { 
		type : "bar",
		colorsPalette: "#fcd800,#fe3b05,#01b1f5,#6eae0a", 
		textColor : "#ffffff",
		labels:     'a,b,c,d,e,f,g,h,i,j,k', 
		show:	'a',
		data:  '', 
		elementId: $(this).attr('id'), 
		gridTextColor: "#ffffff",
		gridBgColor: "transparent",
		prefix: "",
		postfix: "",
		smooth : false
	}; 
	var data = $.extend({}, defaults, data); 	
	
	data.colorsPalette = data.colorsPalette.split(',');
	data.labels = data.labels.split(',');
	data.show = data.show.split(',');
	//////////////////////////////////////////
	$(this).each(function(){
		var elem = $(this);
		var morrisChart;
		if(data.type=='pie'){			
			morrisChart = Morris.Pie({ 
				element: data.elementId, 
				data: data.data, 
				enhanceMax: true , 
				colors: data.colorsPalette, 
				textcolor: data.textColor
			});			
			$('#' + data.elementId).height(window.pieHeight);		
			//$('#' + data.elementId).find('svg').eq(1).remove();//that is becouse of bug when pie chart is painted 2 times after columnizing. error solved, but leaved here commented.	
		}
		if(data.type=='bar'){
			morrisChart = Morris.Bar({
				data: data.data,
				element: data.elementId,
				xkey: 'x',
				ykeys: data.show,
				labels: data.labels,
				barColors: data.colorsPalette,
				gridTextColor: data.gridTextColor,
				postUnits: data.postfix,
				preUnits: data.prefix,
				gridBgColor : data.gridBgColor
			});
		}		
		if(data.type=='donut'){
			morrisChart = Morris.Donut({ 
				element: data.elementId, 
				data: data.data, 
				enhanceMax: true, 
				colors: data.colorsPalette, 
				textcolor: data.textColor 
			})	
		}

		if(data.type=='line'){
			morrisChart = Morris.Line({
				element: data.elementId, 
				smooth: data.smooth, 
				data: data.data, 
				xkey: 'x',
				ykeys: data.show,
				labels: data.labels ,
				lineColors: data.colorsPalette,
				gridTextColor: data.gridTextColor,
				gridBgColor : data.gridBgColor,
				postUnits: data.postfix,
				preUnits: data.prefix
			});	
		}
		if(data.type=='area'){
			morrisChart = Morris.Area({
				element: data.elementId, 
				smooth: data.smooth, 
				data: data.data, 
				xkey: 'x',					
				ykeys: data.show,
				labels: data.labels,
				lineColors: data.colorsPalette,
				gridTextColor: data.gridTextColor,
				postUnits: data.postfix,
				preUnits: data.prefix,
				gridBgColor : data.gridBgColor
			});
		}
		$('> svg', this).css('width','100%'); //avoid overflow bug
		
		var chartHeight = elem.height();
		var chartWidth = elem.width();
		
		
		var redrawInterval = setInterval(function(){			
			if ( chartHeight != elem.height() || chartWidth != elem.width()) {				
				chartHeight = elem.height();
				chartWidth = elem.width();	
				morrisChart.redraw();
				
			}
		},1000);
		//we need to store intervals in array to stop all of them when new items created on responsivnes
		window.mmChartsIntervals.push(redrawInterval);

	
	});

}

$.clearChartsIntervals = function(){

	for(var i=0;i<window.mmChartsIntervals.length;i++){
		clearInterval(window.mmChartsIntervals[i]);
	}
	window.mmChartsIntervals = [];
	
}

$.fn.animateHtml = function(from,to,time,easing,postfix) {
	$(this).each(function(){
		var elem = $(this);
		$({someValue: 0}).animate({someValue: to}, {
			duration: time,
			easing:easing,
			step: function() {		
				console.log(Math.ceil(this.someValue) + "%");
				elem.text(Math.ceil(this.someValue) + "" + postfix);//animate it normally and on every step change label text
			}
		});	
	});

}

$.fn.scrollToElem = function(elem,time,easing,offset){
	var offsetX = $(elem).eq(0).offset().left - offset;
	var offsetY = $(elem).eq(0).offset().top - offset;
	
	offsetX = $(document).width() - offsetX < $(window).width() ? $(document).width() - $(window).width() : offsetX;
	offsetY = $(document).height() - offsetY < $(window).height() ? $(document).height() - $(window).height() : offsetY;
	$('body,html').stop().animate({'scrollLeft': offsetX, 'scrollTop': offsetY}, time,easing);
}

MSBrowser = {
  Version: function() {
    var version = 999; // we assume a sane browser
    if (navigator.appVersion.indexOf("MSIE") != -1)
      // bah, IE again, lets downgrade version number
      version = parseFloat(navigator.appVersion.split("MSIE")[1]);
    return version;
  }
}


})(jQuery);