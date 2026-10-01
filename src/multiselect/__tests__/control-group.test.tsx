// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup from '../../../lib/components/internal/components/control-group';
import Multiselect from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

describe('Multiselect in control group', () => {
  test('resets the context for a custom dropdown footer', () => {
    const { container, getByTestId } = render(
      <ControlGroup>
        <Multiselect
          selectedOptions={[]}
          options={[{ value: '1', label: 'One' }]}
          onChange={() => {}}
          renderDropdownFooter={() => <PositionProbe />}
        />
      </ControlGroup>
    );
    createWrapper(container).findMultiselect()!.openDropdown();

    expect(getByTestId('probe')).toHaveTextContent('none');
  });
});
