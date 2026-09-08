// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isKeyboardInteraction } from '../focus-visible';

afterEach(() => {
  delete document.body.dataset.awsuiFocusVisible;
});

test('returns false when the focus-visible flag is not set', () => {
  expect(isKeyboardInteraction()).toBe(false);
});

test('returns true when the focus-visible flag is set on the body', () => {
  document.body.dataset.awsuiFocusVisible = 'true';
  expect(isKeyboardInteraction()).toBe(true);
});

test('resolves the flag from the element owning document when an element is given', () => {
  document.body.dataset.awsuiFocusVisible = 'true';
  const element = document.createElement('div');
  document.body.appendChild(element);
  expect(isKeyboardInteraction(element)).toBe(true);
});

test('falls back to the main document when the element is null', () => {
  document.body.dataset.awsuiFocusVisible = 'true';
  expect(isKeyboardInteraction(null)).toBe(true);
});
