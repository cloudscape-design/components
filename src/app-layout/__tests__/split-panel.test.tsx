// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, screen } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import SplitPanel from '../../../lib/components/split-panel';
import { KeyCode } from '../../../lib/components/internal/keycode';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { renderComponent, splitPanelI18nStrings } from './utils';
import splitPanelStyles from '../../../lib/components/split-panel/styles.selectors.js';
import applayoutTools from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';

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

for (const theme of ['refresh', 'classic']) {
  describe(`Theme=${theme}`, () => {
    beforeEach(() => {
      (useVisualRefresh as jest.Mock).mockReturnValue(theme === 'refresh');
    });
    afterEach(() => {
      (useVisualRefresh as jest.Mock).mockReset();
    });
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

    (['bottom', 'side'] as const).forEach(position =>
      test(`split panel can open and close in ${position} position`, () => {
        const { wrapper } = renderComponent(
          <AppLayout
            splitPanel={defaultSplitPanel}
            splitPanelPreferences={{ position }}
            onSplitPanelPreferencesChange={noop}
          />
        );
        expect(wrapper.findSplitPanel()!.findOpenButton()).not.toBeNull();
        act(() => wrapper.findSplitPanel()!.findOpenButton()!.click());
        expect(wrapper.findSplitPanel()!.findOpenButton()).toBeNull();
        act(() => wrapper.findSplitPanel()!.findCloseButton()!.click());
        expect(wrapper.findSplitPanel()!.findOpenButton()).not.toBeNull();
      })
    );

    (['bottom', 'side'] as const).forEach(position => {
      test(`Moves focus to slider when opened in ${position} position`, () => {
        const { wrapper } = renderComponent(
          <AppLayout
            splitPanel={defaultSplitPanel}
            splitPanelPreferences={{ position }}
            onSplitPanelPreferencesChange={noop}
          />
        );
        act(() => wrapper.findSplitPanel()!.findOpenButton()!.click());
        expect(wrapper.findSplitPanel()!.findSlider()!.getElement()).toHaveFocus();
      });

      test(`Moves focus to open button when closed in ${position} position`, () => {
        const { wrapper } = renderComponent(
          <AppLayout
            splitPanel={defaultSplitPanel}
            splitPanelPreferences={{ position }}
            onSplitPanelPreferencesChange={noop}
          />
        );
        act(() => wrapper.findSplitPanel()!.findOpenButton()!.click());
        act(() => wrapper.findSplitPanel()!.findCloseButton()!.click());
        expect(wrapper.findSplitPanel()!.findOpenButton()!.getElement()).toHaveFocus();
      });
    });
    test(`should not render split panel when it is not defined in ${theme}`, () => {
      const { wrapper, rerender } = renderComponent(<AppLayout splitPanel={defaultSplitPanel} />);
      expect(wrapper.findSplitPanel()).toBeTruthy();
      rerender(<AppLayout />);
      expect(wrapper.findSplitPanel()).toBeFalsy();
    });
  });
}

describe('Visual refresh only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test('does not render the side open-button if split panel is in bottom position', () => {
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
    expect(wrapper.findSplitPanel()!.findOpenButton()).toBeFalsy();
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
    expect(wrapper.findSplitPanel()!.findOpenButton()).toBeFalsy();
  });

  test('renders side open-button bar when single split panel is closed in position side', () => {
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
    expect(wrapper.findSplitPanel()!.findOpenButton()).toBeTruthy();
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
    expect(wrapper.find(`.${splitPanelStyles['open-button']}`)).toBeFalsy();
  });

  test('should not show background color of split panel drawer when there is no splitPanel', () => {
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
    expect(wrapper.find('[data-testid="side-split-panel-drawer"]')?.getElement()).not.toHaveClass(
      applayoutTools['has-tools-form-persistence']
    );
    isMocked = false;
  });
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
