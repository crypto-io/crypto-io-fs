import { writeFile, readdir, readdirSync, mkdirSync, rmdirSync, readFile, unlinkSync, existsSync } from 'fs';
import { dirname, join } from 'path';

export const direxists = (dir = '') => {
  try {
    readdirSync(dir);
  } catch (e) {
    return false;
  }
  return true;
}

export const exists = path => {
  try {
    existsSync(path);
  } catch (e) {
    return false;
  }
  return true;
}

export const mkdir = path => {
  const dir = dirname(path);
  if (!direxists(dir)) {
    mkdir(dir)
    mkdirSync(dir)
  }
}

export const write = (path, data) => {
  return new Promise((resolve, reject) => {
    writeFile(path, data, (error, d) => {
      if (error) {
        if (error.code === 'ENOENT') {
          mkdir(path);
          return write(path, data).then(() => resolve());
        }
        reject(error);
      }
      resolve();
    })
  });
}

/**
 * Get the directory paths
 * @return Promise()
 * Resolves {filename, path}
 */
export const readdirectory = path => new Promise((resolve, reject) => {
  readdir(path, (error, data) => {
    if (error) reject(error);
    else resolve(data.map(file => file = {filename: file, path: join(path, file)}));
  });
});

export const read = (path, as='string') => new Promise((resolve, reject) =>
  readFile(path, (error, data) => {
    if (error) {
      // TODO: decide to include or not, check use case.
      // if(error.code === 'EISDIR') return readdirectory(path);
      reject(error);
    } else try {
      if(as === 'string' || as === 'map') data = data.toString();
      else if (as === 'json') data = JSON.parse(data);
      else if (as === 'map') data = new Map(data);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  }));

export const remove = path => new Promise((resolve, reject) => {
  try {
    unlinkSync(path);
    resolve();
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EISDIR') {
      try {
        rmdirSync(path);
        resolve();
      } catch (error) {
        if (error.code === 'ENOTEMPTY') {
          const files = readdirSync(path);
          for (let file of files) {
            file = join(path, file);
            unlinkSync(file)
          }
          return remove(path).then(() => {resolve()})
        } else {
          reject(error);
        }
      }
    } else {
      reject(error);
    }
  }
});

export default {
  read,
  readdirectory,
  write,
  remove,
  direxists,
  exists,
  mkdir
};
