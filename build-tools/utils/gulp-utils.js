// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const Vinyl = require('vinyl');
const { src, dest } = require('gulp');
const { through: throughLib } = require('mississippi');

function task(displayName, fn) {
  fn.displayName = displayName;
  return fn;
}

function through(transform, flush) {
  return throughLib.obj(
    async function (file, encoding, callback) {
      try {
        const result = await transform(file, data => {
          this.push(new Vinyl(data));
        });
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    },
    flush &&
      async function (callback) {
        try {
          const result = await flush(data => {
            this.push(new Vinyl(data));
          });
          callback(null, result);
        } catch (error) {
          callback(error);
        }
      }
  );
}

function copyTask(name, from, to) {
  return task(`copy:${name}`, () => src(from).pipe(dest(to)));
}

function copyWithProcessingTask(name, from, to, processor) {
  return task(`copyWithProcessing:${name}`, () =>
    src(from, { nodir: true })
      .pipe(
        through(file => {
          file.contents = Buffer.from(processor(file.path, file.contents.toString()));
          return file;
        })
      )
      .pipe(dest(to))
  );
}

// NOOP gulp task
function noop() {
  console.warn('Running NOOP Gulp task. This could indicate a wrongly configured task composition.');
  return Promise.resolve();
}

module.exports = { task, through, copyTask, noop, copyWithProcessingTask };
