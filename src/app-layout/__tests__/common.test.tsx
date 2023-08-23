// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from 'react-dom/test-utils';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';
import {
  describeEachAppLayout,
  drawerWithoutLabels,
  isDrawerClosed,
  renderComponent,
  singleDrawer,
  singleDrawerOpen,
} from './utils';
import AppLayout from '../../../lib/components/app-layout';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(() => {
  test('Default state', () => {
    const { wrapper } = renderComponent(<AppLayout />);

    expect(wrapper.findNavigationToggle()).toBeTruthy();
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findNavigationClose()).toBeTruthy();
    expect(wrapper.findToolsToggle()).toBeTruthy();
    expect(wrapper.findTools()).toBeTruthy();
    expect(wrapper.findToolsClose()).toBeTruthy();
    expect(wrapper.findContentRegion()).toBeTruthy();
    expect(wrapper.findNotifications()).toBeFalsy();
    expect(wrapper.findBreadcrumbs()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()![0]).toBeFalsy();
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test('should render notifications', () => {
    const { wrapper } = renderComponent(<AppLayout notifications="Notifications" />);
    expect(wrapper.findNotifications()).toBeTruthy();
  });

  test('should render breadcrumbs', () => {
    const { wrapper } = renderComponent(<AppLayout breadcrumbs="Breadcrumbs" />);
    expect(wrapper.findBreadcrumbs()).toBeTruthy();
  });

  [
    {
      openProp: 'navigationOpen',
      hideProp: 'navigationHide',
      handler: 'onNavigationChange',
      findLandmarks: (wrapper: AppLayoutWrapper) => wrapper.findAll('nav'),
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findNavigation(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findNavigationToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findNavigationClose(),
    },
    {
      openProp: 'toolsOpen',
      hideProp: 'toolsHide',
      handler: 'onToolsChange',
      findLandmarks: (wrapper: AppLayoutWrapper) => wrapper.findAll('aside'),
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findTools(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findToolsToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findToolsClose(),
    },
  ].forEach(({ openProp, hideProp, handler, findElement, findLandmarks, findToggle, findClose }) => {
    describe(`${openProp} prop`, () => {
      test(`Should call handler once on open when toggle is clicked`, () => {
        const onToggle = jest.fn();
        const props = {
          [openProp]: false,
          [handler]: onToggle,
        };
        const { wrapper } = renderComponent(<AppLayout {...props} />);

        findToggle(wrapper).click();
        expect(onToggle).toHaveBeenCalledTimes(1);
        expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: true } }));
      });

      test(`Should call handler once on open when span inside toggle is clicked`, () => {
        const onToggle = jest.fn();
        const props = {
          [openProp]: false,
          [handler]: onToggle,
        };
        const { wrapper } = renderComponent(<AppLayout {...props} />);

        // Chrome bubbles up events from specific elements inside <button>s.
        findToggle(wrapper).find('span')!.click();
        expect(onToggle).toHaveBeenCalledTimes(1);
        expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: true } }));
      });

      test(`Should call handler once on close`, () => {
        const onToggle = jest.fn();
        const props = {
          [openProp]: true,
          [handler]: onToggle,
        };
        const { wrapper } = renderComponent(<AppLayout {...props} />);

        findClose(wrapper).click();
        expect(onToggle).toHaveBeenCalledTimes(1);
        expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ detail: { open: false } }));
      });

      test('Renders two landmarks in closed state', () => {
        const props = {
          [openProp]: false,
          [handler]: () => {},
        };
        const { wrapper } = renderComponent(<AppLayout {...props} />);
        const landmarks = findLandmarks(wrapper);
        expect(landmarks).toHaveLength(2);

        const toggleElement = findToggle(wrapper).getElement();

        if (landmarks[0].getElement().contains(toggleElement)) {
          expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'false');
          expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'true');
        } else {
          expect(landmarks[1].getElement()).toContainElement(toggleElement);
          expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'false');
          expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'true');
        }
      });

      test('Renders two landmarks in open state', () => {
        const props = {
          [openProp]: true,
          [handler]: () => {},
        };
        const { wrapper } = renderComponent(<AppLayout {...props} />);
        const landmarks = findLandmarks(wrapper);
        expect(landmarks).toHaveLength(2);
        const toggleElement = findToggle(wrapper).getElement();

        if (landmarks[0].getElement().contains(toggleElement)) {
          expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'true');
          expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'false');
        } else {
          expect(landmarks[1].getElement()).toContainElement(toggleElement);
          expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'true');
          expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'false');
        }
      });

      test('Renders aria-expanded only on toggle', () => {
        const { wrapper } = renderComponent(<AppLayout />);
        expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-expanded', 'false');
        expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-haspopup', 'true');
        expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-expanded');
        expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-haspopup');
      });

      test('Does not add a label to the toggle and landmark when they are not defined', () => {
        const { wrapper } = renderComponent(<AppLayout />);
        expect(findToggle(wrapper).getElement()).not.toHaveAttribute('aria-label');
        expect(findLandmarks(wrapper)[0].getElement()).not.toHaveAttribute('aria-label');
      });

      test('Adds labels to toggle button and landmark when defined', () => {
        const labels = {
          navigationToggle: 'toggle',
          toolsToggle: 'toggle',
          navigation: 'landmark',
          tools: 'landmark',
        };

        const { wrapper } = renderComponent(<AppLayout ariaLabels={labels} />);
        expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-label', 'toggle');
        expect(findLandmarks(wrapper)[0].getElement()).toHaveAttribute('aria-label', 'landmark');
      });

      test('Close button does have a label if it is defined', () => {
        const props = { [openProp]: true, [handler]: () => {} };
        const labels = {
          navigationClose: 'close label',
          toolsClose: 'close label',
        };
        const { wrapper } = renderComponent(<AppLayout {...props} ariaLabels={labels} />);

        expect(findClose(wrapper).getElement()).toHaveAttribute('aria-label', 'close label');
      });

      test('Close button does not render a label if is not defined', () => {
        const props = { [openProp]: true, [handler]: () => {} };
        const { wrapper } = renderComponent(<AppLayout {...props} />);

        expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-label');
      });

      test('Opens and closes drawer in uncontrolled mode', () => {
        // use content type with initial closed state for all drawers
        const { wrapper } = renderComponent(<AppLayout contentType="form" />);
        expect(isDrawerClosed(findElement(wrapper))).toBe(true);

        act(() => findToggle(wrapper).click());
        expect(isDrawerClosed(findElement(wrapper))).toBe(false);

        act(() => findClose(wrapper).click());
        expect(isDrawerClosed(findElement(wrapper))).toBe(true);
      });

      test('Moves focus between open and close buttons', () => {
        // use content type with initial closed state for all drawers
        const { wrapper } = renderComponent(<AppLayout contentType="form" />);

        act(() => findToggle(wrapper).click());
        expect(findClose(wrapper).getElement()).toBe(document.activeElement);

        act(() => findClose(wrapper).click());
        expect(findToggle(wrapper).getElement()).toBe(document.activeElement);
      });

      test(`Should not render the drawer if ${hideProp} is set to true`, () => {
        const props = { [hideProp]: true };
        const { wrapper } = renderComponent(<AppLayout {...props} />);
        expect(findElement(wrapper)).toBeFalsy();
        expect(findLandmarks(wrapper)).toHaveLength(0);
      });
    });
  });

  // Drawers tests

  describe(`Drawers`, () => {
    test(`Should call handler once on open when toggle is clicked`, () => {
      const onChange = jest.fn();
      const drawersClosed = {
        drawers: {
          onChange: onChange,
          items: singleDrawer.drawers.items,
        },
      };
      const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersClosed} />);

      wrapper.findDrawersTriggers()![0].click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: 'security' }));
    });

    test(`Should call handler once on open when span inside toggle is clicked`, () => {
      const onChange = jest.fn();
      const drawersClosed = {
        drawers: {
          onChange: onChange,
          items: singleDrawer.drawers.items,
        },
      };
      const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersClosed} />);

      // Chrome bubbles up events from specific elements inside <button>s.
      wrapper.findDrawersTriggers()![0]!.find('span')!.click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: 'security' }));
    });

    test(`Should call handler once on close`, () => {
      const onChange = jest.fn();
      const drawersOpen = {
        drawers: {
          onChange: onChange,
          activeDrawerId: 'security',
          items: singleDrawer.drawers.items,
        },
      };

      const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersOpen} />);

      wrapper.findActiveDrawerCloseButton()!.click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: null }));
    });

    test('Renders aria-expanded only on toggle', () => {
      const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);

      expect(wrapper.findDrawersTriggers()![0].getElement()).toHaveAttribute('aria-expanded', 'false');
      expect(wrapper.findDrawersTriggers()![0].getElement()).toHaveAttribute('aria-haspopup', 'true');
      wrapper.findDrawersTriggers()![0].click();
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-expanded');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-haspopup');
    });

    test('Close button does have a label if it is defined', () => {
      const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawerOpen} />);

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security close button'
      );
    });

    test('Close button does not render a label if is not defined', () => {
      const drawersOpen = {
        drawers: {
          activeDrawerId: 'security',
          items: drawerWithoutLabels.drawers.items,
        },
      };

      const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersOpen} />);

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-label');
    });

    test('Opens and closes drawer in uncontrolled mode', () => {
      // use content type with initial closed state for all drawers
      const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
      expect(wrapper.findActiveDrawer()).toBeNull();

      act(() => wrapper.findDrawersTriggers()![0].click());
      expect(wrapper.findActiveDrawer()).not.toBeNull();

      act(() => wrapper.findActiveDrawerCloseButton()!.click());
      expect(wrapper.findActiveDrawer()).toBeNull();
    });
  });
});
