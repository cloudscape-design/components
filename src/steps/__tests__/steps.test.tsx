// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Steps, { StepsProps } from '../../../lib/components/steps';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps: StepsProps = {
  steps: [],
  ariaLabel: 'Steps Execution',
  ariaDescribedby: 'steps-description',
};

const successfullSteps: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Listed EC2 instances',
    details: (
      <div>
        EC2 Instances IDs:
        <ul>
          <li>ec2InstanceID1</li>
          <li>ec2InstanceID2</li>
          <li>ec2InstanceID3</li>
          <li>ec2InstanceID4</li>
        </ul>
      </div>
    ),
    status: 'success',
  },
  {
    header: 'Gathered Security Group IDs',
    details: (
      <div>
        Security Groups IDs:
        <ul>
          <li>securityGroupID1</li>
          <li>securityGroupID2</li>
          <li>securityGroupID3</li>
        </ul>
      </div>
    ),
    status: 'success',
  },
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'success',
  },
];

const renderSteps = (props: Partial<StepsProps>) => {
  const renderResult = render(<Steps {...defaultProps} {...props} />);
  return createWrapper(renderResult.container).findSteps()!;
};

describe('Steps', () => {
  test('renders all steps', () => {
    const wrapper = renderSteps({ steps: successfullSteps });

    expect(wrapper.findItems()).toHaveLength(4);
  });
});
