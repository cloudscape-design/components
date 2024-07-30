// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { ButtonProps } from '../../../lib/components/button';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import TriggerButton, { TriggerButtonProps } from '../../../lib/components/app-layout/visual-refresh/trigger-button';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';
import popoverStyles from '../../../lib/components/popover/styles.css.js';

import { act, render, waitFor } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import { IconProps } from '../../../lib/components/icon/interfaces.js';

const mockProps = {
  ariaLabel: 'Aria label',
  className: 'class-from-props',
  iconName: 'bug',
  testId: 'mockTestId',
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
  const wrapper = createWrapper(container).findByClassName('trigger-wrapper');
  await delay();
  return { wrapper, rerender, container, getByTestId, getByText };
}

describe('Toolbar desktop trigger-button', () => {
  it('renders correctly with iconName', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { container, wrapper, getByTestId } = await renderTriggerButton(
      {
        iconName: 'bug',
      },
      ref as any
    );
    expect(container).toBeTruthy();
    waitFor(() => {
      const button = wrapper!.find('button[type="button"]');
      expect(wrapper!.findByClassName('trigger-wrapper')).toBeTruthy();
      expect(getByTestId(mockProps.testId)).toBeTruthy();
      expect(button).toBeTruthy();
      expect(button!.getElement().ariaLabel).toEqual(mockProps.ariaLabel);
      expect(wrapper!.findIcon()).toBeTruthy();
      expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
    });
  });

  it('renders correctly with iconSvg', async () => {
    const iconTestId = 'icon-test-id';
    const icon = (
      <svg data-testid={iconTestId} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    );
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { container, wrapper, getByTestId } = await renderTriggerButton(
      {
        iconSvg: icon,
      },
      ref as any
    );
    expect(container).toBeTruthy();
    waitFor(() => {
      const button = wrapper!.findButton();
      expect(wrapper!.findByClassName('trigger-wrapper')).toBeTruthy();
      expect(getByTestId(mockProps.testId)).toBeTruthy();
      expect(button).toBeTruthy();
      expect(button!.getElement().ariaLabel).toEqual(mockProps.ariaLabel);
      expect(wrapper!.findIcon()).toBeTruthy();
      expect(getByTestId(iconTestId)).toBeTruthy();
      expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
    });
  });

  it.skip('does not render without either an iconName or iconSVG prop', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { container, wrapper, getByTestId } = await renderTriggerButton(
      {
        iconName: '' as IconProps.Name,
      },
      ref as any
    );
    expect(container).toBeTruthy();
    waitFor(() => {
      const button = wrapper!.find('button[type="button"]');
      expect(wrapper!.findByClassName('trigger-wrapper')).toBeTruthy();
      expect(getByTestId(mockProps.testId)).toBeTruthy();
      expect(button).toBeTruthy();
      expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
    });
  });

  it('renders correctly with badge', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { container, wrapper } = await renderTriggerButton(
      {
        badge: true,
      },
      ref as any
    );
    expect(container).toBeTruthy();
    waitFor(() => {
      const button = wrapper!.find('button[type="button"]');
      expect(wrapper!.findByClassName('trigger-wrapper')).toBeTruthy();
      expect(button).toBeTruthy();
      expect(button!.findBadge()).toBeTruthy();
    });
  });

  describe('Trigger wrapper events', () => {
    it('Shows tooltip on pointerEnter and closes on pointerLeave', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { container, wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
        },
        ref as any
      );
      expect(container).toBeTruthy();
      waitFor(() => {
        expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        const triggerWrapper = wrapper!.findByClassName('trigger-wrapper');
        expect(triggerWrapper).toBeTruthy();
        triggerWrapper!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeTruthy();
          expect(wrapper!.findByClassName(popoverStyles.content)).toBeTruthy();
          expect(getByText(mockTooltipText)).toBeTruthy();
        });

        const otherEl = wrapper!.findByClassName(mockOtherEl.class);
        otherEl!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        });
      });
    });

    it('Shows tooltip on focus and removes on escape', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { container, wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
        },
        ref as any
      );
      expect(container).toBeTruthy();
      waitFor(() => {
        expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        const triggerWrapper = wrapper!.findByClassName('trigger-wrapper');
        expect(triggerWrapper).toBeTruthy();
        triggerWrapper!.focus();
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeTruthy();
          expect(wrapper!.findByClassName(popoverStyles.content)).toBeTruthy();
          expect(getByText(mockTooltipText)).toBeTruthy();
        });

        triggerWrapper!.keydown(KeyCode.escape);
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        });
      });
    });

    it('Shows tooltip on focus and removes on blur', async () => {
      const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
      const mockTooltipText = 'Mock Tooltip';
      const { container, wrapper, getByText } = await renderTriggerButton(
        {
          tooltipText: mockTooltipText,
        },
        ref as any
      );
      expect(container).toBeTruthy();
      waitFor(() => {
        expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        const triggerWrapper = wrapper!.findByClassName('trigger-wrapper');
        expect(triggerWrapper).toBeTruthy();
        triggerWrapper!.focus();
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeTruthy();
          expect(wrapper!.findByClassName(popoverStyles.content)).toBeTruthy();
          expect(getByText(mockTooltipText)).toBeTruthy();
        });

        triggerWrapper!.blur();
        waitFor(() => {
          expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
        });
      });
    });
  });

  it('Is focusable using the forwarded ref and tooltip does not show', async () => {
    const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    const { container, wrapper, getByTestId } = await renderTriggerButton(
      {
        iconName: 'bug',
      },
      ref as any
    );
    expect(container).toBeTruthy();
    waitFor(() => {
      const button = wrapper!.find('button[type="button"]');
      expect(wrapper!.findByClassName('trigger-wrapper')).toBeTruthy();
      expect(getByTestId(mockProps.testId)).toBeTruthy();
      expect(button).toBeTruthy();
      expect(document.activeElement).not.toBe(button!.getElement());
      (ref.current as any)?.focus();
      waitFor(() => {
        expect(document.activeElement).toBe(button!.getElement());
        expect(wrapper!.findByClassName(tooltipStyles.root)).toBeNull();
      });
    });
  });
});
