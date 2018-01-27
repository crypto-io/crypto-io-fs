'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

const direxists = (dir = '') => {
  try {
    fs.readdirSync(dir);
  } catch (e) {
    return false;
  }
  return true;
};
const exists = path$$1 => fs.existsSync(path$$1);
const mkdir = path$$1 => {
  const dir = path.dirname(path$$1);
  if (!direxists(dir)) {
    mkdir(dir);
    fs.mkdirSync(dir);
  }
};
const write = (path$$1, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path$$1, data, (error, d) => {
      if (error) {
        if (error.code === 'ENOENT') {
          mkdir(path$$1);
          return write(path$$1, data).then(() => resolve());
        }
        reject(error);
      }
      resolve();
    });
  });
};
const readdirectory = path$$1 => new Promise((resolve, reject) => {
  fs.readdir(path$$1, (error, data) => {
    if (error) reject(error);else resolve(data.map(file => file = { filename: file, path: path.join(path$$1, file) }));
  });
});
const read = (path$$1, as = 'string') => new Promise((resolve, reject) => fs.readFile(path$$1, (error, data) => {
  if (error) {
    reject(error);
  } else try {
    if (as === 'string' || as === 'map') data = data.toString();else if (as === 'json') data = JSON.parse(data);else if (as === 'map') data = new Map(data);
    resolve(data);
  } catch (error) {
    reject(error);
  }
}));
const remove = path$$1 => new Promise((resolve, reject) => {
  try {
    fs.unlinkSync(path$$1);
    resolve();
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EISDIR') {
      try {
        fs.rmdirSync(path$$1);
        resolve();
      } catch (error) {
        if (error.code === 'ENOTEMPTY') {
          const files = fs.readdirSync(path$$1);
          for (let file of files) {
            file = path.join(path$$1, file);
            fs.unlinkSync(file);
          }
          return remove(path$$1).then(() => {
            resolve();
          });
        } else {
          reject(error);
        }
      }
    } else {
      reject(error);
    }
  }
});
var index = {
  read,
  readdirectory,
  write,
  remove,
  direxists,
  exists,
  mkdir
};

exports.direxists = direxists;
exports.exists = exists;
exports.mkdir = mkdir;
exports.write = write;
exports.readdirectory = readdirectory;
exports.read = read;
exports.remove = remove;
exports['default'] = index;
//# sourceMappingURL=fs.js.map
