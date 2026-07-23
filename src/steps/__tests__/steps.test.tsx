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

const successfulSteps: ReadonlyArray<StepsProps.Step> = [
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

const stepsForCustomRender: ReadonlyArray<StepsProps.Step> = [
  {
    header: 'Checked Cross Region Consent',
    status: 'success',
  },
  {
    header: 'Analyzing security rules',
    status: 'loading',
    details: 'Step details',
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
    const wrapper = renderSteps({ steps: successfulSteps });

    expect(wrapper.findItems()).toHaveLength(4);
  });

  test('renders correct steps headers', () => {
    const wrapper = renderSteps({ steps: successfulSteps });

    expect(wrapper.findItems()[0]!.findHeader()!.getElement()).toHaveTextContent('Listed EC2 instances');
    expect(wrapper.findItems()[1]!.findHeader()!.getElement()).toHaveTextContent('Gathered Security Group IDs');
    expect(wrapper.findItems()[2]!.findHeader()!.getElement()).toHaveTextContent('Checked Cross Region Consent');
    expect(wrapper.findItems()[3]!.findHeader()!.getElement()).toHaveTextContent('Analyzing security rules');
  });

  test('renders correct steps details', () => {
    const wrapper = renderSteps({ steps: successfulSteps });

    expect(wrapper.findItems()[0]!.findDetails()!.getElement()).toHaveTextContent('EC2 Instances IDs:');
    expect(wrapper.findItems()[1]!.findDetails()!.getElement()).toHaveTextContent('Security Groups IDs:');
    expect(wrapper.findItems()[2]!.findDetails()).toBeNull();
    expect(wrapper.findItems()[3]!.findDetails()).toBeNull();
  });

  describe('Accessibility', () => {
    test('applies ARIA label to steps', () => {
      const testAriaLabel = 'Test aria label';
      const wrapper = renderSteps({ steps: successfulSteps, ariaLabel: testAriaLabel });

      expect(wrapper.findByClassName(stepsStyles.list)!.getElement()).toHaveAccessibleName(testAriaLabel);
    });

    test('applies ARIA labelledby to steps', () => {
      const testAriaLabelledBy = 'test-id';
      const wrapper = renderSteps({ steps: successfulSteps, ariaLabelledby: testAriaLabelledBy });

      expect(wrapper.findByClassName(stepsStyles.list)!.getElement()).toHaveAttribute(
        'aria-labelledby',
        testAriaLabelledBy
      );
    });

    test('applies ARIA describedby to steps', () => {
      const testAriaDescribedBy = 'test-id';
      const wrapper = renderSteps({ steps: successfulSteps, ariaDescribedby: testAriaDescribedBy });

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

  describe('orientation', () => {
    test('renders with default vertical orientation', () => {
      const wrapper = renderSteps({ steps: successfulSteps });

      expect(wrapper.getElement()).not.toHaveClass(stepsStyles.horizontal);
    });

    test('renders with horizontal orientation when explicitly set', () => {
      const wrapper = renderSteps({
        steps: successfulSteps,
        orientation: 'horizontal',
      });

      expect(wrapper.getElement()).toHaveClass(stepsStyles.horizontal);
    });

    test('renders with vertical orientation', () => {
      const wrapper = renderSteps({
        steps: successfulSteps,
        orientation: 'vertical',
      });

      expect(wrapper.getElement()).not.toHaveClass(stepsStyles.horizontal);
    });
  });

  describe('connectorLines', () => {
    test.each([
      { orientation: 'vertical', connectorLines: undefined },
      { orientation: 'horizontal', connectorLines: undefined },
      { orientation: 'vertical', connectorLines: 'visible' },
      { orientation: 'horizontal', connectorLines: 'visible' },
    ] as const)(
      'renders visible connector lines when orientation=$orientation and connectorLines=$connectorLines',
      ({ orientation, connectorLines }) => {
        const wrapper = renderSteps({ steps: successfulSteps, orientation, connectorLines });
        expect(wrapper.findAllByClassName(stepsStyles.connector)).toHaveLength(4);
        expect(wrapper.findAllByClassName(stepsStyles['connector-hidden'])).toHaveLength(0);
      }
    );

    test.each([{ orientation: 'vertical' }, { orientation: 'horizontal' }] as const)(
      'hides connector lines by marking every connector when orientation=$orientation and connectorLines="none"',
      ({ orientation }) => {
        const wrapper = renderSteps({ steps: successfulSteps, orientation, connectorLines: 'none' });
        expect(wrapper.findAllByClassName(stepsStyles.connector)).toHaveLength(4);
        expect(wrapper.findAllByClassName(stepsStyles['connector-hidden'])).toHaveLength(4);
      }
    );

    test.each([{ orientation: 'vertical' }, { orientation: 'horizontal' }] as const)(
      'hides connector lines also when custom steps are used and orientation=$orientation',
      ({ orientation }) => {
        const wrapper = renderSteps({
          steps: stepsForCustomRender,
          orientation,
          connectorLines: 'none',
          renderStep: (step: StepsProps.Step) => ({ header: step.header, details: step.details }),
        });
        expect(wrapper.findAllByClassName(stepsStyles.connector)).toHaveLength(2);
        expect(wrapper.findAllByClassName(stepsStyles['connector-hidden'])).toHaveLength(2);
      }
    );
  });

  describe('renderStep', () => {
    const customRenderStep = (step: StepsProps.Step) => ({
      header: <span data-testid="custom-header">Custom: {step.header}</span>,
      details: step.details ? <div data-testid="custom-details">Details: {step.details}</div> : undefined,
      icon: <span data-testid="custom-icon">icon</span>,
    });

    test('renders custom content when using renderStep', () => {
      const wrapper = renderSteps({ steps: stepsForCustomRender, renderStep: customRenderStep });

      const customHeaders = wrapper.findAll('[data-testid="custom-header"]');
      expect(customHeaders).toHaveLength(stepsForCustomRender.length);

      expect(customHeaders[0].getElement()).toHaveTextContent('Checked Cross Region Consent');
      expect(customHeaders[1].getElement()).toHaveTextContent('Analyzing security rules');
    });

    test('renders custom details when using renderStep', () => {
      const wrapper = renderSteps({ steps: stepsForCustomRender, renderStep: customRenderStep });

      const customDetails = wrapper.findAll('[data-testid="custom-details"]');
      // Only last step has details
      expect(customDetails).toHaveLength(1);
      expect(customDetails[0].getElement()).toHaveTextContent('Step details');
    });

    test('renders custom icon when using renderStep', () => {
      const wrapper = renderSteps({ steps: stepsForCustomRender, renderStep: customRenderStep });

      const customHeaders = wrapper.findAll('[data-testid="custom-icon"]');
      expect(customHeaders).toHaveLength(stepsForCustomRender.length);
    });

    test('renders custom content in horizontal mode', () => {
      const wrapper = renderSteps({
        steps: stepsForCustomRender,
        orientation: 'horizontal',
        renderStep: customRenderStep,
      });

      expect(wrapper.findAll('[data-testid="custom-header"]')).not.toHaveLength(0);
      expect(wrapper.findAll('[data-testid="custom-details"]')).not.toHaveLength(0);
      expect(wrapper.findAll('[data-testid="custom-icon"]')).not.toHaveLength(0);
    });

    test('does not render status indicators when using renderStep with icon', () => {
      const wrapper = renderSteps({ steps: stepsForCustomRender, renderStep: customRenderStep });

      expect(wrapper.findItems()[0].findHeader()?.findStatusIndicator()).toBeNull();
    });
  });

  describe('annotation', () => {
    test('renders annotation content', () => {
      const wrapper = renderSteps({ steps: [{ header: 'Event', status: 'log', annotation: '10:30' }] });

      expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
    });

    test('does not render annotation when not provided', () => {
      const wrapper = renderSteps({ steps: [{ header: 'Event', status: 'success' }] });

      expect(wrapper.findItems()[0].findAnnotation()).toBeNull();
    });

    test('renders annotation content in horizontal mode', () => {
      const wrapper = renderSteps({
        steps: [{ header: 'Event', status: 'log', annotation: '10:30' }],
        orientation: 'horizontal',
      });

      expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
    });

    test('renders annotation when using renderStep', () => {
      const wrapper = renderSteps({
        steps: [{ header: 'Event', status: 'log', annotation: '10:30' }],
        renderStep: (step: StepsProps.Step) => ({ header: <span>Custom: {step.header}</span> }),
      });

      expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
    });

    test('renders annotation in horizontal mode when using renderStep', () => {
      const wrapper = renderSteps({
        steps: [{ header: 'Event', status: 'log', annotation: '10:30' }],
        orientation: 'horizontal',
        renderStep: (step: StepsProps.Step) => ({ header: <span>Custom: {step.header}</span> }),
      });

      expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
    });
  });
});
