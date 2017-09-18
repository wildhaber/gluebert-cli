const inquirer = require('inquirer');

const ACTIONS = [
    'create',
    'init',
];

class ActionDispatcher {

    constructor(commands) {
        this._commands = commands;
        this._arguments = commands.resolve();
    }

    dispatch() {
        if(ACTIONS.includes(this._arguments.action)) {
            const Action = require(`./actions/${this._arguments.action}`);
            new Action(this._commands);
        } else {
            this._displayError();
        }
    }

    _displayError() {
        if(!this._arguments.action) {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What do you like to do?',
                    choices: [{
                        name: 'Initialize Gluebert Settings',
                        value: 'init',
                    }, {
                        name: 'Create a new Gluebert module or data',
                        value: 'create',
                    }],
                },
            ])
                .then((answers) => {
                    this._arguments.action = answers.action;
                    this._commands.setArg('action', answers.action);
                    this.dispatch();
                });
        } else if(!ACTIONS.includes(this._arguments.action)) {
            console.log(`Cannot understand action '${this._arguments.action}'. This is unknown to us.`);
            console.log('Please use one of the following action:');
            ACTIONS.forEach((action) => {
                console.log(` - ${action}`);
            });
        }
    }
}

module.exports = ActionDispatcher;