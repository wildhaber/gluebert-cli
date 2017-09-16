const PATH = require('path');

const CONFIG_FILE = `gluebert.config.json`;

class CommandInterpreter {
    constructor(args, sourcePath) {
        this._args = args;
        this._action = (args.length > 0) ? args[0] : null;
        this._kind = (args.length > 1) ? args[1] : null;
        this._name = (args.length > 2) ? args[2] : null;
        this.sourcePath = sourcePath;
        this.configuration = this.getConfiguration();

    }

    resolve() {
        return {
            action: this._action,
            kind: this._kind,
            name: this._name,
        };
    }

    getConfiguration() {
        return require(PATH.join(this.sourcePath, CONFIG_FILE));
    }

    isComplete() {
        return this._args.length > 0;
    }

    displayError() {
        switch(this._args.length) {
            case 0 :
                console.log('Could not interpretate your command. Please add at least one action argument.');
                console.log('e.g. gluebert init');
                console.log('e.g. gluebert create module example');
                console.log('e.g. gluebert create data example');
        }
    }

}

module.exports = CommandInterpreter;