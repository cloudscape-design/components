// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender } from '@testing-library/react';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/flashbar/styles.css.js';
import { createFlashbarWrapper, findList, testFlashDismissal } from './common';
import { DATA_ATTR_ANALYTICS_FLASHBAR } from '../../../lib/components/internal/analytics/selectors';
import { disableMotion } from '@cloudscape-design/global-styles';

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
  for (const withAnimations of [false, true]) {
    describe(withAnimations ? 'with animations' : 'without animations', () => {
      beforeEach(() => {
        disableMotion(!withAnimations);
      });

      afterEach(() => {
        disableMotion(false);
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

      test('findItemsByType', () => {
        const wrapper = createFlashbarWrapper(
          <Flashbar
            items={[
              { content: 'Flash', type: 'success' },
              { content: 'Flash', type: 'error' },
              { content: 'Flash', type: 'error' },
              { content: 'Flash', type: 'warning' },
              { content: 'Flash', type: 'info' },
              { content: 'Flash', type: 'warning', loading: true }, // assuming info
              { content: 'Flash', loading: true }, // assuming info
            ]}
          />
        );
        expect(wrapper.findItemsByType('success')).toHaveLength(1);
        expect(wrapper.findItemsByType('error')).toHaveLength(2);
        expect(wrapper.findItemsByType('warning')).toHaveLength(1);
        expect(wrapper.findItemsByType('info')).toHaveLength(3);
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
        const iconLabel = 'Info';
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

        expect(wrapper.findItems()[0].find('[role="img"]')?.getElement()).toHaveAccessibleName(iconLabel);
      });

      test.each([['success'], ['error'], ['info'], ['warning'], ['in-progress']] as FlashbarProps.Type[][])(
        'icon has aria-label from i18nStrings when no statusIconAriaLabel provided: type %s',
        type => {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              i18nStrings={{
                successIconAriaLabel: 'success',
                errorIconAriaLabel: 'error',
                infoIconAriaLabel: 'info',
                warningIconAriaLabel: 'warning',
                inProgressIconAriaLabel: 'in-progress',
              }}
              items={[
                {
                  header: 'The header',
                  content: 'The content',
                  action: <Button>Click me</Button>,
                  type: type === 'in-progress' ? 'info' : type,
                  loading: type === 'in-progress',
                },
              ]}
            />
          );

          expect(wrapper.findItems()[0].find('[role="img"]')?.getElement()).toHaveAccessibleName(type);
        }
      );

      describe('Accessibility', () => {
        test('renders items in an unordered list', () => {
          const flashbar = createFlashbarWrapper(
            <Flashbar
              items={[
                {
                  header: 'The header',
                  content: 'The content',
                },
              ]}
            />
          );
          const list = flashbar.find('ul')!;
          expect(list).toBeTruthy();
          expect(list.findAll('li')).toHaveLength(1);
        });

        test('applies ARIA label to the unordered list', () => {
          const customAriaLabel = 'Custom text';
          const flashbar = createFlashbarWrapper(
            <Flashbar
              items={[
                {
                  header: 'The header',
                  content: 'The content',
                },
              ]}
              i18nStrings={{
                ariaLabel: customAriaLabel,
              }}
            />
          );
          const list = findList(flashbar)!;
          expect(list).toBeTruthy();
          expect(list.getElement().getAttribute('aria-label')).toEqual(customAriaLabel);
        });

        test('renders the label, header, and content in an aria-live region for ariaRole="status"', () => {
          const { rerender, container } = reactRender(<Flashbar items={[]} />);
          rerender(
            <Flashbar
              items={[
                {
                  id: '1',
                  ariaRole: 'status',
                  type: 'error',
                  statusIconAriaLabel: 'Error',
                  header: 'The header',
                  content: 'The content',
                },
              ]}
            />
          );
          // Render area of the LiveRegion component.
          expect(container.querySelector('span[aria-hidden]')).toHaveTextContent('Error The header The content');
        });
      });
    });
  }

  test('dismisses items', () => {
    testFlashDismissal({ stackItems: false });
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

  describe('analytics', () => {
    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the flashbar type`, () => {
      const { container } = reactRender(<Flashbar items={[{ id: '0', type: 'success' }]} />);
      expect(container.querySelector(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="success"]`)).toBeInTheDocument();
    });

    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the effective flashbar type when loading`, () => {
      const { container } = reactRender(<Flashbar items={[{ id: '0', type: 'success', loading: true }]} />);
      expect(container.querySelector(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="info"]`)).toBeInTheDocument();
    });
  });
});
