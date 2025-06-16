// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, renderComponent, testDrawer, testDrawerWithoutLabels } from './utils';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(({ theme, size }) => {
  test('Default state', async () => {
    const { wrapper } = renderComponent(<AppLayout />);

    expect(wrapper.findNavigationToggle()).toBeTruthy();
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findNavigationClose()).toBeTruthy();
    await waitFor(() => {
      expect(wrapper.findToolsToggle()).toBeTruthy();
    });
    expect(wrapper.findTools()).toBeTruthy();
    expect(wrapper.findToolsClose()).toBeTruthy();
    expect(wrapper.findContentRegion()).toBeTruthy();
    expect(wrapper.findNotifications()).toBeFalsy();
    expect(wrapper.findBreadcrumbs()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
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

  test('should not find tools slot as findActiveDrawer utility', async () => {
    const { wrapper } = renderComponent(<AppLayout toolsOpen={true} tools="test content" />);
    await waitFor(() => {
      expect(wrapper.findTools()!.getElement()).toHaveTextContent('test content');
    });
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  [
    {
      openProp: 'navigationOpen',
      hideProp: 'navigationHide',
      handler: 'onNavigationChange',
      expectedCallsOnMobileToggle: 2,
      findLandmarks: (wrapper: AppLayoutWrapper) => wrapper.findAll('nav'),
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findNavigation(),
      findOpenElement: (wrapper: AppLayoutWrapper) => wrapper.findOpenNavigationPanel(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findNavigationToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findNavigationClose(),
    },
    {
      openProp: 'toolsOpen',
      hideProp: 'toolsHide',
      handler: 'onToolsChange',
      expectedCallsOnMobileToggle: 1,
      findLandmarks: (wrapper: AppLayoutWrapper) => wrapper.findAll('aside'),
      findElement: (wrapper: AppLayoutWrapper) => wrapper.findTools(),
      findOpenElement: (wrapper: AppLayoutWrapper) => wrapper.findOpenToolsPanel(),
      findToggle: (wrapper: AppLayoutWrapper) => wrapper.findToolsToggle(),
      findClose: (wrapper: AppLayoutWrapper) => wrapper.findToolsClose(),
    },
  ].forEach(
    ({
      openProp,
      hideProp,
      handler,
      expectedCallsOnMobileToggle,
      findElement,
      findOpenElement,
      findLandmarks,
      findToggle,
      findClose,
    }) => {
      describe(`${openProp} prop`, () => {
        const waitForAppLayoutLoaded = (wrapper: AppLayoutWrapper) => {
          return waitFor(() => {
            if (openProp === 'navigationOpen') {
              expect(wrapper.findNavigationToggle()).toBeTruthy();
            } else {
              expect(wrapper.findToolsToggle()).toBeTruthy();
            }
          });
        };
        test(`Should call handler once on open when toggle is clicked`, async () => {
          const onToggle = jest.fn();
          const props = {
            [openProp]: false,
            [handler]: onToggle,
          };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          findToggle(wrapper).click();
          expect(onToggle).toHaveBeenCalledTimes(size === 'mobile' ? expectedCallsOnMobileToggle : 1);
          expect(onToggle).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { open: true } }));
        });

        test(`Should call handler once on open when span inside toggle is clicked`, async () => {
          const onToggle = jest.fn();
          const props = {
            [openProp]: false,
            [handler]: onToggle,
          };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          // Chrome bubbles up events from specific elements inside <button>s.
          findToggle(wrapper).find('span')!.click();
          expect(onToggle).toHaveBeenCalledTimes(size === 'mobile' ? expectedCallsOnMobileToggle : 1);
          expect(onToggle).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { open: true } }));
        });

        test(`Should call handler once on close`, async () => {
          const onToggle = jest.fn();
          const props = {
            [openProp]: true,
            [handler]: onToggle,
          };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          findClose(wrapper).click();
          expect(onToggle).toHaveBeenCalledTimes(size === 'mobile' ? expectedCallsOnMobileToggle : 1);
          expect(onToggle).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { open: false } }));
        });

        test('Renders two landmarks in closed state', async () => {
          const props = {
            [openProp]: false,
            [handler]: () => {},
          };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          const landmarks = findLandmarks(wrapper);
          expect(landmarks).toHaveLength(2);

          const toggleElement = findToggle(wrapper).getElement();

          if (theme === 'refresh-toolbar') {
            // toggles are always visible, no need to test for aria-hidden
            expect(landmarks[0].getElement()).toContainElement(toggleElement);
            expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'true');
          } else {
            if (landmarks[0].getElement().contains(toggleElement)) {
              expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'false');
              expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'true');
            } else {
              expect(landmarks[1].getElement()).toContainElement(toggleElement);
              expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'false');
              expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'true');
            }
          }
        });

        test('Renders two landmarks in open state', async () => {
          const props = {
            [openProp]: true,
            [handler]: () => {},
          };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          const landmarks = findLandmarks(wrapper);
          expect(landmarks).toHaveLength(2);
          const toggleElement = findToggle(wrapper).getElement();

          if (theme === 'refresh-toolbar') {
            // toggles are always visible, no need to test for aria-hidden
            expect(landmarks[0].getElement()).toContainElement(toggleElement);
            expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'false');
          } else {
            if (landmarks[0].getElement().contains(toggleElement)) {
              expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'true');
              expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'false');
            } else {
              expect(landmarks[1].getElement()).toContainElement(toggleElement);
              expect(landmarks[1].getElement()).toHaveAttribute('aria-hidden', 'true');
              expect(landmarks[0].getElement()).toHaveAttribute('aria-hidden', 'false');
            }
          }
        });

        test('Renders aria-expanded only on toggle', async () => {
          const props = {
            [openProp]: false,
            [handler]: () => {},
          };

          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-expanded', 'false');
          expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-haspopup', 'true');
          expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-expanded');
          expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-haspopup');
        });

        test('Does not add a label to the toggle and landmark when they are not defined', async () => {
          const { wrapper } = renderComponent(<AppLayout />);
          await waitForAppLayoutLoaded(wrapper);
          expect(findToggle(wrapper).getElement()).not.toHaveAttribute('aria-label');
          expect(findLandmarks(wrapper)[0].getElement()).not.toHaveAttribute('aria-label');
        });

        test('Adds labels to toggle button and landmark when defined', async () => {
          const labels = {
            navigationToggle: 'toggle',
            toolsToggle: 'toggle',
            navigation: 'landmark',
            tools: 'landmark',
          };

          const { wrapper } = renderComponent(<AppLayout ariaLabels={labels} />);
          await waitForAppLayoutLoaded(wrapper);
          expect(findToggle(wrapper).getElement()).toHaveAttribute('aria-label', 'toggle');
          expect(findLandmarks(wrapper)[theme === 'refresh-toolbar' ? 1 : 0].getElement()).toHaveAttribute(
            'aria-label',
            'landmark'
          );
        });

        test('Close button does have a label if it is defined', async () => {
          const props = { [openProp]: true, [handler]: () => {} };
          const labels = {
            navigationClose: 'close label',
            toolsClose: 'close label',
          };
          const { wrapper } = renderComponent(<AppLayout {...props} ariaLabels={labels} />);

          await waitForAppLayoutLoaded(wrapper);

          expect(findClose(wrapper).getElement()).toHaveAttribute('aria-label', 'close label');
        });

        test('Close button does not render a label if is not defined', async () => {
          const props = { [openProp]: true, [handler]: () => {} };
          const { wrapper } = renderComponent(<AppLayout {...props} />);

          await waitForAppLayoutLoaded(wrapper);

          expect(findClose(wrapper).getElement()).not.toHaveAttribute('aria-label');
        });

        test('Opens and closes drawer in uncontrolled mode', async () => {
          // use content type with initial closed state for all drawers
          const { wrapper } = renderComponent(<AppLayout contentType="form" />);

          await waitForAppLayoutLoaded(wrapper);

          expect(findOpenElement(wrapper)).toBeFalsy();

          findToggle(wrapper).click();
          expect(findOpenElement(wrapper)).toBeTruthy();

          findClose(wrapper).click();
          expect(findOpenElement(wrapper)).toBeFalsy();
        });

        test('Moves focus between open and close buttons', async () => {
          // use content type with initial closed state for all drawers
          const { wrapper } = renderComponent(<AppLayout contentType="form" />);

          await waitForAppLayoutLoaded(wrapper);

          findToggle(wrapper).click();
          expect(findClose(wrapper).getElement()).toBe(document.activeElement);

          findClose(wrapper).click();
          expect(findToggle(wrapper).getElement()).toBe(document.activeElement);
        });

        test(`Should not render the drawer if ${hideProp} is set to true`, () => {
          const props = { [hideProp]: true };
          const { wrapper } = renderComponent(<AppLayout {...props} />);
          expect(findElement(wrapper)).toBeFalsy();
          expect(() => findOpenElement(wrapper)).toThrow(/App Layout does not have .* content/);
          expect(findLandmarks(wrapper)).toHaveLength(0);
        });
      });
    }
  );

  // Drawers tests

  describe(`Drawers`, () => {
    test(`Should call handler once on open when toggle is clicked`, async () => {
      const onChange = jest.fn();
      const { wrapper } = renderComponent(
        <AppLayout drawers={[testDrawer]} onDrawerChange={event => onChange(event.detail)} />
      );
      await waitFor(() => {
        expect(wrapper.findDrawerTriggerById('security')).toBeTruthy();
      });
      wrapper.findDrawerTriggerById('security')!.click();
      expect(onChange).toHaveBeenCalledWith({ activeDrawerId: 'security' });
    });

    test(`Should call handler once on open when span inside toggle is clicked`, async () => {
      const onChange = jest.fn();
      const { wrapper } = renderComponent(
        <AppLayout drawers={[testDrawer]} onDrawerChange={event => onChange(event.detail)} />
      );
      await waitFor(() => {
        expect(wrapper.findDrawerTriggerById('security')).toBeTruthy();
      });
      // Chrome bubbles up events from specific elements inside <button>s.
      wrapper.findDrawerTriggerById('security')!.find('span')!.click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ activeDrawerId: 'security' });
    });

    test(`Should call handler once on close`, async () => {
      const onChange = jest.fn();
      const { wrapper } = renderComponent(
        <AppLayout
          drawers={[testDrawer]}
          activeDrawerId={testDrawer.id}
          onDrawerChange={event => onChange(event.detail)}
        />
      );
      await waitFor(() => {
        expect(wrapper.findActiveDrawerCloseButton()).toBeTruthy();
      });
      wrapper.findActiveDrawerCloseButton()!.click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ activeDrawerId: null });
    });

    test('Renders aria-expanded only on toggle', async () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);

      await waitFor(() => {
        expect(wrapper.findDrawerTriggerById('security')).toBeTruthy();
      });

      const drawerTrigger = wrapper.findDrawerTriggerById('security')!;
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-expanded', 'false');
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-haspopup', 'true');

      drawerTrigger.click();
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-expanded');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-haspopup');
    });

    test('Close button does have a label if it is defined', async () => {
      const { wrapper } = renderComponent(
        <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
      );

      await waitFor(() => {
        expect(wrapper.findActiveDrawerCloseButton()).toBeTruthy();
      });

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security close button'
      );
    });

    test('Close button does not render a label if is not defined', async () => {
      const { wrapper } = renderComponent(
        <AppLayout activeDrawerId={testDrawerWithoutLabels.id} drawers={[testDrawerWithoutLabels]} />
      );

      await waitFor(() => {
        expect(wrapper.findActiveDrawerCloseButton()).toBeTruthy();
      });

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-label');
    });

    test('Opens and closes drawer in uncontrolled mode', async () => {
      // use content type with initial closed state for all drawers
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
      expect(wrapper.findActiveDrawer()).toBeNull();

      await waitFor(() => {
        expect(wrapper.findDrawerTriggerById('security')).toBeTruthy();
      });

      wrapper.findDrawerTriggerById('security')!.find('span')!.click();
      expect(wrapper.findActiveDrawer()).not.toBeNull();

      wrapper.findActiveDrawerCloseButton()!.click();
      expect(wrapper.findActiveDrawer()).toBeNull();
    });
  });
});
