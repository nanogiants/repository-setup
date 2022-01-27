# NanoGiants Repository Setup

This project helps setting up the necessary Open Source related markdown files according to our default CODE_OF_CONDUCT and CONTRIBUTING (guidelines). It also includes generation of LICENSE file, either with our default license (MIT) or any other you want.

## Setup

### Installation

```bash
$ npm install -g @nanogiants/repository-setup
```

Then run:

```bash
$ ng-repo-setup
```

### Without installation

Just run this module with npx:

```bash
npx --package=@nanogiants/repository-setup ng-repo-setup
```

Then answer the questions in your console. After the required files have been generated, you may edit the TODO comments in the generated Code of Conduct and Contributing files.

## Templates

The templates are based on the templates of the [`contributing-gen`](https://www.npmjs.com/package/contributing-gen) npm module: https://github.com/bttger/contributing-gen/tree/master/templates
