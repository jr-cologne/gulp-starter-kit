#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

const packageJson = require('../package.json');

const scripts = `"start": "gulp"`;
const gitignore = `node_modules\ndist`;

const getDependencies = dependencies =>
  Object.entries(dependencies)
    .map(dependency => `${ dependency[0] }@${ dependency[1] }`)
    .toString()
    .replace(/,/g, ' ')
    .replace(/^/g, '');

console.log('npm init - Initializing your project...');

const projectFolder = process.argv[2];

exec(
  `mkdir ${ projectFolder } && cd ${ projectFolder } && npm init -f`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(
        `Oops, something went wrong initializing your project:
        ${ initErr }`
      );
      return;
    }

    const packageJSON = `${ projectFolder }/package.json`;

    fs.readFile(packageJSON, (readErr, file) => {
      if (readErr) throw readErr;

      const data = file
        .toString()
        .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts);

      fs.writeFile(packageJSON, data, writeErr => writeErr || true);
    });

    const filesToCopy = [ 'gulpfile.js', '.editorconfig' ];

    for (let i = 0; i < filesToCopy.length; i++) {
      fs
        .createReadStream(path.join(__dirname, `../${ filesToCopy[i] }`))
        .pipe(fs.createWriteStream(`${ projectFolder }/${ filesToCopy[i] }`));
    }

    fs.writeFile(`${ projectFolder }/.gitignore`, gitignore, writeErr => writeErr || true);

    console.log('npm init successful - Your npm package has been initialized');

    console.log('Installing dependencies - This might take a few minutes...');

    const devDependencies = getDependencies(packageJson.devDependencies);

    exec(
      `cd ${ projectFolder } && npm i --save-dev ${ devDependencies }`,
      (npmErr, npmStdout, npmStderr) => {
        if (npmErr) {
          console.error(
            `Oops, something went wrong installing the dependencies:
            ${ npmErr }`
          );
          return;
        }

        console.log(npmStdout);
        console.log('Dependency installation successful - All dependencies have been installed');

        console.log('Copying additional files...');

        fs
          .copy(path.join(__dirname, '../src'), `${ projectFolder }/src`)
          .then(() =>
            console.log(`\nAll done!\nYour project has been set up to the ${ projectFolder } folder.\nHappy Coding!`))
          .catch(err => console.error(err));
      }
    );
  }
);
