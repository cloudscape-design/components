// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import SplitPanel, { SplitPanelProps } from '../../../lib/components/split-panel';
import {
  SplitPanelContext,
  SplitPanelContextProps,
} from '../../../lib/components/internal/context/split-panel-context';
import createWrapper, { SplitPanelWrapper } from '../../../lib/components/test-utils/dom';

const onKeyDown = jest.fn();
jest.mock('../../../lib/components/split-panel/utils/use-keyboard-events', () => ({
  useKeyboardEvents: () => onKeyDown,
}));

const onSliderMouseDown = jest.fn();
jest.mock('../../../lib/components/split-panel/utils/use-mouse-events', () => ({
  useMouseEvents: () => onSliderMouseDown,
}));

const i18nStrings = {
  closeButtonAriaLabel: 'closeButtonAriaLabel',
  openButtonAriaLabel: 'openButtonAriaLabel',
  preferencesTitle: 'preferencesTitle',
  preferencesPositionLabel: 'preferencesPositionLabel',
  preferencesPositionDescription: 'preferencesPositionDescription',
  preferencesPositionSide: 'preferencesPositionSide',
  preferencesPositionBottom: 'preferencesPositionBottom',
  preferencesConfirm: 'preferencesConfirm',
  preferencesCancel: 'preferencesCancel',
  resizeHandleAriaLabel: 'resizeHandleAriaLabel',
};

const defaultProps: SplitPanelProps = {
  header: 'Split panel header',
  children: <p>Split panel content</p>,
  hidePreferencesButton: undefined,
  i18nStrings,
};

const defaultContextProps: SplitPanelContextProps = {
  topOffset: 0,
  bottomOffset: 0,
  leftOffset: 0,
  rightOffset: 0,
  position: 'bottom',
  size: 0,
  getMaxWidth: () => 500,
  getMaxHeight: () => 500,
  getHeader: () => null,
  isOpen: true,
  isMobile: false,
  isRefresh: false,
  isForcedPosition: false,
  onResize: jest.fn(),
  onToggle: jest.fn(),
  onPreferencesChange: jest.fn(),
  reportSize: jest.fn(),
};

