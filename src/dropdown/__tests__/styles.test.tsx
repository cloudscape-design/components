// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDropdownStyles } from '../style';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  dropdown: {
    background: 'rgb(255, 255, 255)',
    borderColor: 'rgb(0, 0, 0)',
    borderRadius: '8px',
    borderWidth: '2px',
  },
};

describe('getDropdownStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getDropdownStyles({})).toMatchSnapshot();
    expect(getDropdownStyles(undefined)).toMatchSnapshot();
    expect(getDropdownStyles(allStyles)).toMatchSnapshot();
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getDropdownStyles: getDropdownStylesNonCore } = await import('../style');

    const result = getDropdownStylesNonCore(allStyles);

    expect(result).toBeUndefined();
  });
});
