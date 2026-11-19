// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import * as baseComponentHooks from '../../../lib/components/internal/hooks/use-base-component';

const useBaseComponentSpy = jest.spyOn(baseComponentHooks, 'default');

const defaultProps: AutosuggestProps = {
  value: '',
  onChange: () => {},
  options: [{ value: 'option1' }],
  ariaLabel: 'autosuggest',
};

beforeEach(() => useBaseComponentSpy.mockClear());

test.each([
  ['with tokens', [{ value: 'a' }]],
  ['with an empty tokens array', []],
])('reports token mode usage in metadata %s', (_, tokens) => {
  render(<Autosuggest {...defaultProps} tokens={tokens} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith('Autosuggest', {
    props: expect.anything(),
    metadata: { hasTokens: true },
  });
});

test('reports no token mode usage by default', () => {
  render(<Autosuggest {...defaultProps} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith('Autosuggest', {
    props: expect.anything(),
    metadata: { hasTokens: false },
  });
});
