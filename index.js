#!/usr/bin/env node

'use strict';

var version = require('./package').version,
    program = require('commander'),
    files = require('./src/files');


program
    .version(version)
    .usage('[command] [options]');

program
    .command('init')
    .description('creates federico.json config file')
    .option("-f, --force", "Force file creation even if not in a project root")
    .option("-d, --dir <dir>", "Overrides default directory to write json to")
    .action(files.createConfig)
    .on('--help', function () {
        console.log('  Example:');
        console.log();
        console.log('    $ init');
        console.log('    $ init -d path/to/dir');
        console.log();
    });

program
    .command('create <type> <name>')
    .description('create a component or element')
    .option("-f, --force", "Force file creation even if not in a project root")
    .option("--html", "Skips html file creation")
    .option("--scss", "Skips sass file creation")
    .option("--js", "Skips javascript file creation")
    .option("--gspec", "Skips test file creation")
    .action(files.createFiles)
    .on('--help', function () {
        console.log('  Examples:');
        console.log();
        console.log('    $ create component header');
        console.log('    $ create element buttons');
        console.log();
    });

program.parse(process.argv);
