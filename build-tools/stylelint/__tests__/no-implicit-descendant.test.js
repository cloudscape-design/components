// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import stylelint from 'stylelint';
import { configBasedir } from './common.js';

function runPlugin(code) {
  return stylelint.lint({
    code,
    configBasedir,
    config: {
      plugins: ['../no-implicit-descendant.js'],
      rules: {
        '@cloudscape-design/no-implicit-descendant': [true, { ignoreParents: ['.ignore'] }],
      },
    },
  });
}

describe('Typical usage', () => {
  test('should only catch nested selectors', async () => {
    const { errored } = await runPlugin('.outer {}; .outer2 {}');
    expect(errored).toBe(false);
  });

  test('should catch nested css rule with no combinator', async () => {
    const { errored } = await runPlugin('.outer { .inner {} }');
    expect(errored).toBe(true);
  });

  test('should allow nested css rule with an explicit combinator', async () => {
    const { errored } = await runPlugin('.outer { ~ .sibling {} }');
    expect(errored).toBe(false);
  });

  test('should catch nested css rule next to passing css rules', async () => {
    const { errored } = await runPlugin('.outer { ~ .sibling1, ~ .sibling2, .other {} }');
    expect(errored).toBe(true);
  });

  test('should allow pseudoelements without a combinator', async () => {
    const { errored } = await runPlugin('.outer { &:hover, &:focus {} }');
    expect(errored).toBe(false);
  });

  test('should catch nesting in sass mixins', async () => {
    const { errored } = await runPlugin('@mixin outer { .inner {} }');
    expect(errored).toBe(true);
  });

  test('should allow selectors using "&"', async () => {
    // This is technically a violation, but we let another rule catch this one.
    const { errored } = await runPlugin('.outer { & inner {} }');
    expect(errored).toBe(false);
  });
});

describe('ignoreParents', () => {
  test('should allow nested rules under ignored parent', async () => {
    const { errored } = await runPlugin('.ignore { .inner {} }');
    expect(errored).toBe(false);
  });

  test('should allow nested rules under nested ignored parent', async () => {
    const { errored } = await runPlugin('.outer { > .ignore { .inner {} } }');
    expect(errored).toBe(false);
  });
});

describe('At-rule exemptions', () => {
  test('should allow nested rules under top-level at-rules', async () => {
    const { errored } = await runPlugin('@media print { .inner {} }');
    expect(errored).toBe(false);
  });

  test('should catch nested rules under nested at-rules', async () => {
    const { errored } = await runPlugin('.outer { @media print { .inner {} } }');
    expect(errored).toBe(true);
  });

  test('should allow nested rules with explicit combinator under nested at-rules', async () => {
    const { errored } = await runPlugin('.outer { @media print { > .inner {} } }');
    expect(errored).toBe(false);
  });
});
