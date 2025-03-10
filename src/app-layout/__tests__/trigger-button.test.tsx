// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

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
import { testIf } from '../../__tests__/utils';

import testUtilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';

const MockUseAppLayoutInternals = jest.spyOn(AllContext, 'useAppLayoutInternals').mockName('useAppLayoutInternals');

const mockDrawerId = 'mock-drawer-id';
const mockTestId = `awsui-app-layout-trigger-${mockDrawerId}`;
const mockTooltipText = 'Mock Tooltip';

const mockProps = {
  ariaLabel: 'Aria label',
  className: 'class-from-props',
  iconName: 'bug',
  testId: mockTestId,
  tooltipText: mockTooltipText,
  hasTooltip: false,
  isForPreviousActiveDrawer: false,
};
const mockHorizontalToolbarProps = {
  hasOpenDrawer: false,
  isMobile: false,
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

const mockRelatedTarget = new EventTarget();
const mockEventBubbleWithRelatedTarget = {
  ...mockEventBubble,
  relatedTarget: mockRelatedTarget,
};

const triggerButtoonTooltipClass = testUtilStyles['trigger-tooltip'];

const renderVisualRefreshTriggerButton = (
  props: Partial<VisualRefreshTriggerButtonProps> = {},
  useAppLayoutInternalsValues: Partial<AllContext.AppLayoutInternals> = {},
  ref: React.Ref<ButtonProps.Ref> = null
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
  ref: React.Ref<ButtonProps.Ref> = null
) => {
  const renderProps = { ...mockProps, ...mockHorizontalToolbarProps, ...props };
  const { container, rerender, getByTestId, getByText } = render(
    <div>
      <VisualRefreshToolbarTriggerButton {...(renderProps as VisualRefreshToolbarTriggerButtonProps)} ref={ref} />
      <span className={mockOtherEl.class}>{mockOtherEl.text}</span>
    </div>
  );
  const wrapper = createWrapper(container).findByClassName(toolbarTriggerButtonStyles['trigger-wrapper'])!;
  return { wrapper, rerender, getByTestId, getByText, container };
};

describe('Visual refresh trigger-button (not in appLayoutWidget toolbar)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe.each([true, false])('Toolbar trigger-button with isMobile=%s', isMobile => {
    describe.each([true, false])('AppLayoutInternals with hasOpenDrawer=%s', hasOpenDrawer => {
      testIf(!isMobile)('applies the correct class when selected', () => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const { wrapper } = renderVisualRefreshTriggerButton(
          {
            selected: true,
          },
          {
            isMobile,
            hasOpenDrawer,
          },
          ref
        );
        expect(wrapper).not.toBeNull();
        const seletedButton = wrapper.findByClassName(visualRefreshStyles.selected);
        expect(seletedButton).toBeTruthy();
      });

      test('renders correctly with wit badge', () => {
        const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
        const { wrapper, getByTestId } = renderVisualRefreshTriggerButton(
          {
            badge: false,
          },
          {
            isMobile,
            hasOpenDrawer,
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
        expect(mockClickSpy).toHaveBeenCalledTimes(disabledValue ? 0 : 1);
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
    (ref.current as any)?.focus(mockEventBubbleWithRelatedTarget);
    expect(document.activeElement).toBe(button!.getElement());
  });
});

describe('Visual Refresh Toolbar trigger-button', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders correctly with badge using dot class', () => {
    const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton({
      badge: true,
    });

    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(getByTestId(mockTestId)).toBeTruthy();
    expect(button).toBeTruthy();
    expect(wrapper!.findIcon()).toBeTruthy();
    expect(wrapper.findByClassName(toolbarTriggerButtonStyles.dot)).toBeTruthy();
  });

  test('applies the correct class when selected', () => {
    const { wrapper } = renderVisualRefreshToolbarTriggerButton({
      selected: true,
    });
    expect(wrapper).not.toBeNull();
    const seletedButton = wrapper.findByClassName(toolbarTriggerButtonStyles.selected);
    expect(seletedButton).toBeTruthy();
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
    const mockClickSpy = jest.fn();
    const { wrapper, getByTestId } = renderVisualRefreshToolbarTriggerButton({
      disabled: disabledValue,
      onClick: mockClickSpy,
    });
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button')!;
    expect(getByTestId(mockTestId)).toBeTruthy();
    button.click();
    expect(mockClickSpy).toHaveBeenCalledTimes(disabledValue ? 0 : 1);
  });

  test('renders an empty button when no iconName and iconSVG prop', () => {
    const { wrapper } = renderVisualRefreshToolbarTriggerButton({
      iconName: '' as IconProps.Name,
    });
    expect(wrapper).not.toBeNull();
    const button = wrapper.find('button');
    expect(button).toBeTruthy();
    expect(button?.findIcon()).toBeNull();
  });

  describe('Shared trigger wrapper events', () => {
    describe.each([true, false] as const)('isMobile=%s', isMobile => {
      describe.each([true, false] as const)('hastTooltip=%s', hasTooltip => {
        test('Is focusable using the forwarded ref with no tooltip', () => {
          const ref: React.MutableRefObject<ButtonProps.Ref | null> = React.createRef();
          const { wrapper, getByTestId, getByText } = renderVisualRefreshToolbarTriggerButton(
            {
              hasTooltip,
              isMobile,
            },
            ref
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          const button = wrapper!.find('button');
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          expect(button).toBeTruthy();
          expect(document.activeElement).not.toBe(button!.getElement());
          (ref.current as any)?.focus(mockEventBubbleWithRelatedTarget);
          expect(document.activeElement).toBe(button!.getElement());
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
        });

        test('pointer events work properly', () => {
          const { wrapper, getByText, getByTestId } = renderVisualRefreshToolbarTriggerButton({
            hasTooltip,
            isMobile,
          });
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.pointerEnter(wrapper!.getElement());
          if (hasTooltip) {
            expect(getByText(mockTooltipText)).toBeTruthy();
            //trigger event again to assert the tooltip remains
            fireEvent.pointerDown(wrapper!.getElement());
          } else {
            expect(() => getByText(mockTooltipText)).toThrow();
          }
          fireEvent.pointerLeave(wrapper!.getElement(), mockEventBubble);
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        test('Focus and blur events work properly', () => {
          const { wrapper, getByText, getByTestId } = renderVisualRefreshToolbarTriggerButton({
            hasTooltip,
            isMobile,
          });
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement());

          if (hasTooltip) {
            expect(getByText(mockTooltipText)).toBeTruthy();
          } else {
            expect(() => getByText(mockTooltipText)).toThrow();
          }

          fireEvent.blur(wrapper!.getElement());
          expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(hasTooltip)('Tooltip can be hidden on escape key press when open', async () => {
          const { wrapper, getByText, getByTestId } = await renderVisualRefreshToolbarTriggerButton({
            hasTooltip,
            isMobile,
          });
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement());
          expect(getByText(mockTooltipText)).toBeTruthy();

          fireEvent.keyDown(wrapper!.getElement(), {
            ...mockEventBubble,
            key: 'Escape',
            code: KeyCode.escape,
          });

          expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(hasTooltip)(
          'Does not show tooltip on pointerEnter or focus when there is no arialLabel nor tooltipText',
          async () => {
            const { wrapper, getByTestId } = await renderVisualRefreshToolbarTriggerButton({
              ariaLabel: '',
              tooltipText: '',
            });
            expect(getByTestId(mockTestId)).toBeTruthy();
            expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();

            fireEvent.pointerEnter(wrapper!.getElement());
            expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();

            fireEvent.focus(wrapper!.getElement());
            expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();
          }
        );
      });
      testIf(isMobile)('Does not show tooltip if hasOpenDrawer', async () => {
        const { wrapper, getByTestId } = await renderVisualRefreshToolbarTriggerButton({
          isMobile,
          hasOpenDrawer: true,
        });
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();

        fireEvent.focus(wrapper!.getElement());
        expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();
      });

      //the realatedTarget here would be truthy when key or click navigation
      //relatedTarget exists on events that are not associated with closeing the split panel from within
      test('Focus and blur events work properly for split panel and related target exists', () => {
        const { wrapper, getByText, getByTestId } = renderVisualRefreshToolbarTriggerButton({
          hasTooltip: true,
          isMobile,
          isForSplitPanel: true,
        });
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
        expect(() => getByText(mockTooltipText)).toThrow();

        fireEvent.focus(wrapper!.getElement(), mockEventBubbleWithRelatedTarget);
        expect(getByText(mockTooltipText)).toBeTruthy();

        fireEvent.blur(wrapper!.getElement());
        expect(wrapper.findByClassName(triggerButtoonTooltipClass)).toBeNull();
        expect(() => getByText(mockTooltipText)).toThrow();
      });

      //the relatedTarget here will be null just like when a split panel closed via mouse or key interaction
      //with the close button on the split panel
      test('Focus and blur events work properly for split panel and relatedTarget is null', () => {
        const { wrapper, getByText, getByTestId } = renderVisualRefreshToolbarTriggerButton({
          hasTooltip: true,
          isMobile,
          isForSplitPanel: true,
        });
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
        expect(() => getByText(mockTooltipText)).toThrow();
        fireEvent.focus(wrapper!.getElement());

        expect(() => getByText(mockTooltipText)).toThrow();
      });

      test('Focus events work properly for isForPreviousDrawer', () => {
        const { wrapper, getByText, getByTestId } = renderVisualRefreshToolbarTriggerButton({
          hasTooltip: true,
          isMobile,
          isForPreviousActiveDrawer: true,
        });
        expect(getByTestId(mockTestId)).toBeTruthy();
        expect(wrapper!.findByClassName(triggerButtoonTooltipClass)).toBeNull();
        expect(() => getByText(mockTooltipText)).toThrow();

        fireEvent.focus(wrapper!.getElement());
        expect(() => getByText(mockTooltipText)).toThrow();
      });
    });
  });
});
