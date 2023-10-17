// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const scrollElementIntoViewMock = jest.fn();
jest.mock('../../../lib/components/internal/utils/scrollable-containers', () => {
  const originalModule = jest.requireActual('../../../lib/components/internal/utils/scrollable-containers');
  return {
    __esModule: true,
    ...originalModule,
    scrollElementIntoView: scrollElementIntoViewMock,
  };
});

import React from 'react';
import Flashbar from '../../../lib/components/flashbar';
import { createFlashbarWrapper, findList, testFlashDismissal } from './common';
import createWrapper, { FlashbarWrapper } from '../../../lib/components/test-utils/dom';
import { FlashbarProps } from '../interfaces';
import { render } from '@testing-library/react';
import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  const originalVisualModeModule = jest.requireActual('@cloudscape-design/component-toolkit/internal');
  return {
    __esModule: true,
    ...originalVisualModeModule,
    useReducedMotion: jest.fn(),
  };
});

const sampleItems: Record<FlashbarProps.Type, FlashbarProps.MessageDefinition> = {
  error: { type: 'error', header: 'Error', content: 'There was an error' },
  success: { type: 'success', header: 'Success', content: 'Everything went fine' },
  warning: { type: 'warning', header: 'Warning' },
  info: { type: 'info', header: 'Information' },
  'in-progress': { type: 'in-progress', header: 'Operation in progress' },
};

const defaultStrings = {
  ariaLabel: 'Notifications',
  notificationBarText: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
  successIconAriaLabel: 'Success',
  infoIconAriaLabel: 'Information',
  inProgressIconAriaLabel: 'In progress',
};

const defaultItems = [sampleItems.error, sampleItems.success];

const defaultProps = {
  stackItems: true,
  i18nStrings: defaultStrings,
};

