'use strict';

const { exec } = require("child_process");

const BuildOptions = {
  platform: 'web-mobile',
  debug: true
};

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('build-web-mobile');
    },
    'build-web-mobile:only-build' () {
      const creatorPath = process.execPath;
      const projectPath = Editor.Project.path;

      let buildParams = '';
      for (const key in BuildOptions) {
        buildParams += `${key}=${BuildOptions[key]};`;
      }

      const cmd = `"${creatorPath}" --path "${projectPath}" --build "${buildParams}"`;

      exec(cmd, (err, stdout, stderr) => {
        Editor.log('err', err);
        Editor.log('stderr', stderr);
        Editor.log('stdout', stdout);
      });
    },
    'build-web-mobile:build-and-deploy' () {

    },
    'change-state' () {

    }
  },
};