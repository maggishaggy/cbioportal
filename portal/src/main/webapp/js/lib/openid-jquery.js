/*
Simple OpenID Plugin
http://code.google.com/p/openid-selector/

This code is licenced under the New BSD License.
*/

var providers_large = {
  
    googleplus: {
        name: 'GooglePlus',
        url: 'http://localhost:8080/gdac-portal/auth/google'
    }
};

var providers = $.extend({}, providers_large);

var openid = {

	demo: false,
	ajaxHandler: null,
	cookie_expires: 6*30,	// 6 months.
	cookie_name: 'openid_provider',
	cookie_path: '/',
	
	img_path: 'images/login/',
	
	input_id: null,
	provider_url: null,
	provider_id: null,
	
    init: function(input_id) {
        
        var openid_btns = $('#openid_btns');
        
        this.input_id = input_id;
        
        $('#openid_choice').show();
        $('#openid_input_area').empty();
        
        // add box for each provider
        for (id in providers_large) {
        
           	openid_btns.append(this.getBoxHTML(providers_large[id], 'large', '.jpeg'));
        }

        $('#openid_form').submit(this.submit);
        
        var box_id = this.readCookie();
        if (box_id) {
        	this.signin(box_id, true);
        }  
    },
    getBoxHTML: function(provider, box_size, image_ext) {

		var img_subdir;
		if (box_size == "large") {
			img_subdir = "images.large/";
		}
		else {
			img_subdir = "images.small/";
		}

        var box_id = provider["name"].toLowerCase();
        return '<a title="'+provider["name"]+'" href="javascript: openid.signin(\''+ box_id +'\');"' +
        		' style="background: #FFF url(' + this.img_path + img_subdir  + box_id + image_ext+') no-repeat center center" ' + 
        		'class="' + box_id + ' openid_' + box_size + '_btn"></a>';    
    
    },
    /* Provider image click */
    signin: function(box_id, onload) {
    
    	var provider = providers[box_id];
  		if (! provider) {
  			return;
  		}
		
		this.highlight(box_id);
		this.setCookie(box_id);
		
		this.provider_id = box_id;
		this.provider_url = provider['url'];
                
                Console.log('signin function url = ' +url);
		
		// prompt user for input?
		if (provider['label']) {
			this.useInputBox(provider);
		} else {
			$('#openid_input_area').empty();
			if (! onload) {
                                 Console.log('signin function submitting');
				$('#openid_form').submit();
			}
		}
    },
    /* Sign-in button click */
    submit: function() {
         Console.log('signin function url = ' +url);
    	var url = openid.provider_url; 
         Console.log('submir function provider url = ' +url);
    	if (url) {
    		url = url.replace('{username}', $('#openid_username').val());
                Console.log('submir function modified url = ' +url);
    		openid.setOpenIdUrl(url);
    	}
    	if(openid.ajaxHandler) {
    		openid.ajaxHandler(openid.provider_id, document.getElementById(openid.input_id).value);
    		return false;
    	}
    	if(openid.demo) {
    		alert("In client demo mode. Normally would have submitted OpenID:\r\n" + document.getElementById(openid.input_id).value);
    		return false;
    	}
    	return true;
    },
    setOpenIdUrl: function (url) {
    
    	var hidden = document.getElementById(this.input_id);
    	if (hidden != null) {
    		hidden.value = url;
    	} else {
    		$('#openid_form').append('<input type="hidden" id="' + this.input_id + '" name="' + this.input_id + '" value="'+url+'"/>');
    	}
    },
    highlight: function (box_id) {
    	
    	// remove previous highlight.
    	var highlight = $('#openid_highlight');
    	if (highlight) {
    		highlight.replaceWith($('#openid_highlight a')[0]);
    	}
    	// add new highlight.
    	$('.'+box_id).wrap('<div id="openid_highlight"></div>');
    },
    setCookie: function (value) {
    
		var date = new Date();
		date.setTime(date.getTime()+(this.cookie_expires*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
		
		document.cookie = this.cookie_name+"="+value+expires+"; path=" + this.cookie_path;
    },
    readCookie: function () {
		var nameEQ = this.cookie_name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
    },
    useInputBox: function (provider) {
   	
		var input_area = $('#openid_input_area');
		
		var html = '';
		var id = 'openid_username';
		var value = '';
		var label = provider['label'];
		var style = '';
		
		if (label) {
			html = '<p>' + label + '</p>';
		}
		if (provider['name'] == 'OpenID') {
			id = this.input_id;
			value = 'http://';
			style = 'background:#FFF url('+this.img_path+'images/'+'openid-inputicon.gif) no-repeat scroll 0 50%; padding-left:18px;';
		}
		html += '<input id="'+id+'" type="text" style="'+style+'" name="'+id+'" value="'+value+'" />' + 
					'<input id="openid_submit" type="submit" value="Sign-In"/>';
		
		input_area.empty();
		input_area.append(html);

		$('#'+id).focus();
    },
    setDemoMode: function (demoMode) {
    	this.demo = demoMode;
    },
    setAjaxHandler: function (ajaxFunction) {
    	this.ajaxHandler = ajaxFunction;
    }
};
