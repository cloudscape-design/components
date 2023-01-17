// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Flashbar from '../../../lib/components/flashbar';
import { render } from './common';
import { FlashbarWrapper } from '../../../lib/components/test-utils/dom';
import { FlashbarProps, StackedFlashbarProps } from '../interfaces';

describe('Collapsible Flashbar', () => {
  describe('Basic behavior', () => {
    it('shows only the header and content of the last item in the array when collapsed', () => {
      const flashbar = renderFlashbar();
      const items = flashbar.findItems();
      expect(items.length).toBe(1);
      expect(items[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(items[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
    });

    it('shows toggle element with desired text', () => {
      const flashbar = renderFlashbar({
        i18nStrings: {
          toggleButtonText: 'Custom text',
          toggleButtonAriaLabel: 'Collapsed ARIA label',
        },
      });
      const button = findToggleElement(flashbar);
      expect(button).toBeTruthy();
      expect(button).toHaveTextContent('Custom text');
    });

    it('does not show toggle element if there is only one item', () => {
      const flashbar = renderFlashbar({ items: [{ type: 'error' }] });
      expect(findToggleElement(flashbar)).toBeFalsy();
    });

    it('expands and collapses by clicking on toggle element', () => {
      const flashbar = renderFlashbar();
      const items = flashbar.findItems();
      expect(items.length).toBe(1);
      expect(items[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(items[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');

      findToggleElement(flashbar)!.click();

      const expandedItems = flashbar.findItems();
      expect(expandedItems.length).toBe(2);
      expect(expandedItems[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(expandedItems[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
      expect(expandedItems[1].findHeader()!.getElement()).toHaveTextContent('Error');
      expect(expandedItems[1].findContent()!.getElement()).toHaveTextContent('There was an error');

      findToggleElement(flashbar)!.click();

      const collapsedItems = flashbar.findItems();
      expect(collapsedItems.length).toBe(1);
      expect(collapsedItems[0].findHeader()!.getElement()).toHaveTextContent('Success');
      expect(collapsedItems[0].findContent()!.getElement()).toHaveTextContent('Everything went fine');
    });
  });

  describe('Accessibility', () => {
    it('renders items in an unordered list', () => {
      const flashbar = renderFlashbar({
        i18nStrings: {
          toggleButtonText: 'Custom text',
          toggleButtonAriaLabel: 'Toggle button ARIA label',
        },
      });
      const list = flashbar.find('ul')!;
      expect(list).toBeTruthy();
      expect(list.findAll('li')).toHaveLength(2);
    });

    it('applies ARIA label to the unordered list', () => {
      const expectedAriaLabel = 'Custom text';
      const flashbar = renderFlashbar({
        i18nStrings: {
          ariaLabel: expectedAriaLabel,
        },
      });
      const list = flashbar.find('ul')!;
      expect(list).toBeTruthy();
      expect(list.getElement().getAttribute('aria-label')).toEqual(expectedAriaLabel);
    });

    it('hides collapsed items from the accessibility tree', () => {
      const findAccessibleListItems = (wrapper: FlashbarWrapper) =>
        wrapper.findAll('li').filter(item => item.getElement().getAttribute('aria-hidden') !== 'true');

      const flashbar = renderFlashbar();
      const items = findAccessibleListItems(flashbar);
      expect(items.length).toBe(1);
    });

    it('applies desired ARIA label to toggle button', () => {
      const flashbar = renderFlashbar({
        i18nStrings: {
          toggleButtonText: 'Custom text',
          toggleButtonAriaLabel: 'Toggle button ARIA label',
        },
      });
      const button = findToggleButtonElement(flashbar);
      expect(button).toHaveAttribute('aria-label', 'Toggle button ARIA label');
    });

    it('applies aria-expanded attribute to toggle button', () => {
      const flashbar = renderFlashbar({
        i18nStrings: {
          toggleButtonText: 'Custom text',
          toggleButtonAriaLabel: 'Toggle button ARIA label',
        },
      });
      const button = findToggleButtonElement(flashbar)!;
      expect(button).toHaveAttribute('aria-expanded', 'false');

      button.click();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('applies aria-controls attribute to toggle button referring to the unordered list', () => {
      const flashbar = renderFlashbar({
        i18nStrings: {
          toggleButtonText: 'Custom text',
          toggleButtonAriaLabel: 'Toggle button ARIA label',
        },
      });
      const listId = flashbar.find('ul')!.getElement().id;
      expect(listId).toBeTruthy();
      const button = findToggleButtonElement(flashbar);
      expect(button).toHaveAttribute('aria-controls', listId);
    });

    it('applies aria-describedby attribute to the list, referencing the item counter', () => {
      const flashbar = renderFlashbar();
      const list = flashbar.find('ul')!;
      expect(list).toBeTruthy();
      const itemCountId = findItemCounter(flashbar)!.getElement().id;
      expect(itemCountId).toBeTruthy();
      expect(list.getElement().getAttribute('aria-describedby')).toEqual(itemCountId);
    });
  });

  it('announces updates to the item counter with aria-live', () => {
    const flashbar = renderFlashbar();
    const counter = findItemCounter(flashbar)!.getElement();
    expect(counter).toHaveAttribute('aria-live', 'polite');
  });
});

function findToggleElement(flashbar: FlashbarWrapper): HTMLElement | undefined {
  const element = Array.from(flashbar.getElement().children).find(
    element => element instanceof HTMLElement && element.tagName !== 'UL'
  );
  if (element) {
    return element as HTMLElement;
  }
}

function findToggleButtonElement(flashbar: FlashbarWrapper): HTMLElement | undefined {
  return findToggleElement(flashbar)?.querySelector('button') || undefined;
}

function findItemCounter(flashbar: FlashbarWrapper) {
  return flashbar.find('[role="status"]');
}

const sampleItems: Record<string, FlashbarProps.MessageDefinition> = {
  error: { type: 'error', header: 'Error', content: 'There was an error' },
  success: { type: 'success', header: 'Success', content: 'Everything went fine' },
};

const defaultStrings = {
  ariaLabel: 'Notifications',
  toggleButtonText: 'Notifications',
  toggleButtonAriaLabel: 'View all notifications',
  errorCountAriaLabel: 'Error',
  warningCountAriaLabel: 'Warning',
  successCountAriaLabel: 'Success',
  infoCountAriaLabel: 'Information',
  inProgressCountAriaLabel: 'In progress',
};

const defaultItems = [sampleItems.error, sampleItems.success];

const defaultProps = {
  stackItems: true,
  i18nStrings: defaultStrings,
};

function renderFlashbar(
  customProps: Partial<
    Omit<StackedFlashbarProps, 'i18nStrings' | 'stackItems'> & {
      i18nStrings?: Partial<StackedFlashbarProps.I18nStrings>;
    }
  > = {
    items: defaultItems,
  }
) {
  const { items, ...restProps } = customProps;
  const props = { ...defaultProps, ...restProps, i18nStrings: { ...defaultStrings, ...restProps.i18nStrings } };
  return render(<Flashbar {...props} items={items || defaultItems} />);
}
