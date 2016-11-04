var fs = require('fs-extra'),
    username = require('username'),
    config = require(__dirname + '/config/federico'),
    checks = require(__dirname + '/checks');

'use strict';

/**
 * handles file creation, modification and deletion
 * @module federico/files
 */
var Files = module.exports = {
    
    /** 
     * @property {string} cwd Current working directory
     */
    cwd: process.cwd() + '/',

    /** 
     * @property {array} extensions Current supported extensions defined in config 
     */
    extensions: config.extensions,

    /**
     * creates federico local config file
     * @param {object} [options] Options defined in cli program call
     * @param {boolean} options.dir True and set if defined in cli
     * @param {boolean} options.force True if defined in cli
     */
    createConfig: function(options) {
        
        // create path
        var dir = Files.cwd,
            fileName = 'federico.json';

        if (options.dir) {
            dir += options.dir + '/';
        }

        if (checks.isProjectRoot(dir, options.force)) {
            fs.outputJson(dir + fileName, config, function(err) {
                if (err) { 
                    console.error('\nError: writing file: "' + dir + fileName + '".\n\n');
                } 
                console.log('\nCreated config file.\n\n');
            });
        } else {
            console.error('\nError: no package.json found. "' + dir + '" is not a project root.\n\n');
        }

    },

    /**
     * gets the file template based on extension
     * @param {string} extension Extension to get template for
     * @returns {string} Template
     */
    getTemplate: function(extension, cb) {

        if (extension === 'sass') {
            extension = 'scss';
        }
        
        var tplFile = __dirname + '/tpl/' + extension + '.tpl';

        fs.readFile(tplFile, 'utf8', function(err, data) {
            if (err) { 
                console.error('\nError: cannot read template: "' + tplFile + '".\n\n');
            } 
            if (typeof cb === 'function') {
                cb(data);
            }
        });
    },

    /**
     * creates and writes files of requested type
     * @param {string} type Type to create (component/element)
     * @param {string} name Name
     * @param {object} [options] Options defined in cli program call
     * @param {boolean} options.html True if defined in cli
     * @param {boolean} options.js True if defined in cli
     * @param {boolean} options.scss True if defined in cli
     * @param {boolean} options.force True if defined in cli
     */
    createFiles: function(type, name, options) {

        var filesArray = [],
            filePath = config.paths[type] || null,
            fileCount = 0;

        if (checks.isProjectRoot(Files.cwd, options.force)) {

            // filepath should exist, else type is unsupported
            if (filePath !== null) {
                
                // create filepath and filename for each extension
                Files.extensions.forEach(function(extension, i) {
                    var ext = extension.substr(1, extension.length);
                    if (typeof options[ext] === 'undefined') {
                        
                        var fileName = name;

                        Files.getTemplate(ext, function(fileTpl) {

                            // replace template values
                            var d = new Date(),
                                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                            fileTpl = fileTpl.replace(/{{name}}/gi, name);
                            fileTpl = fileTpl.replace(/{{ucfirst_name}}/gi, name.charAt(0).toUpperCase() + name.slice(1));
                            fileTpl = fileTpl.replace(/{{author}}/gi, username.sync());
                            fileTpl = fileTpl.replace(/{{date}}/gi, months[d.getMonth()] + ' ' + d.getFullYear());

                            // alter filename for sass partials
                            if (ext === 'scss' || ext === 'sass') {
                                fileName = '_' + name;
                            }

                            // filepath and data
                            fileData = {
                                file: Files.cwd + filePath + name + '/' + fileName + extension,
                                tpl: fileTpl
                            };

                            fs.outputFile(fileData.file, fileData.tpl, function(err) {
                                if (err) { 
                                    console.error('\nError writing file: "' + fileData.file + '".\n\n');
                                }

                                // set files to full access
                                fs.chmodSync(fileData.file, '0777');
                                
                                // count for result
                                fileCount++;

                                if (Files.extensions.length === fileCount) {
                                    console.log('\n' + type + ' "' + name + '" created.\n\n');
                                }
                            });   
                        });  
                    } else {
                        fileCount++;
                    }
                });


            } else {
                
                console.error('\nError: unsupported type "' + type + '".\n\n');
                process.exit(1);
            }

        } else {
            console.error('\nError: no package.json found. "' + Files.cwd + '" is not a project root.\n\n');   
        }

        //console.log('create %s "%s"', type, name, options.html, options.js, options.scss);
        // console.log(config.paths, Files.extensions);
    }

};