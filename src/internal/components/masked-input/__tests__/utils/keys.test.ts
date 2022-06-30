// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isCommand, isDigit } from '../../../../../../lib/components/internal/components/masked-input/utils/keys';

const KEYCODE_SPACE = 32;

describe('isCommand', () => {
  test('returns true if given a special command', () => {
    for (let keyCode = 8; keyCode < 47; keyCode++) {
      if (keyCode === KEYCODE_SPACE) {
        continue; // Special case tested below
      }

      expect(isCommand(keyCode, false, false)).toBe(true);
      expect(isCommand(keyCode, true, false)).toBe(true);
      expect(isCommand(keyCode, false, true)).toBe(true);
      expect(isCommand(keyCode, true, true)).toBe(true);
    }
  });

  test('returns true if given a clipboard command', () => {
    expect(isCommand(0, false, true)).toBe(true);
    expect(isCommand(0, true, false)).toBe(true);
  });

  test('returns false when not special command or clipboard command', () => {
    expect(isCommand(0, false, false)).toBe(false);
  });

  test('returns false if the special command is the SPACE key', () => {
    expect(isCommand(KEYCODE_SPACE, false, false)).toBe(false);
  });
});

describe('isDigit', () => {
  test('returns true if given a single digit character', () => {
    for (let digit = 0; digit < 10; digit++) {
      expect(isDigit(`${digit}`)).toBe(true);
    }
  });

  test('returns false if given a single non-digit character', () => {
    expect(isDigit('a')).toBe(false);
    expect(isDigit('z')).toBe(false);
    expect(isDigit(' ')).toBe(false);
    expect(isDigit('$')).toBe(false);
    expect(isDigit('/')).toBe(false);
  });
});
