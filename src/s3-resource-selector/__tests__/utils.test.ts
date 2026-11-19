// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { joinObjectPath } from '../../../lib/components/s3-resource-selector/utils';

test('does not crash on empty items', () => {
  expect(joinObjectPath([])).toEqual('');
});

test('single item', () => {
  expect(joinObjectPath(['root'])).toEqual('root');
});

test('joins paths without trailing slashes', () => {
  expect(joinObjectPath(['a', 'b', 'c'])).toEqual('a/b/c');
});

test('concatenates trailing slashes', () => {
  expect(joinObjectPath(['/', 'b/'])).toEqual('/b/');
  expect(joinObjectPath(['a/', '/', '/', 'b/'])).toEqual('a///b/');
  expect(joinObjectPath(['a///', 'b'])).toEqual('a///b');
  expect(joinObjectPath(['a//', 'b/', 'c/'])).toEqual('a//b/c/');
});

test('mixed items', () => {
  expect(joinObjectPath(['a//', 'b/', 'c', 'd'])).toEqual('a//b/c/d');
});
