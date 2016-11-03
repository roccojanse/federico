var config = require('./config'),
    fs = require('fs-extra');

/**
 * creates components, elements and files
 * @author Rocco Janse, roccojanse@outlook.com
 */
module.exports = {

    extensions: ['.html', '.scss', '.js'],

    /**
     * determines type of file to create
     * @param {string} type Type of object to create
     * @param {string} name Name of files to create
     * @param {string} path [Path to create objecct in]
     * @returns void
     */
    type: function(type, name, path) {
        if (type === 'component') {
            this.createComponent(name, path);
        }
        if (type === 'element') {
            this.createElement(name, path);
        }
    },

    /**
     * creates components
     * @param {string} name Component name
     * @param {string} path [Path to create objecct in]
     * @returns void
     */
    createComponent: function(name, path) {
        if (name !== null) {
            var filePath = path || config.paths.components;
            this.extensions.forEach(function(ext, i) {
                
                if (ext === '.scss') {
                    fileName = '_' + name;
                } else {
                    fileName = name;
                }

                fs.outputFile(filePath + fileName + ext, '/**\n * name\n *\n */', function(err) {
                    if (err) { 
                        this.handleError(err); 
                    }
                    console.log(filePath + fileName + ext + ' created.');
                });
            });
            console.log('CREATE COMPONENT "'+ name +'".');

        } else {
            this.handleError('\n\nNo component name found.\n\nUsage: federico create component <name>');
        }
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