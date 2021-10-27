const fs = require('fs/promises');
const prompts = require('prompts');
const { getLicense, findLicense } = require('license');
const path = require('path');
const covgen = require('covgen');

(async () => {
  const answers = await prompts([
    {
      type: 'toggle',
      name: 'generateLicense',
      message: 'Generate LICENSE file?',
      initial: 'on',
    },
    {
      type: 'toggle',
      name: 'generateContributing',
      message: 'Generate CONTRIBUTING.md file?',
      initial: 'on',
    },
    {
      type: 'toggle',
      name: 'generateCodeOfConduct',
      message: 'Generate CODE_OF_CONDUCT.md file?',
      initial: 'on',
    },
  ]);

  if (answers.generateLicense) {
    const possibleLicenses = findLicense('');

    const licenseAnswer = await prompts({
      type: 'autocomplete',
      name: 'licenseType',
      message: 'Choose your preferred license',
      choices: possibleLicenses.map(license => ({ title: license, value: license })),
      initial: 'MIT',
    });

    const licenseText = getLicense(licenseAnswer.licenseType, {
      year: new Date().getFullYear(),
      author: 'NanoGiants GmbH',
    });

    await fs.writeFile(path.join(process.cwd(), 'LICENSE'), licenseText);
  }

  if (answers.generateContributing) {
    await fs.copyFile(
      path.join(__dirname, 'resources', 'CONTRIBUTING.md'),
      path.join(process.cwd(), 'CONTRIBUTING.md'),
    );
  }

  if (answers.generateCodeOfConduct) {
    await covgen('developers@nanogiants.de', path.join(process.cwd(), 'CODE_OF_CONDUCT.md'));
  }

  console.log('All files have been created');
})();
