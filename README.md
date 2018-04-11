# Yoi Kit

A solid foundation to kickstart your project with [Yoi – the Yoshino frontend component library](https://github.com/yoshino-digital/yoi). Features:

* all of Yoi’s [utilities](https://yoshino-digital.github.io/yoi/utilities/), [components](https://yoshino-digital.github.io/yoi/components/), [behaviours](https://yoshino-digital.github.io/yoi/behaviours/) and [actions](https://yoshino-digital.github.io/yoi/actions/)
* Node.js based build tools (via [npm scripts](https://docs.npmjs.com/misc/scripts)), including:
    * a simple but powerful static site builder
    * templating with [Nunjucks](https://mozilla.github.io/nunjucks/) (with powerful features like inheritance, macros, injected data via json, …)
    * a [local browser instance](https://browsersync.io) for preview, synchronized across all connected devices (synchronized scrolling, page changes, etc.)
    * CSS pre-prosessing with [LESS](http://lesscss.org) (variables, mixins, etc.)
    * CSS post-processing with [autoprefixer](https://autoprefixer.github.io)
    * image and file compression, even [removal of unused CSS](https://github.com/uncss/uncss) during publishing
    * a simple upload script to push files via ssh to your web server

## Documentation

Read the [Yoi user documentation](https://yoshino-digital.github.io/yoi/start/) to learn how to use the pre-built components and get an introduction on how to [customize your project](https://yoshino-digital.github.io/yoi/start/customizing.html).

This repository contains a lot of useful contextual documentation in the form of inline comments or readme files inside almost every file or directory.

## Installing

To start a new project, you need to install some files on your computer:

- install Node.js and NPM: [on MacOs](https://treehouse.github.io/installation-guides/mac/node-mac.html) | [on Windows](https://treehouse.github.io/installation-guides/windows/node-windows.html)
- copy the content of this repository to your computer, navigate to the local directory via Terminal and start the setup: `npm install`
- after the install process, a new browser window should open and display the index page

If you plan to use GIT with your project, **delete the following lines** from your .gitignore file (or your configuration changes won’t be commited):

    src/assets/js/*.index
    src/assets/less/config/*.less
    src/assets/less/yoi-components.less
    src/assets/less/yoi-utilities.less

Additionally, edit the `postinstall` script to prevent overriding your configuration if you run npm install. Change:

    "postinstall": "npm run yoi-update && npm run yoi-init && npm run dev",

to

    "postinstall": "npm run yoi-update && npm run dev",

## Developing

Your working directory is `src`. You’ll find example pages and a pre-built directory structure for all your templates, scripts, styles and other assets. Take a look at the example files and the readme files inside each directory, as well as inline comments. We’ll publish a more detailed documentation in the future.

During development, you can use the following [NPM scripts](https://docs.npmjs.com/misc/scripts):

### Build & Serve

1. Run the build process for development: `npm run build`
2. Start a local preview server: `npm run serve`
3. Run the watch task to make your browser refresh on changes: `npm run watch`

As a shortcut, you could also use: `npm run dev` which chains the tasks `build`, `serve` and `watch`.

### Publish

1. Once you are ready, run the publish process: `npm run publish`.
2. After the publish process is complete, you have a static html site inside the directory `dist`.
3. If you wish to preview the built, run `npm run serve`
4. You can now use the `upload` task to [deploy](#deploying) your site.

#### Difference Between Building & Publishing

The build-prefixed npm scripts produce files suitable for debugging. You can figure out the source file for each line in concatenated files thanks to [source maps](http://blog.teamtreehouse.com/introduction-source-maps). However, these files are large and not meant for production.
The publish-prefixed scripts produce compressed files without source maps and thus way smaller file sizes. In addition, we make experimental use of [uncss](https://github.com/giakki/uncss) &mdash; a script that parses HTML files and removes all the CSS rules from the stylesheets that were not referenced.

## Deploying

If you have **ssh access to your webserver**, you can use the upload script via the command line. Edit the line `"upload": "scp -r ./dist/* user@server:/html/"` in `/package.json` to add your user name, server address and destination path. Run the upload script via `npm run upload`.