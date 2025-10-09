// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils.js';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import createWrapper from '../../../lib/components/test-utils/dom';
import { testIf } from '../../__tests__/utils';
import { describeEachAppLayout, manyDrawers, renderComponent, testDrawer } from './utils';

import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';

const mockEventBubble = {
  bubbles: true,
  isTrusted: true,
  relatedTarget: null,
};

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(({ size, theme }) => {
  test('registers public drawers api', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('should render an active drawer', () => {
    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
    );

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('should call handler once on open when toggle is clicked', () => {
    const onChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout drawers={[testDrawer]} onDrawerChange={event => onChange(event.detail)} />
    );

    wrapper.findDrawerTriggerById(testDrawer.id)!.click();
    expect(onChange).toHaveBeenCalledWith({ activeDrawerId: 'security' });
  });

  test('should call handler once on open when span inside toggle is clicked', () => {
    const onChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout drawers={[testDrawer]} onDrawerChange={event => onChange(event.detail)} />
    );

    wrapper.findDrawerTriggerById('security')!.find('span')!.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ activeDrawerId: 'security' });
  });

  test('should call handler once on close', () => {
    const onChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        activeDrawerId={testDrawer.id}
        drawers={[testDrawer]}
        onDrawerChange={event => onChange(event.detail)}
      />
    );

    wrapper.findActiveDrawerCloseButton()!.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ activeDrawerId: null });
  });

  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout toolsHide={true} drawers={[testDrawer]} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findDrawerTriggerTooltip()).toBeNull();
  });

  test('should not apply drawers treatment to the tools if the drawers array is empty', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[]} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('ignores tools when drawers API is used', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" drawers={[testDrawer]} />);

    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('should open active drawer on click of overflow item', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
    const buttonDropdown = wrapper.findDrawersOverflowTrigger();

    expect(wrapper.findActiveDrawer()).toBeFalsy();
    buttonDropdown!.openDropdown();
    buttonDropdown!.findItemById('5')!.click();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('renders resize only on resizable drawer', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        drawers={[
          testDrawer,
          {
            ...testDrawer,
            id: 'security-resizable',
            resizable: true,
          },
        ]}
      />
    );

    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();

    wrapper.findDrawerTriggerById('security-resizable')!.click();
    expect(!!wrapper.findActiveDrawerResizeHandle()).toBe(size === 'desktop');
  });

  test('focuses drawer close button', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={testDrawer.id}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
      />
    );
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => ref!.focusActiveDrawer());
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
  });

  test('moves focus on focusToolsClose if tools are rendered as part of drawers', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper, rerender } = renderComponent(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={null}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
        tools={<div>Tools</div>}
      />
    );
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    rerender(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={testDrawer.id}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
        tools={<div>Tools</div>}
      />
    );
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveFocus();
    act(() => ref!.focusToolsClose());
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
  });

  testIf(size !== 'mobile')('aria-controls points to an existing drawer id', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    const drawerTrigger = wrapper.findDrawerTriggerById('security')!;
    expect(drawerTrigger!.getElement()).not.toHaveAttribute('aria-controls');

    drawerTrigger.click();
    expect(drawerTrigger!.getElement()).toHaveAttribute('aria-controls', 'security');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveAttribute('id', 'security');
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        drawers={[
          { ...testDrawer, id: 'first', badge: true },
          { ...testDrawer, id: 'second' },
        ]}
      />
    );

    expect(wrapper.findDrawerTriggerById('first', { hasBadge: true })).toBeTruthy();
    expect(wrapper.findDrawerTriggerById('second', { hasBadge: false })).toBeTruthy();
  });

  test('Opens and closes drawer in uncontrolled mode', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    expect(wrapper.findActiveDrawer()).toBeNull();

    wrapper.findDrawerTriggerById('security')!.find('span')!.click();
    expect(wrapper.findActiveDrawer()).not.toBeNull();

    wrapper.findActiveDrawerCloseButton()!.click();
    expect(wrapper.findActiveDrawer()).toBeNull();
  });

  testIf(size !== 'mobile' && theme !== 'classic')('shows trigger button as selected when drawer opened', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    const drawerTrigger = wrapper.findDrawerTriggerById('security')!;
    const selectedClass = theme === 'refresh' ? visualRefreshStyles.selected : toolbarTriggerButtonStyles.selected;
    expect(drawerTrigger!.getElement()).not.toHaveClass(selectedClass);
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();

    drawerTrigger.click();
    expect(drawerTrigger!.getElement()).toHaveClass(selectedClass);

    drawerTrigger.click();
    expect(drawerTrigger!.getElement()).not.toHaveClass(selectedClass);
  });

  testIf(theme === 'refresh-toolbar')('tooltip renders correctly on focus, blur, and escape key press events', () => {
    const mockDrawers = [testDrawer];
    const result = render(<AppLayout drawers={mockDrawers} />);
    const wrapper = createWrapper(result.container).findAppLayout();
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
    expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();

    const items = wrapper!.findDrawersTriggers();
    expect(items.length).toEqual(mockDrawers.length);

    fireEvent.focus(items![0].getElement());
    expect(wrapper!.findDrawerTriggerTooltip()).toBeTruthy();
    expect(result.getByText(testDrawer.ariaLabels.drawerName)).toBeTruthy();

    fireEvent.blur(items![0].getElement());
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
    expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();

    fireEvent.focus(items![0].getElement());
    expect(wrapper!.findDrawerTriggerTooltip()).toBeTruthy();
    expect(result.getByText(testDrawer.ariaLabels.drawerName)).toBeTruthy();

    fireEvent.keyDown(items![0].getElement(), {
      ...mockEventBubble,
      key: 'Escape',
      code: KeyCode.escape,
    });
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
    expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();
  });

  testIf(theme === 'refresh-toolbar')(
    'tooltip renders correctly on pointer events and is removed on escape key press',
    () => {
      const mockDrawers = [testDrawer];
      const result = render(<AppLayout drawers={mockDrawers} />);
      const wrapper = createWrapper(result.container).findAppLayout();
      expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
      expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();

      const items = wrapper!.findDrawersTriggers();
      expect(items?.length).toEqual(mockDrawers.length);

      fireEvent.pointerEnter(items![0].getElement());
      expect(wrapper!.findDrawerTriggerTooltip()).toBeTruthy();
      expect(result.getByText(testDrawer.ariaLabels.drawerName)).toBeTruthy();

      fireEvent.pointerLeave(items![0].getElement());
      expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
      expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();

      fireEvent.pointerEnter(items![0].getElement());
      expect(wrapper!.findDrawerTriggerTooltip()).toBeTruthy();
      expect(result.getByText(testDrawer.ariaLabels.drawerName)).toBeTruthy();

      fireEvent.keyDown(items![0].getElement(), {
        ...mockEventBubble,
        key: 'Escape',
        code: KeyCode.escape,
      });
      expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
      expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();
    }
  );

  testIf(theme === 'refresh-toolbar')('tooltip does not render on trigger focus via close button', () => {
    const mockDrawers = [testDrawer];
    const result = render(<AppLayout drawers={mockDrawers} />);
    const wrapper = createWrapper(result.container).findAppLayout();
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
    expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();
    wrapper?.findDrawerTriggerById(testDrawer.id)!.click();
    expect(wrapper?.findActiveDrawer()).toBeTruthy();
    wrapper?.findActiveDrawerCloseButton()!.click();
    expect(wrapper!.findDrawerTriggerTooltip()).toBeNull();
    expect(() => result.getByTestId(testDrawer.ariaLabels.drawerName)).toThrow();
  });
});
