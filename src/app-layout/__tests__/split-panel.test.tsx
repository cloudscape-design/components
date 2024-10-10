// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useState } from 'react';
import { screen } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { AppLayoutProps } from '../../../lib/components/app-layout/interfaces';
import SplitPanel from '../../../lib/components/split-panel';
import { KeyCode } from '../../../lib/components/internal/keycode';
import { describeEachAppLayout, renderComponent, splitPanelI18nStrings } from './utils';
import applayoutTools from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';

const defaultSplitPanel = (
  <SplitPanel i18nStrings={splitPanelI18nStrings} header="test header">
    test content
  </SplitPanel>
);
const noop = () => {};

let originalDocumentHeight: number;
let originalGetComputedStyle: Window['getComputedStyle'];
const fakeComputedStyle: Window['getComputedStyle'] = (...args) => {
  const result = originalGetComputedStyle(...args);
  // stub width value to allow enough space for side positioning
  result.width = '600px';
  return result;
};

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isMotionDisabled: jest.fn().mockReturnValue(true),
  useDensityMode: jest.fn().mockReturnValue('comfortable'),
  useReducedMotion: jest.fn().mockReturnValue(true),
}));

let isMocked = false;

jest.mock('@cloudscape-design/component-toolkit', () => {
  const actualUseContainerQuery = jest.requireActual('@cloudscape-design/component-toolkit');
  return {
    ...actualUseContainerQuery,
    useContainerQuery: (arg: any) => (isMocked ? [800, () => {}] : actualUseContainerQuery.useContainerQuery(arg)),
  };
});

beforeEach(() => {
  originalDocumentHeight = document.documentElement.clientHeight;
  // stub height value to allow vertical resizing
  Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = fakeComputedStyle;
});
afterEach(() => {
  Object.defineProperty(document.documentElement, 'clientHeight', {
    value: originalDocumentHeight,
    configurable: true,
  });
  window.getComputedStyle = originalGetComputedStyle;
});

