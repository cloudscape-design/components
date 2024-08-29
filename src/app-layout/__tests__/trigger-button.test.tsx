// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import * as AllContext from '../../../lib/components/app-layout/visual-refresh/context.js';
import VisualRefreshTriggerButton, {
  TriggerButtonProps as VisualRefreshTriggerButtonProps,
} from '../../../lib/components/app-layout/visual-refresh/trigger-button';
import VisualRefreshToolbarTriggerButton, {
  TriggerButtonProps as VisualRefreshToolbarTriggerButtonProps,
} from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/index.js';
import { ButtonProps } from '../../../lib/components/button';
import { IconProps } from '../../../lib/components/icon/interfaces.js';
import createWrapper from '../../../lib/components/test-utils/dom';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';

const MockUseAppLayoutInternals = jest.spyOn(AllContext, 'useAppLayoutInternals').mockName('useAppLayoutInternals');

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
const mockUseLayoutInternalValues = {
  hasOpenDrawer: false,
  isMobile: false,
};

const mockEventBubble = {
  bubbles: true,
  isTrusted: true,
  relatedTarget: null,
};

const mockEventBubbleWithShiftFocus = {
  ...mockEventBubble,
  relatedTarget: {
    dataset: {
      shiftFocus: 'last-opened-toolbar-trigger-button',
    },
  },
};

const renderVisualRefreshTriggerButton = (
  props: Partial<VisualRefreshTriggerButtonProps> = {},
  useAppLayoutInternalsValues: Partial<AllContext.AppLayoutInternals> = {},
  ref: React.Ref<ButtonProps.Ref>
) => {
  MockUseAppLayoutInternals.mockReturnValue({
    ...mockUseLayoutInternalValues,
    ...useAppLayoutInternalsValues,
  } as AllContext.AppLayoutInternals);
  const renderProps = { ...mockProps, ...props };
  const { container, rerender, getByTestId, getByText } = render(
    <div>
      <VisualRefreshTriggerButton {...(renderProps as VisualRefreshTriggerButtonProps)} ref={ref} />
      <span className={mockOtherEl.class}>{mockOtherEl.text}</span>
    </div>
  );
  const wrapper = createWrapper(container).findByClassName(visualRefreshStyles['trigger-wrapper'])!;
  return { wrapper, rerender, getByTestId, getByText };
};

const renderVisualRefreshToolbarTriggerButton = (
  props: Partial<VisualRefreshToolbarTriggerButtonProps> = {},
  ref: React.Ref<ButtonProps.Ref>
) => {
  const renderProps = { ...mockProps, ...props };
  const { container, rerender, getByTestId, getByText } = render(
    <div>
      <VisualRefreshToolbarTriggerButton {...(renderProps as VisualRefreshToolbarTriggerButtonProps)} ref={ref} />
      <span className={mockOtherEl.class}>{mockOtherEl.text}</span>
    </div>
  );
  const wrapper = createWrapper(container).findByClassName(toolbarTriggerButtonStyles['trigger-wrapper'])!;
  return { wrapper, rerender, getByTestId, getByText };
};

