// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ControlGroupContext } from '../../../lib/components/internal/context/control-group-context';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';

const defaultOptions: MultiselectProps.Options = [
  { label: 'First', value: '1' },
  { label: 'Second', value: '2' },
];

jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  const originalModule = jest.requireActual('@cloudscape-design/component-toolkit/internal');

  return {
    __esModule: true,
    ...originalModule,
    warnOnce: jest.fn(),
  };
});

beforeEach(() => {
  (warnOnce as jest.Mock).mockClear();
});

function renderInControlGroup(jsx: React.ReactElement) {
  return render(<ControlGroupContext.Provider value={{ position: 'first' }}>{jsx}</ControlGroupContext.Provider>);
}

test('warns when rendered inside a control group without inlineTokens', () => {
  renderInControlGroup(<Multiselect selectedOptions={[]} options={defaultOptions} ariaLabel="Labels" />);
  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith(
    'Multiselect',
    'You should set `inlineTokens` to `true` when using the component inside a control group.'
  );
});

test('does not warn when rendered inside a control group with inlineTokens', () => {
  renderInControlGroup(
    <Multiselect selectedOptions={[]} options={defaultOptions} ariaLabel="Labels" inlineTokens={true} />
  );
  expect(warnOnce).not.toHaveBeenCalled();
});

test('does not warn when rendered outside a control group', () => {
  render(<Multiselect selectedOptions={[]} options={defaultOptions} ariaLabel="Labels" />);
  expect(warnOnce).not.toHaveBeenCalled();
});
