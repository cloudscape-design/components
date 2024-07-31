// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { ButtonProps } from '../../../lib/components/button';
import { IconProps } from '../../../lib/components/icon/interfaces.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import TriggerButton, { TriggerButtonProps } from '../../../lib/components/app-layout/visual-refresh/trigger-button';
import triggerButtonStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

import { act, render, fireEvent } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';

const mockDrawerId = 'mock-drawer-id';
const mockTestId = `awsui-app-layout-trigger-${mockDrawerId}`;
const mockProps = {
  ariaLabel: 'Aria label',
  className: 'class-from-props',
  iconName: 'bug',
  testId: mockTestId,
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
  const wrapper = createWrapper(container).findByClassName(triggerButtonStyles['trigger-wrapper'])!;
  await delay();
  return { wrapper, rerender, getByTestId, getByText };
}

describe.each([true, false])('Toolbar trigger-button with isMobile=%s', isMobile => {
  it('renders correctly with iconName', async () => {
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

  it('renders correctly with iconSvg', async () => {
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

  it.each([true, false])('renders correctly and with when disabled is %s', async disabledValue => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const mockClickSpy = jest.fn();
    const { wrapper } = await renderTriggerButton(
      {
        isMobile,
        disabled: disabledValue,
        onClick: mockClickSpy,
      },
      ref as any
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button')!;
    button.click();
    expect(mockClickSpy).toBeCalledTimes(disabledValue ? 0 : 1);
  });

  it.skip('does not render without either an iconName or iconSVG prop', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { wrapper, getByTestId } = await renderTriggerButton(
      {
        iconName: '' as IconProps.Name,
        isMobile,
      },
      ref as any
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(button).toBeTruthy();
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  it('renders correctly with badge', async () => {
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
    expect(wrapper.findByClassName(triggerButtonStyles.dot)).toBeTruthy();
    expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
  });

  describe('Trigger wrapper events', () => {
    it('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
          isMobile,
          badge: true,
        },
        ref as any
      );
      expect(wrapper!.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.pointerEnter(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.pointerLeave(wrapper!.getElement());
      expect(wrapper.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    it('Shows tooltip on pointerEnter and closes on e', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
          isMobile,
          badge: true,
        },
        ref as any
      );
      expect(wrapper!.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.pointerEnter(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.pointerLeave(wrapper!.getElement());
      expect(wrapper.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    it('Shows tooltip on focus and removes on key escape', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
          isMobile,
          badge: true,
        },
        ref as any
      );
      expect(wrapper!.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.keyDown(wrapper!.getElement(), { key: 'Escape', code: KeyCode.escape });
      expect(wrapper.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });

    it('Shows tooltip on focus and removes on blur', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
          isMobile,
          badge: true,
        },
        ref as any
      );
      expect(wrapper!.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
      fireEvent.focus(wrapper!.getElement());
      expect(getByText(mockTooltipText)).toBeTruthy();
      fireEvent.blur(wrapper!.getElement());
      expect(wrapper.findByClassName('awsui-app-layout-trigger-tooltip')).toBeNull();
      expect(() => getByText(mockTooltipText)).toThrow();
    });
  });

  it('Is focusable using the forwarded ref and tooltip does not show', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const mockTooltipText = 'Mock Tooltip';
    const { wrapper, getByTestId, getByText } = await renderTriggerButton(
      {
        iconName: 'bug',
        isMobile,
        tooltipText: mockTooltipText,
      },
      ref as any
    );

    const button = wrapper!.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(document.activeElement).not.toBe(button!.getElement());
    (ref.current as any)?.focus();
    expect(document.activeElement).toBe(button!.getElement());
    expect(() => getByText(mockTooltipText)).toThrow();
  });
});
