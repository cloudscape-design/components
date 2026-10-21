// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import * as baseComponentHooks from '../../../lib/components/internal/hooks/use-base-component';
import Token, { TokenProps } from '../../../lib/components/token';

const useBaseComponentSpy = jest.spyOn(baseComponentHooks, 'default');

beforeEach(() => useBaseComponentSpy.mockClear());

test.each<[string, Partial<TokenProps>, object, object]>([
  ['defaults', {}, { variant: 'normal', readOnly: undefined, disabled: undefined }, { hasIcon: false }],
  [
    'inline variant with icon',
    { variant: 'inline', icon: <Icon name="file" size="small" /> },
    { variant: 'inline', readOnly: undefined, disabled: undefined },
    { hasIcon: true },
  ],
  ['disabled', { disabled: true }, { variant: 'normal', readOnly: undefined, disabled: true }, { hasIcon: false }],
  ['read-only', { readOnly: true }, { variant: 'normal', readOnly: true, disabled: undefined }, { hasIcon: false }],
])('reports component metrics: %s', (_, tokenProps, expectedProps, expectedMetadata) => {
  render(<Token label="Token" {...tokenProps} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith('Token', { props: expectedProps, metadata: expectedMetadata });
});
