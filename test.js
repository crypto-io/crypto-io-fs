const test = require('blue-tape');
const { read, write, remove, direxists, readdirectory } = require('./fs.js');
(async () => {
  await test('write', async tape => {
    tape.plan(1);

    try {
      await write('hello/hello.txt', 'some tekst');
      await write('no-object.json', '[object object]');

      tape.ok('create file/directory');
    } catch (e) {
      tape.fail(e)
    }
  });

  await test('read', async tape => {
    tape.plan(2);
    tape.shouldFail(read('no-object.json', 'json'), 'returns errors for read');

    const data = await read('hello/hello.txt', 'string')
    tape.equal('some tekst', data, 'read from file');
  });

  await test('direxists', async tape => {
    tape.plan(1);
    const exists = await direxists('hello');
    tape.equal(exists, true, 'directory exists');
  });

  await test('readdirectory', async tape => {
    tape.plan(1);
    const paths = await readdirectory('hello');
    tape.deepEqual(paths, [{filename: 'hello.txt', path: 'hello\\hello.txt'}], 'read directory & transform paths');
  });

  await test('remove', async tape => {
    tape.plan(1);
    await remove('hello')
    await remove('no-object.json')
    const exists = await direxists('hello');
    tape.equal(exists, false, 'remove directory');
  });

})()
