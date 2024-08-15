// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { ButtonProps } from '../../../lib/components/button';
import { IconProps } from '../../../lib/components/icon/interfaces.js';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import TriggerButton, {
  TriggerButtonProps,
} from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/index.js';
import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

import { act, render, fireEvent } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';

const mockDrawerId = 'mock-drawer-id';
const mockTestId = `awsui-app-layout-trigger-${mockDrawerId}`;
const mockTooltipText = 'Mock Tooltip';
const mockRelatedElement = document.createElement('div');
const mockProps: Partial<TriggerButtonProps> = {
  ariaLabel: 'Aria label',
  className: 'class-from-props',
  iconName: 'bug',
  testId: mockTestId,
  tooltipText: mockTooltipText,
  hasTooltip: true,
  hideTooltipOnFocus: false,
  hasOpenDrawer: false,
  isMobile: false,
};
const mockOtherEl = {
  class: 'other-el-class',
  text: 'other-element',
};

const mockEventBubble = {
  bubbles: true,
  isTrusted: true,
  relatedTarget: null,
};

const testIf = (condition: boolean) => (condition ? test : test.skip);

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
  const wrapper = createWrapper(container).findByClassName(toolbarTriggerButtonStyles['trigger-wrapper'])!;
  await delay();
  return { wrapper, rerender, getByTestId, getByText };
}

