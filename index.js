#!/usr/bin/env node

var version = require('./package').version,
    program = require('commander');

/**
 * creates files
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
