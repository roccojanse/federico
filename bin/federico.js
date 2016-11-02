#! /usr/bin/env node

var command = process.argv[2] || null,
    filename = process.argv[3] || '';

console.log(command + ': ' + filename);

if (command === null) {
    console.log('Usage: federico <command> [filename]');
    process.exit(1);
}