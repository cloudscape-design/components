// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import InternalControlGroup from '../../../lib/components/internal/components/control-group';
import Select from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

describe('Select control in control group', () => {
  test('resets the context for custom dropdown content', () => {
    const { container, getByTestId } = render(
      <InternalControlGroup>
        <Select selectedOption={null} options={[]} onChange={() => {}} empty={<PositionProbe />} />
      </InternalControlGroup>
    );
    createWrapper(container).findSelect()!.openDropdown();

    expect(getByTestId('probe')).toHaveTextContent('none');
  });
});
