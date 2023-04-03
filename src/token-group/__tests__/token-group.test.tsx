// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import TokenGroup, { TokenGroupProps } from '../../../lib/components/token-group';
import createWrapper, { TokenGroupWrapper, IconWrapper } from '../../../lib/components/test-utils/dom';

import icons from '../../../lib/components/icon/icons';

import selectors from '../../../lib/components/token-group/styles.selectors.js';
import optionSelectors from '../../../lib/components/internal/components/option/styles.selectors.js';
import tokenListSelectors from '../../../lib/components/internal/components/token-list/styles.selectors.js';

function renderTokenGroup(props: TokenGroupProps = {}): TokenGroupWrapper {
  const { container } = render(<TokenGroup {...props} />);
  return createWrapper(container).findTokenGroup()!;
}

const onDismiss = () => {};
const generateItems = (count: number) => [...new Array(count)].map((_, index) => ({ label: `label-${index}` }));
const i18nStrings = { limitShowMore: 'Show more', limitShowFewer: 'Show less' };

describe('TokenGroup', () => {
  const items = [
    {
      label: 'Item label',
      labelTag: '128Gb',
      iconName: 'close',
      description: 'Item description',
      tags: ['2-CPU', '2Gb RAM'],
    },
  ] as TokenGroupProps.Item[];

  test('raises warning without onDismiss property', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    renderTokenGroup({ items });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `[AwsUi] [TokenGroup] You provided \`items\` prop without an \`onDismiss\` handler. This will render a read-only component. If the component should be mutable, set an \`onDismiss\` handler.`
    );
    consoleWarnSpy.mockRestore();
  });

  test('does not apply "has-items" class when provided an empty items list', () => {
    const wrapper = renderTokenGroup({ items: [], onDismiss });
    expect(wrapper.getElement()).not.toHaveClass(selectors['has-items']);
  });

  test('applies "has-items" class with a non-empty list', () => {
    const wrapper = renderTokenGroup({ items, onDismiss });
    expect(wrapper.getElement()).toHaveClass(selectors['has-items']);
  });

  test('aligns tokens horizontally by default', () => {
    const wrapper = renderTokenGroup({ items, onDismiss });
    expect(wrapper.find(`ul.${tokenListSelectors.horizontal}`)).not.toBeNull();
  });

  test('applies the alignment correctly', () => {
    const wrapper = renderTokenGroup({ alignment: 'vertical', items, onDismiss });
    expect(wrapper.find(`ul.${tokenListSelectors.horizontal}`)).toBeNull();
    expect(wrapper.find(`ul.${tokenListSelectors.vertical}`)).not.toBeNull();
  });

  describe('Token', () => {
    const findToken = (wrapper: TokenGroupWrapper) => wrapper.findToken(1);

    test('displays option', () => {
      const wrapper = renderTokenGroup({ items, onDismiss });
      expect(wrapper.findToken(1)!.findOption()).not.toBeNull();
    });

    test('displays dismiss area', () => {
      const wrapper = renderTokenGroup({ items, onDismiss });

      expect(findToken(wrapper)!.findDismiss()).not.toBeNull();
      expect(findToken(wrapper)!.findDismiss()!.findByClassName(IconWrapper.rootSelector)).not.toBeNull();
    });

    test('sets no alternative text on the dismiss area by default', () => {
      const wrapper = renderTokenGroup({ items, onDismiss });

      expect(findToken(wrapper)!.findDismiss()!.getElement()).not.toHaveAttribute('aria-label');
    });

    test('sets the alternative text on the dismiss area', () => {
      const wrapper = renderTokenGroup({ items: [{ ...items[0], dismissLabel: 'dismiss' }], onDismiss });

      expect(findToken(wrapper)!.findDismiss()!.getElement()).toHaveAttribute('aria-label', 'dismiss');
    });

    test('correctly disables the option when disabled', () => {
      const wrapper = renderTokenGroup({ items: [{ ...items[0], disabled: true }], onDismiss });
      expect(findToken(wrapper)!.findByClassName(optionSelectors.disabled)).not.toBeNull();
    });

    test('sets aria-disabled on the token when disabled', () => {
      const wrapper = renderTokenGroup({ items: [{ ...items[0], disabled: true }], onDismiss });
      expect(wrapper.findByClassName(tokenListSelectors['list-item'])!.getElement()).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    test('does not set aria-disabled on the token when not disabled', () => {
      const wrapper = renderTokenGroup({ items: [{ ...items[0], disabled: false }], onDismiss });
      expect(wrapper.findByClassName(tokenListSelectors['list-item'])!.getElement()).not.toHaveAttribute(
        'aria-disabled'
      );
    });

    test('fires dismiss event on mouse click', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderTokenGroup({ items, onDismiss: onDismissSpy });

      findToken(wrapper)!.findDismiss()!.click();

      expect(onDismissSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { itemIndex: 0 },
        })
      );
    });

    test('does not fire dismiss event when disabled', () => {
      const onDismissSpy = jest.fn();
      const wrapper = renderTokenGroup({ items: [{ ...items[0], disabled: true }], onDismiss });

      findToken(wrapper)!.findDismiss()!.click();

      expect(onDismissSpy).not.toHaveBeenCalled();
    });

    test('does not automatically remove the token after firing dismiss event', () => {
      const wrapper = renderTokenGroup({ items, onDismiss: onDismiss });

      findToken(wrapper)!.findDismiss()!.click();

      expect(findToken(wrapper)).not.toBeNull();
    });

    test('tokens are hidden by default when given a limit', () => {
      const wrapper = renderTokenGroup({ items: generateItems(5), i18nStrings, limit: 2 });
      expect(wrapper.findTokens().length).toBe(2);
      expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Show more (+3)');
    });

    test('tokens are expanded on token toggle', () => {
      const wrapper = renderTokenGroup({ items: generateItems(5), i18nStrings, limit: 2 });
      wrapper.findTokenToggle()!.click();

      expect(wrapper.findTokens().length).toBe(5);
      expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Show less');
    });

    test('toggle button has aria-controls property that points to the token container', () => {
      const wrapper = renderTokenGroup({ items: generateItems(5), i18nStrings, limit: 2 });

      const id = wrapper.findByClassName(tokenListSelectors.list)!.getElement().getAttribute('id');
      expect(wrapper.findTokenToggle()!.getElement()).toHaveAttribute('aria-controls', id);
    });

    test('shows expand icon when there tokens hidden', () => {
      const wrapper = renderTokenGroup({ items: generateItems(5), i18nStrings, limit: 2 });
      const icon = wrapper.findTokenToggle()!.find('svg');

      expect(icon!.getElement()).toContainHTML(icons['treeview-expand']);
    });

    test('shows collapse icon when there tokens hidden', () => {
      const wrapper = renderTokenGroup({ items: generateItems(5), i18nStrings, limit: 2 });
      wrapper.findTokenToggle()!.click();

      const icon = wrapper.findTokenToggle()!.find('svg');
      expect(icon!.getElement()).toContainHTML(icons['treeview-collapse']);
    });
  });
});
