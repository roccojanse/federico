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
     */
    isProjectRoot: function(dir) {
        return fs.existsSync(dir + '/package.json');
    }

};