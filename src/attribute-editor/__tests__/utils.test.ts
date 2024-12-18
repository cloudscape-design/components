// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AttributeEditorProps } from '../interfaces';
import {
  getGridTemplateColumns,
  getItemGridColumns,
  getRemoveButtonGridColumns,
  isRemoveButtonOnSameLine,
} from '../utils';

describe('utils', () => {
  const sampleLayout: AttributeEditorProps.GridLayout = {
    rows: [
      [1, 2],
      [2, 1],
    ],
    removeButton: {
      width: 1,
      ownRow: false,
    },
  };

  describe('getItemGridColumns', () => {
    it('should return correct grid columns for first item', () => {
      const result = getItemGridColumns(sampleLayout, 0);
      expect(result).toEqual({ gridColumnStart: 1, gridColumnEnd: 2 });
    });

    it('should return correct grid columns for second item', () => {
      const result = getItemGridColumns(sampleLayout, 1);
      expect(result).toEqual({ gridColumnStart: 2, gridColumnEnd: 4 });
    });

    it('should return correct grid columns for third item (second row)', () => {
      const result = getItemGridColumns(sampleLayout, 2);
      expect(result).toEqual({ gridColumnStart: 1, gridColumnEnd: 3 });
    });
  });

  describe('getRemoveButtonGridColumns', () => {
    it('should return correct columns when button is on single line', () => {
      const singleLineLayout: AttributeEditorProps.GridLayout = {
        rows: [[1]],
        removeButton: { width: 1 },
      };
      const result = getRemoveButtonGridColumns(singleLineLayout, 2);
      expect(result).toEqual({ gridColumnStart: 2, gridColumnEnd: 3 });
    });

    it('should return full width when button is on own row', () => {
      const multiLineLayout: AttributeEditorProps.GridLayout = {
        rows: [[1, 2]],
        removeButton: { width: 1, ownRow: true },
      };
      const result = getRemoveButtonGridColumns(multiLineLayout, 2);
      expect(result).toEqual({ gridColumnStart: 1, gridColumnEnd: 4 });
    });
  });

  describe('isRemoveButtonOnSameLine', () => {
    it('should return true for single row layout without ownRow', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1]],
        removeButton: { width: 1 },
      };
      expect(isRemoveButtonOnSameLine(layout)).toBe(true);
    });

    it('should return false for single row layout with ownRow', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1]],
        removeButton: { width: 1, ownRow: true },
      };
      expect(isRemoveButtonOnSameLine(layout)).toBe(false);
    });

    it('should return false for multi-row layout', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1], [1]],
        removeButton: { width: 1 },
      };
      expect(isRemoveButtonOnSameLine(layout)).toBe(false);
    });
  });

  describe('getGridTemplateColumns', () => {
    it('should generate correct template for single row with remove button', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1, 1]],
        removeButton: { width: 1 },
      };
      expect(getGridTemplateColumns(layout)).toBe('repeat(2, 1fr) 1fr');
    });

    it('should handle auto width remove button', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1]],
        removeButton: { width: 'auto' },
      };
      expect(getGridTemplateColumns(layout)).toBe('repeat(1, 1fr) max-content');
    });

    it('should not add remove button column when button is on own row', () => {
      const layout: AttributeEditorProps.GridLayout = {
        rows: [[1, 1]],
        removeButton: { width: 1, ownRow: true },
      };
      expect(getGridTemplateColumns(layout)).toBe('repeat(2, 1fr) ');
    });
  });
});
