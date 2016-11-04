var fs = require('fs-extra');

'use strict';

/**
 * various global checks
 * @module federico/checks
 */
var Checks = module.exports = {
    
    /**
     * checks if requested dir is a project root
     * by checking the directory for a package.json file
     * @param {string} directory Directory which must contain a pacakge.json
     * @param {(boolean|undefined)} [force = false] Forces check returns true
     * @returns {boolean} True if directory is a project root or force parameter is true
     */
    isProjectRoot: function(dir, force) {
        var ret = false;
        if (typeof force !== 'undefined' && force === true) {
            ret = true;
        } else {
            ret = fs.existsSync(dir + '/package.json');
        }
        return ret; 
    }

};