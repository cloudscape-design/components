// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/flashbar/styles.css.js';
import { createFlashbarWrapper } from './common';

let mockUseAnimations = false;
let useAnimations = false;
jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => {
  const originalVisualModeModule = jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode');
  return {
    __esModule: true,
    ...originalVisualModeModule,
    useVisualRefresh: (...args: any) =>
      mockUseAnimations ? useAnimations : originalVisualModeModule.useVisualRefresh(...args),
    useReducedMotion: (...args: any) =>
      mockUseAnimations ? !useAnimations : originalVisualModeModule.useReducedMotion(...args),
  };
});

declare global {
  interface Window {
    panorama?: any;
  }
}

const noop = () => void 0;
const toggleButtonSelector = 'button';

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('Flashbar component', () => {
  beforeAll(() => {
    mockUseAnimations = true;
  });
  afterAll(() => {
    mockUseAnimations = false;
  });

  for (const withAnimations of [false, true]) {
    describe(withAnimations ? 'with animations' : 'without animations', () => {
      beforeEach(() => {
        useAnimations = withAnimations;
      });

      test('renders no flash when items are empty', () => {
        const wrapper = createFlashbarWrapper(<Flashbar items={[]} />);
        expect(wrapper.findItems().length).toBe(0);
      });

      test('renders correct count of flash messages', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { header: 'Item 1', id: '0' },
              { header: 'Item 2', id: '1' },
              { header: 'Item 3', id: '2' },
            ]}
          />
        );
        expect(wrapper.findItems().length).toBe(3);
      });

      test('dismiss buttons', () => {
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              items={[{ content: 'Non-dismissible flash', buttonText: 'Action button', onButtonClick: noop, id: '0' }]}
            />
          );
          expect(wrapper.findItems()[0].findDismissButton()).toBeNull();
        }
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              items={[
                {
                  content: 'Non-dismissible flash',
                  buttonText: 'Action button',
                  onButtonClick: noop,
                  dismissible: false,
                  id: '0',
                },
              ]}
            />
          );
          expect(wrapper.findItems()[0].findDismissButton()).toBeNull();
        }
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              items={[
                {
                  content: 'Dismissible flash',
                  buttonText: 'Action button',
                  onButtonClick: noop,
                  dismissible: true,
                  dismissLabel: 'Dismiss',
                  onDismiss: noop,
                  id: '0',
                },
              ]}
            />
          );
          expect(wrapper.findItems()[0].findDismissButton()).not.toBeNull();
        }
      });

      test('dismiss buttons have no default label', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar items={[{ content: 'Dismissible flash', dismissible: true, onDismiss: noop }]} />
        );
        expect(wrapper.findItems()[0].findDismissButton()!.getElement()).not.toHaveAttribute('aria-label');
      });

      test('dismiss buttons can have specified labels', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              {
                content: 'Dismissible flash',
                dismissible: true,
                onDismiss: noop,
                dismissLabel: 'close 1',
                id: '0',
              },
              {
                content: 'Dismissible flash',
                dismissible: true,
                onDismiss: noop,
                dismissLabel: 'close 2',
                id: '1',
              },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'close 1');
        expect(wrapper.findItems()[1].findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'close 2');
      });

      test('loading state', () => {
        {
          const spinner = createWrapper(
            reactRender(<Flashbar items={[{ content: 'Not loading flash', id: '0' }]} />).container
          ).findSpinner();
          expect(spinner).toBeNull();
        }
        {
          const spinner = createWrapper(
            reactRender(<Flashbar items={[{ content: 'Loading flash', loading: true, id: '0' }]} />).container
          ).findSpinner();
          expect(spinner).not.toBeNull();
        }
      });

      test('correct type of message', () => {
        {
          const wrapper = createFlashbarWrapper(<Flashbar items={[{ content: 'Flash', type: 'success', id: '0' }]} />);
          expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
            styles['flash-type-success']
          );
        }
        {
          const wrapper = createFlashbarWrapper(<Flashbar items={[{ content: 'Flash', type: 'warning', id: '0' }]} />);
          expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
            styles['flash-type-warning']
          );
        }
        {
          const wrapper = createFlashbarWrapper(<Flashbar items={[{ content: 'Flash', type: 'info', id: '0' }]} />);
          expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
            styles['flash-type-info']
          );
        }
        {
          const wrapper = createFlashbarWrapper(<Flashbar items={[{ content: 'Flash', type: 'error', id: '0' }]} />);
          expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
            styles['flash-type-error']
          );
        }
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar items={[{ content: 'Flash', type: 'error', loading: true, id: '0' }]} />
          );
          expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
            styles['flash-type-info']
          );
        }
      });

      test('correct aria-role', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { content: 'Alert', ariaRole: 'alert', id: '0' },
              { content: 'Status', ariaRole: 'status', id: '1' },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveAttribute('role', 'alert');
        expect(wrapper.findItems()[1].findByClassName(styles.flash)!.getElement()).toHaveAttribute('role', 'status');
      });

      test('correct header', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findHeader()!.getElement()).toHaveTextContent('The header');
      });

      test('correct content', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('The content');
      });

      test('correct button text', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findActionButton()!.findTextRegion()!.getElement()).toHaveTextContent(
          'The button text'
        );
      });

      test('renders `action` content', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar items={[{ header: 'The header', content: 'The content', action: <Button>Click me</Button> }]} />
        );
        expect(wrapper.findItems()[0].findAction()!.findButton()!.getElement()).toHaveTextContent('Click me');
      });

      test('when both `buttonText` and `action` provided, prefers the latter', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              {
                header: 'The header',
                content: 'The content',
                buttonText: 'buttonText',
                action: <Button>Action</Button>,
              },
            ]}
          />
        );
        expect(wrapper.findItems()[0].findActionButton()).toBeNull();
        expect(wrapper.findItems()[0].findAction()!.findButton()!.getElement()).toHaveTextContent('Action');
      });

      test('dismiss callback gets called', () => {
        const dismissSpy = jest.fn();
        const buttonClickSpy = jest.fn();
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              {
                header: 'The header',
                content: 'The content',
                dismissible: true,
                dismissLabel: 'Dismiss',
                buttonText: 'Action button',
                onDismiss: dismissSpy,
                onButtonClick: buttonClickSpy,
              },
            ]}
          />
        );
        wrapper.findItems()[0].findDismissButton()!.click();
        expect(dismissSpy).toHaveBeenCalled();
        expect(buttonClickSpy).not.toHaveBeenCalled();
      });

      test('action button callback gets called', () => {
        const dismissSpy = jest.fn();
        const buttonClickSpy = jest.fn();
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              {
                header: 'The header',
                content: 'The content',
                dismissible: true,
                dismissLabel: 'Dismiss',
                buttonText: 'Action button',
                onDismiss: dismissSpy,
                onButtonClick: buttonClickSpy,
              },
            ]}
          />
        );
        wrapper.findItems()[0].findActionButton()!.click();

        expect(buttonClickSpy).toHaveBeenCalled();
        expect(dismissSpy).not.toHaveBeenCalled();
      });

      test('icon has an aria-label when statusIconAriaLabel is provided', () => {
        const iconLabel = 'Warning';
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              {
                header: 'The header',
                content: 'The content',
                statusIconAriaLabel: iconLabel,
                action: <Button>Click me</Button>,
              },
            ]}
          />
        );

        expect(wrapper.findItems()[0].find(`:scope [aria-label]`)?.getElement()).toHaveAttribute(
          'aria-label',
          iconLabel
        );
      });
    });
  }
});