describe('Collapsible Flashbar', () => {
  for (const withAnimations of [false, true]) {
    describe(withAnimations ? 'with animations' : 'without animations', () => {
      beforeAll(() => {
        (useReducedMotion as jest.Mock).mockReturnValue(!withAnimations);
      });

      afterAll(() => {
        (useReducedMotion as jest.Mock).mockReturnValue(true);
      });

      describe('Basic behavior', () => {
        it('shows only the header and content of the first item in the array when collapsed', () => {
          const flashbar = renderFlashbar();
          const items = flashbar.findItems();
          expect(items.length).toBe(1);
          expect(items[0].findHeader()!.getElement()).toHaveTextContent(defaultItems[0].header!.toString());
          expect(items[0].findContent()!.getElement()).toHaveTextContent(defaultItems[0].content!.toString());
        });

        it('shows toggle element with desired text', () => {
          const customToggleButtonText = 'Custom text';
          const flashbar = renderFlashbar({
            i18nStrings: {
              notificationBarText: customToggleButtonText,
            },
          });
          const toggleElement = findNotificationBar(flashbar);
          expect(toggleElement).toBeTruthy();
          expect(toggleElement).toHaveTextContent(customToggleButtonText);
        });

        it('does not show toggle element if there is only one item', () => {
          const flashbar = renderFlashbar({ items: [{ type: 'error' }] });
          expect(findNotificationBar(flashbar)).toBeFalsy();
        });

        it('expands and collapses by clicking on notification bar', () => {
          const flashbar = renderFlashbar();
          const items = flashbar.findItems();
          expect(items.length).toBe(1);
          expect(items[0].findHeader()!.getElement()).toHaveTextContent(defaultItems[0].header!.toString());
          expect(items[0].findContent()!.getElement()).toHaveTextContent(defaultItems[0].content!.toString());

          findNotificationBar(flashbar)!.click();

          const expandedItems = flashbar.findItems();
          expect(expandedItems.length).toBe(2);
          expect(expandedItems[0].findHeader()!.getElement()).toHaveTextContent(defaultItems[0].header!.toString());
          expect(expandedItems[0].findContent()!.getElement()).toHaveTextContent(defaultItems[0].content!.toString());
          expect(expandedItems[1].findHeader()!.getElement()).toHaveTextContent(defaultItems[1].header!.toString());
          expect(expandedItems[1].findContent()!.getElement()).toHaveTextContent(defaultItems[1].content!.toString());

          findNotificationBar(flashbar)!.click();

          const collapsedItems = flashbar.findItems();
          expect(collapsedItems.length).toBe(1);
          expect(collapsedItems[0].findHeader()!.getElement()).toHaveTextContent(defaultItems[0].header!.toString());
          expect(collapsedItems[0].findContent()!.getElement()).toHaveTextContent(defaultItems[0].content!.toString());
        });

        it('collapses automatically when enough items are added', () => {
          const item1 = { ...sampleItems.success, id: '0' };
          const item2 = { ...sampleItems.error, id: '1' };

          const { container, rerender } = render(
            <Flashbar items={[item1]} {...{ stackItems: true, i18nStrings: defaultStrings }} />
          );
          const wrapper = createWrapper(container);
          const flashbar = wrapper.findFlashbar()!;
          expect(flashbar.findItems()).toHaveLength(1);
          expect(findNotificationBar(flashbar)).toBeFalsy();

          rerender(<Flashbar items={[item1, item2]} {...{ stackItems: true, i18nStrings: defaultStrings }} />);
          expect(wrapper.findFlashbar()!.findItems()).toHaveLength(1);
          const toggleElement = findNotificationBar(wrapper.findFlashbar()!);
          expect(toggleElement).toBeTruthy();
        });

        it('collapses automatically again when enough items are added even if it had been expanded before', () => {
          const item1 = { ...sampleItems.success, id: '0' };
          const item2 = { ...sampleItems.error, id: '1' };

          const { container, rerender } = render(
            <Flashbar items={[item1, item2]} {...{ stackItems: true, i18nStrings: defaultStrings }} />
          );
          const wrapper = createWrapper(container);
          const flashbar = wrapper.findFlashbar()!;
          expect(flashbar.findItems()).toHaveLength(1);
          expect(findNotificationBar(flashbar)).toBeTruthy();
          const toggleElement = findNotificationBar(wrapper.findFlashbar()!);
          expect(toggleElement).toBeTruthy();
          toggleElement!.click();
          expect(flashbar.findItems()).toHaveLength(2);

          rerender(<Flashbar items={[item1]} {...{ stackItems: true, i18nStrings: defaultStrings }} />);
          expect(wrapper.findFlashbar()!.findItems()).toHaveLength(1);
          expect(findNotificationBar(wrapper.findFlashbar()!)).toBeFalsy();

          rerender(<Flashbar items={[item1, item2]} {...{ stackItems: true, i18nStrings: defaultStrings }} />);
          expect(wrapper.findFlashbar()!.findItems()).toHaveLength(1);
          expect(findNotificationBar(wrapper.findFlashbar()!)).toBeTruthy();
        });
      });

      test('findItemsByType', () => {
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              stackItems={true}
              items={[
                { content: 'Flash', type: 'success' },
                { content: 'Flash', type: 'warning' },
              ]}
            />
          );
          expect(wrapper.findItemsByType('success')).toHaveLength(1);
          expect(wrapper.findItemsByType('warning')).toHaveLength(0);

          findNotificationBar(wrapper)!.click();

          expect(wrapper.findItemsByType('success')).toHaveLength(1);
          expect(wrapper.findItemsByType('warning')).toHaveLength(1);
        }
        {
          const wrapper = createFlashbarWrapper(
            <Flashbar
              stackItems={true}
              items={[
                { content: 'Flash', type: 'warning' },
                { content: 'Flash', type: 'warning' },
              ]}
            />
          );
          expect(wrapper.findItemsByType('warning')).toHaveLength(1);

          findNotificationBar(wrapper)!.click();

          expect(wrapper.findItemsByType('warning')).toHaveLength(2);
        }
      });

      describe('Accessibility', () => {
        it('renders items in an unordered list', () => {
          const flashbar = renderFlashbar();
          const list = flashbar.find('ul')!;
          expect(list).toBeTruthy();
          expect(list.findAll('li')).toHaveLength(2);
        });

        it('applies ARIA label to the unordered list', () => {
          const customAriaLabel = 'Custom text';
          const flashbar = renderFlashbar({
            i18nStrings: {
              ariaLabel: customAriaLabel,
            },
          });
          const list = findList(flashbar)!;
          expect(list).toBeTruthy();
          expect(list.getElement().getAttribute('aria-label')).toEqual(customAriaLabel);
        });

        it('hides collapsed items from the accessibility tree', () => {
          const flashbar = renderFlashbar();
          const accessibleItems = flashbar
            .findAll('li')
            .filter(item => item.getElement().getAttribute('aria-hidden') !== 'true');
          expect(accessibleItems.length).toBe(1);
        });

        it('does not render outer toggle element as HTML button element', () => {
          const flashbar = renderFlashbar();
          const toggle = findNotificationBar(flashbar);
          expect(toggle!.tagName).not.toEqual('BUTTON');
        });

        it('applies desired ARIA label to toggle element', () => {
          const customToggleButtonAriaLabel = 'Custom toggle button ARIA label';
          const flashbar = renderFlashbar({
            i18nStrings: {
              notificationBarAriaLabel: customToggleButtonAriaLabel,
            },
          });
          const button = flashbar.findToggleButton()?.getElement();
          expect(button).toHaveAttribute('aria-label', customToggleButtonAriaLabel);
        });

        it('applies aria-expanded attribute to toggle button', () => {
          const flashbar = renderFlashbar();
          const button = flashbar.findToggleButton()!;
          expect(button?.getElement()).toHaveAttribute('aria-expanded', 'false');

          button.click();
          expect(button?.getElement()).toHaveAttribute('aria-expanded', 'true');
        });

        it('applies aria-controls attribute to toggle button referring to the unordered list', () => {
          const flashbar = renderFlashbar();
          const listId = findList(flashbar)!.getElement().id;
          expect(listId).toBeTruthy();
          const button = flashbar.findToggleButton()?.getElement();
          expect(button).toHaveAttribute('aria-controls', listId);
        });

        it('applies aria-describedby attribute to the list, referencing the item counter', () => {
          const flashbar = renderFlashbar();
          const list = findList(flashbar)!;
          expect(list).toBeTruthy();
          const counter = findOuterCounter(flashbar);
          expect(counter).toBeTruthy();
          const itemCounterElementId = findOuterCounter(flashbar)!.id;
          expect(itemCounterElementId).toBeTruthy();
          expect(list.getElement()).toHaveAttribute('aria-describedby', itemCounterElementId);
        });

        it('does not apply aria-describedby to the list when the toggle element is not rendered', () => {
          const flashbar = renderFlashbar({ items: [sampleItems.error] });
          const list = findList(flashbar)!;
          expect(list).toBeTruthy();
          const itemCounterElement = findOuterCounter(flashbar);
          expect(itemCounterElement).toBeFalsy();
          expect(list.getElement()).not.toHaveAttribute('aria-describedby');
        });

        it('applies aria-describedby to the toggle button, referencing the item counter', () => {
          const flashbar = renderFlashbar();
          const itemCounterElementId = findOuterCounter(flashbar)!.id;
          expect(itemCounterElementId).toBeTruthy();
          const toggleButton = flashbar.findToggleButton()?.getElement();
          expect(toggleButton).toHaveAttribute('aria-describedby', itemCounterElementId);
        });

        it('announces updates to the item counter with aria-live', () => {
          const flashbar = renderFlashbar();
          const counter = findOuterCounter(flashbar);
          expect(counter).toHaveAttribute('aria-live', 'polite');
          // We add `role="status"` as well, to maximize compatibility
          // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#roles_with_implicit_live_region_attributes
          expect(counter).toHaveAttribute('role', 'status');
        });

        it('renders the toggle element header as H2 element', () => {
          const customToggleButtonText = 'Custom text';
          const flashbar = renderFlashbar({
            i18nStrings: {
              notificationBarText: customToggleButtonText,
            },
          });
          const h2 = findNotificationBar(flashbar)!.querySelector('h2');
          expect(h2).toHaveTextContent(customToggleButtonText);
        });

        it('applies ARIA labels and title attributes to the item counter', () => {
          const customLabels = {
            errorIconAriaLabel: 'Custom error ARIA label',
            successIconAriaLabel: 'Custom success ARIA label',
            infoIconAriaLabel: 'Custom info ARIA label',
            inProgressIconAriaLabel: 'Custom progress ARIA label',
            warningIconAriaLabel: 'Custom warning ARIA label',
          };
          const flashbar = renderFlashbar({ i18nStrings: { ...customLabels } });
          const innerCounter = findInnerCounterElement(flashbar);
          for (const ariaLabel of Object.values(customLabels)) {
            expect(innerCounter!.querySelector(`[aria-label="${ariaLabel}"]`)).toBeTruthy();
            expect(innerCounter!.querySelector(`[title="${ariaLabel}"]`)).toBeTruthy();
          }
        });

        test.each([['success'], ['error'], ['info'], ['warning'], ['in-progress']] as FlashbarProps.Type[][])(
          'item icon has aria-label from i18nStrings when no statusIconAriaLabel provided: type %s',
          type => {
            const wrapper = renderFlashbar({
              i18nStrings: {
                successIconAriaLabel: 'success',
                errorIconAriaLabel: 'error',
                infoIconAriaLabel: 'info',
                warningIconAriaLabel: 'warning',
                inProgressIconAriaLabel: 'in-progress',
              },
              items: [
                {
                  header: 'The header',
                  content: 'The content',
                  type: type === 'in-progress' ? 'info' : type,
                  loading: type === 'in-progress',
                },
              ],
            });

            expect(wrapper.findItems()[0].find('[role="img"]')?.getElement()).toHaveAccessibleName(type);
          }
        );
      });

      describe('Sticky', () => {
        it('scrolls the button into view when collapsing', () => {
          scrollElementIntoViewMock.mockClear();
          const flashbar = renderFlashbar();
          findNotificationBar(flashbar)!.click(); // Expand
          findNotificationBar(flashbar)!.click(); // Collapse
          expect(scrollElementIntoViewMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  }

  test('dismisses items', () => {
    // Test this feature only without animations because TransitionGroup delays item removals by one frame.
    // Customers should disable animations in their tests.
    (useReducedMotion as jest.Mock).mockReturnValue(true);
    testFlashDismissal({ stackItems: true });
  });
});

// Entire interactive element including the counter and the actual <button/> element
function findNotificationBar(flashbar: FlashbarWrapper): HTMLElement | undefined {
  const element = Array.from(flashbar.getElement().children).find(
    element => element instanceof HTMLElement && element.tagName !== 'UL'
  );
  if (element) {
    return element as HTMLElement;
  }
}

// Item counter including the header
function findOuterCounter(flashbar: FlashbarWrapper) {
  const toggleElement = findNotificationBar(flashbar);
  if (toggleElement) {
    return Array.from(toggleElement.children)[0];
  }
}

// Inner counter including only the icons and the number of items for each type
function findInnerCounterElement(flashbar: FlashbarWrapper) {
  const outerCounter = findOuterCounter(flashbar);
  if (outerCounter) {
    const element = Array.from(outerCounter.children).find(
      element => element instanceof HTMLElement && element.tagName !== 'H2'
    );
    if (element) {
      return element as HTMLElement;
    }
  }
}

function renderFlashbar(
  customProps: Partial<
    Omit<FlashbarProps, 'i18nStrings' | 'stackItems'> & {
      i18nStrings?: Partial<FlashbarProps.I18nStrings>;
    }
  > = {
    items: defaultItems,
  }
) {
  const { items, ...restProps } = customProps;
  const props = { ...defaultProps, ...restProps, i18nStrings: { ...defaultStrings, ...restProps.i18nStrings } };
  return createFlashbarWrapper(<Flashbar {...props} items={items || defaultItems} />);
}
