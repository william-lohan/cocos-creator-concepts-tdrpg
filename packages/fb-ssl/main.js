'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const copyFile = util.promisify(fs.copyFile);

function onBuildFinish(options, callback) {
  if (options.platform === 'fb-instant-games') {
    const keyPath = path.join(options.project, 'dev-ssl', 'key.pem');
    const certPath = path.join(options.project, 'dev-ssl', 'cert.pem');
    Promise.all([
      copyFile(keyPath, options.dest),
      copyFile(certPath, options.dest)
    ]).then(() => callback());
  }
}

module.exports = {
  load () {
    // Editor.Builder.on('build-finished', onBuildFinish);
  },
  unload () {
    // Editor.Builder.removeListener('build-finished', onBuildFinish);
  }
};
