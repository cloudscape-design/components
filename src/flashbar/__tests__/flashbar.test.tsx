// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render as reactRender, waitFor } from '@testing-library/react';

import { disableMotion } from '@cloudscape-design/global-styles';

import Button from '../../../lib/components/button';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import { LiveRegionController } from '../../../lib/components/live-region/controller.js';
import createWrapper from '../../../lib/components/test-utils/dom';
import { mockInnerText } from '../../internal/analytics/__tests__/mocks';
import { createFlashbarWrapper, findList, testFlashDismissal } from './common';

import styles from '../../../lib/components/flashbar/styles.css.js';

// The non-collapsible flashbar only uses animations in Visual Refresh,
// so in order to enable them, we need to mock `useVisualRefresh`
let useVisualRefresh = false;
jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => {
  const originalVisualModeModule = jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode');
  return {
    ...originalVisualModeModule,
    useVisualRefresh: (...args: any) => useVisualRefresh || originalVisualModeModule.useVisualRefresh(...args),
  };
});

let mockElementOffsetLeft = 200;
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    configurable: true,
    enumerable: true,
    get() {
      return mockElementOffsetLeft;
    },
  },
});

LiveRegionController.defaultDelay = 0;

mockInnerText();

const noop = () => void 0;

beforeEach(() => {
  mockElementOffsetLeft = 200;
});

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

function setAnimations(state: boolean) {
  useVisualRefresh = state;
  disableMotion(!state);
}

describe('Flashbar component', () => {
  describe.each([true, false])('withAnimations=%s', withAnimations => {
    beforeEach(() => {
      setAnimations(withAnimations);
    });

    afterEach(() => {
      setAnimations(false);
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
          items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
        />
      );
      expect(wrapper.findItems()[0].findHeader()!.getElement()).toHaveTextContent('The header');
    });

    test('correct content', () => {
      const wrapper = createFlashbarWrapper(
        <Flashbar
          items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
        />
      );
      expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('The content');
    });

    test('correct button text', () => {
      const wrapper = createFlashbarWrapper(
        <Flashbar
          items={[{ header: 'The header', content: 'The content', buttonText: 'The button text', onButtonClick: noop }]}
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

    it('adds wrapped class to actions if they are displayed on a new line', () => {
      mockElementOffsetLeft = 10;
      const { container } = reactRender(
        <Flashbar items={[{ header: 'The header', content: 'The content', action: <Button>Click me</Button> }]} />
      );
      expect(container.querySelector(`.${styles['action-wrapped']}`)).toBeTruthy();
    });

    it('does not add wrapped class to actions if they are displayed on same line', () => {
      mockElementOffsetLeft = 200;
      const { container } = reactRender(
        <Flashbar items={[{ header: 'The header', content: 'The content', action: <Button>Click me</Button> }]} />
      );
      expect(container.querySelector(`.${styles['action-wrapped']}`)).toBeFalsy();
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

      test('renders the label, header, and content in an aria-live region for ariaRole="status"', async () => {
        const { rerender } = reactRender(<Flashbar items={[]} />);
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

        await waitFor(() => {
          expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('Error The header The content');
        });
      });
    });
  });

  test('dismisses items', () => {
    // Test this feature only with motion disabled because TransitionGroup delays item removals by one frame.
    // Customers should disable animations in their tests too:
    // https://cloudscape.design/foundation/visual-foundation/motion/#implementation
    setAnimations(false);
    testFlashDismissal({ stackItems: false });
  });
});
