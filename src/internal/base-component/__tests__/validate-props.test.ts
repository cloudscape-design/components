// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { validateProps } from '../../../../lib/components/internal/base-component';

test('should pass validation', () => {
  expect(() => validateProps('TestComponent', {}, [], {})).not.toThrow();
  expect(() => validateProps('TestComponent', { variant: 'foo' }, ['bar'], { variant: ['foo'] })).not.toThrow();
});

test('should throw error when excluded prop is used', () => {
  expect(() => validateProps('TestComponent', { variant: 'foo' }, ['variant'], {})).toThrow(
    new Error('TestComponent does not support "variant" property when used in default theme')
  );
});

test('should throw error when invalid prop is used', () => {
  expect(() => validateProps('TestComponent', { variant: 'foo' }, [], { variant: ['bar'] })).toThrow(
    new Error('TestComponent does not support "variant" with value "foo" when used in default theme')
  );
});
