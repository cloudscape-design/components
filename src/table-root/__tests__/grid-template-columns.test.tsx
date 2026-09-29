// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { computeGridTemplateColumns } from '../grid-template-columns';
import { TableRootProps } from '../interfaces';

const COLUMNS: ReadonlyArray<TableRootProps.ColumnDefinition> = [{ size: 200 }, {}, { size: 100 }];

function gridTemplate(columns: ReadonlyArray<TableRootProps.ColumnDefinition>) {
  return computeGridTemplateColumns({ type: 'grid', columns });
}

describe('computeGridTemplateColumns', () => {
  test('auto layout has no grid template', () => {
    expect(computeGridTemplateColumns({ type: 'auto' })).toBeUndefined();
  });

  describe('grid template compiled from the size union', () => {
    test('multiple columns join into one template', () => {
      expect(gridTemplate(COLUMNS)).toBe('200px minmax(0px, 1fr) 100px');
    });

    test('a fixed pixel size becomes a px track', () => {
      expect(gridTemplate([{ size: 200 }])).toBe('200px');
    });

    test('an absent size becomes a flexible minmax(0px, 1fr) track', () => {
      expect(gridTemplate([{}])).toBe('minmax(0px, 1fr)');
    });

    test('a flex weight becomes minmax(0px, <weight>fr)', () => {
      expect(gridTemplate([{ size: { flex: 2 } }])).toBe('minmax(0px, 2fr)');
    });

    test('an explicit zero flex weight becomes a 0fr track (not the default 1fr)', () => {
      expect(gridTemplate([{ size: { flex: 0 } }])).toBe('minmax(0px, 0fr)');
    });

    test('minWidth floors a flexible track', () => {
      expect(gridTemplate([{ minWidth: 150 }])).toBe('minmax(150px, 1fr)');
    });

    test('maxWidth caps a non-weighted track at a px ceiling', () => {
      expect(gridTemplate([{ maxWidth: 300 }])).toBe('minmax(0px, 300px)');
      expect(gridTemplate([{ minWidth: 100, maxWidth: 300 }])).toBe('minmax(100px, 300px)');
    });

    test('flex and maxWidth are mutually exclusive at the type level', () => {
      // @ts-expect-error — a weighted (flex) track cannot also be hard-capped (maxWidth); the union forbids it.
      const invalid: TableRootProps.ColumnDefinition = { size: { flex: 2 }, maxWidth: 300 };
      expect(invalid).toBeDefined();
    });

    describe('malformed numeric values do not invalidate the whole template', () => {
      test('a negative fixed size clamps to 0px', () => {
        expect(gridTemplate([{ size: -50 }, { size: 100 }])).toBe('0px 100px');
      });

      test('a non-finite fixed size falls back to the default growable track', () => {
        expect(gridTemplate([{ size: NaN }, { size: 100 }])).toBe('minmax(0px, 1fr) 100px');
        expect(gridTemplate([{ size: Infinity }])).toBe('minmax(0px, 1fr)');
      });

      test('a negative flex weight clamps to 0fr', () => {
        expect(gridTemplate([{ size: { flex: -2 } }])).toBe('minmax(0px, 0fr)');
      });

      test('a non-finite flex weight falls back to the default growable track', () => {
        expect(gridTemplate([{ size: { flex: NaN } }])).toBe('minmax(0px, 1fr)');
      });

      test('a negative minWidth clamps to 0px, a non-finite minWidth is dropped', () => {
        expect(gridTemplate([{ minWidth: -10 }])).toBe('minmax(0px, 1fr)');
        expect(gridTemplate([{ minWidth: NaN, maxWidth: 300 }])).toBe('minmax(0px, 300px)');
      });

      test('a negative maxWidth clamps to 0px, a non-finite maxWidth is dropped', () => {
        expect(gridTemplate([{ maxWidth: -300 }])).toBe('minmax(0px, 0px)');
        expect(gridTemplate([{ maxWidth: Infinity }])).toBe('minmax(0px, 1fr)');
      });
    });
  });
});
