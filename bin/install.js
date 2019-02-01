#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const dependencies = require('../package.json').devDependencies;

const scripts = `"start": "gulp",\n\t\t"build": "gulp build"`;
const gitignore = `node_modules\ndist`;

const projectFolder = process.argv[2];

/**
 * Check whether project folder is valid
 *
 * @param {string} name
 * @return {boolean}
 */
const checkProjectFolder = (name) => name;

/**
 * Initialize project
 *
 * @param {string} projectFolder
 * @return {Promise<boolean>}
 */
const init = projectFolder => {
  return new Promise((resolve, reject) => {
    exec(
      `mkdir ${ projectFolder } && cd ${ projectFolder } && npm init -f`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(
            `Oops, something went wrong initializing your project:
            ${ err }`
          );
          reject(false);
        }

        const packageJson = `${ projectFolder }/package.json`;

        fs.readFile(packageJson, (readErr, file) => {
          if (readErr) throw readErr;

          const data = file
            .toString()
            .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts);

          fs.writeFile(packageJson, data, writeErr => writeErr || true);
        });

        const filesToCopy = [ 'gulpfile.js', '.editorconfig' ];

        for (let i = 0; i < filesToCopy.length; i++) {
          fs
            .createReadStream(path.join(__dirname, `../${ filesToCopy[i] }`))
            .pipe(fs.createWriteStream(`${ projectFolder }/${ filesToCopy[i] }`));
        }

        fs.writeFile(`${ projectFolder }/.gitignore`, gitignore, writeErr => writeErr || true);

        resolve(true);
      }
    );
  });
};

/**
 * Get a formatted string of all dependencies to install
 *
 * @param {object} dependencies
 * @return {string}
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
 * @param {object} dependencies
 * @return {Promise<boolean>}
 */
const installDependencies = dependencies => {
  return new Promise((resolve, reject) => {
    dependencies = getFormattedDependencies(dependencies);

    exec(
      `cd ${ projectFolder } && npm i --save-dev ${ dependencies }`,
      (npmErr, npmStdout, npmStderr) => {
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
 * Copy additional files
 *
 * @return {boolean}
 */
const copyAdditionalFiles = async () => {
  try {
    await fs
      .copy(path.join(__dirname, '../src'), `${projectFolder}/src`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * Install gulp-starter-kit into project folder
 *
 * @param {string} projectFolder
 * @param {object} dependencies
 * @return {Promise<boolean>}
 */
const install = async (projectFolder, dependencies) => {
  console.log('npm init - Initializing your project...');

  if (! await init(projectFolder)) return false;

  console.log('npm init successful - Your npm package has been initialized');

  console.log('Installing dependencies - This might take a few minutes...');

  if (! await installDependencies(dependencies)) return;

  console.log('Dependency installation successful - All dependencies have been installed');

  console.log('Copying additional files...');

  if (!copyAdditionalFiles()) return false;

  console.log('Copying additional files successful');

  return true;
}

if (!checkProjectFolder(projectFolder)) {
  console.error('Oops, looks like you have not specified any project name. Please make sure to do that.');
  return;
}

install(projectFolder, dependencies).then(() => {
  console.log(`\nAll done!\nYour project has been set up to the ${ projectFolder } folder.\nHappy Coding!`);
});
