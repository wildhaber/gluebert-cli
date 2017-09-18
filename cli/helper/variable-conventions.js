class VariableConventions {

    constructor() {
    }

    camelCase(str) {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return (index === 0)
                    ? letter.toLowerCase()
                    : letter.toUpperCase();
            }).replace(/\s+/g, '');
    }

    upperCamelCase(str) {
        const camelCase = this.camelCase(str);
        return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    }

    hyphenLowerCase(str) {
        const camelCase = this.camelCase(str);
        return camelCase.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
    }

    snakeUpperCase(str) {
        const camelCase = this.camelCase(str);
        return camelCase.replace(/([A-Z])/g, (g) => `_${g[0].toUpperCase()}`)
            .toUpperCase();
    }
}

module.exports = VariableConventions;