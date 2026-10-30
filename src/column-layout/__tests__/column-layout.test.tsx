// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ColumnLayout, { ColumnLayoutProps } from '../../../lib/components/column-layout';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/column-layout/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderColumnLayout(props: ColumnLayoutProps = {}) {
  const renderResult = render(<ColumnLayout {...props} />);
  // The styling classes are defined on the inner grid.
  return createWrapper(renderResult.container).findGrid()!;
}

describe('ColumnLayout component', () => {
  describe('columns property', () => {
    it('has 1 column by default', () => {
      const wrapper = renderColumnLayout();
      expect(wrapper.getElement()).toHaveClass(styles['grid-columns-1']);
    });

    [2, 3, 4].forEach(columnCount => {
      it(`can have ${columnCount} columns`, () => {
        const wrapper = renderColumnLayout({ columns: columnCount as 2 | 3 | 4 });
        expect(wrapper.getElement()).toHaveClass(styles[`grid-columns-${columnCount}`]);
      });
    });

    [1, 2, 3, 4].forEach(columnCount => {
      it(`does not warn for ${columnCount} columns`, () => {
        render(<ColumnLayout columns={columnCount} />);
        expect(warnOnce).not.toHaveBeenCalled();
      });
    });

    [5, 6, 10, 12].forEach(columnCount => {
      it(`warns that ${columnCount} columns is unsupported without minColumnWidth`, () => {
        render(<ColumnLayout columns={columnCount} />);
        expect(warnOnce).toHaveBeenCalledWith(
          'ColumnLayout',
          expect.stringContaining(`\`columns\` (${columnCount}) is not supported without \`minColumnWidth\``)
        );
      });

      it(`does not warn for ${columnCount} columns when minColumnWidth is set`, () => {
        render(<ColumnLayout columns={columnCount} minColumnWidth={100} />);
        expect(warnOnce).not.toHaveBeenCalled();
      });
    });
  });

  describe('borders property', () => {
    it('is none by default', () => {
      const wrapper = renderColumnLayout();
      expect(wrapper.getElement()).not.toHaveClass(styles['grid-vertical-borders']);
      expect(wrapper.getElement()).not.toHaveClass(styles['grid-horizontal-borders']);
    });

    it('applies vertical styling', () => {
      const wrapper = renderColumnLayout({ borders: 'vertical' });
      expect(wrapper.getElement()).toHaveClass(styles['grid-vertical-borders']);
      expect(wrapper.getElement()).not.toHaveClass(styles['grid-horizontal-borders']);
    });

    it('applies horizontal styling', () => {
      const wrapper = renderColumnLayout({ borders: 'horizontal' });
      expect(wrapper.getElement()).not.toHaveClass(styles['grid-vertical-borders']);
      expect(wrapper.getElement()).toHaveClass(styles['grid-horizontal-borders']);
    });

    it('applies both horizontal and vertical when "all" is provided', () => {
      const wrapper = renderColumnLayout({ borders: 'all' });
      expect(wrapper.getElement()).toHaveClass(styles['grid-vertical-borders']);
      expect(wrapper.getElement()).toHaveClass(styles['grid-horizontal-borders']);
    });
  });

  describe('text-grid variant', () => {
    it('disables borders even when a value for borders is provided', () => {
      ['none', 'vertical', 'horizontal', 'all'].forEach(borders => {
        const wrapper = renderColumnLayout({ variant: 'text-grid', borders: borders as ColumnLayoutProps['borders'] });
        expect(wrapper.getElement()).not.toHaveClass(styles['grid-vertical-borders']);
        expect(wrapper.getElement()).not.toHaveClass(styles['grid-horizontal-borders']);
      });
    });
  });
});
