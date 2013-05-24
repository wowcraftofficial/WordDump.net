jQuery(document).ready(function ($) {
	
	var mmajaxurl = SITEURL + "/wp-admin/admin-ajax.php";

	$('.sorttilesbutton').click(function(){
	    alert('d');
			var order = $('input').not('#s').serialize();
			var elem = $('.sorttilesbutton');
			console.log( 'Saving tiles order...' );
			
			elem.find('.control-label').html('Saving tiles');
			$.ajax({
				type: 'POST',
				url: mmajaxurl,
				data: {
					action: 'updateTilesOrder',
					tilesOrder: order
				},
				success: function (data, textStatus, XMLHttpRequest) {
					elem.find('.control-label').html(data);
					console.log('Tiles order saved...');
					setTimeout(function(){
						elem.fadeOut(200,function(){elem.find('.control-label').html('Save tiles');});
					},1000);
				},
				error: function (MLHttpRequest, textStatus, errorThrown) {
					alert("Tiles could not be saved: " + errorThrown);
					elem.find('.control-label').html(errorThrown);
					setTimeout(function(){
						elem.fadeOut(200,function(){elem.find('.control-label').html('Save tiles');});
					},1000);					
				},
				timeout: 6000
			});			
			return false;
	});
	
	//remember initial navbar menu html
	var defaultMenuHTML = $('.menu').html();
	
	$('body.ajax-search #s').keyup(function(){		
			
			var value = $(this).val();//get input value
			if (value == "") {
				$('.menu').html(defaultMenuHTML);
				$('.menu ul li').each(function(i){
					$(this).delay(i*5).fadeSlideIn(550,'easeOutQuart',20);	//slide in animation
				});	
				return;
			} else {
			$('.menu').html('<div class="smallsquare bgnorpt mrgnaut preloadercircle prelative cboth mediumlinetop"></div>');
			$('.menu .preloadercircle').hide().delay(400).fadeIn(200).eq(1).remove();
			
			}
			
			var sendAjax = function(){
				if ($('#s').val() == '') return;
				$.ajax({
					type: 'POST',
					url: mmajaxurl,
					data: {
						action: 'mmSearch',
						searchKey: value
					},
					success: function (data, textStatus, XMLHttpRequest) {					

						//if returned empty flag, restore initial navbar menu
						if (data=='empty') {
							$('.menu').html(defaultMenuHTML);
							
						} else {
							//parse data to an array
							var data = $.parseJSON(data);							
							
							var title = '';
							var url = '';
							var bg = '';
							var icon = '';
							
							//if nothing found (empty array)
							if (!data.length) {
								$('.menu').html('<ul><li><h3>Nothing found</h3><ul></li>').eq(1).remove();
							} else {							
								//sort array by title similaryty to query key
								if (data[0]) data[0] = data[0].sort(function(x,y){return $.stringsSimilarity(y[0],value) - $.stringsSimilarity(x[0],value)});								
								if (data[1]) data[1] = data[1].sort(function(x,y){return $.stringsSimilarity(y[0],value) - $.stringsSimilarity(x[0],value)});																
							
								$('.menu').html('').html('<ul></ul>'); //set blank list in navvar
								
								for (var i = 0; i < data.length; i++) {	//loop trought pages, than trough posts							

									if (i==1) {$('.menu ul').append('<hr class="cboth"/>')}; //put hr between pages and posts								
								
									for (var j = 0; j < data[i].length; j++) {  //for each row add <li> and <a> link with data		
										title = data[i][j][0];
										url = data[i][j][1];
										bg = data[i][j][2];
										icon = data[i][j][3];							   

										$('.menu ul').append('<a href="' + url + '"><li class="cboth"><div class="fleft mediumline smallsquare inline blackbg aligntop smallgroup labelbg bgcenter" style="background-color:' + bg +';background-image:url(' + icon + ');"></div>' + title + '&nbsp;</li></a>');							  
									}

								}							
								$('.menu').eq(1).remove(); //sometimes results are sent twice and menu is created twice - remove 2nd one.
							}
						}
						
						//$('.menu').fadeSlideIn(550,'easeOutQuart',20);	//slide in animation
						$('.menu ul li').each(function(i){
							$(this).delay(i*5).fadeSlideIn(550,'easeOutQuart',20);	//slide in animation
						});
						
					},
					error: function (MLHttpRequest, textStatus, errorThrown) {
						
					}
				});						
			}
			$.timeBid(function(){sendAjax();});
			
			return false;
	});
	
	$('body.logged-admin .tile').each(function(){
		var tile = $(this);
		
		tile.mouseHold(function(){
			var id = tile.parent().attr('topost');

			$.ajax({
				type: 'POST',
				url: mmajaxurl,
				data: {
					postid: id,
					action: 'mmGetEditURL'
				},
				success: function (data, textStatus, XMLHttpRequest) {
					if (textStatus == 'success') window.location.href = data;
				}
			});			
			return false;
		},2000);		
	});
	
	$('.contact-form').each(function(){
		var form = $(this);
		$('input[type=submit]', form).click(function(){
			$('.mm-loader.fs').fadeIn(300);
			$.ajax({
				type: 'POST',
				url: mmajaxurl,
				data: {
					name: $('#cf_name').val(),
					email: $('#cf_email').val(),
					content: $('#cf_message').val(),
					action: 'mmSendMail'
				},
				success: function (data, textStatus, XMLHttpRequest) {
					$.mmError(data,true);
					$('.mm-loader.fs').fadeOut(300);
				},
				error: function (MLHttpRequest, textStatus, errorThrown) {
					$.mmError('Failed to send email. Try again',true);
					$('.mm-loader.fs').fadeOut(300);
				},
				timeout: 5000
			});	
			return false;
		});
	});
	
	
	
	
});