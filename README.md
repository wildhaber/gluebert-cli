# gluebert-cli
A command line interface for [gluebert.js](https://github.com/wildhaber/gluebert).

## Install

```
npm install gluebert-cli -g
```

## Usage

### Create Configuration file:

```bash
gluebert init
```

this ends up in a file called `gluebert.config.json` with the following content:
(obviously you can define your own locations :-))

```json
{
    "locations": {
        "data": "./js/data",
        "module": "./js/modules",
        "scssVariables": "./scss/variables.scss"
    }
}
```

### Create a new Module

```bash
gluebert create module <name> <selector>
```

e.g.:

```bash
gluebert create module slider .c-slider
```

results in the following file structure:

```
project/
|-- modules
|  |-- slider
|  |  |-- slider.module.js
|  |  |-- slider.controller.js
|  |  |-- slider.styles.scss
```

### Create new Data

```bash
gluebert create data <name>
```

e.g.:

```bash
gluebert create module user
```

results in the following file structure:

```
project/
|-- data
|  |-- user
|  |  |-- user.data.js
|  |  |-- user.signature.js
```

