// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Select from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('Select native search', () => {
  test('typing a group label prefix does not select an option inside that group', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select
        options={[{ label: 'Compute', options: [{ label: 'EC2', value: 'ec2' }] }]}
        selectedOption={null}
        onChange={onChange}
      />
    );
    createWrapper(container).findSelect()!.findTrigger().keydown({ key: 'c' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
