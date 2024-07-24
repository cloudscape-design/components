// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SegmentedControl, { SegmentedControlProps } from '../../../lib/components/segmented-control';
import { renderSegmentedControl } from './utils';

export const defaultOptions: SegmentedControlProps.Option[] = [
  { text: 'Segment-1', iconName: 'settings', id: 'seg-1' },
  { text: '', iconName: 'settings', iconAlt: 'Settings', id: 'seg-2' },
  { text: 'Segment-3', id: 'seg-3', disabled: true },
  { text: 'Segment-4', iconName: 'settings', id: 'seg-4' },
];

test('renders select', () => {
  const { selectWrapper } = renderSegmentedControl(<SegmentedControl selectedId="seg-1" options={defaultOptions} />);
  expect(selectWrapper).not.toBeNull();
});

test('finds options', () => {
  const { selectWrapper } = renderSegmentedControl(<SegmentedControl selectedId="seg-1" options={defaultOptions} />);
  selectWrapper.openDropdown();
  expect(selectWrapper.findDropdown().findOptions()).toHaveLength(4);
});

test('finds selected option', () => {
  const { selectWrapper } = renderSegmentedControl(<SegmentedControl selectedId="seg-1" options={defaultOptions} />);
  selectWrapper.openDropdown();
  expect(selectWrapper.findDropdown().findSelectedOptions()[0].findLabel().getElement()).toHaveTextContent('Segment-1');
});

test('Displays the iconAlt as text in the Select in the use-case of only icons', () => {
  const { selectWrapper } = renderSegmentedControl(<SegmentedControl selectedId="seg-2" options={defaultOptions} />);
  expect(selectWrapper.findTrigger().getElement()).toHaveTextContent('Settings');
});
