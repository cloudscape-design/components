// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import SplitPanel, { SplitPanelProps } from '../../../lib/components/split-panel';
import {
  SplitPanelContextProvider,
  SplitPanelContextProps,
} from '../../../lib/components/internal/context/split-panel-context';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/split-panel/styles.css.js';
import { defaultSplitPanelContextProps } from './helpers';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const onKeyDown = jest.fn();
jest.mock('../../../lib/components/app-layout/utils/use-keyboard-events', () => ({
  useKeyboardEvents: () => onKeyDown,
}));

const onSliderPointerDown = jest.fn();
jest.mock('../../../lib/components/app-layout/utils/use-pointer-events', () => ({
  usePointerEvents: () => onSliderPointerDown,
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

function renderSplitPanel({
  props,
  contextProps,
  messages = {},
}: {
  props?: Partial<SplitPanelProps>;
  contextProps?: Partial<SplitPanelContextProps>;
  messages?: Record<string, string>;
} = {}) {
  const { container } = render(
    <TestI18nProvider messages={{ 'split-panel': messages }}>
      <SplitPanelContextProvider value={{ ...defaultSplitPanelContextProps, ...contextProps }}>
        <SplitPanel {...defaultProps} {...props} />
      </SplitPanelContextProvider>
    </TestI18nProvider>
  );
  const wrapper = createWrapper(container).findSplitPanel()!;
  return { wrapper };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('Split panel', () => {
  test('throws error when split panel is used outside its context', () => {
    expect(() => render(<SplitPanel {...defaultProps} />)).toThrow('Split panel can only be used inside app layout');
  });

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
        (defaultSplitPanelContextProps.onToggle as jest.Mock).mockClear();

        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: true } });
        wrapper.findCloseButton()!.getElement().click();
        expect(defaultSplitPanelContextProps.onToggle).toHaveBeenCalledTimes(1);
      });

      test('opens panel', () => {
        (defaultSplitPanelContextProps.onToggle as jest.Mock).mockClear();

        const { wrapper } = renderSplitPanel({ contextProps: { position, isOpen: false } });
        wrapper.findOpenButton()!.getElement().click();
        expect(defaultSplitPanelContextProps.onToggle).toHaveBeenCalledTimes(1);
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

      test('fires pointerDown', () => {
        onSliderPointerDown.mockClear();
        const { wrapper } = renderSplitPanel({ contextProps: { position } });
        fireEvent.pointerDown(wrapper.findSlider()!.getElement());
        expect(onSliderPointerDown).toHaveBeenCalledTimes(1);
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

      expect(defaultSplitPanelContextProps.onPreferencesChange).not.toHaveBeenCalled();
      expect(createWrapper().findModal()).toBeNull();
    });

    test('confirms modal', () => {
      const { wrapper } = renderSplitPanel();
      wrapper.findPreferencesButton()!.click();
      const modalWrapper = createWrapper().findModal()!;

      modalWrapper.findFooter()!.findAll('button')[1].getElement().click();

      expect(defaultSplitPanelContextProps.onPreferencesChange).toHaveBeenCalledTimes(1);
      expect(defaultSplitPanelContextProps.onPreferencesChange).toHaveBeenCalledWith({
        position: defaultSplitPanelContextProps.position,
      });
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

  describe('has proper aria properties', () => {
    test('split panel content has correct role', () => {
      const { wrapper } = renderSplitPanel({ contextProps: { position: 'side' } });
      const sidePanelElem = wrapper.findByClassName(styles['drawer-content-side'])?.getElement();
      expect(sidePanelElem).toHaveAttribute('role', 'region');
    });

    test('split panel is labelled by panel header', () => {
      const { wrapper } = renderSplitPanel({ contextProps: { position: 'side' } });
      const sidePanelElem = wrapper.findByClassName(styles['drawer-content-side'])?.getElement();
      const labelId = sidePanelElem?.getAttribute('aria-labelledby');

      expect(sidePanelElem?.querySelector(`#${labelId}`)!.textContent).toBe('Split panel header');
    });
  });

  describe('i18n', () => {
    test('supports using i18nStrings.openButtonAriaLabel from i18n provider', () => {
      const { wrapper } = renderSplitPanel({
        props: { i18nStrings: undefined },
        contextProps: { position: 'bottom', isOpen: false },
        messages: { 'i18nStrings.openButtonAriaLabel': 'Custom open button' },
      });
      expect(wrapper.findOpenButton()!.getElement()).toHaveAttribute('aria-label', 'Custom open button');
    });

    test('supports using i18nStrings.closeButtonAriaLabel and i18nStrings.resizeHandleAriaLabel from i18n provider', () => {
      const { wrapper } = renderSplitPanel({
        props: { i18nStrings: undefined },
        contextProps: { position: 'bottom', isOpen: true },
        messages: {
          'i18nStrings.closeButtonAriaLabel': 'Custom close button',
          'i18nStrings.resizeHandleAriaLabel': 'Custom resize',
        },
      });
      expect(wrapper.findCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Custom close button');
      expect(wrapper.findSlider()!.getElement()).toHaveAttribute('aria-label', 'Custom resize');
    });

    test('supports using preferences props from i18n provider', () => {
      const { wrapper } = renderSplitPanel({
        props: { i18nStrings: undefined },
        contextProps: { position: 'bottom', isOpen: true },
        messages: {
          'i18nStrings.preferencesTitle': 'Custom title',
          'i18nStrings.preferencesPositionLabel': 'Custom position',
          'i18nStrings.preferencesPositionDescription': 'Custom position description',
          'i18nStrings.preferencesPositionSide': 'Custom side',
          'i18nStrings.preferencesPositionBottom': 'Custom bottom',
          'i18nStrings.preferencesConfirm': 'Custom confirm',
          'i18nStrings.preferencesCancel': 'Custom cancel',
        },
      });
      wrapper.findPreferencesButton()!.click();
      const modalWrapper = createWrapper().findModal()!;
      expect(modalWrapper.findHeader().getElement()).toHaveTextContent('Custom title');
      expect(modalWrapper.findContent().findFormField()!.findLabel()!.getElement()).toHaveTextContent(
        'Custom position'
      );
      expect(modalWrapper.findContent().findFormField()!.findDescription()!.getElement()).toHaveTextContent(
        'Custom position description'
      );
      const tileItems = modalWrapper.findContent().findTiles()!.findItems();
      expect(tileItems[0].findLabel().getElement()).toHaveTextContent('Custom bottom');
      expect(tileItems[1].findLabel().getElement()).toHaveTextContent('Custom side');
      const footerItems = modalWrapper.findFooter()!.findSpaceBetween()!;
      expect(footerItems.find(':nth-child(1)')!.findButton()!.getElement()).toHaveTextContent('Custom cancel');
      expect(footerItems.find(':nth-child(2)')!.findButton()!.getElement()).toHaveTextContent('Custom confirm');
    });
  });
});
