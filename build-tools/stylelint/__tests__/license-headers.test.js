// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const stylelint = require('stylelint');

function runPlugin(code, header, fix = false) {
  return stylelint.lint({
    code,
    configBasedir: __dirname,
    fix,
    config: {
      plugins: ['../license-headers'],
      rules: {
        '@cloudscape-design/license-headers': [true, { header }],
      },
    },
  });
}

describe('Typical usage', () => {
  test('finds single line comments', async () => {
    const { errored } = await runPlugin(
      `/* My copyright */
    .some-css {}
    `,
      'My copyright'
    );
    expect(errored).toBe(false);
  });

  test('does not find single line comments', async () => {
    const { errored } = await runPlugin(
      `/* Different copyright */
  .some-css {}
  `,
      'My copyright'
    );
    expect(errored).toBe(true);
  });

  test('finds multi-line comments', async () => {
    const { errored } = await runPlugin(
      `/* My copyright
 Copyright 2022 */
.some-css {}
`,
      'My copyright\n Copyright 2022'
    );
    expect(errored).toBe(false);
  });

  test('ignores non-root comments', async () => {
    const { errored } = await runPlugin(
      `.some-css {}
/* My copyright */
  `,
      'My copyright'
    );
    expect(errored).toBe(true);
  });
});

describe('Autofixing', () => {
  test('fixes simple file without header', async () => {
    const { errored, output } = await runPlugin(`.some-css {}`, 'My copyright', true);
    expect(errored).toBe(false);
    expect(output).toBe(
      `/*My copyright*/
.some-css {}`
    );
  });

  test('fixes file with existing header', async () => {
    const { errored, output } = await runPlugin(
      `/* some other header */
.some-css {}`,
      'My copyright',
      true
    );
    expect(errored).toBe(false);
    expect(output).toBe(
      `/*My copyright*/
/* some other header */
.some-css {}`
    );
  });

  test('does not add duplicate headers', async () => {
    const input = `/*My copyright*/
.some-css {}`;

    const { errored, output } = await runPlugin(input, 'My copyright', true);
    expect(errored).toBe(false);
    expect(output).toBe(input);
  });
});
