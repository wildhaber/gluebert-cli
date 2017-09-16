const fs = require('fs');
const path = require('path');

const KINDS = [
    'data',
    'module',
];

class CreateAction {

    constructor(commands) {
        this._commands = commands;
        this._arguments = commands.resolve();
        this._config = commands.configuration;
        this._templateConfig = null;

        this._kind = (this._arguments.kind)
            ? this._arguments.kind.toLowerCase()
            : null;

        this._name = this._arguments.name;

        this._init();
    }

    _init() {
        if(this._isValid()) {
            this._create();
        } else {
            this._displayError();
        }
    }

    _directoryExists(dir) {
        return new Promise((resolve, reject) => {
            fs.stat(dir, (err, stats) => {
                if(err) {
                    resolve(false);
                } else if(!stats.isDirectory()) {
                    reject(new Error(`given path '${dir}' is not a directory.`));
                } else {
                    resolve(true);
                }
            });
        });
    }

    _createDir(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    _strReplace(str) {
        return str
            .replace(/\$NAME\$/g, this._name);
    }

    _writeFile(filePath, content) {
        const contentReplaced = this._strReplace(content);
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, contentReplaced, 'UTF8', (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }

    async _createFiles(files, kindNamePath, templateKindPath) {
        Object.keys(files)
            .forEach((file) => {
                const content = fs.readFileSync(path.join('./templates/', this._kind, files[file]), 'UTF8');
                console.log(content);
                const fileName = this._strReplace(file);
                const filePath = path.join(kindNamePath, fileName);
                this._writeFile(filePath, content);
            });
    }

    async _create() {
        try {
            const templateKindPath = path.join('./../../templates', this._kind);
            this._templateConfig = require(path.join(templateKindPath, 'config.json'));
            const locationPath = this._config.locations[this._templateConfig.target];
            const locationPathAbs = path.join(this._commands.sourcePath, locationPath);

            const directoryExists = await this._directoryExists(locationPathAbs);

            if(directoryExists) {
                const kindPathName = path.join(locationPathAbs, this._name);
                const nameAlreadyExist = await this._directoryExists(kindPathName);
                if(!nameAlreadyExist) {
                    await this._createDir(kindPathName)
                        .then(() => this._createFiles(this._templateConfig.files, kindPathName, templateKindPath));
                } else {
                    console.log(`There is already a ${this._kind} called ${this._name}.`);
                    console.log(`Please chose another name, if you like us to create the ${this._kind}`);
                }
            } else {
                console.log(directoryExists.Error);
            }

        } catch(err) {
            console.log(err);
        }
    }

    _isValid() {
        return KINDS.includes(this._kind) && this._name;
    }

    _displayError() {
        if(!KINDS.includes(this._kind)) {
            console.log(`Cannot create something called '${this._kind}'. This is unknown to us.`);
            console.log('Please use one of the following kinds:');
            KINDS.forEach((kind) => {
                console.log(` - ${kind}`);
            });

            console.log(``);
            console.log(`e.g. gluebert create data example`);
            console.log(`e.g. gluebert create module example`);
        } else if(KINDS.includes(this._kind) && !this._name) {
            console.log(`Please provide a name of your ${this._kind}.`);

            console.log(``);
            console.log(`e.g. gluebert create ${this._kind} example`);
        }
    }

}

module.exports = CreateAction;