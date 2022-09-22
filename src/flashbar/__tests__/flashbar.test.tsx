// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';
import Flashbar from '../../../lib/components/flashbar';
import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/flashbar/styles.css.js';

function render(element: React.ReactElement) {
  return createWrapper(reactRender(element).container).findFlashbar()!;
}

const noop = () => void 0;

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
      expect(wrapper.findItems()[0].getElement()).toHaveClass(styles['flash-type-success']);
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'warning' }]} />);
      expect(wrapper.findItems()[0].getElement()).toHaveClass(styles['flash-type-warning']);
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'info' }]} />);
      expect(wrapper.findItems()[0].getElement()).toHaveClass(styles['flash-type-info']);
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'error' }]} />);
      expect(wrapper.findItems()[0].getElement()).toHaveClass(styles['flash-type-error']);
    }
    {
      const wrapper = render(<Flashbar items={[{ content: 'Flash', type: 'error', loading: true }]} />);
      expect(wrapper.findItems()[0].getElement()).toHaveClass(styles['flash-type-info']);
    }
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
});
