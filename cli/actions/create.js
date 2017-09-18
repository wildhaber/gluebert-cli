const fs = require('fs');
const path = require('path');
const Variables = require('./../helper/variable-conventions');
const inquirer = require('inquirer');

const KINDS = [
    'data',
    'module',
];

class CreateAction {

    constructor(commands) {
        this._commands = commands;
        this._arguments = commands.resolve();
        this._config = commands.configuration;
        this._variables = new Variables();

        this._kind = (this._arguments.kind)
            ? this._arguments.kind.toLowerCase()
            : null;

        this._name = this._arguments.name;
        this._selector = this._arguments.selector;

        this._templateKindPath = path.join(__dirname, './../../templates', this._kind);
        this._templateConfig = this.getTemplateConfig();
        this._relStylesVariablesPath = null;

        this._init();
    }

    _init() {
        if(this._isValid()) {
            this._create();
        } else {
            this._autocomplete();
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


    _getRelStylesVariablesPath(kindPathName) {
        return path.relative(
            kindPathName,
            path.join(
                this._commands.sourcePath,
                this._config.locations.scssVariables,
            ),
        );
    }

    _strReplace(str) {
        return str
            .replace(/\$VARIABLES_PATH\$/g, this._relStylesVariablesPath)
            .replace(/\$SELECTOR\$/g, this._selector)
            .replace(/\$NAME\$/g, this._name)
            .replace(/\$NAME_SNAKE_UPPER\$/g, this._variables.snakeUpperCase(this._name))
            .replace(/\$NAME_UPPER\$/g, this._name.toUpperCase())
            .replace(/\$NAME_CAMEL\$/g, this._variables.camelCase(this._name))
            .replace(/\$NAME_UPPER_CAMEL\$/g, this._variables.upperCamelCase(this._name))
            .replace(/\$NAME_LOWER\$/g, this._name.toLowerCase())
            .replace(/\$NAME_HYPHEN\$/g, this._variables.hyphenLowerCase(this._name));
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

    async _createFiles(files, kindNamePath) {
        Object.keys(files)
            .forEach((file) => {
                const content = fs.readFileSync(path.join(this._templateKindPath, files[file]), 'UTF8');
                const fileName = this._strReplace(file);
                const filePath = path.join(kindNamePath, fileName);
                this._writeFile(filePath, content);
            });
    }

    getTemplateConfig() {
        return require(path.join(this._templateKindPath, 'config.json'));
    }

    async _create() {
        try {
            const locationPath = this._config.locations[this._templateConfig.target];
            const locationPathAbs = path.join(this._commands.sourcePath, locationPath);

            const directoryExists = await this._directoryExists(locationPathAbs);

            if(directoryExists) {
                const kindPathName = path.join(locationPathAbs, this._strReplace(this._templateConfig.folder));
                const nameAlreadyExist = await this._directoryExists(kindPathName);
                this._relStylesVariablesPath = this._getRelStylesVariablesPath(kindPathName);
                if(!nameAlreadyExist) {
                    await this._createDir(kindPathName)
                        .then(() => this._createFiles(this._templateConfig.files, kindPathName));
                } else {

                    return inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'override',
                            default: false,
                            message: `There is already a ${this._kind} called ${this._name}. Shall we override it?`,
                        },
                    ])
                        .then((answers) => {
                            if(answers.override) {
                                return this._createFiles(this._templateConfig.files, kindPathName);
                            } else {
                                console.log(`Please chose another name, if you like us to create the ${this._kind}`);
                            }
                        });

                }
            } else {

                return inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'create',
                        message: `Base folder for ${this._kind} does not exist - shall we crate one?`,
                    },
                ])
                    .then((answers) => {
                        if(answers.create) {
                            return this._create();
                        } else {
                            console.log(`--- aborted, main folder for ${this._kind} does not exist ---`);
                        }
                    });

            }

        } catch(err) {
            console.log(err);
        }
    }

    _hasArguments() {
        const args = this._templateConfig.arguments;
        for(let i = 0, l = args.length; i < l; i++) {
            const argKey = '_' + args[i];
            if(!this[argKey]) {
                return false;
            }
        }
        return true;
    }

    _isValid() {
        return KINDS.includes(this._kind) && this._hasArguments();
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

    _autocomplete() {
        if(!this._kind) {
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: `What is the name of your ${this._kind}?`,
            }])
                .then((answers) => {
                    this._name = answers.name;
                    this._init();
                });
        } else if(!KINDS.includes(this._kind)) {
            this._displayError();
        } else if(!this._name) {
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: `What is the name of your ${this._kind}?`,
            }])
                .then((answers) => {
                    this._name = answers.name;
                    this._init();
                });
        } else if(!this._selector) {
            inquirer.prompt([{
                type: 'input',
                name: 'selector',
                message: `What is the selector of ${this._kind} ${this._name}?`,
            }])
                .then((answers) => {
                    this._selector = answers.selector;
                    this._init();
                });
        }
    }

}

module.exports = CreateAction;