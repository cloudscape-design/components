// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup from '../../../lib/components/internal/components/control-group';
import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

const options = [{ value: '1', label: 'One' }];
const noop = () => {};

describe('Multiselect in control group', () => {
  test('resets the context for a custom dropdown footer', () => {
    const { container, getByTestId } = render(
      <ControlGroup>
        <Multiselect
          selectedOptions={[]}
          options={options}
          onChange={noop}
          renderDropdownFooter={() => <PositionProbe />}
        />
      </ControlGroup>
    );
    createWrapper(container).findMultiselect()!.openDropdown();

    expect(getByTestId('probe')).toHaveTextContent('none');
  });

  it('renders inline tokens even if `inlineTokens` is not set', () => {
    const { container } = render(
      <ControlGroup>
        <Multiselect selectedOptions={[options[0]]} options={options} onChange={() => {}} />
      </ControlGroup>
    );

    const multiselect = createWrapper(container).findMultiselect()!;
    const inlineTokens = multiselect.findInlineTokens();

    expect(inlineTokens).toHaveLength(1);
    expect(inlineTokens[0].findLabel().getElement()).toHaveTextContent('One');
    expect(multiselect.findTokens()).toHaveLength(0);
  });
});
