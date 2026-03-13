// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FormField, { FormFieldProps } from '../../../lib/components/form-field';
import createWrapper, { FormFieldWrapper } from '../../../lib/components/test-utils/dom';

import screenreaderOnlyStyles from '../../../lib/components/internal/components/screenreader-only/styles.css.js';
import liveRegionStyles from '../../../lib/components/live-region/test-classes/styles.css.js';

function renderFormField(props: FormFieldProps = {}) {
  const { container, rerender } = render(<FormField {...props} />);
  const wrapper = createWrapper(container).findFormField()!;
  return { wrapper, rerender: (props: FormFieldProps) => rerender(<FormField {...props} />) };
}

function findDebouncedCharacterCount(wrapper: FormFieldWrapper): HTMLElement | undefined {
  return wrapper.findByClassName(screenreaderOnlyStyles.root)?.getElement();
}

describe('FormField component', () => {
  describe('Basic rendering', () => {
    [
      { slot: 'label', finder: (wrapper: FormFieldWrapper) => wrapper.findLabel() },
      { slot: 'description', finder: (wrapper: FormFieldWrapper) => wrapper.findDescription() },
      { slot: 'info', finder: (wrapper: FormFieldWrapper) => wrapper.findInfo() },
      { slot: 'constraintText', finder: (wrapper: FormFieldWrapper) => wrapper.findConstraint() },
      { slot: 'errorText', finder: (wrapper: FormFieldWrapper) => wrapper.findError() },
      { slot: 'warningText', finder: (wrapper: FormFieldWrapper) => wrapper.findWarning() },
      { slot: 'children', finder: (wrapper: FormFieldWrapper) => wrapper.findControl() },
      { slot: 'secondaryControl', finder: (wrapper: FormFieldWrapper) => wrapper.findSecondaryControl() },
    ].forEach(({ slot, finder }) => {
      describe(`${slot}`, () => {
        test(`displays empty ${slot} when not set`, () => {
          const { wrapper } = renderFormField({});
          expect(finder(wrapper)).toBeNull();
        });

        test(`displays empty ${slot} when set to empty`, () => {
          const props: any = {};
          props[slot] = '';
          const { wrapper } = renderFormField(props);
          expect(finder(wrapper)).toBeNull();
        });

        test(`renders a ${slot} when a string is passed`, () => {
          const value = 'this is a string';
          const props: any = {};
          props[slot] = value;

          const { wrapper } = renderFormField(props);
          expect(finder(wrapper)?.getElement()).toHaveTextContent(value);
        });

        test(`renders a ${slot} when jsx is passed`, () => {
          const value = (
            <div>
              this is a <strong>formatted</strong> value
            </div>
          );
          const props: any = {};
          props[slot] = value;
          const { wrapper } = renderFormField(props);

          expect(finder(wrapper)?.getElement()).toHaveTextContent('this is a formatted value');
          expect(finder(wrapper)?.getElement()).toContainHTML('<div>this is a <strong>formatted</strong> value</div>');
        });

        test(`${slot} re-renders content correctly`, () => {
          let wrapper: FormFieldWrapper;

          const renderResult = render(<FormField />);
          wrapper = createWrapper(renderResult.container).findFormField()!;
          expect(finder(wrapper)).toBeNull();

          const value = 'this is a string';
          const props: any = {};
          props[slot] = value;

          renderResult.rerender(<FormField {...props} />);
          wrapper = createWrapper(renderResult.container).findFormField()!;
          expect(finder(wrapper)?.getElement()).not.toBeNull();
        });
      });
    });
  });

  test('label is rendered with semantic DOM element', () => {
    const testLabel = 'Label Unit Test';

    const { wrapper } = renderFormField({
      label: testLabel,
    });

    const labelElement = wrapper.findLabel();
    expect(labelElement).not.toBeNull();
    expect(labelElement?.getElement()).toHaveTextContent(testLabel);
    expect(labelElement?.getElement().tagName).toBe('LABEL');
  });

  test('errorIcon has an accessible text alternative', () => {
    const errorText = 'Yikes, that is just plan wrong';
    const errorIconAriaLabel = 'Error';
    const { wrapper } = renderFormField({
      errorText,
      i18nStrings: { errorIconAriaLabel },
    });

    const errorLabel = wrapper.find(`:scope [aria-label]`);

    expect(errorLabel?.getElement()).not.toBeNull();
    expect(errorLabel?.getElement()).toHaveAttribute('aria-label', errorIconAriaLabel);
  });

  test('warningIcon has an accessible text alternative', () => {
    const warningText = 'You sure?';
    const warningIconAriaLabel = 'Warning';
    const { wrapper } = renderFormField({
      warningText,
      i18nStrings: { warningIconAriaLabel },
    });

    const warningLabel = wrapper.find(`:scope [aria-label]`);

    expect(warningLabel?.getElement()).not.toBeNull();
    expect(warningLabel?.getElement()).toHaveAttribute('aria-label', warningIconAriaLabel);
  });

  test('constraintText region displays constraint content text when error-text is also set', () => {
    const constraintText = 'let this be a lesson to you';
    const errorText = 'wrong, do it again';
    const { wrapper } = renderFormField({
      constraintText,
      errorText,
    });
    expect(wrapper.findConstraint()?.getElement()).toHaveTextContent(constraintText);
    expect(wrapper.findError()?.getElement()).toHaveTextContent(errorText);
  });

  test('constraintText region displays constraint content text when warning-text is also set', () => {
    const constraintText = 'think twice';
    const warningText = 'warning you, check once again';
    const { wrapper } = renderFormField({
      constraintText,
      warningText,
    });
    expect(wrapper.findConstraint()?.getElement()).toHaveTextContent(constraintText);
    expect(wrapper.findWarning()?.getElement()).toHaveTextContent(warningText);
  });

  describe('live-region', () => {
    test('Should render live region for error text', () => {
      const errorText = 'Nope do it again';
      const errorIconAriaLabel = 'Error';
      renderFormField({ errorText, i18nStrings: { errorIconAriaLabel } });

      // Since live region in this componennt uses 'source' prop
      // it is too complex to successfully assert the aria live message
      expect(createWrapper().findByClassName(liveRegionStyles.announcer)?.getElement()).toBeInTheDocument();
    });

    test('Should render live region for warning text', () => {
      const warningText = 'Are you sure?';
      const warningIconAriaLabel = 'Warning';
      renderFormField({ warningText, i18nStrings: { warningIconAriaLabel } });

      // Since live region in this componennt uses 'source' prop
      // it is too complex to successfully assert the aria live message
      expect(createWrapper().findByClassName(liveRegionStyles.announcer)?.getElement()).toBeInTheDocument();
    });
  });

  describe('characterCountText', () => {
    test('does not render wrapper element when not set', () => {
      const { wrapper } = renderFormField({});
      expect(wrapper.findCharacterCount()).toBeNull();
    });

    test('does not render wrapper element when set to empty', () => {
      const { wrapper } = renderFormField({ characterCountText: '' });
      expect(wrapper.findCharacterCount()).toBeNull();
    });

    test('renders characterCountText when a string is passed', () => {
      const { wrapper } = renderFormField({ characterCountText: 'this is a string' });
      expect(wrapper.findCharacterCount()!.getElement()).toHaveTextContent('this is a string');
    });

    describe('debouncing', () => {
      const DEBOUNCE_TIME_MS = 1000;

      beforeEach(() => jest.useFakeTimers());
      afterEach(() => jest.useRealTimers());

      test('renders characterCountText directly on initial render', () => {
        const { wrapper } = renderFormField({ characterCountText: 'this is a string' });
        expect(wrapper.findCharacterCount()!.getElement()).toHaveTextContent('this is a string');
      });

      test("wrapper.findCharacterCount() doesn't return the debounced version of the slot", () => {
        const { wrapper, rerender } = renderFormField({ characterCountText: 'this is a string' });
        expect(wrapper.findCharacterCount()!.getElement()).toHaveTextContent('this is a string');
        rerender({ characterCountText: 'another string' });
        expect(wrapper.findCharacterCount()!.getElement()).toHaveTextContent('another string');
        rerender({ characterCountText: '' });
        expect(wrapper.findCharacterCount()).toBeNull();
      });

      test('delays updates until debounce duration', async () => {
        const { wrapper, rerender } = renderFormField({ characterCountText: 'Character count: 5/10' });
        rerender({ characterCountText: 'Character count: 6/10' });
        expect(findDebouncedCharacterCount(wrapper)!).toHaveTextContent('Character count: 5/10');
        await jest.advanceTimersByTimeAsync(DEBOUNCE_TIME_MS);
        expect(findDebouncedCharacterCount(wrapper)!).toHaveTextContent('Character count: 6/10');
      });

      test('restarts timer if a new update happened during debounce duration', async () => {
        const { wrapper, rerender } = renderFormField({ characterCountText: 'Character count: 5/10' });
        // Rerender and wait 500ms: the text should not update
        rerender({ characterCountText: 'Character count: 6/10' });
        await jest.advanceTimersByTimeAsync(DEBOUNCE_TIME_MS / 2);
        expect(findDebouncedCharacterCount(wrapper)!).toHaveTextContent('Character count: 5/10');
        // Rerender and wait 500ms: the text should not update
        rerender({ characterCountText: 'Character count: 7/10' });
        await jest.advanceTimersByTimeAsync(DEBOUNCE_TIME_MS / 2);
        expect(findDebouncedCharacterCount(wrapper)!).toHaveTextContent('Character count: 5/10');
        // Wait another 500ms (1s since last update): the text should update
        await jest.advanceTimersByTimeAsync(DEBOUNCE_TIME_MS / 2);
        expect(findDebouncedCharacterCount(wrapper)!).toHaveTextContent('Character count: 7/10');
      });
    });
  });
});
