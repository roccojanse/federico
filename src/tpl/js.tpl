/* globals $ */

/**
 * {{ucfirst_name}}
 * description
 * 
 * @author {{author}}
 * @version 1.0
 * @date {{date}}
 */
var {{ucfirst_name}} = function(options) {

	'use strict';

    // vars
    var _this = this;
    
    // config
    var config = $.extend({
        $element: $('.{{name}}')
    }, options);
   
	/**
	 * initializes component
     * @public
	 */	
	this.init = function() {

        // if component exists
        if (config.$element.length > 0) {

            // code
        }
    };
};