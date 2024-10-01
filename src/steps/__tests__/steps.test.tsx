// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Steps, { StepsProps } from '../../../lib/components/steps';
import createWrapper from '../../../lib/components/test-utils/dom';

import statusIconStyles from '../../../lib/components/status-indicator/styles.selectors.js';
import stepsStyles from '../../../lib/components/steps/styles.selectors.js';

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
    status: 'loading',
  },
];

const stepsWithIconAriaLabel: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
    statusIconAriaLabel: 'test icon aria label 1',
  },
  {
    header: 'Analyzing security rules',
    status: 'loading',
    statusIconAriaLabel: 'test icon aria label 2',
  },
];

const renderSteps = (props: Partial<StepsProps>) => {
  const renderResult = render(<Steps {...defaultProps} {...props} />);
  return createWrapper(renderResult.container).findSteps()!;
};

describe('Steps', () => {
  test('renders no steps when none are provided', () => {
    const wrapper = renderSteps({ steps: [] });

    expect(wrapper.findItems()).toHaveLength(0);
  });

  test('renders correct count of steps', () => {
    const wrapper = renderSteps({ steps: successfullSteps });

    expect(wrapper.findItems()).toHaveLength(4);
  });

  test('renders correct steps headers', () => {
    const wrapper = renderSteps({ steps: successfullSteps });

    expect(wrapper.findItems()[0]!.findHeader()!.getElement()).toHaveTextContent('Listed EC2 instances');
    expect(wrapper.findItems()[1]!.findHeader()!.getElement()).toHaveTextContent('Gathered Security Group IDs');
    expect(wrapper.findItems()[2]!.findHeader()!.getElement()).toHaveTextContent('Checked Cross Region Consent');
    expect(wrapper.findItems()[3]!.findHeader()!.getElement()).toHaveTextContent('Analyzing security rules');
  });

  test('renders correct steps details', () => {
    const wrapper = renderSteps({ steps: successfullSteps });

    expect(wrapper.findItems()[0]!.findDetails()!.getElement()).toHaveTextContent('EC2 Instances IDs:');
    expect(wrapper.findItems()[1]!.findDetails()!.getElement()).toHaveTextContent('Security Groups IDs:');
    expect(wrapper.findItems()[2]!.findDetails()).toBeNull();
    expect(wrapper.findItems()[3]!.findDetails()).toBeNull();
  });

  describe('Accessibility', () => {
    test('applies ARIA label to steps', () => {
      const testAriaLabel = 'Test aria label';
      const wrapper = renderSteps({ steps: successfullSteps, ariaLabel: testAriaLabel });

      expect(wrapper.findByClassName(stepsStyles.list)!.getElement()).toHaveAccessibleName(testAriaLabel);
    });

    test('applies ARIA labelledby to steps', () => {
      const testAriaLabelledBy = 'test-id';
      const wrapper = renderSteps({ steps: successfullSteps, ariaLabelledby: testAriaLabelledBy });

      expect(wrapper.findByClassName(stepsStyles.list)!.getElement()).toHaveAttribute(
        'aria-labelledby',
        testAriaLabelledBy
      );
    });

    test('applies ARIA describedby to steps', () => {
      const testAriaDescribedBy = 'test-id';
      const wrapper = renderSteps({ steps: successfullSteps, ariaDescribedby: testAriaDescribedBy });

      expect(wrapper.findByClassName(stepsStyles.list)!.getElement()).toHaveAttribute(
        'aria-describedby',
        testAriaDescribedBy
      );
    });

    test('applies ARIA label to steps status indicators', () => {
      const wrapper = renderSteps({ steps: stepsWithIconAriaLabel });

      stepsWithIconAriaLabel.forEach((step, index) => {
        expect(
          wrapper.findItems()[index]!.findHeader()!.findByClassName(statusIconStyles.icon)!.getElement()
        ).toHaveAccessibleName(step.statusIconAriaLabel);
      });
    });
  });
});
