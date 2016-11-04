#!/usr/bin/env node

'use strict';

var version = require('./package').version,
    program = require('commander');

/**
 * creates files
 * @param {string} type Type of object to create (component/element)
 * @param {string} name Name of new object
 * @param {object} options Options defined in cli program call
 * @param {boolean} options.html True if defined in cli
 * @param {boolean} options.js True if defined in cli
 * @param {boolean} options.sass True if defined in cli
 */
function create(type, name, options) {
    console.log('create %s "%s"', type, name, options.html, options.js, options.sass);
}

program.version(version);

program
    .command('create <type> <name>')
    .description('create a component or element')
    .option("--html", "Only create html")
    .option("--scss, --sass", "Only create sass")
    .option("--js", "Only create javascript")
    .action(create)
    .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log('    $ create component header');
        console.log('    $ create element buttons');
        console.log();
    });

program.parse(process.argv);
