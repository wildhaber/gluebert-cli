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
        if(!ACTIONS.includes(this._arguments.action)) {
            console.log(`Cannot understand action '${this._arguments.action}'. This is unknown to us.`)
            console.log('Please use one of the following action:');
            ACTIONS.forEach((action) => {
                console.log(` - ${action}`);
            });
        }
    }
}

module.exports = ActionDispatcher;