function renderSplitPanel({
  props,
  contextProps,
}: {
  props?: Partial<SplitPanelProps>;
  contextProps?: Partial<SplitPanelContextProps>;
} = {}) {
  const { container } = render(
    <SplitPanelContext.Provider value={{ ...defaultContextProps, ...contextProps }}>
      <SplitPanel {...defaultProps} {...props} />
    </SplitPanelContext.Provider>
  );
  const wrapper = createWrapper(container).findSplitPanel()!;
  return { wrapper };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('Split panel', () => {
  test('renders panel in bottom position', () => {
    const { wrapper } = renderSplitPanel({ contextProps: { position: 'bottom' } });
    expect(wrapper.findOpenPanelBottom()).not.toBeNull();
    expect(wrapper.findOpenPanelSide()).toBeNull();
  });

  test('renders panel in side position', () => {
    const { wrapper } = renderSplitPanel({ contextProps: { position: 'side' } });
    expect(wrapper.findOpenPanelBottom()).toBeNull();
    expect(wrapper.findOpenPanelSide()).not.toBeNull();
  });

  describe.each(['bottom', 'side'] as const)('Position %s', position => {
    test('displays header, content and aria-label', () => {
      const { wrapper } = renderSplitPanel({ contextProps: { position } });
      expect(wrapper.findHeader().getElement()).toHaveTextContent('Split panel header');
      expect(wrapper.getElement()).toHaveTextContent('Split panel content');
      expect(wrapper.findSlider()!.getElement()).toHaveAttribute('aria-label', 'resizeHandleAriaLabel');
    });

    describe('Toggling', () => {
      test('shows close button on open', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: true } });
        expect(wrapper.findCloseButton()).not.toBeNull();
        expect(wrapper.findCloseButton()!.getElement()).toHaveAttribute('aria-label', 'closeButtonAriaLabel');
      });

      test('does not show close button on closed panel', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: false } });
        expect(wrapper.findCloseButton()).toBeNull();
      });

      test('shows open button on closed', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: false } });
        expect(wrapper.findOpenButton()).not.toBeNull();
        expect(wrapper.findOpenButton()!.getElement()).toHaveAttribute('aria-label', 'openButtonAriaLabel');
      });

      test('does not show open button on open panel', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: true } });
        expect(wrapper.findOpenButton()).toBeNull();
      });

      test('hides panel', () => {
        (defaultContextProps.onToggle as jest.Mock).mockClear();

        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: true } });
        wrapper.findCloseButton()!.getElement().click();
        expect(defaultContextProps.onToggle).toHaveBeenCalledTimes(1);
      });

      test('opens panel', () => {
        (defaultContextProps.onToggle as jest.Mock).mockClear();

        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: false } });
        wrapper.findOpenButton()!.getElement().click();
        expect(defaultContextProps.onToggle).toHaveBeenCalledTimes(1);
      });
    });

    describe('Slider', () => {
      test('shows slider on open panel', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: true } });
        expect(wrapper.findSlider()).not.toBeNull();
      });

      test('does not show slider button on closed panel', () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: false } });
        expect(wrapper.findSlider()).toBeNull();
      });

      test('fires keyDown', () => {
        onKeyDown.mockClear();
        const { wrapper } = renderSplitPanel({ contextProps: { position } });
        fireEvent.keyDown(wrapper.findSlider()!.getElement(), { keyCode: KeyCode.up });
        expect(onKeyDown).toHaveBeenCalledTimes(1);
      });

      test('fires mouseDown', () => {
        onSliderMouseDown.mockClear();
        const { wrapper } = renderSplitPanel({ contextProps: { position } });
        fireEvent.mouseDown(wrapper.findSlider()!.getElement());
        expect(onSliderMouseDown).toHaveBeenCalledTimes(1);
      });
    });

    describe('size adjustments', () => {
      const minSize = position === 'bottom' ? 160 : 280;

      function getPanelSize(wrapper: SplitPanelWrapper) {
        if (position === 'bottom') {
          return wrapper.findOpenPanelBottom()!.getElement().style.height;
        }
        return (wrapper.findOpenPanelSide()!.getElement() as HTMLElement).style.width;
      }

      // layout calculation is delayed by one frame to wait for app-layout to finish its rendering
      function nextFrame() {
        return act(async () => {
          await new Promise(resolve => requestAnimationFrame(resolve));
        });
      }

      test('renders specified size', async () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, size: 300 } });
        await nextFrame();

        expect(getPanelSize(wrapper)).toEqual('300px');
        expect(defaultContextProps.reportSize).toHaveBeenCalledTimes(1);
        expect(defaultContextProps.reportSize).toHaveBeenLastCalledWith(300);
      });

      test('size cannot be less than minSize', async () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, size: 100 } });
        await nextFrame();

        expect(getPanelSize(wrapper)).toEqual(`${minSize}px`);
        expect(defaultContextProps.reportSize).toHaveBeenCalledTimes(1);
        expect(defaultContextProps.reportSize).toHaveBeenLastCalledWith(minSize);
      });

      test('size cannot be more than maxSize', async () => {
        const { wrapper } = renderSplitPanel({ contextProps: { position, size: 800 } });
        await nextFrame();

        expect(getPanelSize(wrapper)).toEqual('500px');
        expect(defaultContextProps.reportSize).toHaveBeenCalledTimes(2);
        expect(defaultContextProps.reportSize).toHaveBeenLastCalledWith(500);
      });

      test('when minSize > maxSize, prefer minSize', async () => {
        const { wrapper } = renderSplitPanel({
          contextProps: { position, size: 300, getMaxHeight: () => 100, getMaxWidth: () => 100 },
        });
        await nextFrame();

        expect(getPanelSize(wrapper)).toEqual(`${minSize}px`);
        expect(defaultContextProps.reportSize).toHaveBeenCalledTimes(2);
        expect(defaultContextProps.reportSize).toHaveBeenCalledWith(minSize);
      });
    });
  });

  describe('Preferences', () => {
    test('shows preferences button by default', () => {
      const { wrapper } = renderSplitPanel();
      expect(wrapper.findPreferencesButton()).not.toBeNull();
    });

    test('hides preferences button', () => {
      const { wrapper } = renderSplitPanel({ props: { hidePreferencesButton: true } });
      expect(wrapper.findPreferencesButton()).toBeNull();
    });

    test('opens preferences modal', () => {
      const { wrapper } = renderSplitPanel();
      wrapper.findPreferencesButton()!.click();
      const modalWrapper = createWrapper().findModal();
      expect(modalWrapper).not.toBeNull();
    });

    test('cancels modal', () => {
      const { wrapper } = renderSplitPanel();
      wrapper.findPreferencesButton()!.click();
      const modalWrapper = createWrapper().findModal()!;

      modalWrapper.findFooter()!.findAll('button')[0].getElement().click();

      expect(defaultContextProps.onPreferencesChange).not.toHaveBeenCalled();
      expect(createWrapper().findModal()).toBeNull();
    });

    test('confirms modal', () => {
      const { wrapper } = renderSplitPanel();
      wrapper.findPreferencesButton()!.click();
      const modalWrapper = createWrapper().findModal()!;

      modalWrapper.findFooter()!.findAll('button')[1].getElement().click();

      expect(defaultContextProps.onPreferencesChange).toHaveBeenCalledTimes(1);
      expect(defaultContextProps.onPreferencesChange).toHaveBeenCalledWith({ position: defaultContextProps.position });
      expect(createWrapper().findModal()).toBeNull();
    });

    test('disables "side" position option in forced "bottom" position', () => {
      const { wrapper } = renderSplitPanel({ contextProps: { isForcedPosition: true } });
      wrapper.findPreferencesButton()!.click();
      const sidePositionTileElement = createWrapper()
        .findModal()!
        .findContent()!
        .findTiles()!
        .findInputByValue('side')!
        .getElement();
      expect(sidePositionTileElement?.disabled).toBeTruthy();
    });
  });
});
