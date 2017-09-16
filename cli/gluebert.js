#!/usr/bin/env node
const package = require('./../package.json');
const program = require('commander');
const Interpreter = require('./interpreter');
const ActionDispatcher = require('./action.dispatcher');

program
    .version(package.version)
    .parse(process.argv);

const commands = new Interpreter(program.args, process.cwd());

if(commands.isComplete()) {
    const ad = new ActionDispatcher(commands);
    ad.dispatch();
} else {
    commands.displayError();
}