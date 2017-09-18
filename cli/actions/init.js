const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

class InitAction {

    constructor(commands) {
        this._commands = commands;
        this._arguments = commands.resolve();

        this._skeleton = {
            locations: {
                data: './js/data',
                module: './js/modules',
                scssVariables: './scss/variables.scss',
            },
        };

        this._init();
    }

    _init() {
        this._questionnaire();
    }

    _questionnaire() {
        inquirer.prompt([
            {
                message: 'What is the relative path to your data-folder ',
                default: './js/data',
                type: 'input',
                name: 'dataFolder',
            },
            {
                message: 'What is the relative path to your module-folder ',
                default: './js/module',
                type: 'input',
                name: 'moduleFolder',
            },
            {
                message: 'What is the relative path to your global scss-variables:',
                default: './js/scss/variables.scss',
                type: 'input',
                name: 'scssVariables',
            },
        ])
            .then((answers) => {
                this._skeleton.locations = {
                    data: answers.dataFolder,
                    module: answers.moduleFolder,
                    scssVariables: answers.scssVariables,
                };
                return this._writeSettings();
            });
    }

    _writeSettings() {
        const filePath = path.join(this._commands.sourcePath, 'gluebert.config.json');
        const content = JSON.stringify(this._skeleton, null, 4);
        return this._writeFile(filePath, content);
    }

    _writeFile(filePath, content) {
        const contentReplaced = content;
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


}

module.exports = InitAction;