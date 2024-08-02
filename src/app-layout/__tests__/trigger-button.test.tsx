// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { ButtonProps } from '../../../lib/components/button';
import { IconProps } from '../../../lib/components/icon/interfaces.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import TriggerButton, { TriggerButtonProps } from '../../../lib/components/app-layout/visual-refresh/trigger-button';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

import { act, render, fireEvent } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';

const testIf = (condition: boolean) => (condition ? test : test.skip);

const mockDrawerId = 'mock-drawer-id';
const mockTestId = `awsui-app-layout-trigger-${mockDrawerId}`;
const mockTooltipText = 'Mock Tooltip';
const mockProps = {
  ariaLabel: 'Aria label',
  className: 'class-from-props',
  iconName: 'bug',
  testId: mockTestId,
  tooltipText: mockTooltipText,
  hasTooltip: true,
};
const mockOtherEl = {
  class: 'other-el-class',
  text: 'other-element',
};

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

async function renderTriggerButton(props: Partial<TriggerButtonProps> = {}, ref: React.Ref<ButtonProps.Ref>) {
  const renderProps = { ...mockProps, ...props };
  const { container, rerender, getByTestId, getByText } = render(
    <div>
      <TriggerButton {...(renderProps as TriggerButtonProps)} ref={ref} />
      <span className={mockOtherEl.class}>{mockOtherEl.text}</span>
    </div>
  );
  const wrapper = createWrapper(container).findByClassName(visualRefreshStyles['trigger-wrapper'])!;
  await delay();
  return { wrapper, rerender, getByTestId, getByText };
}

describe.each([true, false])('Toolbar trigger-button with isMobile=%s', isMobile => {
  test('renders correctly with without tooltip nor badge', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        isMobile,
        hasTooltip: false,
        badge: false,
      },
      ref as any
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper.findByClassName(visualRefreshStyles.dot)).toBeNull();
    expect(wrapper.findBadge()).toBeNull();
    expect(wrapper!.findAllByClassName(visualRefreshStyles['trigger-tooltip']).length).toEqual(0);
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  test('renders correctly with iconName', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        isMobile,
      },
      ref as any
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  test('renders correctly with iconSvg', async () => {
    const iconTestId = 'icon-test-id';
    const icon = (
      <svg data-testid={iconTestId} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    );
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        iconSvg: icon,
        isMobile,
      },
      ref as any
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
    expect(getByTestId(iconTestId)).toBeTruthy();
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  test.each([true, false])('renders correctly and with when disabled is %s', async disabledValue => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const mockClickSpy = jest.fn();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        isMobile,
        disabled: disabledValue,
        onClick: mockClickSpy,
      },
      ref as any
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button')!;
    expect(getByTestId(mockTestId)).toBeTruthy();
    button.click();
    expect(mockClickSpy).toBeCalledTimes(disabledValue ? 0 : 1);
  });

  test('renders an empty button when no iconName and iconSVG prop', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper } = await renderTriggerButton(
      {
        iconName: '' as IconProps.Name,
        isMobile,
      },
      ref as any
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(button).toBeTruthy();
    expect(button?.findIcon()).toBeNull();
  });

  testIf(!isMobile)('renders correctly with badge using dot class on desktop', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        badge: true,
        isMobile,
      },
      ref as any
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper.findByClassName(visualRefreshStyles.dot)).toBeTruthy();
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  test('renders correctly with ariaLabel as fallback for tooltipText', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByText, getByTestId } = await renderTriggerButton(
      {
        isMobile,
        tooltipText: '',
      },
      ref as any
    );
    expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(() => getByText(mockTooltipText)).toThrow();
    expect(() => getByText(mockProps.ariaLabel)).toThrow();
    fireEvent.pointerEnter(wrapper!.getElement());
    expect(getByText(mockProps.ariaLabel)).toBeTruthy();
  });

  describe('Trigger wrapper events', () => {
    test('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.pointerEnter(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.pointerLeave(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    test('Does not show tooltip on pointerEnter when hasTooltip is false', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
          hasTooltip: false,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.pointerEnter(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    test('Does not show tooltip on pointerEnter when there is no arialLabel nor tooltipText', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByTestId } = await renderTriggerButton(
        {
          isMobile,
          ariaLabel: '',
          tooltipText: '',
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      fireEvent.pointerEnter(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
    });

    test('Shows tooltip on focus and removes on key escape', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.keyDown(wrapper!.getElement(), { key: 'Escape', code: KeyCode.escape });
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    test('Does not show tooltip on focus when hasTooltip is false', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
          hasTooltip: false,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    test('Does not show tooltip on focus when no ariaLabel nor tooltipText', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByTestId } = await renderTriggerButton(
        {
          isMobile,
          ariaLabel: '',
          tooltipText: '',
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      fireEvent.focus(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
    });

    test('Shows tooltip on focus and removes on blur', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.blur(wrapper!.getElement());
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    test('Shows tooltip on focus and removes on outside click', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const { wrapper, getByText, getByTestId } = await renderTriggerButton(
        {
          isMobile,
        },
        ref as any
      );
      expect(getByTestId(mockTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.click(getByText(mockOtherEl.text));
      expect(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip'])).toBeNull();
    });
  });

  test('Is focusable using the forwarded ref and tooltip does not show', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const mockTooltipText = 'Mock Tooltip';
    const { wrapper, getByTestId, getByText } = await renderTriggerButton(
      {
        isMobile,
      },
      ref as any
    );
    expect(getByTestId(mockTestId)).toBeTruthy();
    const button = wrapper!.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(document.activeElement).not.toBe(button!.getElement());
    (ref.current as any)?.focus();
    expect(document.activeElement).toBe(button!.getElement());
    expect(() => getByText(mockTooltipText)).toThrow();
  });
});
