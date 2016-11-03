#! /usr/bin/env node
var create = require('./create');

var command = process.argv[2] || null,
    type = process.argv[3] || null,
    filename = process.argv[4] || null;

if (command !== null && command === 'create') {
    create.type(type, filename);
}