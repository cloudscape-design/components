// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getInputStyles } from '../styles';

// Mock the environment module
jest.mock('../../internal/environment', () => ({
  SYSTEM: 'core',
}));

const allStyles = {
  root: {
    borderRadius: '4px',
    borderWidth: '1px',
    fontSize: '14px',
    fontWeight: '400',
    paddingBlock: '8px',
    paddingInline: '12px',
    backgroundColor: {
      default: '#ffffff',
      disabled: '#f0f0f0',
      hover: '#fafafa',
      focus: '#ffffff',
      readonly: '#ffffff',
    },
    borderColor: {
      default: '#cccccc',
      disabled: '#e0e0e0',
      hover: '#999999',
      focus: '#0073bb',
      readonly: '#e0e0e0',
    },
    boxShadow: {
      default: 'none',
      disabled: 'none',
      hover: '0 1px 2px rgba(0,0,0,0.1)',
      focus: '0 0 0 2px #0073bb',
      readonly: 'none',
    },
    color: {
      default: '#000000',
      disabled: '#999999',
      hover: '#000000',
      focus: '#000000',
      readonly: '#000000',
    },
  },
  placeholder: {
    color: '#999999',
    fontSize: '14px',
    fontWeight: '400',
    fontStyle: 'italic',
  },
};

describe('getInputStyles', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('handles all possible style configurations', () => {
    expect(getInputStyles({})).toMatchSnapshot();
    expect(getInputStyles(undefined)).toMatchSnapshot();
    expect(getInputStyles(allStyles)).toMatchSnapshot();
  });

  test('returns undefined when SYSTEM is not core', async () => {
    jest.resetModules();
    jest.doMock('../../internal/environment', () => ({
      SYSTEM: 'visual-refresh',
    }));

    const { getInputStyles: getInputStylesNonCore } = await import('../styles');

    const style = {
      root: {
        borderRadius: '4px',
      },
    };

    const result = getInputStylesNonCore(style);

    expect(result).toBeUndefined();
  });
});
