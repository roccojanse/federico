var fs = require('fs-extra'),
    username = require('username'),
    readline = require('readline'),
    config = require(__dirname + '/config/federico'),
    checks = require(__dirname + '/checks'),

    rl = readline.createInterface(process.stdin, process.stdout), 
    
    localDirName = '.federico';

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
            fileName = 'config.json';

        if (options.dir) {
            dir += options.dir + '/';
        }

        if (checks.isProjectRoot(dir, options.force)) {
            var filePath = dir + config.paths.root + localDirName + '/';
            fs.outputJson(filePath + fileName, config, function(err) {
                if (err) { 
                    console.error('\nError: writing file: "' + filePath + fileName + '".\n\n');
                    process.exit(1);
                } 
                console.log('\nCreated config file.\n\n');
                process.exit();
            });
        } else {
            console.error('\nError: no package.json found. "' + dir + '" is not a project root.\n\n');
            process.exit(1);
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

        // get tplFile
        var tplFile = __dirname + '/tpl/' + extension + '.tpl';
        if (fs.existsSync(Files.cwd + '/' + localDirName + '/tpl/' + extension + '.tpl')) {
            tplFile = Files.cwd + '/' + localDirName + '/tpl/' + extension + '.tpl';
        } else {
            if (checks.isProjectRoot(Files.cwd)) {
                console.log('No custom templates found. Using default template for .' + extension + ' file.');
            } else {
                console.log('Not running from a project root. Using default template for .' + extension + ' file.');
            }
        }

        fs.readFile(tplFile, 'utf8', function(err, data) {
            if (err) { 
                console.error('\nError: cannot read template: "' + tplFile + '".\n\n');
                process.exit(1);
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

        var fileArray = [],
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

                        // alter filename for sass partials
                        if (ext === 'scss' || ext === 'sass') {
                            fileName = '_' + name;
                        }

                        fileArray.push({
                            type: type,
                            name: name,
                            ext: ext, 
                            file: Files.cwd + filePath + name + '/' + fileName + extension 
                        });
                    
                    }
                });

                if (fileArray.length > 0) {
                    
                    // write all files in fileArray
                    Files.getTplAndWriteFile(fileArray, 0, function() {
                        console.log('\n' + type + ' "' + name + '" created.\n\n');
                        process.exit();
                    });

                }

            } else {
                
                console.error('\nError: unsupported type "' + type + '".\n\n');
                process.exit(1);
            }

        } else {
            console.error('\nError: no package.json found. "' + Files.cwd + '" is not a project root.\n\n');   
            process.exit(1);
        }
    },

    /**
     * wrapper to check file existance and prompts user to overwrite or skip file creation
     * calls itself recursive untill all items from fileArray are processed
     * @param {array} fileArray Array of files to check and write
     * @param {integer} i Array index to process
     * @param {function} [cb] Callback function, called when all items of the array are processed
     */
    getTplAndWriteFile: function(fileArray, i, cb) {

        var error;

        // file already exists?
        if (fs.existsSync(fileArray[i].file)) {

            console.log(fileArray[i].file + ' already exists.');
            
            rl.question("Overwrite? [yes]/no: ", function(answer) {
                if (answer.match(/^y(es)?$/i)) {
                    
                    // overwrite
                    Files.writeFile(fileArray[i], function(err) {
                        if (err) {
                            console.error('\nError writing file: "' + fileArray[i].file + '".');   
                        }

                        i++;
            
                        if (i < fileArray.length) {
                            Files.getTplAndWriteFile(fileArray, i, cb);
                        } 

                        if (i === fileArray.length) {
                            if (typeof cb === 'function') {
                                cb();
                            }
                        }
                    });
                } else {

                    // skip
                    i++;
        
                    if (i < fileArray.length) {
                        Files.getTplAndWriteFile(fileArray, i, cb);
                    } 

                    if (i === fileArray.length) {
                        if (typeof cb === 'function') {
                            cb();
                        }
                    }
                }

            });

        } else {

            // write file
            Files.writeFile(fileArray[i], function(err) {
                if (err) {
                    console.error('\nError writing file: "' + fileArray[i].file + '".');   
                }

                i++;
    
                if (i < fileArray.length) {
                    Files.getTplAndWriteFile(fileArray, i, cb);
                } 

                if (i === fileArray.length) {
                    if (typeof cb === 'function') {
                        cb();
                    }
                }
            });
        }
    },

    /**
     * writes files based on fetched templates
     * @param {object} fileData Object containing filedata
     * @param {function} [cb] Callback function, called when all items of the array are processed
     */
    writeFile: function(fileData, cb) {

        var name = fileData.name,
            ext = fileData.ext;

        Files.getTemplate(ext, function(fileTpl) {

            // replace template values
            var d = new Date(),
                months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

            fileTpl = fileTpl.replace(/{{name}}/gi, name);
            fileTpl = fileTpl.replace(/{{ucfirst_name}}/gi, name.charAt(0).toUpperCase() + name.slice(1));
            fileTpl = fileTpl.replace(/{{author}}/gi, username.sync());
            fileTpl = fileTpl.replace(/{{date}}/gi, months[d.getMonth()] + ' ' + d.getFullYear());

            fileData.tpl = fileTpl;

            // write file
            fs.outputFile(fileData.file, fileData.tpl, function(err) {

                if (typeof cb === 'function') {
                    if (err) {  
                        cb(err);
                    } else {
                        // set files to full access
                        fs.chmodSync(fileData.file, '0777');
                        cb();
                    }
                } else {
                    if (err) { 
                        console.error('\nError writing file: "' + fileData.file + '".\n\n');
                        process.exit(1);
                    }

                    // set files to full access
                    fs.chmodSync(fileData.file, '0777');
                }
            }); 
        });  
    }

};