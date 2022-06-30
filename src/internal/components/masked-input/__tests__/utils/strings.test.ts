// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  insertAt,
  padLeftZeros,
} from '../../../../../../lib/components/internal/components/masked-input/utils/strings';

describe('padLeftZeros', () => {
  test('pads empty string', () => {
    expect(padLeftZeros('', 3)).toBe('000');
  });

  test('pads a non-empty string', () => {
    expect(padLeftZeros('0', 2)).toBe('00');
  });

  test('pads the left side of a string', () => {
    expect(padLeftZeros('a', 2)).toBe('0a');
  });

  test('pads a string up until the given length', () => {
    expect(padLeftZeros('aaaa', 2)).toBe('aaaa');
  });
});

describe('insertAt', () => {
  test('should insert at the beginning of given text', () => {
    expect(insertAt('', 'hello', 0)).toBe('hello');
    expect(insertAt('world', 'hello ', 0)).toBe('hello world');
    expect(insertAt(' world', 'hello', 0)).toBe('hello world');
    expect(insertAt('world, how are you?', 'hello ', 0)).toBe('hello world, how are you?');
  });

  test('should insert in the middle of a given text', () => {
    expect(insertAt('this is a test', 'hello ', 10)).toBe('this is a hello test');
    expect(insertAt('this is a test', 'hello ', 6)).toBe('this ihello s a test');
  });

  test('should insert at the end of a given text', () => {
    expect(insertAt('this is a test', '. Hello.', 14)).toBe('this is a test. Hello.');
    expect(insertAt('this is a test', '. Hello.', 100)).toBe('this is a test. Hello.');
  });

  test('should insert and crop based on `end` parameter', () => {
    expect(insertAt('hello world', 'test', 0, 11)).toBe('test');
    expect(insertAt('hello world', 'test', 0, 5)).toBe('test world');
    expect(insertAt('hello world', 'test', 6, 11)).toBe('hello test');
  });
});
