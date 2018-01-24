# YOI Boilerplate

This repository is a starter kit to kickstart your project with [Yoi – the Yoshino Frontend Component Library](https://github.com/yoshino-digital/yoi).

## Documentation

Read the [Yoi user documentation](https://yoshino-digital.github.io/yoi/start/) to learn how to use the pre-built components and get an introduction on how to [customize your project](https://yoshino-digital.github.io/yoi/start/customizing.html).

This repository contains a lot of useful contextual documentation in the form of inline comments or readme files inside almost every file or directory.

## Installing

To start a new project, you need to install some files on your computer:

- install Node.js and NPM: [on MacOs](https://treehouse.github.io/installation-guides/mac/node-mac.html) | [on Windows](https://treehouse.github.io/installation-guides/windows/node-windows.html)
- clone this repository, navigate to the local directory via Terminal and start the setup: `npm install`
- after the install process, a new browser window should open and display the index page

## Developing

Your working directory is `src`. You’ll find example pages and a pre-built directory structure for all your templates, scripts, styles and other assets. Take a look at the example files and the readme files inside each directory, as well as inline comments. We’ll publish a more detailed documentation in the future.

During development, you can use the following [NPM scripts](https://docs.npmjs.com/misc/scripts):

### Build & Serve

1. Run the build process for development: `npm run build`
2. Start a local preview server (with auto-refresh on changes): `npm run serve`

It makes sense to chain the two commands: `npm run build && npm run serve`

### Publish

1. Once you are ready, run the publish process: `npm run publish`.
2. After the publish process is complete, you have a static html site inside the directory `dist`. Upload the whole content of the directory to your web server. You can use the command line to upload &mdash; see [upload](#upload).

### Difference between Building & Publishing

The build-prefixed npm scripts produce files suitable for debugging. You can figure out the source file for each line in concatenated files thanks to [source maps](http://blog.teamtreehouse.com/introduction-source-maps). However, these files are large and not meant for production.
The publish-prefixed scripts produce compressed files without source maps and thus way smaller file sizes. In addition, we make experimental use of [uncss](https://github.com/giakki/uncss) &mdash; a script that parses HTML files and removes all the CSS rules from the stylesheets that were not referenced.

## Deploying

If you have ssh access to your webserver, you can use the upload script via the command line. Have a look at package.json and edit the line `"upload": "scp -r ./dist/* user@server:/html/"` to add your user name, server address and destination path. Run the upload script via `npm run upload`.