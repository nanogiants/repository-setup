# NanoGiants Repository Setup

This project helps setting up the necessary Open Source related markdown files according to our default CODE_OF_CONDUCT and CONTRIBUTING (guidelines). It also includes generation of LICENSE file, either with our default license (MIT) or any other you want.

## Setup

```bash
$ npm install -g @nanogiants/repository-setup
```

Then run:

```bash
$ ng-repo-setup
```

and answer the questions in your console. After the required files have been generated, you may edit the TODO comments in the generated Code of Conduct and Contributing files.

## Templates

The templates are based on the templates of the [`contributing-gen`](https://www.npmjs.com/package/contributing-gen) npm module: https://github.com/bttger/contributing-gen/tree/master/templates