describeEachAppLayout({ sizes: ['desktop'] }, ({ theme }) => {
  function isDrawersBarDisplayed(wrapper: AppLayoutWrapper) {
    return !!wrapper.findByClassName(applayoutTools['has-tools-form']);
  }

  test('should render split panel in bottom position', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'bottom' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).not.toBeNull();
  });

  test('should render split panel in side position', () => {
    isMocked = true;
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'side' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findSplitPanel()!.findOpenPanelSide()).not.toBeNull();
    isMocked = false;
  });

  describe.each(['bottom', 'side'] as const)('%s position', position => {
    test('split panel can open and close', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanel={defaultSplitPanel}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={noop}
        />
      );
      expect(wrapper.findSplitPanelOpenButton()).not.toBeNull();
      wrapper.findSplitPanelOpenButton()!.click();
      if (theme === 'classic' || (theme === 'refresh' && position === 'bottom')) {
        expect(wrapper.findSplitPanelOpenButton()).toBeNull();
      } else {
        expect(wrapper.findSplitPanelOpenButton()).not.toBeNull();
      }
      wrapper.findSplitPanel()!.findCloseButton()!.click();
      expect(wrapper.findSplitPanelOpenButton()).not.toBeNull();
    });

    test('Moves focus to slider when opened', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanel={defaultSplitPanel}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={noop}
        />
      );
      wrapper.findSplitPanelOpenButton()!.click();
      expect(wrapper.findSplitPanel()!.findSlider()!.getElement()).toHaveFocus();
    });

    test('Moves focus to open button when closed', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanel={defaultSplitPanel}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={noop}
        />
      );
      wrapper.findSplitPanelOpenButton()!.click();
      wrapper.findSplitPanel()!.findCloseButton()!.click();
      expect(wrapper.findSplitPanelOpenButton()!.getElement()).toHaveFocus();
    });

    test(`Moves focus to the slider when focusSplitPanel() is called`, () => {
      const ref: React.MutableRefObject<AppLayoutProps.Ref | null> = React.createRef();
      const { wrapper } = renderComponent(
        <AppLayout
          ref={ref}
          splitPanel={defaultSplitPanel}
          splitPanelOpen={true}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={noop}
        />
      );
      ref.current!.focusSplitPanel();
      expect(wrapper.findSplitPanel()!.findSlider()!.getElement()).toHaveFocus();
    });

    test(`Does nothing when focusSplitPanel() is called but split panel is closed`, () => {
      const ref: React.MutableRefObject<AppLayoutProps.Ref | null> = React.createRef();
      renderComponent(
        <AppLayout
          ref={ref}
          splitPanel={defaultSplitPanel}
          splitPanelPreferences={{ position }}
          onSplitPanelPreferencesChange={noop}
        />
      );
      const previouslyFocusedElement = document.activeElement;
      ref.current!.focusSplitPanel();
      expect(previouslyFocusedElement).toHaveFocus();
    });
  });

  test('should not render split panel when it is not defined', () => {
    const { wrapper, rerender } = renderComponent(<AppLayout splitPanel={defaultSplitPanel} />);
    expect(wrapper.findSplitPanel()).toBeTruthy();
    rerender(<AppLayout />);
    expect(wrapper.findSplitPanel()).toBeFalsy();
  });

  test('should fire split panel toggle event', () => {
    const onSplitPanelToggle = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        onSplitPanelToggle={event => onSplitPanelToggle(event.detail)}
        splitPanelPreferences={{ position: 'bottom' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    wrapper.findSplitPanel()!.findOpenButton()!.click();
    expect(onSplitPanelToggle).toHaveBeenCalledWith({ open: true });
    onSplitPanelToggle.mockClear();
    wrapper.findSplitPanel()!.findCloseButton()!.click();
    expect(onSplitPanelToggle).toHaveBeenCalledWith({ open: false });
  });

  test('should change split panel position in uncontrolled mode', () => {
    const onPreferencesChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        onSplitPanelPreferencesChange={event => onPreferencesChange(event.detail)}
      />
    );
    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).not.toBeNull();
    wrapper.findSplitPanel()!.findPreferencesButton()!.click();
    expect(screen.getByRole('radio', { name: 'Bottom' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Side' })).toBeEnabled();
    screen.getByRole('radio', { name: 'Side' }).click();
    screen.getByRole('button', { name: 'Confirm' }).click();
    expect(wrapper.findSplitPanel()!.findOpenPanelSide()).not.toBeNull();
    expect(onPreferencesChange).toHaveBeenCalledWith({ position: 'side' });
  });

  test('should fire split panel resize event', () => {
    const onSplitPanelResize = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        onSplitPanelResize={event => onSplitPanelResize(event.detail)}
      />
    );
    wrapper.findSplitPanel()!.findSlider()!.keydown(KeyCode.pageUp);
    expect(onSplitPanelResize).toHaveBeenCalled();
  });

  test('should dynamically show and hide split panel based on "splitPanel" prop', () => {
    const CustomAppLayout = () => {
      const [splitPanelEnabled, setSplitPanelEnabled] = useState(true);
      return (
        <AppLayout
          splitPanel={splitPanelEnabled && defaultSplitPanel}
          content={
            <button data-testid="toggle-split-panel" onClick={() => setSplitPanelEnabled(!splitPanelEnabled)}>
              toggle
            </button>
          }
        />
      );
    };
    const { wrapper } = renderComponent(<CustomAppLayout />);

    expect(wrapper.findSplitPanelOpenButton()!.getElement()).toBeInTheDocument();

    wrapper.find('[data-testid="toggle-split-panel"]')!.click();

    expect(wrapper.findSplitPanelOpenButton()).toBeFalsy();

    wrapper.find('[data-testid="toggle-split-panel"]')!.click();

    expect(wrapper.findSplitPanelOpenButton()!.getElement()).toBeInTheDocument();
  });

  test(`${theme === 'refresh-toolbar' ? 'renders' : 'does not render'} the side open-button correctly when split panel is in bottom position`, () => {
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'bottom' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findToolsToggle()).toBeTruthy();
    expect(!!wrapper.findSplitPanelOpenButton()).toBe(theme === 'refresh-toolbar');
  });

  test(`${theme === 'refresh-toolbar' ? 'renders' : 'does not render'} the side open-button if split panel is in bottom position`, () => {
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'bottom' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findToolsToggle()).toBeTruthy();
    expect(!!wrapper.findSplitPanelOpenButton()).toBe(theme === 'refresh-toolbar');
  });

  test('does not render side open-button when single split panel is open in position side', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        toolsHide={true}
        splitPanel={defaultSplitPanel}
        splitPanelOpen={true}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'side' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(isDrawersBarDisplayed(wrapper)).toBeFalsy();
  });

  test(`${theme === 'refresh' ? 'renders' : 'does not render'} side open-button bar when single split panel is closed in position side`, () => {
    const { wrapper } = renderComponent(
      <AppLayout
        toolsHide={true}
        splitPanel={defaultSplitPanel}
        splitPanelOpen={false}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'side' }}
        onSplitPanelPreferencesChange={noop}
      />
    );
    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(isDrawersBarDisplayed(wrapper)).toBe(theme === 'refresh');
    expect(wrapper.findSplitPanelOpenButton()).toBeTruthy();
  });

  test('does render tools toggle when the drawer is hidden', () => {
    const defaultProps = {
      splitPanel: defaultSplitPanel,
      splitPanelPreferences: { position: 'side' },
      onSplitPanelPreferencesChange: noop,
    } as const;
    const { wrapper, rerender } = renderComponent(<AppLayout {...defaultProps} toolsHide={false} />);
    expect(wrapper.findToolsToggle()).toBeTruthy();
    rerender(<AppLayout {...defaultProps} toolsHide={true} />);
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('does not render open-button bar in default state', () => {
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findSplitPanelOpenButton()).toBeFalsy();
  });

  (theme === 'refresh' ? test : test.skip)(
    'should not show background color of split panel drawer when there is no splitPanel',
    () => {
      isMocked = true;
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanel={null}
          splitPanelOpen={true}
          splitPanelSize={400}
          splitPanelPreferences={{ position: 'side' }}
          onSplitPanelPreferencesChange={noop}
          onSplitPanelToggle={noop}
          onSplitPanelResize={noop}
        />
      );
      expect(wrapper.find('[data-testid="side-split-panel-drawer"]')!.getElement()).not.toHaveClass(
        applayoutTools['has-tools-form-persistence']
      );
      isMocked = false;
    }
  );

  test('should not set width on split panel drawer when there is no splitPanel', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        splitPanel={null}
        splitPanelOpen={true}
        splitPanelSize={400}
        onSplitPanelToggle={noop}
        splitPanelPreferences={{ position: 'side' }}
      />
    );
    expect(wrapper.find('[data-testid="side-split-panel-drawer"]')?.getElement().style.width).toBeFalsy();
  });
});
