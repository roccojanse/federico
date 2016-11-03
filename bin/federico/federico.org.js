#! /usr/bin/env node
var fs = require('fs-extra'),

    path = './Frontend/',
    componentPath = path + 'components/',
    elementPath = path + 'elements/',
    
    command = process.argv[2] || null,
    type = process.argv[3] || null,
    filename = process.argv[4] || null,

    commands = ['create', 'delete'],
    types = ['element', 'component'],
    
    handleError = function(msg) {
        console.log(msg);
        process.exit(1);    
    },
    
    create = function(type, filename) {
        var dir = componentPath;
        if (type === 'element') {
            dir = elementPath;
        }

        filepaths = [];
        filepaths[0] = dir + filename + '/' + filename + '.html';
        filepaths[1] = dir + filename + '/_' + filename + '.scss';
        filepaths[2] = dir + filename + '/' + filename + '.js';

        filepaths.forEach(function(value, i) {
            fs.outputFile(filepaths[i], 'Just now, we have created this file', function (err) {
                if (err) { handleError(err); }
                console.log(filepaths[i] + ' created.');
            });
        });

    };



// main logic
if (command !== null) {
    if (commands.indexOf(command) > -1) {
        if (type !== null) {
            if (types.indexOf(type) > -1) {
                if (filename !== null) {

                    if (command === 'create') {
                        create(type, filename);
                    }

                } else {
                    handleError('\n\nError: filename not set.\n\nUsage: federico ' + command + ' ' + type + ' [filename]\ni.e: federico ' + command + ' ' + type + ' test');                   
                }
            } else {
                handleError('\n\nError: type "' + type + '" not found.\n\nUsage: federico ' + command + ' <type> [filename]\ni.e: federico ' + command + ' component test');
            }
        } else {
            handleError('\n\nError: no type found.\n\nUsage: federico ' + command + ' <type> [filename]\ni.e: federico ' + command + ' component test');           
        }
    } else {
        handleError('\n\nError: command "' + command + '" not found.\n\nUsage: federico <command> <type> [filename]\ni.e: federico create component test');
    }
} else {
    handleError('\n\nUsage: federico <command> <type> [filename]\ni.e: federico create component test');
}