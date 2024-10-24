// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ProgressBar, { ProgressBarProps } from '../../../lib/components/progress-bar';
import createWrapper from '../../../lib/components/test-utils/dom';
import ProgressBarWrapper from '../../../lib/components/test-utils/dom/progress-bar';

import liveRegionStyles from '../../../lib/components/live-region/test-classes/styles.css.js';
import styles from '../../../lib/components/progress-bar/styles.css.js';

const standaloneAndKeyvalueVariants: Array<ProgressBarProps.Variant> = ['standalone', 'key-value'];
const allVariants: Array<ProgressBarProps.Variant> = [...standaloneAndKeyvalueVariants, 'flash'];
const statuses: Array<ProgressBarProps.Status> = ['success', 'error'];

const renderProgressBar = (progressBarProps: ProgressBarProps): ProgressBarWrapper => {
  const { container } = render(<ProgressBar {...progressBarProps} />);
  return createWrapper(container).findProgressBar()!;
};

const checkPercentage = (wrapper: ProgressBarWrapper, percentage: number) => {
  expect(wrapper.findPercentageText()!.getElement()).toHaveTextContent(`${percentage}%`);
};

allVariants.forEach(variant => {
  describe(`Progress bar component ${variant} variant`, () => {
    describe('Progress value ', () => {
      test('is 0 if not set', () => {
        const wrapper = renderProgressBar({ variant });
        checkPercentage(wrapper, 0);
      });

      test('is displayed correctly for a value between 0-100', () => {
        const wrapper = renderProgressBar({ variant, value: 26 });
        checkPercentage(wrapper, 26);
      });

      test('is clamped to 100 when > 100', () => {
        const wrapper = renderProgressBar({ variant, value: 1312 });
        checkPercentage(wrapper, 100);
      });

      test('is clamped to 0 when < 0', () => {
        const wrapper = renderProgressBar({ variant, value: -10 });
        checkPercentage(wrapper, 0);
      });

      test('is rounded to ceiling for floating point values > .5', () => {
        const wrapper = renderProgressBar({ variant, value: 36.6 });
        checkPercentage(wrapper, 37);
      });

      test('is rounded to floor for floating point values < .5', () => {
        const wrapper = renderProgressBar({ variant, value: 36.4 });
        checkPercentage(wrapper, 36);
      });
      test('sets aria-hidden to percentage container', () => {
        const wrapper = renderProgressBar({ variant, value: 36 });
        expect(wrapper.findByClassName(styles['percentage-container'])!.getElement()).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });
    describe('Result state ', () => {
      test('is not displayed for value=100 and status="in-progress"', () => {
        const wrapper = renderProgressBar({ variant, value: 100 });
        checkPercentage(wrapper, 100);
        expect(wrapper.findResultText()).toBeNull();
      });
      statuses.forEach(status => {
        describe(`${status} `, () => {
          test('displays result text correctly', () => {
            const wrapper = renderProgressBar({ variant, status, resultText: 'result text' });
            expect(wrapper.findResultText(status)!.getElement()).toHaveTextContent('result text');
          });
        });
      });
    });

    describe('ARIA live region', () => {
      test('is present in the DOM while in-progress', () => {
        renderProgressBar({ variant, value: 0 });
        expect(createWrapper().find('[aria-live]')).not.toBeNull();
      });

      test('contains result text', () => {
        const wrapper = renderProgressBar({ variant, value: 100, status: 'success', resultText: 'Result!' });
        expect(wrapper.find('[aria-live]')!.getElement()).toHaveTextContent('Result!');
      });
    });

    describe('ARIA labels', () => {
      test('attaches aria-label to the progress bar', () => {
        const wrapper = renderProgressBar({ variant, value: 100, ariaLabel: 'aria label' });
        expect(wrapper.find('progress')!.getElement()).toHaveAttribute('aria-label', 'aria label');
      });

      test('attaches aria-labelledby to the progress bar', () => {
        const wrapper = renderProgressBar({ variant, value: 100, ariaLabelledby: 'testid' });
        expect(wrapper.find('progress')!.getElement()).toHaveAttribute(
          'aria-labelledby',
          expect.stringContaining('testid')
        );
      });

      test('ignores aria-labelledby if aria-label is provided', () => {
        const wrapper = renderProgressBar({ variant, value: 100, ariaLabelledby: 'testid', ariaLabel: 'hello' });
        expect(wrapper.find('progress')!.getElement()).not.toHaveAttribute('aria-labelledby');
      });

      describe('aria-describedby', () => {
        test('associate progress element with description prop', () => {
          const wrapper = renderProgressBar({ variant, description: 'dummy description' });
          const descriptionId = screen.queryByText('dummy description')!.id;
          expect(wrapper.find('progress')!.getElement()).toHaveAttribute('aria-describedby', descriptionId);
        });

        test('associate progress element with additionalInfo prop', () => {
          const wrapper = renderProgressBar({ variant, additionalInfo: 'dummy additional info' });
          const additionalInfoId = screen.queryByText('dummy additional info')!.id;
          expect(wrapper.find('progress')!.getElement()).toHaveAttribute('aria-describedby', additionalInfoId);
        });

        test('associate progress element with ariaDescribedby prop', () => {
          const wrapper = renderProgressBar({
            variant,
            ariaDescribedby: 'dummy-reference-element-id',
          });
          expect(wrapper.find('progress')!.getElement()).toHaveAttribute(
            'aria-describedby',
            'dummy-reference-element-id'
          );
        });

        test('associate progress element with description, additionalInfo and ariaDescribedby props', () => {
          const wrapper = renderProgressBar({
            variant,
            description: 'dummy description',
            additionalInfo: 'dummy additional info',
            ariaDescribedby: 'dummy-reference-element-id',
          });
          const descriptionId = screen.queryByText('dummy description')!.id;
          const additionalInfoId = screen.queryByText('dummy additional info')!.id;
          const ariaDescribedByValue = wrapper.find('progress')!.getElement().getAttribute('aria-describedby');
          expect(ariaDescribedByValue).toContain(descriptionId);
          expect(ariaDescribedByValue).toContain(additionalInfoId);
          expect(ariaDescribedByValue).toContain('dummy-reference-element-id');
        });

        test('is ignored when additionalInfo, description and ariaDescribedby props are not present', () => {
          const wrapper = renderProgressBar({ variant, value: 100 });
          expect(wrapper.find('progress')!.getElement()).not.toHaveAttribute('aria-describedby');
        });
      });
    });
  });
});
describe('Progress bar component flash variant - Result state', () => {
  test('raises a warning if resultButtonText is set', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    renderProgressBar({
      variant: 'flash',
      status: 'error',
      resultText: 'result text',
      resultButtonText: 'Retry',
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[AwsUi] [ProgressBar] The `resultButtonText` is ignored if you set `variant="flash"`, and the result button is not displayed. Use the `buttonText` property and the `onButtonClick` event listener of the flashbar item in which the progress bar component is embedded.'
    );
    consoleWarnSpy.mockRestore();
  });
  statuses.forEach(status => {
    test('does not display result button', () => {
      const wrapper = renderProgressBar({
        variant: 'flash',
        status,
        resultText: 'result text',
        resultButtonText: 'Retry',
      });
      expect(wrapper.findResultButton()).toBeNull();
    });
    test('does not display status indicator', () => {
      const wrapper = renderProgressBar({
        variant: 'flash',
        status,
        resultText: 'result text',
      });
      expect(createWrapper(wrapper.getElement()).findStatusIndicator()).toBeNull();
    });
  });
});

standaloneAndKeyvalueVariants.forEach(variant => {
  statuses.forEach(status => {
    describe(`Progress bar component ${variant} variant - Result state`, () => {
      test('displays status indicator', () => {
        const wrapper = renderProgressBar({
          variant,
          status,
          resultText: 'result text',
        });
        expect(createWrapper(wrapper.getElement()).findStatusIndicator()).not.toBeNull();
      });
      test('displays result button when resultButtonText is set', () => {
        const wrapper = renderProgressBar({
          variant,
          status,
          resultText: 'result text',
          resultButtonText: 'Retry',
        });
        expect(wrapper.findResultButton()!.findTextRegion()!.getElement()).toHaveTextContent('Retry');
      });
      test('does not display result button when resultButtonText is not set', () => {
        const wrapper = renderProgressBar({
          variant,
          status,
          resultText: 'result text',
        });
        expect(wrapper.findResultButton()).toBeNull();
      });
      test('fires onResultButtonClick event when clicking the result button', () => {
        const onResultButtonClick = jest.fn();

        const wrapper = renderProgressBar({
          variant,
          status,
          resultText: 'result text',
          resultButtonText: 'Retry',
          onResultButtonClick,
        });
        expect(onResultButtonClick).toHaveBeenCalledTimes(0);
        wrapper.findResultButton()!.click();
        expect(onResultButtonClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('Progress updates', () => {
  test('Announced progress value changes not more often then given interval', () => {
    jest.useFakeTimers(); // Mock timers
    const label = 'progress';
    const { container, rerender } = render(<ProgressBar label={label} value={0} />);
    const wrapper = createWrapper(container).findProgressBar()!;

    expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(`${label}: 0%`);
    rerender(<ProgressBar label={label} value={1} />);

    // live region has an old value
    expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(`${label}: 0%`);
    rerender(<ProgressBar label={label} value={2} />);

    // 6 seconds passed, live region has a new value
    jest.advanceTimersByTime(6000);
    expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(`${label}: 2%`);
  });

  test('correctly extracts react node label for announcement', () => {
    const wrapper = renderProgressBar({
      label: (
        <span>
          Text-<i>optional</i>
        </span>
      ),
      value: 10,
      status: 'in-progress',
    });
    expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe('Text-optional: 10%');
  });

  test('renders additional info correctly', () => {
    const wrapper = renderProgressBar({ additionalInfo: 'additional info' });

    expect(wrapper.findAdditionalInfo()!.getElement().textContent).toBe('additional info');
  });
});