describe('Visual refresh trigger-button (not in appLayoutWidget toolbar)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe.each([true, false])('Toolbar trigger-button with isMobile=%s', isMobile => {
    describe.each([true, false])('AppLayoutInternals with hasOpenDrawer=%s', hasOpenDrawer => {
      test('renders correctly with wit badge', () => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton(
          {
            badge: false,
          },
          ref
        );

        expect(wrapper).not.toBeNull();
        expect(getByTestId(mockTestId)).toBeTruthy();
        const button = wrapper.find('button');
        expect(button).toBeTruthy();
        expect(wrapper.findByClassName(toolbarTriggerButtonStyles.dot)).toBeNull();
        expect(wrapper.findBadge()).toBeNull();
      });

      test('renders correctly with aria controls adn aria label', () => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const mockAriaControls = 'mock-aria-control';
        const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
          {
            ariaControls: mockAriaControls,
          },
          {
            isMobile,
            hasOpenDrawer,
          },
          ref
        );

        expect(wrapper).not.toBeNull();
        const button = wrapper.find('button');
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(button).toBeTruthy();
        expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
        expect(button!.getElement().getAttribute('aria-controls')).toEqual(mockAriaControls);
      });

      test.each([true, false])('icon renders correctly when iconSvg prop has a %s value', hasIconSvg => {
        const icon = (
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        );
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
          {
            iconName: hasIconSvg ? undefined : (mockProps.iconName as IconProps.Name),
            iconSvg: hasIconSvg ? icon : '',
          },
          {
            isMobile,
            hasOpenDrawer,
          },
          ref
        );

        expect(wrapper).not.toBeNull();
        const button = wrapper.find('button');
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(button).toBeTruthy();
        expect(wrapper!.findIcon()).toBeTruthy();
      });

      test.each([true, false])('Disables click events when disabled prop is %s', disabledValue => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const mockClickSpy = jest.fn();
        const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
          {
            disabled: disabledValue,
            onClick: mockClickSpy,
          },
          {
            isMobile,
            hasOpenDrawer,
          },
          ref
        );
        expect(wrapper).not.toBeNull();
        const button = wrapper.find('button')!;
        expect(getByTestId(mockTestId)).toBeTruthy();
        button.click();
        expect(mockClickSpy).toBeCalledTimes(disabledValue ? 0 : 1);
      });

      test('renders an empty button when no iconName and iconSVG prop', () => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const { wrapper } = renderVisualRefreshTriggerButton(
          {
            iconName: '' as IconProps.Name,
            iconSvg: '',
          },
          {
            isMobile,
            hasOpenDrawer,
          },
          ref
        );
        expect(wrapper).not.toBeNull();
        const button = wrapper.find('button');
        expect(button).toBeTruthy();
        expect(button?.findIcon()).toBeNull();
      });
    });
  });

  test('renders correctly with badge using dot class on desktop', () => {
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
      {
        badge: true,
      },
      {
        isMobile: false,
      },
      ref
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper.findByClassName(visualRefreshStyles.dot)).toBeTruthy();
  });

  test.each([true, false] as const)('Is focusable using the forwarded ref with mobile is %s', isMobile => {
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
      {},
      {
        isMobile,
      },
      ref
    );
    expect(getByTestId(mockTestId)).toBeTruthy();
    const button = wrapper!.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(document.activeElement).not.toBe(button!.getElement());
    (ref.current as any)?.focus(mockEventBubbleWithShiftFocus);
    expect(document.activeElement).toBe(button!.getElement());
  });
});

describe('Visual Refresh Toolbar trigger-button', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders correctly with badge using dot class', () => {
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton(
      {
        badge: true,
      },
      ref
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper.findByClassName(toolbarTriggerButtonStyles.dot)).toBeTruthy();
  });

  test.each([true, false])('icon renders correctly when iconSvg prop has a %s value', hasIconSvg => {
    const icon = (
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    );
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton(
      {
        iconName: hasIconSvg ? undefined : (mockProps.iconName as IconProps.Name),
        iconSvg: hasIconSvg ? icon : '',
      },
      ref
    );

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(wrapper!.findIcon()).toBeTruthy();
  });

  test.each([true, false])('click events work as expected when disabled is %s', disabledValue => {
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const mockClickSpy = jest.fn();
    const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton(
      {
        disabled: disabledValue,
        onClick: mockClickSpy,
      },
      ref
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button')!;
    expect(getByTestId(mockTestId)).toBeTruthy();
    button.click();
    expect(mockClickSpy).toBeCalledTimes(disabledValue ? 0 : 1);
  });

  test('renders an empty button when no iconName and iconSVG prop', () => {
    const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
    const { wrapper } = renderVisualRefreshToolbarTriggerButton(
      {
        iconName: '' as IconProps.Name,
      },
      ref
    );
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(button).toBeTruthy();
    expect(button?.findIcon()).toBeNull();
  });
});
