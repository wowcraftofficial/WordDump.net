(function($) {

mmcomments = function(){	
	
	//hide reply button
	$('.comment-body .reply ').hide();
	//when single comment is hovered
	$('.comment-body').hover(
		function() {
			//if there is not 'respond' mode alredy activated
			if($(this).next().attr('id') !== 'respond')
			{
				//show reply button
				$(this).find('.reply').stop(true,true);
				$('.reply').slideHide();
				$('> .reply', this).stop().delay(320).slideShow(320,'easeOutQuart');
				//event.stopPropagation();
			}			
		},
		function() { //hide reply button
			$(this).find('.reply').stop(true,true);
			$('> .reply', this).delay(120).slideHide(320,'easeOutQuart');
		}
	);
	//on reply button click
	$('.replyButton').click(function(){
		$('.replyForm').hide();//hide reply form if its active on other comment
		setTimeout(function(){$('.replyForm').slideShow(420,'easeOutQuart');},60);//and reply form
		$(this).slideHide(420,'easeOutQuart');		
	});		

	$('.reply a').click(function(){
		$('.replyForm').hide(); 
		$(this).parent().slideHide(420,'easeOutQuart');
		setTimeout(function(){$('.replyForm').slideShow(420,'easeOutQuart');},60);		
	});	
	//when cencel reply button clicked, hide form
	$('#cancel-comment-reply-link').click(function(){		
		$('.replyForm').hide();
		$('.replyForm').slideShow(420,'easeOutQuart');		
	});
	$("#cancel-comment-reply-link").insertAfter("#comment");
};
mmshortcodes = function(){

	//////////////////////////////
	$('.closebutton').click(function(){	
		$(this).parent().slideHide(350,'easeOutQuart');
	});	
	///////////////////////
	var tabs = $('.shortcode.tabs');
	tabs.find('.tab').each(function(){	////////////////add nav position for each tab in tabs sortcode
		var title=$(this).attr('id');	//take tab id
		$(this).parent().parent().find('ul').append('<li tab='+title+'>'+title.substr(4)+'</li>');//create nav position using tab id
	});
	tabs.find('ul li').click(function(){	//tabs nav click event
		var openedtab = $(this).parent().parent().parent().find('.tab:visible');	//select any tab that is opened (visable) atm
		var nav = $(this).parent().parent().parent().find('ul');
		var tab = $(this).attr('tab');		//every li has tab attr witch is the same with its tab id
		if(tab === openedtab.attr('id')) return;		//if clicked tab is opened one, return
		openedtab.slideHide(300,'easeOutQuart');	//hide opened
		$('#'+tab).slideShow(300,'easeOutQuart');	//show clicked
		nav.find('li').removeClass('active');
		$(this).addClass('active');
	});
	tabs.find('ul').each(function(){		//on each tabs shortcode, add active class to first element
		$(this).find('li').first().addClass('active');	//do it here
		var tab = $(this).find('li.active').attr('tab');	//get activated tab attr
		$(this).parent().parent().find('#'+tab).show();		//and show its tab
	});

	var accordionTabs = $('.accordionTabs');
	accordionTabs.each(function(){
		var tabs=$(this).find('.accordionTab');
		
		tabs.eq(0).addClass('active');
		tabs.not('.active').find('.tabContent').hide();
		
		tabs.click(function(){
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			$(this).siblings().find('.tabContent').slideHide(300,'easeOutQuart');
			$(this).find('.tabContent').slideShow(30,'easeOutQuart');
			
			var image =$(this).find('img');
			var imgsrc = image.attr('src');						//img src
			var imgplus = imgsrc=imgsrc.replace("mobile_minus","app_add");	
			var imgminus = imgsrc=imgsrc.replace("app_add","mobile_minus");
			
			image.attr({src: imgplus});
			$(this).siblings().find('img').attr({src: imgminus});
		});
		
		var minuses = $('.accordionTabs').find('.accordionTab').not('.active').find('.tabTitle').find('img');
		var minussrc = minuses.eq(0).attr('src');
		minussrc=minussrc.replace("app_add","mobile_minus");	
		minuses.attr({src: minussrc});

	});

	$('.shortcode.accordion').accordion();

	$(window).load(function(){			
		$('.shortcode.progressbar').each(function(i){
			var bar = $(this).find('.bar');
			
			var progress = bar.attr('progress');
			progress=progress>100?100:progress;
			
			var width = (progress*$(this).width() - 10*100)/$(this).width() + '%';		
			bar.delay(100+i*50 - (100-progress)/2).animate({'width':width},1250,'easeOutQuart').removeClass('actual');
			
			if ($(this).hasClass('labeled')){
				$(this).next('.progressbarlabel').delay(100+i*50 - (100-progress)/2).animateHtml(0,progress,1250,'easeOutQuart','%');
			}
		});
	});


};


mmdraw = function(){

	window.disableResponsiveJs = 0; //useful for debuging - dont change layout on resize (opening FireBug) etc
	
	//estamine page mode depending on window size
	isMobile = $.isMobile();
	
	windowHeight = $(window).height();
	windowWidth = $(window).width();
	//oldIE = MSBrowser.Version()!=999 && MSBrowser.Version()<=7;	//true only when has IE 7 or older
	
	//columnbreak class has only functional purpose, remove its content
	$('.columnbreak').html('');
	
	//those elements should not be divided into 2 columns if possible during columnization. add class 'dontsplit'
	//$('.columnContent').find('div ,table, caption, label, legend, script, textarea, embed, ul, h1, h2, h3, h4, h5, h6, form, blockquote').addClass('dontsplit');//removed 1.01
	$('.columnContent').find('table, textarea, embed, h1, h2, blockquote').addClass('dontsplit');
	//Big headers and content below them should not be placed in 2 different columns - avoid splitting
	$('.columnContent').find('h1,h2').each(function(){
		$(this).add($(this).next()).wrap('<div class="dontsplit" />');
	});
	
	$('.tabs, .accordionTabs').each(function(){	//avoid columnizer height bug and need to be done before columnizing
		$(this).find('.tab, .accordionTab .tabContent').hide();
		$(this).find('.tab, .accordionTab .tabContent').eq(0).show();
	});	
	
	/////////////////////////////////////////////////////////////////	
	
	//adds horizontal or vertical scroll smooth event depending on isMobile var
	if ( $('body').hasClass('mm-orientation-auto') ) {
		$("html, body").horizontalScroll(400,'easeOutQuart',isMobile);
	}
	
	//adds perspective background image moving mode
	$(window).parallaxBg(isMobile);

	//if is in screen mode
	if(!isMobile){
		//in case you switch from mobile to non-mobile, and non-mobile is not scrolling down, scroll page to the very top
		$("html, body").animate({'scrollTop':0});
		$("body").addClass("mm-non-mobile").removeClass("mm-mobile");
		//set main content container to be as high as possible (to the bottom - 80px)
		$('#contentholder,.verticalScroll,.singleColumn,.fullHeight').strethDown(100);
		$('body.home .verticalScroll:not(nav), body.home .singleColumn').strethDown(100,160);
		$('#gallerry .singleColumn').strethDown(100,210);
		
		var fullHeight,tilesHeight,topMargin;
		if ( $('#blog, #gallerry').length ){
			$('.sorting-options h3').css({'margin-top':0});
			fullHeight = $('#contentholder').height();
			tilesHeight = $('.singleColumn').height() + $('.sorting-options').height();
			topMargin = Math.floor((fullHeight-tilesHeight)/2);
			topMargin *= 0.7;
			$('.sorting-options h3').css({'margin-top':topMargin});
		}
		//homepage vertical center
		if( $('body').hasClass('home') ) {
			$('.single-group').css({'margin-top':0});
			fullHeight = $('#contentholder').height();
			tilesHeight = $('.single-group:not(.welcome-column)').height();
			topMargin = Math.floor((fullHeight-tilesHeight)/2);
			topMargin *= 0.7;
			$('.single-group').css({'margin-top':topMargin});
		}	
		
		
		$('.verticalScroll,.singleColumn,.fullHeight').height($('#contentholder').height()-80);
		//its to avoid whitespace on beginning of column
		$('br').addClass('removeiflast').addClass('removeiffirst');
		//avoid breaking column on its beginning (there would be empty column = big gap)
		$('.columnbreak').addClass('removeiffirst');	
		
		//if some elements that should not be divided into 2 columns are higher than single column, they will be divided anyway, so remove 'dontsplit' class (we will add it again later in case of window resize)
		var tooHigh = $('.dontsplit').filter(function(){		
			return $(this).height() > $('#contentholder').height()-80;
		}).not('.verticalScroll');		
		tooHigh.removeClass('dontsplit');
		
		//hide columns (they will fade in later)
		$('body.mm-orientation-auto .columnWrapper').show().css('opacity',0);	
		$('body.mm-orientation-auto .columnContent').width(550*2);//another columnizer cheat - content width has to be 2x wider than single column
		$('body.mm-orientation-auto .columnContent>*').width(470);//but content itself has to has correct width in order to allow columnizer to get its height and divide it correctly inside columns. I know its weird but without native support of column content it gets tricki, but it wokrs fine.
		//$('.columnWrapper').css('opacity',1); //dev		
		
		//columnize text content
		$('body.mm-orientation-auto .columnContent').columnize({
			width : 550,
			height : $('#contentholder').height()-60,//i dont know why columnizer make columns a little higher than set, thats why -60.
			buildOnce: true, 
			lastNeverTallest: false,
			ignoreImageLoading: false, //causes custom scrollbar error, inspect
			doneFunc: function(){	//when columnizing is done
				tooHigh.addClass('.dontsplit');	//add again 'dontsplit' class to elements that was higher than single column
				$('.columnWrapper').css('opacity',1);	//show column wraper
				
				
				
				$('.column').css('opacity',0).delay(350).each(function(i){	//and fade in every single column with delay		
					if ( window.modeChanged ) {
						$(this).delay(200+i*100).fadeSlideIn(650,'easeOutQuart',50);
					} else {
						$(this).show().css('opacity',1);
					}
				});

				
				$('.column').find('.columnwidth').each(function(){	//if any column has [columnwidth] shortcode inside - change column width
				
					var columnWidth=$(this).attr('columnwidth');	//get shortcode column-width attr
					var widthDifference = columnWidth - $(this).parents('.column').width();
					
					var columnHolder = $(this).parents('.columnContent');
					var parentColumn = $(this).parents('.column');					
					
					columnHolder.width(+columnHolder.width() + widthDifference);
					parentColumn.width(columnWidth);
					parentColumn.children().width('');
				});		

				$('body.mm-orientation-auto .columnContent').find(".verticalScroll").mCustomScrollbar({ //add custom scrollbar to elements
					scrollInertia: 220,
					mouseWheel: 45,
					advanced:{
						updateOnBrowserResize:true, 
						updateOnContentResize:true
					},
					scrollEasing:"easeOutQuart",
					set_height:$(this).parent().height()

				});	
				
				$('.columnContent').find(".mCSB_scrollTools").css('opacity',0);	//custom scrollbar is hidden and shows when hovered
				$('.columnContent').find(".verticalScroll").hover(
					function(){$(this).find(".mCSB_scrollTools").stop(true,true).animate({'opacity':1},150,'easeOutQuart');},
					function(){$(this).find(".mCSB_scrollTools").stop(true,true).delay(100).animate({'opacity':0},150,'easeOutQuart');}
				);
				
				$('.metroSlide').once().metroSlide();
			}
		});
		

		//isotope homepage tiles
		$('#indexContent .singleColumn, #child-tiles .singleColumn').isotope({
			
			animationEngine: 'jquery',
			layoutMode: 'masonryHorizontal',
			masonryHorizontal: {rowHeight: 80},
			animationOptions: {duration: 750,easing:'easeOutExpo'},	
			getSortData : {
				order : function ( $elem ) {
					return parseInt($elem.attr('order'));
				}
			}
		//when done, if old IE (dont support no-wraping) change body width to sume of groups width's to avoid line breaking
		}).promise().done(function(){
			if ((!$.browser.msie || !$.browser.version > 7) || !$('#indexContent .singleColumn').length) return; //thats only becouse IE7 and lower dont support no-wrapping css, and we had to change body width
			
			var columnsWidth = 0;
			$('#indexContent .singleColumn, #tilesMenu, .welcome-column').each(function(){				
				columnsWidth+=$(this).outerWidth()+80;//width of column + 80px margin
			});
			columnsWidth+=80;
			$('body').width(columnsWidth);
		});	
		//gallerry tiles isotope
		$('#gallerry .singleColumn').isotope({
			getSortData : {
				date : function ( $elem ) {
					return parseInt($elem.attr('date'));
				},
				author : function ( $elem ) {
					return $elem.attr('author');
				},
				category : function ( $elem ) {
					return $elem.attr('category');
				},
				comments : function ( $elem ) {
					return parseInt($elem.attr('comments'));
				},
				name : function ( $elem ) {
					return $elem.attr('name');
				}
			},
			animationEngine: 'jquery',
			layoutMode: 'masonryHorizontal',		
			itemSelector: '.gallerrytile',
			masonryHorizontal: {rowHeight: 210},
			animationOptions: {duration: 750,easing: 'easeOutExpo'}		
		});	
		
		$('#portfolio .singleColumn').isotope({
			getSortData : {
				date : function ( $elem ) {
					return parseInt($elem.attr('date'));
				},
				author : function ( $elem ) {
					return $elem.attr('author');
				},
				category : function ( $elem ) {
					return $elem.attr('category');
				},
				comments : function ( $elem ) {
					return parseInt($elem.attr('comments'));
				},
				name : function ( $elem ) {
					return $elem.attr('name');
				}
			},
			animationEngine: 'jquery',
			layoutMode: 'masonryHorizontal',		
			itemSelector: '.portfoliotile',
			masonryHorizontal: {rowHeight: 160},
			animationOptions: {duration: 750,easing: 'easeOutExpo'}		
		});	
		
		
		
		
		//blog tiles isotope
		$('#blog .singleColumn').isotope({
			getSortData : {
				date : function ( $elem ) {
					return parseInt($elem.attr('date'));
				},
				author : function ( $elem ) {
					return $elem.attr('author');
				},
				category : function ( $elem ) {
					return $elem.attr('category');
				},
				comments : function ( $elem ) {
					return parseInt($elem.attr('comments'));
				},
				name : function ( $elem ) {
					return $elem.attr('name');
				}
			},
			animationEngine: 'jquery',
			layoutMode: 'masonryHorizontal',
			itemSelector: '.blogtile',
			masonryHorizontal: {rowHeight: 40},
			animationOptions: {duration: 750,easing: 'easeOutExpo'}		
		});	

		$('body.logged-admin .singleColumn').mmsort('.tile');
		$("body.home .verticalScroll").fitVids();
	
		
	}
	else	//IS IN MOBILE MODE
	{
		$("body").addClass("mm-mobile").removeClass("mm-non-mobile");
		//show all the columns
		$('.column').css('opacity',1);

		//make all videos responsive.
		$("article, body.home .verticalScroll").fitVids();		
		
	}//end else is mobile

	//if options of theme tells so - add tiles background gradient (10 color tones difference)
	$('body.tile-gradient div.tile:not(".labelbg")').tileBg(10);
	
	//if there is too many pages in menu, add vertical scrolling
	var navHeight = $('#contentholder').height() - 15;
	$('body.mm-orientation-auto .verticalScroll').filter(function(){return !$(this).hasClass('mCustomScrollbar')}).mCustomScrollbar({	//filter is to avoid double scroll adding
		scrollInertia:220, 
		mouseWheel: 45,
		advanced:{
			updateOnBrowserResize:true, 
			updateOnContentResize:true
		},
		scrollEasing:"easeOutQuart",
		set_height: navHeight
	});
	
	//and hover show effect
	$(".mCSB_scrollTools").css('opacity',0);
	$(".verticalScroll").hover(
		function(){$(this).find(".mCSB_scrollTools").stop(true,true).animate({'opacity':1},150,'easeOutQuart');},
		function(){$(this).find(".mCSB_scrollTools").stop(true,true).delay(100).animate({'opacity':0},150,'easeOutQuart');}
	);	

	//fade in all the groups of tiles
	$('.single-group,.singleColumn').filter(function(){return $(this).parent().attr('class') !== 'single-group'}).css('opacity',0).delay(100).each(function(i){
		$(this).delay((i+1)*70).fadeSlideIn(750,'easeOutQuart',80);
	});	
	
	//fade in header and controll buttons
	//$('header, .controlFooter').css('opacity',0).delay(200).animate({'opacity':1},750,'easeOutQuart');
	$('.mm_dialog_notification').oncekey('showNotifications').delay(2000).showHidden().animate({'right':'-=30'},0).animate({'right':'+=30','opacity':1},550,'easeOutQuart').delay(4000).fadeOut(150,'easeOutQuart').click(function(){$(this).stop().fadeOut(150,'easeOutQuart');});	//show notifications

	$('.thile, .bottom-label').bgalpha(0.92);
	$('#blog .bottom-label').bgalpha(0.6);
	
	//add fullscreen images events in gallerry
	$('.mmlightbox').metroLightbox();

	//adds backbutton hover effect and if fullscreen image is shown, adds click event
	$('#backbutton').hover(
		function(){$(this).stop().animate({left:'-4px'},150,'easeOutQuart')},
		function(){$(this).stop().animate({left:'0px'},150,'easeOutQuart')}
	).click(function(){
		if($('img.lightboxSingle').is(':visible')){		
			$('.fullscreenbg').fadeOut(200);	//on backbutton click, hide fullscreen image
			return false;			
		}
	});		
	//adds hover effect on arrow on video-tiles.
	$('.videoarrow').hover(
		function(){$(this).stop().css('position','relative').animate({left:'3px'},150,'easeOutQuart')},
		function(){$(this).stop().animate({left:'0px'},150,'easeOutQuart')}
	);		

	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	//////////////////////trivial stuff, dont toutch//////////////////
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	//need to be done after main init
 
	
	$('.metroSlide').once().metroSlide();
	
	if( $('#last-post-fullscreen').length ){
		var bodyMarginLeft = parseInt($('body').css('margin-left'));
		var makeSquare = function(){
			var height = $(this).height();
			$('body').css('margin-left',bodyMarginLeft + height);
			$('#last-post-fullscreen').width(height);
			
		};
		makeSquare();
			$(window).resize(function(){makeSquare();})
	}
	//default placeholders of inputs
	$('#s').defaultValue("Search");
	$('input#url').defaultValue("Website");
	$('input#email,input#cf_email').defaultValue("Email");
	$('input#author,input#cf_name').defaultValue("Your name");
	
	//remove empty paragraphs to avoid column whitespaces
	$('p').filter(function(){return $(this).html()=='';}).remove();
	
	//adds 'clear form' cross button on search input
	$('#s').inputCencelButton("clearFormButton");
	
	//hide images with incorrect url
	$('img').error(function(){
		$(this).hide(); 
	});		
	$('img').each(function() { this.src = this.src; });	

	//opacity settings
	$('.tile .info,.tile .caption').css('opacity',0.95);	
	$('blockquote, q').css('opacity',0.8);
	$('.secondary,#copyright').css('opacity',0.6);		
	$('.tertiary,.widget.widget_calendar th, svg text').css('opacity',0.4);
	$('.marginal').css('opacity',0.2);
	$('.tile .info .meta').hide();	
	
	$('.post-tile h2').limitTextLines(3);
	


	//this is tricky. It will detect first and last column shortcode (one_third ex.) inside each row of each column and add classes .first or .last or both.
	$(".onethird,.twothird,.onehalf").each(function(){ //foreach item			
				
		var offsetTop = $(this).offset().top;	//get this item top position
		var lineGroup = $(this).siblings(".onethird,.twothird,.onehalf").andSelf().filter(function(){return $(this).offset().top == offsetTop});	//group items by the same top position
		if (!lineGroup.length==1) return;
		lineGroup.eq(0).addClass('first');	//and add first class to the first of them
		lineGroup.eq(lineGroup.length-1).addClass('last');	//and .last class to the last of them	

	});		
	
	$.keyboardSearch();
	//removes white spaces on columns begin
	$('.split').each(function(){	
		var firstChild = $(this).children().eq(0);
		if(firstChild.text().length==1) firstChild.hide();
	});
	//and in extreme case - hide empty column to remove huge gap
	$('.column').each(function(){
		if( !$(this).height() ) {$(this).hide();}
	});
	//var emptyColumns = $('.column').filter(function(){return $(this).height()==0}).hide().length;
	
	//if content is more narrow then window, there is no need to show 'scroll back' button - hide it
	if ($(document).width()<$(window).width()) $('.scrollback').hide();
	//add scrollback button event
	$('.scrollback').click(function(){
		$('html,body').animate({'scrollLeft':0, 'scrollTop':0},750,'easeOutQuart');
	});
	
	//share button click -> sharebar show event
	$('.sharebutton').click(function(){		
		$('.shareFooter').stop().show().animate({right:'0px'},200,'easeOutQuart');
		//show sharebar content one part after another in metro style
		$('.shareFooter > *').each(function(i){
			$(this).show().css('opacity',0).delay(i*30+80).fadeSlideIn(500,'easeOutQuart',50);
		});
		return false;
	});

	//hide sharebar when clicked anywhere but no on sharebar itself
	$('.shareFooter, #navbar').click(function(e){		
		 e.stopPropagation();
	});	
	$('html,.sharebackbutton').click(function() {
		if ($('.shareFooter').css('opacity')==1){
			$('.shareFooter').stop().animate({right:'-340px'},200,'easeOutQuart',function(){$(this).hide();});
		}
		if(parseInt($('#navbar').css('left')) == 0 ) {
			$('#navbar').mouseleave();
		}
	});	
	
	//adds sliding content inside tiles or any element with that class
	
	
	//navbar show event - shows bar itself and fades in its content.
	$('#navbar').hover(
		function(){
			if(parseInt($(this).css('left')) != 0 ) {
				
				//THIS IS FOR IOS MOBILE DEVICES BUG It disables all nav links for 0.5s when showing.
				$('#tabletTapper').hide();
				$('nav a',this).each(function(){
					var elem = $(this);
					elem.click(function(e){
						e.preventDefault();
						return false;
					});
					
					setTimeout(function(){
						elem.unbind('click');
					},500);				
				});
			
				$(this).stop().animate({left:'0px'},200,'easeOutQuart');
				$(' > * ', this).not('#navbardots').hide().each(function(i){
					$(this).show().css('opacity',0).stop(true,true).delay(i*30+80).fadeSlideIn(500,'easeOutQuart',-50);				
				});			
				$('#navbardots').stop().fadeOut(110);
				setTimeout(function(){$('nav',this).show();},50);
			}
		},
		function(){
			$('#tabletTapper').show();
			$(this).stop().animate({left:'-330px'},200,'easeOutQuart');			
			$('#navbardots').stop().fadeIn(110);
			$('nav',this).hide();
		}
	);	
	//navbar has narrow visible part - its easy to hover but hard to tap with finger, so there is wider invisible div that shows navbar when clicked
	$('#tabletTapper').click(function(){	
		$('#navbar').trigger('mouseenter');
	});
	
	//menu nested options show effects.
	$('nav li ul').css('opacity',1).hide();
	$('nav li ul').each(function(){$(this).css('opacity',$(this).parent().css('opacity')*0.8)});

	$('nav li').hover(
		function(){			
			$('>ul',this).stop(true,true).slideShow(300,'easeOutQuart',function(){$('nav *').css('height','');});
		},
		function(){
			$('> ul',this).delay(300).stop().slideHide(700,'easeOutQuart');
		}
	);
	
	//center tile multi line text bug
	$('.center-title h2').each(function(){
		var elem = $(this);
		var singleLineHeight = parseInt( elem.css('line-height') );

		if ( elem.height() > singleLineHeight ) {
			var text = elem.html();
			$(this).html(text.replace(' ', '<br/>'));
		}
	});	
	
	//go to url on mobile dropdown select menu change
	$('nav select').change(function(){ 
		var link = $(this).find("option:selected").val();
		window.location = link
	});
	
	//scroll page on index on 'go to' menu.
	$('#tilesMenu li').click(function(){
		var scrollto = $(this).attr('scrollto');
		$('body').scrollToElem('#'+scrollto,700,'easeOutQuart',80);
	});
	
	//changes select width to adjust actually selected option
	$('.flatSelect').change(function(){		
		//this is to adjust select width to selected option width
		var $opt = $(this).find("option:selected");
		var $span = $('<span>').addClass('tester').text($opt.text());
		$span.css({'font-family': $opt.css('font-family'),'font-style': $opt.css('font-style'),'font-weight': $opt.css('font-weight'),'font-size': $opt.css('font-size')});
		$('body').append($span);
		// The 30px is for select open icon - it may vary a little per-browser
		$(this).width($span.width()+24);
		$span.remove();		
	});	
	//and adjust it on pageload
	$('.flatSelect').trigger('change');
	
	//change isotope filtering on select change
	$('.flatSelect.filter').change(function(){
		var value = $(this).val();
		value = value=="*"?"*":"."+value;			
		$('.isotope').isotope({ 
		  filter : value
		});
	});	
	//and sorting...
	$('.flatSelect.sort').change(function(){
		var value = $(this).val();
		$('.isotope').isotope({ 
		  sortBy : value,
		  sortAscending : false
		});
	});
	//this adjust blog tiles content to fits exacly the plase has left for it inside tile
	
	$('.chart svg').eq(1).remove();
	
	//fire comments and shortcodes js
	setTimeout(function(){
		$('.blogtile .blogtile-content').strethDownRelative(10,$('.blogtile .blogtile-content').css('line-height'),'.blogtile');
		$('.home-post-tile-content').strethDownRelative(10,$('.home-post-tile-content').css('line-height'),'.tile');
	
		mmcomments();
		mmshortcodes();
		
	},500);
	
	
	
}

})(jQuery);