var config = require('./config'),
    fs = require('fs-extra');

/**
 * creates components, elements and files
 * @author Rocco Janse, roccojanse@outlook.com
 */
module.exports = {

    extensions: ['.html', '.scss', '.js', '.gspec'],

    /**
     * determines type of file to create
     * @param {string} type Type of object to create
     * @param {string} name Name of files to create
     * @param {string} path [Path to create objecct in]
     * @returns void
     */
    type: function(type, name, path) {
        var filePath;
        if (name !== null) {
            
            if (type === 'component') {
                filePath = (path || config.paths.components) + name + '/';
            }
            if (type === 'element') {
                filePath = (path || config.paths.elements) + name + '/';
            }

            this.create(type, name, filePath);

        } else {
            this.handleError('\n\nNo component name found.\n\nUsage: federico create component <name>');
        }
    },

    /**
     * createss components or elements
     * @param {string} type Type of object to create
     * @param {string} name Component or element name
     * @param {string} path [Path to create objecct in]
     * @returns void
     */
    create: function(type, name, path) {
        var extLength = this.extensions.length - 1,
            count = 0,
            elName = name;

        this.extensions.forEach(function(ext, i) {
            
            // add underscore for sass files
            if (ext === '.scss') {
                fileName = '_' + name;
            } else {
                fileName = name;
            }

            fs.outputFile(path + fileName + ext, '/**\n * ' + name + '\n *\n */', function(err) {
                if (err) { 
                    this.handleError(err); 
                }

                count++;

                if (extLength === count) {
                    console.log(type + ' ' + elName + ' created.');
                }
            });
        });
    },

    /**
     * creates elements
     * @param {string} name Element name
     * @param {string} path [Path to create objecct in]
     * @returns void
     */
    createElement: function(name, path) {
        if (name !== null) {
            var filePath = path || config.paths.elements;
            console.log('CREATE ELEMENT "'+ name +'".');

        } else {
            this.handleError('\n\nNo element name found.\n\nUsage: federico create element <name>');
        }
    },

    handleError: function(msg) {
        console.error(msg);
        process.exit(1);  
    }

}