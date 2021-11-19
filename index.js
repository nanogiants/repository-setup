const fs = require('fs/promises');
const path = require('path');
const prompts = require('prompts');
const { getLicense, findLicense } = require('license');
const dot = require('dot');

dot.templateSettings.strip = false;
dot.log = false;
const dots = dot.process({ path: path.join(__dirname, 'templates') });

const packageJsonPath = path.join(process.cwd(), 'package.json');

const FILE_MAPPING = {
  License: 'LICENSE.md',
  Contributing: 'CONTRIBUTING.md',
  CodeOfConduct: 'CODE_OF_CONDUCT.md',
};

(async () => {
  const answers = await prompts(
    Object.entries(FILE_MAPPING).map(([licenseName, fileName]) => ({
      type: 'toggle',
      name: licenseName,
      message: `Generate ${fileName} file?`,
      initial: 'on',
    })),
  );

  if (answers.License) {
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

  if (answers.Contributing || answers.CodeOfConduct) {
    let name,
      slug = '',
      repoUrl,
      docsUrl;

    if (await fs.stat(packageJsonPath)) {
      const {
        name: packageSlug,
        repository: packageRepository,
        homepage: packageHomepage,
      } = JSON.parse(await fs.readFile(packageJsonPath));

      name = packageSlug;
      slug = packageSlug;
      docsUrl = packageHomepage;

      const repositoryUrl = packageRepository?.url;
      if (repositoryUrl) {
        repoUrl = repositoryUrl.endsWith('/') ? repositoryUrl : `${repositoryUrl}/`;
      }
    } else {
      console.log('package.json does not exist');
    }

    const packageAnswers = await prompts([
      {
        type: 'text',
        name: 'name',
        message: 'Name of the project',
        initial: slug,
      },
      {
        type: 'text',
        name: 'slug',
        message: 'Slug of the project',
        initial: slug,
      },
      {
        type: 'text',
        name: 'repoUrl',
        message: 'Repo URL of the project',
        initial: repoUrl,
      },
      {
        type: 'text',
        name: 'docsUrl',
        message: 'Docs URL of the project',
        initial: docsUrl,
      },
    ]);

    name = packageAnswers.name;
    slug = packageAnswers.slug;
    repoUrl = packageAnswers.repoUrl;
    docsUrl = packageAnswers.docsUrl;

    const specs = {
      project: {
        name,
        slug,
        repoUrl,
        docsUrl,
      },
      contributing: {
        generate: answers.generateContributing,
        emailSensitiveBugs: 'developers@nanogiants.de',
      },
      codeOfConduct: {
        generate: answers.generateCodeOfConduct,
        enforcementEmail: 'developers@nanogiants.de',
        enforcementGuidelines: true,
      },
    };

    const filePathContributing = path.join(process.cwd(), 'CONTRIBUTING.md');
    const markdownContributing = dots.contributing(specs);

    const filePathCoC = path.join(process.cwd(), 'CODE_OF_CONDUCT.md');
    const markdownCoC = dots.codeOfConduct(specs);

    await fs.writeFile(filePathCoC, markdownCoC, 'utf-8');
    await fs.writeFile(filePathContributing, markdownContributing, 'utf-8');
  }

  for (const [file, created] of Object.entries(answers)) {
    if (created) {
      console.log(`${FILE_MAPPING[file]} has been created.`);
    }
  }
})();
