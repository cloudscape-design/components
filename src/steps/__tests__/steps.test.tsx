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

  describe('orientation', () => {
    test('renders with default vertical orientation', () => {
      const wrapper = renderSteps({ steps: successfullSteps });

      expect(wrapper.getElement()).not.toHaveClass(stepsStyles.horizontal);
    });

    test('renders with horizontal orientation when explicitly set', () => {
      const wrapper = renderSteps({
        steps: successfullSteps,
        orientation: 'horizontal',
      });

      expect(wrapper.getElement()).toHaveClass(stepsStyles.horizontal);
    });

    test('renders with vertical orientation', () => {
      const wrapper = renderSteps({
        steps: successfullSteps,
        orientation: 'vertical',
      });

      expect(wrapper.getElement()).not.toHaveClass(stepsStyles.horizontal);
    });
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
    test('renders annotation content in vertical orientation', () => {
      const wrapper = renderSteps({ steps: [{ header: 'Event', status: 'log', annotation: '10:30' }] });

      expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
    });

    test('returns null when annotation is not provided', () => {
      const wrapper = renderSteps({ steps: [{ header: 'Event', status: 'success' }] });

      expect(wrapper.findItems()[0].findAnnotation()).toBeNull();
    });

    test('uses a shared leading column when any vertical step has an annotation', () => {
      const wrapper = renderSteps({
        steps: [
          { header: 'First', status: 'log', annotation: '10:30' },
          { header: 'Second', status: 'log' },
        ],
      });

      expect(wrapper.findByClassName(stepsStyles['with-annotation'])).not.toBeNull();
      expect(wrapper.findItems()[0].findAnnotation()).not.toBeNull();
      expect(wrapper.findItems()[1].findAnnotation()).toBeNull();
    });

    test('renders annotation content in horizontal orientation', () => {
      const wrapper = renderSteps({
        steps: [{ header: 'Event', status: 'log', annotation: '10:30' }],
        orientation: 'horizontal',
      });

      const item = wrapper.findItems()[0];
      const annotation = item.findAnnotation()!.getElement();
      const header = item.findHeader()!.getElement();

      expect(annotation).toHaveTextContent('10:30');
      expect(annotation.nextElementSibling).toBe(header);
    });

    test.each(['vertical', 'horizontal'] as const)(
      'renders annotation for custom steps in %s orientation',
      orientation => {
        const wrapper = renderSteps({
          steps: [{ header: 'Event', status: 'log', annotation: '10:30' }],
          orientation,
          renderStep: (step: StepsProps.Step) => ({ header: <span>Custom: {step.header}</span> }),
        });

        expect(wrapper.findItems()[0].findAnnotation()!.getElement()).toHaveTextContent('10:30');
      }
    );

    test('renders annotation values of different lengths in the shared vertical column', () => {
      const shortValue = '9:00 AM';
      const longValue = 'December 31, 2024, 11:59:59 PM (UTC+14:00)';
      const wrapper = renderSteps({
        steps: [
          { header: 'Short timestamp', status: 'log', annotation: shortValue },
          { header: 'Long timestamp', status: 'log', annotation: longValue },
        ],
      });

      const first = wrapper.findItems()[0].findAnnotation()!.getElement();
      const second = wrapper.findItems()[1].findAnnotation()!.getElement();

      expect(first).toHaveTextContent(shortValue);
      expect(second).toHaveTextContent(longValue);
      expect(second.textContent).toBe(longValue);
    });
  });
});
