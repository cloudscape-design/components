// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGridDefinition } from '../../../lib/components/form-field/util';

describe('Form Field stretch property', () => {
  test('getGridColumns returns the right values', () => {
    [false, true].forEach(stretch => {
      const stretchTrueValues = [{ colspan: 12 }, { colspan: 12 }];
      const stretchFalseValues = [{ colspan: { default: 12, xs: 9 } }, { colspan: { default: 12, xs: 3 } }];

      const values = getGridDefinition(stretch, true, false);

      if (stretch) {
        expect(values).toEqual(stretchTrueValues);
      } else {
        expect(values).toEqual(stretchFalseValues);
      }
    });

    [false, true].forEach(stretch => {
      const stretchTrueValues = [{ colspan: 12 }];
      const stretchFalseValues = [{ colspan: { default: 12, xs: 9 } }];

      const values = getGridDefinition(stretch, false, false);

      if (stretch) {
        expect(values).toEqual(stretchTrueValues);
      } else {
        expect(values).toEqual(stretchFalseValues);
      }
    });

    [false, true].forEach(stretch => {
      const stretchTrueValues = [{ colspan: 12 }, { colspan: 12 }];
      const stretchFalseValues = [{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }];

      const values = getGridDefinition(stretch, true, true);

      if (stretch) {
        expect(values).toEqual(stretchTrueValues);
      } else {
        expect(values).toEqual(stretchFalseValues);
      }
    });

    [false, true].forEach(stretch => {
      const stretchTrueValues = [{ colspan: 12 }];
      const stretchFalseValues = [{ colspan: { default: 12, xs: 8 } }];

      const values = getGridDefinition(stretch, false, true);

      if (stretch) {
        expect(values).toEqual(stretchTrueValues);
      } else {
        expect(values).toEqual(stretchFalseValues);
      }
    });
  });
});