describe('Toolbar trigger-button', () => {
  beforeEach(() => jest.clearAllMocks());

  //tests for both desktop and mobile
  describe.each([true, false])('Toolbar trigger-button with isMobile=%s', isMobile => {
    //tests for both drawer being opend and closed
    describe.each([true, false])('AppLayout with hasOpenDrawer=%s', hasOpenDrawer => {
      test('renders correctly with without tooltip nor badge', async () => {
        const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
        const { wrapper, getByTestId } = await renderTriggerButton(
          {
            hasTooltip: false,
            badge: false,
            hasOpenDrawer,
            isMobile,
          },
          ref as any
        );

        expect(wrapper).not.toBeNull();
        expect(getByTestId(mockTestId)).toBeTruthy();
        const button = wrapper.find('button');
        expect(button).toBeTruthy();
        expect(button!.getElement().getAttribute('aria-label')).toEqual(mockProps.ariaLabel);
        expect(wrapper!.findIcon()).toBeTruthy();
        expect(wrapper.findByClassName(toolbarTriggerButtonStyles.dot)).toBeNull();
        expect(wrapper.findBadge()).toBeNull();
        expect(wrapper!.findAllByClassName(toolbarTriggerButtonStyles['trigger-tooltip']).length).toEqual(0);
        expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
      });

      test('renders correctly with iconName', async () => {
        const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
        const { wrapper, getByTestId } = await renderTriggerButton(
          {
            hasOpenDrawer,
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
            hasOpenDrawer,
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
            disabled: disabledValue,
            onClick: mockClickSpy,
            isMobile,
            hasOpenDrawer,
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
            hasOpenDrawer,
          },
          ref as any
        );
        expect(wrapper).not.toBeNull();
        const button = wrapper.find('button');
        expect(button).toBeTruthy();
        expect(button?.findIcon()).toBeNull();
      });

      describe('Shared trigger wrapper events', () => {
        test('Does not show tooltip on pointerEnter when hasTooltip is false', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              hasTooltip: false,
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.pointerEnter(wrapper!.getElement());
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        test('Does not show tooltip on pointerEnter when there is no arialLabel nor tooltipText', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByTestId } = await renderTriggerButton(
            {
              ariaLabel: '',
              tooltipText: '',
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          fireEvent.pointerEnter(wrapper!.getElement());
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
        });

        test('Does not show tooltip on focus when no ariaLabel nor tooltipText', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByTestId } = await renderTriggerButton(
            {
              ariaLabel: '',
              tooltipText: '',
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          fireEvent.focus(wrapper!.getElement());
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
        });

        testIf(!(isMobile && hasOpenDrawer))(
          'renders correctly with ariaLabel as fallback for tooltipText',
          async () => {
            const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
            const { wrapper, getByText, getByTestId } = await renderTriggerButton(
              {
                tooltipText: '',
                isMobile,
                hasOpenDrawer,
              },
              ref as any
            );
            expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
            const mockTooltipWrapper = getByTestId(mockTestId);
            expect(mockTooltipWrapper).toBeTruthy();
            expect(() => getByText(mockTooltipText)).toThrow();
            expect(() => getByText(mockProps.ariaLabel as string)).toThrow();
            fireEvent.pointerEnter(mockTooltipWrapper, mockEventBubble);
            expect(getByText(mockProps.ariaLabel as string)).toBeTruthy();
          }
        );

        testIf(!isMobile)('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile: false,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.pointerEnter(wrapper!.getElement(), mockEventBubble);
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.pointerLeave(wrapper!.getElement(), mockEventBubble);
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(!isMobile)('Shows tooltip on focus and removes on blur', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile: false,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement(), { relatedTarget: mockRelatedElement });
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.blur(wrapper!.getElement());
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(!(isMobile && hasOpenDrawer))('Shows tooltip on focus and removes on key escape', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer: false,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement(), { relatedTarget: mockRelatedElement });
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.keyDown(wrapper!.getElement(), { key: 'Escape', code: KeyCode.escape });
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(!hasOpenDrawer)('Is focusable using the forwarded ref and tooltip does not show', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByTestId, getByText } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer,
              hideTooltipOnFocus: true,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          const button = wrapper!.find('button');
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(button).toBeTruthy();
          expect(document.activeElement).not.toBe(button!.getElement());
          //TODO find way to simulate rprogrammable focus with the right event data
          (ref.current as any)?.focus();
          expect(document.activeElement).toBe(button!.getElement());
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(!hasOpenDrawer)(
          'Is focusable using the forwarded ref and tooltip does not show but shows after a pointerEnter',
          async () => {
            const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
            const { wrapper, getByTestId, getByText } = await renderTriggerButton(
              {
                isMobile,
                hasOpenDrawer,
                hideTooltipOnFocus: true,
              },
              ref as any
            );
            expect(getByTestId(mockTestId)).toBeTruthy();
            const mockTooltipWrapper = getByTestId(mockTestId);
            expect(mockTooltipWrapper).toBeTruthy();
            const button = wrapper!.find('button');
            expect(getByTestId(mockTestId)).toBeTruthy();
            expect(button).toBeTruthy();
            expect(document.activeElement).not.toBe(button!.getElement());
            //TODO find way to simulate rprogrammable focus with the right event data
            (ref.current as any)?.focus();
            expect(document.activeElement).toBe(button!.getElement());
            expect(() => getByText(mockTooltipText)).toThrow();

            fireEvent.pointerEnter(mockTooltipWrapper, mockEventBubble);
            expect(getByText(mockTooltipText)).toBeTruthy();
          }
        );

        test('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile: true,
              hasOpenDrawer: false,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.pointerEnter(wrapper!.getElement(), mockEventBubble);
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.pointerLeave(wrapper!.getElement(), mockEventBubble);
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(isMobile && !hasOpenDrawer)('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement(), { relatedTarget: mockRelatedElement });
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.blur(wrapper!.getElement(), mockEventBubble);
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(isMobile && !hasOpenDrawer)('Shows tooltip on focus and removes on blur', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement());
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(isMobile && !hasOpenDrawer)('Shows tooltip on focus and removes on key escape', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement(), { relatedTarget: mockRelatedElement });
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.keyDown(wrapper!.getElement(), { key: 'Escape', code: KeyCode.escape });
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
        });

        testIf(!isMobile)('Shows tooltip on focus and removes on outside click', async () => {
          //   const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.focus(wrapper!.getElement(), { relatedTarget: mockRelatedElement });
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.click(getByText(mockOtherEl.text));
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
        });

        testIf(!isMobile)('Shows tooltip on pointerDown and closes on pointerDown elsewhere', async () => {
          const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
          const { wrapper, getByText, getByTestId } = await renderTriggerButton(
            {
              isMobile: false,
              hasOpenDrawer,
            },
            ref as any
          );
          expect(getByTestId(mockTestId)).toBeTruthy();
          expect(wrapper!.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
          expect(() => getByText(mockTooltipText)).toThrow();
          fireEvent.pointerEnter(wrapper!.getElement(), mockEventBubble);
          expect(getByText(mockTooltipText)).toBeTruthy();
          fireEvent.pointerEnter(getByText(mockOtherEl.text), mockEventBubble);
          expect(wrapper.findByClassName(toolbarTriggerButtonStyles['trigger-tooltip'])).toBeNull();
        });
      });
    });
  });
});
