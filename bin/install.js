#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const dependencies = require('../package.json').devDependencies;

const scripts = `"start": "gulp",\n\t\t"build": "gulp build"`;
const gitignore = `node_modules\ndist`;

const projectName = process.argv[2];

/**
 * Get flags from arguments
 *
 * @param {Array} args
 * @return {Array}
 */
const getFlagsFromArguments = args =>
  args.slice(3, args.length)
    .filter((val, index) => val.startsWith('--'));

/**
 * Get options from flags
 *
 * @param {Array} flags
 * @return {Object}
 */
const getOptionsFromFlags = flags => ({
  installInCurrentDir: flags.includes('--current-dir'),
});

/**
 * Check whether project name is valid
 *
 * @param {String} name
 * @return {Boolean}
 */
const checkProjectName = (name) => name !== undefined && name.length > 0;

/**
 * Get project folder from name
 *
 * @param {String} projectName
 * @return {String}
 */
const getProjectFolderFromName = (projectName) => options.installInCurrentDir ? '' : `${ projectName }`;

/**
 * Initialize project in specified folder
 *
 * @param {String} projectFolder
 * @return {Promise<boolean>}
 */
const init = projectFolder => {
  return new Promise((resolve, reject) => {
    const projectPath = (projectFolder !== '') ? `${ projectFolder }/` : '';

    let initCommand = 'npm init -f';

    if (projectFolder !== '') {
      initCommand = `mkdir ${ projectFolder } && cd ${ projectFolder } && ` + initCommand.substr(0);
    }

    exec(
      initCommand,
      (err, stdout, stderr) => {
        if (err) {
          console.error(
            `Oops, something went wrong initializing your project:
            ${ err }`
          );
          reject(false);
        }

        const packageJson = `${ projectPath }package.json`;

        fs.readFile(packageJson, (readErr, file) => {
          if (readErr) throw readErr;

          const data = file
            .toString()
            .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts);

          fs.writeFile(packageJson, data, writeErr => writeErr || true);
        });

        const filesToCopy = [
          'gulpfile.js',
          '.editorconfig'
        ].filter((file, index) =>
          !fs.existsSync(`${ projectPath }${ file }`));

        for (let i = 0; i < filesToCopy.length; i++) {
          fs
            .createReadStream(path.join(__dirname, `../${ filesToCopy[i] }`))
            .pipe(fs.createWriteStream(`${ projectPath }${ filesToCopy[i] }`));
        }

        if (!fs.existsSync(`${ projectPath }.gitignore`)) {
          fs.writeFile(`${ projectPath }.gitignore`, gitignore, writeErr => writeErr || true);
        }

        resolve(true);
      }
    );
  });
};

/**
 * Get a formatted string of all dependencies to install
 *
 * @param {Object} dependencies
 * @return {String}
 */
const getFormattedDependencies = dependencies =>
  Object.entries(dependencies)
    .map(dependency => `${ dependency[0] }@${ dependency[1] }`)
    .toString()
    .replace(/,/g, ' ')
    .replace(/^/g, '');

/**
 * Install dependencies
 *
 * @param {Object} dependencies
 * @param {String} directory
 * @return {Promise<boolean>}
 */
const installDependencies = (dependencies, directory) => {
  return new Promise((resolve, reject) => {
    dependencies = getFormattedDependencies(dependencies);

    exec(
      `cd ${ directory } && npm i --save-dev ${ dependencies }`,
      (npmErr, npmStdout) => {
        if (npmErr) {
          console.error(
            `Oops, something went wrong installing the dependencies:
            ${ npmErr }`
          );
          reject(false);
        }

        console.log(npmStdout);

        resolve(true);
      }
    );
  });
};

/**
 * Copy additional files into directory
 *
 * @param {String} directory
 * @return {Boolean}
 */
const copyAdditionalFiles = async directory => {
  const projectPath = (directory !== '') ? `${ directory }/` : '';

  try {
    if (!fs.existsSync(`${ projectPath }src`)) {
      await fs
        .copy(path.join(__dirname, '../src'), `${ projectPath }src`);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * Install gulp-starter-kit project
 *
 * @param {String} projectName
 * @param {Object} dependencies
 * @param {Object} options
 * @return {Promise<boolean>,Promise<string>}
 */
const install = async (projectName, dependencies, options) => {
  return new Promise(async (resolve, reject) => {
    console.log('npm init - Initializing your project...');

    const projectFolder = getProjectFolderFromName(projectName);

    if (! await init(projectFolder)) reject(false);

    console.log('npm init successful - Your npm package has been initialized');

    console.log('Installing dependencies - This might take a few minutes...');

    if (! await installDependencies(dependencies, projectFolder)) reject(false);

    console.log('Dependency installation successful - All dependencies have been installed');

    console.log('Copying additional files...');

    if (!copyAdditionalFiles(projectFolder)) reject(false);

    console.log('Copying additional files successful');

    resolve(projectFolder);
  });
};

const options = getOptionsFromFlags(
  getFlagsFromArguments(process.argv)
);

if (!checkProjectName(projectName)) {
  console.error('Oops, looks like you have not specified any project name. Please make sure to do that.');
  return;
}

install(projectName, dependencies, options).then((projectFolder) => {
  console.log(`\nAll done!\nYour project has been set up to the ${ projectFolder ? projectFolder : 'current' } folder.\nHappy Coding!`);
}).catch(() => {
  console.error('Oops, looks like something went wrong installing the Gulp Starter Kit.');
});
