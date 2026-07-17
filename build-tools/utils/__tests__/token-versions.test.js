// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { mapValues } = require('lodash');
const { getTokenVersions } = require('../token-versions');

const variablesMap = {
  borderRadiusButton: 'border-radius-button',
  borderWidthField: 'border-width-field',
  colorBorderButtonNormalDefault: 'color-border-button-normal-default',
  colorTextAccent: 'color-text-accent',
  spaceScaledM: 'space-scaled-m',
  fontFamilyBase: 'font-family-base',
};

test('versions border tokens matched by the default groups and leaves others (incl. border colors) version-less', () => {
  expect(getTokenVersions(variablesMap)).toEqual({
    borderRadiusButton: 'v3-1',
    borderWidthField: 'v3-1',
  });
});

test('assigns the version of the first matching group', () => {
  const groups = [
    { pattern: /^color-border-/, version: 'v3-2' },
    { pattern: /^color-/, version: 'v3-1' },
  ];
  expect(getTokenVersions(variablesMap, groups)).toEqual({
    colorBorderButtonNormalDefault: 'v3-2',
    colorTextAccent: 'v3-1',
  });
});

test('a catch-all group versions every token', () => {
  const groups = [{ pattern: /.*/, version: 'v3-1' }];
  expect(getTokenVersions(variablesMap, groups)).toEqual(mapValues(variablesMap, () => 'v3-1'));
});

test('returns an empty map when no group matches', () => {
  const groups = [{ pattern: /^color-background-/, version: 'v3-1' }];
  expect(getTokenVersions(variablesMap, groups)).toEqual({});
});
