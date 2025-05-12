// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { act, render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import createWrapper from '../../../lib/components/test-utils/dom';
import { useRuntimeDrawerContext } from '../runtime-drawer/use-runtime-drawer-context';
import { describeEachAppLayout, getGlobalDrawersTestUtils, testDrawer } from './utils';

async function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, ...rest } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  const globalDrawersWrapper = getGlobalDrawersTestUtils(wrapper);
  await delay();
  return {
    wrapper,
    globalDrawersWrapper,
    rerender,
    getByTestId,
    ...rest,
  };
}

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

beforeEach(() => {
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  describe('runtime drawer context hook', () => {
    const DrawerContent = () => {
      const ref = useRef<HTMLDivElement>(null);
      const runtimeDrawerContext = useRuntimeDrawerContext({ rootRef: ref });
      return (
        <div ref={ref}>
          DrawerContent id: {runtimeDrawerContext?.id} resizable: {runtimeDrawerContext?.resizable ? 'true' : 'false'}
        </div>
      );
    };
    test('does not pass runtime context if rendered within a normal drawer', async () => {
      const { wrapper } = await renderComponent(
        <AppLayout
          drawers={[
            {
              ...testDrawer,
              id: 'test',
              content: <DrawerContent />,
            },
          ]}
        />
      );

      wrapper.findDrawerTriggerById('test')!.click();
      expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('DrawerContent id: resizable: false');
    });

    test('passes runtime drawer context via the hook', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        id: 'test1',
        ariaLabels: {},
        trigger: { iconSvg: '' },
        mountContent: container => {
          ReactDOM.render(<DrawerContent />, container);
        },
        unmountContent: container => unmountComponentAtNode(container),
        type: 'global',
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout />);

      wrapper.findDrawerTriggerById('test1')!.click();
      expect(globalDrawersWrapper.findDrawerById('test1')!.getElement()).toHaveTextContent(
        'DrawerContent id: test1 resizable: false'
      );

      awsuiPlugins.appLayout.updateDrawer({
        id: 'test1',
        resizable: true,
      });

      await delay();

      expect(globalDrawersWrapper.findDrawerById('test1')!.getElement()).toHaveTextContent(
        'DrawerContent id: test1 resizable: true'
      );
    });

    test('should provide updated runtime context when multiple drawers are open', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        id: 'test1',
        ariaLabels: {},
        trigger: { iconSvg: '' },
        mountContent: container => {
          ReactDOM.render(
            <div>
              <div>
                <div>
                  <DrawerContent />
                </div>
              </div>
            </div>,
            container
          );
        },
        unmountContent: container => unmountComponentAtNode(container),
        type: 'global',
      });
      awsuiPlugins.appLayout.registerDrawer({
        id: 'test2',
        ariaLabels: {},
        trigger: { iconSvg: '' },
        mountContent: container => {
          ReactDOM.render(<DrawerContent />, container);
        },
        unmountContent: container => unmountComponentAtNode(container),
        type: 'global',
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout />);

      wrapper.findDrawerTriggerById('test1')!.click();
      wrapper.findDrawerTriggerById('test2')!.click();

      await delay();

      expect(globalDrawersWrapper.findDrawerById('test1')!.getElement()).toHaveTextContent(
        'DrawerContent id: test1 resizable: false'
      );
      expect(globalDrawersWrapper.findDrawerById('test2')!.getElement()).toHaveTextContent(
        'DrawerContent id: test2 resizable: false'
      );

      awsuiPlugins.appLayout.updateDrawer({
        id: 'test1',
        resizable: true,
      });

      await delay();

      expect(globalDrawersWrapper.findDrawerById('test1')!.getElement()).toHaveTextContent(
        'DrawerContent id: test1 resizable: true'
      );
      expect(globalDrawersWrapper.findDrawerById('test2')!.getElement()).toHaveTextContent(
        'DrawerContent id: test2 resizable: false'
      );

      awsuiPlugins.appLayout.updateDrawer({
        id: 'test2',
        resizable: true,
      });

      await delay();

      expect(globalDrawersWrapper.findDrawerById('test1')!.getElement()).toHaveTextContent(
        'DrawerContent id: test1 resizable: true'
      );
      expect(globalDrawersWrapper.findDrawerById('test2')!.getElement()).toHaveTextContent(
        'DrawerContent id: test2 resizable: true'
      );

      wrapper.findDrawerTriggerById('test1')!.click();
      expect(globalDrawersWrapper.findDrawerById('test1')).toBeFalsy();

      awsuiPlugins.appLayout.updateDrawer({
        id: 'test2',
        resizable: false,
      });

      await delay();

      expect(globalDrawersWrapper.findDrawerById('test2')!.getElement()).toHaveTextContent(
        'DrawerContent id: test2 resizable: false'
      );
    });
  });
});
