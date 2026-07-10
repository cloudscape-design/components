// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Fragment } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { flattenChildren } from '../flatten-children';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

describe('flattenChildren', () => {
  afterEach(() => {
    (warnOnce as jest.Mock).mockReset();
  });

  const nestedArrayChildren = [
    <div key="1">Item 1</div>,
    [<div key="2">Item 2</div>, <div key="3">Item 3</div>],
    <div key="4">Item 4</div>,
  ];

  const fragmentChildren = [
    <Fragment key="group">
      <span key="a">A</span>
      <span key="b">B</span>
    </Fragment>,
    <span key="c">C</span>,
  ];

  const singleFragment = (
    <Fragment>
      <span>A</span>
      <span>B</span>
    </Fragment>
  );

  // Tests React 19+ behavior: uses Children.toArray() which does NOT flatten fragments
  describe('React 19+', () => {
    beforeEach(() => {
      // Mock React.version to trigger Children.toArray() code path
      Object.defineProperty(React, 'version', {
        value: '19.0.0',
        writable: true,
        configurable: true,
      });
    });

    it('flattens nested arrays', () => {
      expect(flattenChildren(nestedArrayChildren, 'TestComponent')).toHaveLength(4);
    });

    it('does NOT flatten fragments', () => {
      expect(flattenChildren(fragmentChildren, 'TestComponent')).toHaveLength(2);
      expect(flattenChildren(singleFragment, 'TestComponent')).toHaveLength(1);
    });

    it('does not warn about fragments', () => {
      flattenChildren(fragmentChildren, 'TestComponent');
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });

  // Tests React 16-18 behavior: uses react-keyed-flatten-children which DOES flatten fragments
  describe('React 16-18', () => {
    beforeEach(() => {
      // Mock React.version to trigger react-keyed-flatten-children code path
      Object.defineProperty(React, 'version', {
        value: '18.2.0',
        writable: true,
        configurable: true,
      });
    });

    it('flattens nested arrays', () => {
      expect(flattenChildren(nestedArrayChildren, 'TestComponent')).toHaveLength(4);
    });

    it('flattens fragments', () => {
      expect(flattenChildren(fragmentChildren, 'TestComponent')).toHaveLength(3);
      expect(flattenChildren(singleFragment, 'TestComponent')).toHaveLength(2);
    });

    it('warns when fragments are found with componentName', () => {
      flattenChildren(fragmentChildren, 'TestComponent');
      expect(warnOnce).toHaveBeenCalledWith(
        'TestComponent',
        'React.Fragment children are flattened in React 18 but not in React 19+. Use arrays instead of fragments for consistent behavior.'
      );
    });

    it('does not warn when no fragments are present', () => {
      flattenChildren(nestedArrayChildren, 'TestComponent');
      expect(warnOnce).not.toHaveBeenCalled();
    });
  });
});