describe('Analytics', () => {
  beforeEach(() => {
    window.panorama = () => {};
    jest.spyOn(window, 'panorama');
  });
  it('does not send a metric when an empty array is provided', () => {
    createFlashbarWrapper(<Flashbar items={[]} />);
    expect(window.panorama).toBeCalledTimes(0);
  });

  it('sends a render metric when items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'render',
        eventValue: '2',
        eventDetail: expect.any(String),
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a render metric when items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'render',
        eventValue: '2',
        eventDetail: expect.any(String),
        timestamp: expect.any(Number),
      })
    );
  });

  it('does not send duplicate render metrics on multiple renders', () => {
    const items: FlashbarProps['items'] = [
      { type: 'error', header: 'Error', content: 'There was an error' },
      { type: 'success', header: 'Success', content: 'Everything went fine' },
    ];

    const { rerender } = reactRender(<Flashbar items={items} />);
    rerender(<Flashbar items={items} />);
    expect(window.panorama).toBeCalledTimes(1);
  });

  it('sends an expand metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    window.panorama?.mockClear(); // clear render event

    wrapper.find(toggleButtonSelector)!.click();

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'expand',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a collapse metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    wrapper.find(toggleButtonSelector)!.click(); // expand
    window.panorama?.mockClear(); // clear previous events

    wrapper.find(toggleButtonSelector)!.click(); // collapse
    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'collapse',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });
});

describe('Analytics', () => {
  beforeEach(() => {
    window.panorama = () => {};
    jest.spyOn(window, 'panorama');
  });
  it('does not send a metric when an empty array is provided', () => {
    createFlashbarWrapper(<Flashbar items={[]} />);
    expect(window.panorama).toBeCalledTimes(0);
  });

  it('sends a render metric when items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'render',
        eventValue: '2',
        eventDetail: expect.any(String),
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a render metric when items are provided', () => {
    createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'render',
        eventValue: '2',
        eventDetail: expect.any(String),
        timestamp: expect.any(Number),
      })
    );
  });

  it('does not send duplicate render metrics on multiple renders', () => {
    const items: FlashbarProps['items'] = [
      { type: 'error', header: 'Error', content: 'There was an error' },
      { type: 'success', header: 'Success', content: 'Everything went fine' },
    ];

    const { rerender } = reactRender(<Flashbar items={items} />);
    rerender(<Flashbar items={items} />);
    expect(window.panorama).toBeCalledTimes(1);
  });

  it('sends a dismiss metric when a flash item is dismissed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar items={[{ type: 'error', header: 'Error', content: 'There was an error', dismissible: true }]} />
    );
    window.panorama?.mockClear(); // clear render event
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'dismiss',
        eventValue: 'error',
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends an expand metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    window.panorama?.mockClear(); // clear render event

    wrapper.find(toggleButtonSelector)!.click();

    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'expand',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });

  it('sends a collapse metric when collapsed', () => {
    const wrapper = createFlashbarWrapper(
      <Flashbar
        {...{ stackItems: true }}
        items={[
          { type: 'error', header: 'Error', content: 'There was an error' },
          { type: 'success', header: 'Success', content: 'Everything went fine' },
        ]}
      />
    );
    wrapper.find(toggleButtonSelector)!.click(); // expand
    window.panorama?.mockClear(); // clear previous events

    wrapper.find(toggleButtonSelector)!.click(); // collapse
    expect(window.panorama).toBeCalledTimes(1);
    expect(window.panorama).toHaveBeenCalledWith(
      'trackCustomEvent',
      expect.objectContaining({
        eventContext: 'csa_flashbar',
        eventType: 'collapse',
        eventValue: '2',
        timestamp: expect.any(Number),
      })
    );
  });
});
