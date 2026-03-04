// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { loadFormatter } from '../../../lib/components/app-layout/visual-refresh-toolbar/internal';
import { I18nProvider } from '../../../lib/components/i18n';
import { I18nFormatter } from '../../../lib/components/i18n/utils/i18n-formatter';
import SplitPanel from '../../../lib/components/split-panel';
import { describeEachAppLayout, manyDrawers, renderComponent } from './utils';

// no-op function to suppress controllability warnings
function noop() {}

jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/internal', () => ({
  ...jest.requireActual('../../../lib/components/app-layout/visual-refresh-toolbar/internal'),
  loadFormatter: jest.fn(() => Promise.resolve(null)),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('toolbar mode only features', () => {
  describeEachAppLayout({ themes: ['refresh-toolbar'] }, ({ size }) => {
    test('does not render the toolbar when all panels are hidden', () => {
      const { wrapper } = renderComponent(<AppLayout navigationHide={true} toolsHide={true} />);
      expect(wrapper.findToolbar()).toBeFalsy();
    });

    test('renders toggle buttons when drawers are closed', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationOpen={false} toolsOpen={false} onNavigationChange={noop} onToolsChange={noop} />
      );
      expect(wrapper.findActiveDrawer()).toBeNull();
      expect(wrapper.findToolbar()).toBeTruthy();
      expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findNavigationToggle()!.getElement());
      expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findToolsToggle()!.getElement());
    });

    test('renders navigation toggle button for open state', () => {
      const { wrapper } = renderComponent(<AppLayout navigationOpen={true} onNavigationChange={noop} />);
      expect(wrapper.findToolbar()).toBeTruthy();
      expect(wrapper.findNavigationToggle()).toBeTruthy();
    });

    test('renders toolbar with split panel trigger', () => {
      const { wrapper } = renderComponent(
        <AppLayout splitPanel={<SplitPanel header="Testing">Dummy for testing</SplitPanel>} />
      );
      expect(wrapper.findToolbar()).toBeTruthy();
      expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findSplitPanelOpenButton()!.getElement());
    });

    test('renders toolbar with split panel trigger in active state', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanelOpen={true}
          splitPanel={<SplitPanel header="Testing">Dummy for testing</SplitPanel>}
          onSplitPanelToggle={noop}
        />
      );
      expect(wrapper.findToolbar()).toBeTruthy();
      expect(wrapper.findToolbar()!.getElement()).toContainElement(wrapper.findSplitPanelOpenButton()!.getElement());
      expect(wrapper.findSplitPanelOpenButton()!.getElement()).toHaveAttribute('aria-expanded', 'true');
    });

    // skip on desktop because requires element queries to work
    (size === 'mobile' ? describe : describe.skip)('multiple drawers', () => {
      test('renders multiple toggle buttons', () => {
        const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
        expect(wrapper.findToolbar()).toBeTruthy();
        expect(wrapper.findToolbar()!.getElement()).toContainElement(
          wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()
        );
        expect(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });

      test('renders multiple toggle buttons with an active drawer', () => {
        const { wrapper } = renderComponent(
          <AppLayout activeDrawerId={manyDrawers[0].id} drawers={manyDrawers} onDrawerChange={noop} />
        );
        expect(wrapper.findToolbar()).toBeTruthy();
        expect(wrapper.findToolbar()!.getElement()).toContainElement(
          wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()
        );
        expect(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()).toHaveAttribute('aria-expanded', 'true');
      });
    });

    describe('RemoteI18nProvider integration', () => {
      test('does not block content while formatter is pending or null', async () => {
        // Keep the promise pending until we manually resolve it.
        let resolveFn: (value: null) => void = () => {};
        const loadFormatterImpl = () => {
          return new Promise<null>(resolve => {
            resolveFn = resolve;
          });
        };
        jest.mocked(loadFormatter).mockImplementation(loadFormatterImpl);

        const { wrapper } = renderComponent(<AppLayout content="App layout content" />);
        expect(wrapper.findContentRegion().getElement()).toHaveTextContent('App layout content');

        resolveFn(null);
        await waitFor(() => {
          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('App layout content');
        });
      });

      test('does not fail if loading formatter fails', async () => {
        jest.mocked(loadFormatter).mockImplementation(() => Promise.reject(new Error('failed :(')));
        const { wrapper } = renderComponent(<AppLayout content="App layout content" />);

        await waitFor(() => {
          expect(wrapper.findContentRegion().getElement()).toHaveTextContent('App layout content');
        });
      });

      test('does not call loadFormatter if app layout is wrapped by I18nProvider', () => {
        renderComponent(
          // It doesn't need to have messages, just the existence of a wrapping provider is enough.
          <I18nProvider locale="en" messages={[]}>
            <AppLayout content="App layout content" />
          </I18nProvider>
        );
        expect(loadFormatter).not.toHaveBeenCalled();
      });

      test('rerenders app layout with labels when formatter is correctly loaded', async () => {
        // Keep the promise pending until we manually resolve it.
        let resolveFn: (value: I18nFormatter) => void = () => {};
        const loadFormatterImpl = () => {
          return new Promise<I18nFormatter>(resolve => {
            resolveFn = resolve;
          });
        };
        jest.mocked(loadFormatter as unknown as () => Promise<I18nFormatter>).mockImplementation(loadFormatterImpl);

        const { wrapper } = renderComponent(<AppLayout navigationOpen={true} toolsOpen={true} />);
        expect(wrapper.findNavigationClose().getElement()).not.toHaveAttribute('aria-label');
        expect(wrapper.findToolsClose().getElement()).not.toHaveAttribute('aria-label');

        resolveFn(
          new I18nFormatter('en-US', {
            'cloudscape-design-components': {
              'en-US': {
                'app-layout': {
                  'ariaLabels.navigationClose': 'remote navigationClose',
                  'ariaLabels.toolsClose': 'remote toolsClose',
                },
              },
            },
          })
        );

        await waitFor(() => {
          expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-label', 'remote navigationClose');
          expect(wrapper.findToolsClose().getElement()).toHaveAttribute('aria-label', 'remote toolsClose');
        });
      });
    });
  });
});
