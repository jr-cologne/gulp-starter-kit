# Gulp Starter Kit
A simple Gulp 4 Starter Kit for modern web development.

## What does the gulp-starter-kit do? What can it be used for?
The gulp-starter-kit is a simple way of setting up a mordern web development environment.
Here is a list of the current features:

- Copy html files from `src` to `dist` directory
- Compile sass to css, autoprefix, minify css and put it inside `dist` directory
- Compile ES6+ to ES5, concatenate js files and minify code
- Compress and copy images into `dist` directory
- Copy specified dependencies from `node_modules` directory into `node_modules` folder inside `dist` directory
- Spin up local dev server at `http://localhost:3000` including auto-reloading

## Requirements
This should be installed on your computer in order to get up and running:

- [Node.js](https://nodejs.org/en/)
- [Gulp 4](https://gulpjs.com/)
- [Sass](http://sass-lang.com/)

## Dependencies
These [npm](https://www.npmjs.com/) packages are used in the gulp-starter-kit:

- [babel-core](https://www.npmjs.com/package/babel-core)
- [babel-preset-env](https://www.npmjs.com/package/babel-preset-env)
- [browser-sync](https://www.npmjs.com/package/browser-sync)
- [del](https://www.npmjs.com/package/del)
- [gulp](https://www.npmjs.com/package/gulp)
- [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
- [gulp-babel](https://www.npmjs.com/package/gulp-babel)
- [gulp-concat](https://www.npmjs.com/package/gulp-concat)
- [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano)
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)
- [gulp-sass](https://www.npmjs.com/package/gulp-sass)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)

For more information, take a look at the [package.json]((https://github.com/jr-cologne/gulp-starter-kit/blob/master/package.json)) file.

## Getting Started
In order to get started, make sure you are meeting all requirements listed above.
Then, just go ahead and download the gulp-starter-kit. For this, you can choose between the following options:

### Git clone
One way of downloading the gulp-starter-kit is by cloning this Git repository. Before executing any commands, make sure you have [Git](https://git-scm.com/) installed on your computer.

Then, follow these instructions:

1. Execute `git clone https://github.com/jr-cologne/gulp-starter-kit.git your-project-name`. This creates a folder called `your-project-name` (change that to your project name) at the current location where your terminal / command prompt is pointing to.
2. Change your working directory to your project folder by executing `cd your-project-name`.
3. Install all dependencies by executing `npm install`.
4. Spin up your web development environment with the command `npm start`.
5. Start coding!

If you are lazy, just do everything at once:

```
git clone https://github.com/jr-cologne/gulp-starter-kit.git your-project-name && cd your-project-name && npm install && npm start
```

### npm init
The other, recommended way of downloading the gulp-starter-kit uses the command `npm init` and the [gulp-starter-kit npm package](https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit) as the initializer.

For this, just follow these steps:

1. Execute `npm init @jr-cologne/gulp-starter-kit your-project-name`. This creates a folder called `your-project-name` (change that to your project name) at the current location where your terminal / command prompt is pointing to. Moreover, this initializes your project and installs all dependencies.
2. Change your working directory to your project folder by executing `cd your-project-name`.
3. Spin up your web development environment with the command `npm start`.
4. Start coding!

In case you are lazy, just use this command:

```
npm init @jr-cologne/gulp-starter-kit && cd your-project-name && npm start
```

## Usage / FAQ
### What types of images are supported?
The following types of images are currently supported:

- PNG
- JPG / JPEG
- GIF
- SVG
- ICO (not compressed)

### How can I specify dependencies which are then copied to the `dist` folder?
You can specify your dependencies inside `gulpfile.js`.
Just install your dependency via npm, look for a variable called `node_dependencies` and add the package name of your dependency to the array:

```js
node_dependencies = [
  'jquery'
];
```

## Contributing
Feel free to contribute to this project!
Any kinds of contributions are highly appreciated!

## Versioning
This project uses the rules of semantic versioning. For more information, visit [semver.org](https://semver.org/).

## License
This project is licensed under the [MIT License](https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE).
