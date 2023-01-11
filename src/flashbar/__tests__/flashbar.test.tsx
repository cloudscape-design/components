// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/flashbar/styles.css.js';

declare global {
  interface Window {
    panorama?: any;
  }
}

function render(element: React.ReactElement) {
  return createWrapper(reactRender(element).container).findFlashbar()!;
}

const noop = () => void 0;
const toggleButtonSelector = 'button';

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('Flashbar component', () => {
  test('renders no flash when items are empty', () => {
    const wrapper = render(<Flashbar items={[]} />);
    expect(wrapper.findItems().length).toBe(0);
  });

  test('renders correct count of flash messages', () => {
    const wrapper = render(<Flashbar items={[{ header: 'Item 1' }, { header: 'Item 2' }, { header: 'Item 3' }]} />);
    expect(wrapper.findItems().length).toBe(3);
  });

  test('dismiss buttons', () => {
    {
      const wrapper = render(
        <Flashbar items={[{ content: 'Non-dismissible flash', buttonText: 'Action button', onButtonClick: noop }]} />
      );
      expect(wrapper.findItems()[0].findDismissButton()).toBeNull();
    }
    {
      const wrapper = render(
        <Flashbar
          items={[
            { content: 'Non-dismissible flash', buttonText: 'Action button', onButtonClick: noop, dismissible: false },
          ]}
        />
      );
      expect(wrapper.findItems()[0].findDismissButton()).toBeNull();
    }
    {
      const wrapper = render(
        <Flashbar
          items={[
            {
              content: 'Dismissible flash',
              buttonText: 'Action button',
              onButtonClick: noop,
              dismissible: true,
              dismissLabel: 'Dismiss',
              onDismiss: noop,
            },
          ]}
        />
      );
      expect(wrapper.findItems()[0].findDismissButton()).not.toBeNull();
    }
  });

  test('dismiss buttons have no default label', () => {
    const wrapper = render(<Flashbar items={[{ content: 'Dismissible flash', dismissible: true, onDismiss: noop }]} />);
    expect(wrapper.findItems()[0].findDismissButton()!.getElement()).not.toHaveAttribute('aria-label');
  });

  test('dismiss buttons can have specified labels', () => {
    const wrapper = render(
      <Flashbar
        items={[
          {
            content: 'Dismissible flash',
            dismissible: true,
            onDismiss: noop,
            dismissLabel: 'close 1',
          },
          {
            content: 'Dismissible flash',
            dismissible: true,
            onDismiss: noop,
            dismissLabel: 'close 2',
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
        reactRender(<Flashbar items={[{ content: 'Not loading flash' }]} />).container
      ).findSpinner();
      expect(spinner).toBeNull();
    }
    {
      const spinner = createWrapper(
        reactRender(<Flashbar items={[{ content: 'Loading flash', loading: true }]} />).container
      ).findSpinner();
      expect(spinner).not.toBeNull();
    }
  });

  test('correct type of message', () => {
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'success' }]} />);
      expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
        styles['flash-type-success']
      );
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'warning' }]} />);
      expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
        styles['flash-type-warning']
      );
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'info' }]} />);
      expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(styles['flash-type-info']);
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'error' }]} />);
      expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(
        styles['flash-type-error']
      );
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'error', loading: true }]} />);
      expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveClass(styles['flash-type-info']);
    }
  });

  test('correct aria-role', () => {
    const wrapper = render(
      <Flashbar
        items={[
          { content: 'Alert', ariaRole: 'alert' },
          { content: 'Status', ariaRole: 'status' },
        ]}
      />
    );
    expect(wrapper.findItems()[0].findByClassName(styles.flash)!.getElement()).toHaveAttribute('role', 'alert');
    expect(wrapper.findItems()[1].findByClassName(styles.flash)!.getElement()).toHaveAttribute('role', 'status');
  });

  test('correct header', () => {
    const wrapper = render(
      <Flashbar
        items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
      />
    );
    expect(wrapper.findItems()[0].findHeader()!.getElement()).toHaveTextContent('The header');
  });

  test('correct content', () => {
    const wrapper = render(
      <Flashbar
        items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
      />
    );
    expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('The content');
  });

  test('correct button text', () => {
    const wrapper = render(
      <Flashbar
        items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
      />
    );
    expect(wrapper.findItems()[0].findActionButton()!.findTextRegion()!.getElement()).toHaveTextContent(
      'The button text'
    );
  });

  test('renders `action` content', () => {
    const wrapper = render(
      <Flashbar items={[{ header: 'The header', content: 'The content', action: <Button>Click me</Button> }]} />
    );
    expect(wrapper.findItems()[0].findAction()!.findButton()!.getElement()).toHaveTextContent('Click me');
  });

  test('when both `buttonText` and `action` provided, prefers the latter', () => {
    const wrapper = render(
      <Flashbar
        items={[
          { header: 'The header', content: 'The content', buttonText: 'buttonText', action: <Button>Action</Button> },
        ]}
      />
    );
    expect(wrapper.findItems()[0].findActionButton()).toBeNull();
    expect(wrapper.findItems()[0].findAction()!.findButton()!.getElement()).toHaveTextContent('Action');
  });

  test('dismiss callback gets called', () => {
    const dismissSpy = jest.fn();
    const buttonClickSpy = jest.fn();
    const wrapper = render(
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
    const wrapper = render(
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
    const wrapper = render(
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

    expect(wrapper.findItems()[0].find(`:scope [aria-label]`)?.getElement()).toHaveAttribute('aria-label', iconLabel);
  });

  describe('Stacked notifications', () => {
    it('shows only the header and content of the last item in the array', () => {
      const wrapper = render(
        <Flashbar
          {...{ stackItems: true }}
          items={[
            { type: 'error', header: 'Error', content: 'There was an error' },
            { type: 'success', header: 'Success', content: 'Everything went fine' },
          ]}
        />
      );
      const items = wrapper.findItems();
      expect(items.length).toBe(1);
      expect(items[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(items[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
    });

    it('shows toggle button with desired text', () => {
      const wrapper = render(
        <Flashbar
          {...{
            stackItems: true,
            i18nStrings: {
              toggleButtonText: (itemCount: number) => `Custom text (${itemCount})`,
              expandButtonAriaLabel: (itemCount: number) => `Collapsed aria label (${itemCount})`,
              collapseButtonAriaLabel: 'Expanded aria label',
            },
          }}
          items={[{ type: 'error' }, { type: 'success' }]}
        />
      );
      const button = wrapper.find(toggleButtonSelector);
      expect(button).toBeTruthy();
      expect(button!.getElement()).toHaveTextContent('Custom text (2)');
    });

    it('does not show toggle button if there is only one item', () => {
      const wrapper = render(<Flashbar {...{ stackItems: true }} items={[{ type: 'error' }]} />);
      expect(wrapper.find(toggleButtonSelector)).toBeFalsy();
    });

    it('expands and collapses by clicking on toggle button', () => {
      const wrapper = render(
        <Flashbar
          {...{ stackItems: true }}
          items={[
            { type: 'error', header: 'Error', content: 'There was an error' },
            { type: 'success', header: 'Success', content: 'Everything went fine' },
          ]}
        />
      );
      const items = wrapper.findItems();
      expect(items.length).toBe(1);
      expect(items[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(items[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');

      wrapper.find(toggleButtonSelector)!.click();

      const expandedItems = wrapper.findItems();
      expect(expandedItems.length).toBe(2);
      expect(expandedItems[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(expandedItems[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
      expect(expandedItems[1].findHeader()!.getElement()).toHaveTextContent('Error');
      expect(expandedItems[1].findContent()!.getElement()).toHaveTextContent('There was an error');

      wrapper.find(toggleButtonSelector)!.click();

      const collapsedItems = wrapper.findItems();
      expect(collapsedItems.length).toBe(1);
      expect(collapsedItems[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(collapsedItems[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
    });

    it('applies desired aria labels to toggle button', () => {
      const wrapper = render(
        <Flashbar
          {...{
            stackItems: true,
            i18nStrings: {
              toggleButtonText: (itemCount: number) => `Custom text (${itemCount})`,
              expandButtonAriaLabel: (itemCount: number) => `Collapsed aria label (${itemCount})`,
              collapseButtonAriaLabel: 'Expanded aria label',
            },
          }}
          items={[{ type: 'error' }, { type: 'success' }]}
        />
      );
      const button = wrapper.find(toggleButtonSelector);
      expect(button!.getElement()).toHaveAttribute('aria-label', 'Collapsed aria label (2)');
      button!.click();
      expect(button!.getElement()).toHaveAttribute('aria-label', 'Expanded aria label');
    });
  });
});

describe('Analytics', () => {
  beforeEach(() => {
    window.panorama = () => {};
    jest.spyOn(window, 'panorama');
  });
  it('does not send a metric when an empty array is provided', () => {
    render(<Flashbar items={[]} />);
    expect(window.panorama).toBeCalledTimes(0);
  });

  it('sends a render metric when items are provided', () => {
    render(
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
    render(
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
    const wrapper = render(
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
    const wrapper = render(
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
    const wrapper = render(
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
