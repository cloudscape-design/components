// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { mapValues } = require('lodash');
const { getTokenVersions } = require('../token-versions');

const variablesMap = {
  borderRadiusButton: 'border-radius-button',
  borderWidthField: 'border-width-field',
  colorChartsPurple300: 'color-charts-purple-300',
  colorBorderButtonNormalDefault: 'color-border-button-normal-default',
  colorBackgroundPopover: 'color-background-popover',
  colorTextControlDisabled: 'color-text-control-disabled',
  colorTextAccent: 'color-text-accent',
  spaceScaledM: 'space-scaled-m',
  sizeIconMedium: 'size-icon-m',
  fontFamilyBase: 'font-family-base',
  shadowModal: 'shadow-modal',
};

test('versions border + typography tokens matched by the default groups and leaves others (incl. border colors) version-less', () => {
  expect(getTokenVersions(variablesMap)).toEqual({
    borderRadiusButton: 'v3-1',
    borderWidthField: 'v3-1',
    fontFamilyBase: 'v3-1',
  });
});

test('assigns the version of the first matching group', () => {
  const groups = [
    { pattern: /^color-border-/, version: 'v3-2' },
    { pattern: /^color-text-/, version: 'v3-2' },
    { pattern: /^color-/, version: 'v3-1' },
  ];
  expect(getTokenVersions(variablesMap, groups)).toEqual({
    colorBackgroundPopover: 'v3-1',
    colorBorderButtonNormalDefault: 'v3-2',
    colorChartsPurple300: 'v3-1',
    colorTextAccent: 'v3-2',
    colorTextControlDisabled: 'v3-2',
  });
});

test('a catch-all group versions every token', () => {
  const groups = [{ pattern: /.*/, version: 'v3-1' }];
  expect(getTokenVersions(variablesMap, groups)).toEqual(mapValues(variablesMap, () => 'v3-1'));
});

test('returns an empty map when no group matches', () => {
  const groups = [{ pattern: /^motion-duration-/, version: 'v3-1' }];
  expect(getTokenVersions(variablesMap, groups)).toEqual({});
});
