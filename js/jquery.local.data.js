(function($){
    var pluses = /\+/g;

    function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

    var config = $.localData = function (key, value, options) {
        options = $.extend({}, config.defaults, options);
    
		if (value !== undefined) {
			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			if ( typeof(Storage) !== "undefined" ) {
    			// Web Storage
    			content = {
        			value : value,
        			expires : options.expires ? options.expires.toUTCString() : '',
        			path : options.path ? options.path : '',
        			domain : options.domain ? options.domain : ''
    			};
    			
    			return localStorage[ key ] = JSON.stringify(content);
			} else {
    			// Cookies
    			return (document.cookie = [
    				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
    				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    				options.path    ? '; path=' + options.path : '',
    				options.domain  ? '; domain=' + options.domain : '',
    				options.secure  ? '; secure' : ''
    			].join(''));
			}
		}

		if ( typeof(Storage) !== "undefined" ) {
    		// Web Storage
    		content = JSON.parse(localStorage[ key ]);
    		
    		currentDate = new Date();
    		storageDate = new Date(content.expires);
    		
    		if ( content.expires != "" ) {
        		if ( currentDate.getTime() > storageDate.getTime() ) {
            		return localStorage[ key ] = null;
        		}
    		}
    		
    		if ( ( content.domain != "" ) && ( content.domain != document.domain ) ) {
        		return localStorage[ key ] = null;
    		}
    		
    		if ( ( content.path != "" ) && ( content.path != window.location.pathname ) ) {
        		return localStorage[ key ] = null;
    		}
    		
    		return content.value;
        } else {
            // Cookies
    		var decode = config.raw ? raw : decoded;
    		var cookies = document.cookie.split('; ');
    		for (var i = 0, l = cookies.length; i < l; i++) {
    			var parts = cookies[i].split('=');
    			if (decode(parts.shift()) === key) {
    				var cookie = decode(parts.join('='));
    				return config.json ? JSON.parse(cookie) : cookie;
    			}
    		}
		}

		return null;
	};

	config.defaults = {};

	$.removeLocalData = function (key, options) {
		if ($.localData(key) !== null) {
			$.localData(key, null, options);
			return true;
		}
		return false;
	};
})(jQuery);