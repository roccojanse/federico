var config = require('../federico'),
    fs = require('fs-extra');

'use strict';

/**
 * handles file creation, modificatio and deletion
 * @module federico/files
 */
var Files = module.exports = {

    /** 
     * @property {array} extensions Current supported extensions defined in config 
     */
    extensions: config.extensions,

    /**
     * creates and writes files of requested type
     * @param {string} type Type to create (component/element)
     * @param {string} name Name
     * @param {object} [options] Options defined in cli program call
     * @param {boolean} options.html True if defined in cli
     * @param {boolean} options.js True if defined in cli
     * @param {boolean} options.scss True if defined in cli
     */
    createFiles: function(type, name, options) {

        var filesArray = [],
            filePath = config.paths[type] || null;

        // filepath should exist, else type is unsupported
        if (filePath !== null) {
            
            // create filepath and filename for each extension
            Files.extensions.forEach(function(extension, i) {
                var ext = extension.substr(1, extension.length);
                if (typeof options[ext] === 'undefined') {
                    var fileName = name;
                    if (ext === 'scss' || ext === 'sass') {
                        fileName = '_' + name;
                    }
                    filesArray.push(filePath + name + '/' + fileName + extension);
                }
            });

            
            console.log('Files:', filesArray);

        } else {
            
            console.error('\nError: unsupported type "' + type + '"\n\n');
            process.exit(1);
        }


        console.log('create %s "%s"', type, name, options.html, options.js, options.scss);
        // console.log(config.paths, Files.extensions);
    }

};