// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { InternalButtonDropdownProps } from '../../../lib/components/button-dropdown/interfaces';
import createWrapper, { IconWrapper } from '../../../lib/components/test-utils/dom';
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { isItemGroup, isLinkItem } from '../utils/utils';

import itemStyles from '../../../lib/components/button-dropdown/item-element/styles.css.js';
import categoryStyles from '../../../lib/components/button-dropdown/category-elements/styles.css.js';
import optionsListStyles from '../../../lib/components/internal/components/options-list/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const checkRenderedGroup = (
  renderedItem: ElementWrapper,
  group: ButtonDropdownProps.ItemGroup,
  parentIsDisabled = false
) => {
  const element = renderedItem.getElement();

  checkRenderedItems(renderedItem, group.items, group.disabled, true);

  if (group.text) {
    const header = renderedItem.find(`.${categoryStyles.header}`);
    expect(header).not.toBe(null);
    expect(header!.getElement()).toHaveTextContent(group.text);
  }

  if (parentIsDisabled || group.disabled) {
    expect(element).toHaveClass(`${categoryStyles.disabled}`);
    expect(element).toHaveAttribute('aria-disabled', 'true');
  }
};

const checkElementItem = (
  renderedItem: ElementWrapper,
  item: ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem,
  parentIsDisabled = false
) => {
  const element = renderedItem.getElement();
  expect(element).toHaveTextContent(item.text);

  const disabled = parentIsDisabled || item.disabled;

  if (isLinkItem(item) && item.href) {
    const anchor = renderedItem.find('a')!.getElement();
    if (disabled) {
      expect(anchor).not.toHaveAttribute('href');
    } else {
      expect(anchor).toHaveAttribute('href', item.href);
    }
  }

  if (item.lang) {
    expect(element.children[0]).toHaveAttribute('lang', item.lang);
  } else {
    expect(element.children[0]).not.toHaveAttribute('lang');
  }

  if (disabled) {
    expect(element).toHaveClass(`${itemStyles.disabled}`);
    expect(element.children[0]).toHaveAttribute('aria-disabled', 'true');
  }

  if (item.iconName || item.iconSvg || item.iconUrl) {
    expect(renderedItem.findIcon()).toBeTruthy();
  }
};

const checkRenderedItems = (
  wrapper: ComponentWrapper | ElementWrapper,
  items: ButtonDropdownProps.Items,
  parentIsDisabled = false,
  isChildGroup = false
) => {
  const renderedItems = isChildGroup
    ? wrapper.findAll(`:scope > ul > li`)
    : wrapper.findAll(`.${optionsListStyles['options-list']} > li`);

  expect(renderedItems.length).toBe(items.length);

  Array.prototype.forEach.call(renderedItems, (renderedItem, index) => {
    const item = items[index];

    if (isItemGroup(item)) {
      checkRenderedGroup(renderedItem, item, parentIsDisabled);
    } else {
      checkElementItem(renderedItem, item, parentIsDisabled);
    }
  });
};

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1', description: 'Item 1 description' },
  {
    items: [
      { id: 'i2', text: 'item2' },
      { id: 'i3', text: 'item3' },
    ],
  },
  { id: 'i4', text: 'item4' },
];

[{ expandToViewport: false }, { expandToViewport: true }].forEach(props => {
  describe(`ButtonDropdown Items ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    test('should render a dropdown if the property is set', () => {
      const wrapper = renderButtonDropdown({ ...props, items });
      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()).not.toBe(null);
      expect(wrapper.findItemById('i1')).not.toBe(null);
    });

    test('should have a data-description attribute when a description is set', () => {
      const wrapper = renderButtonDropdown({ ...props, items });
      wrapper.openDropdown();
      expect(wrapper.findItemById('i1')!.getElement()).toHaveAttribute('data-description', 'Item 1 description');
      expect(wrapper.findItemById('i2')!.getElement()).not.toHaveAttribute('data-description');
    });

    test('should render dropdown items', () => {
      const simpleItems = [
        { id: 'i1', text: 'item1' },
        { id: 'i2', text: 'item2' },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: simpleItems });

      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, simpleItems);
    });

    test('should render disabled dropdown items', () => {
      const itemsWithDisabled = [
        { id: 'i1', text: 'item1' },
        { id: 'i2', disabled: true, text: 'item2' },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: itemsWithDisabled });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, itemsWithDisabled);
    });

    test('should render categories', () => {
      const category = [
        {
          id: 'category',
          text: 'category',
          items: [
            { id: 'i1', text: 'item1' },
            { id: 'i2', disabled: true, text: 'item2' },
          ],
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: category });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, category);
    });

    test('should render disabled categories', () => {
      const disabledCategory = [
        {
          text: 'category',
          disabled: true,
          items: [
            { id: 'i1', text: 'item1' },
            { id: 'i2', disabled: true, text: 'item2' },
          ],
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: disabledCategory });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, disabledCategory);
    });

    test('should render lang on items', () => {
      const items = [
        {
          id: 'i0',
          text: 'Deutsch',
          lang: 'de',
        },
        {
          text: 'category',
          disabled: true,
          items: [
            { id: 'i1', disabled: true, text: 'English', lang: 'en' },
            { id: 'i2', text: 'item2' },
          ],
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, items);
    });

    test('should render mixed list of items and categories', () => {
      const mixItems = [
        {
          id: 'category1',
          text: 'category1',
          items: [
            { id: 'i1', text: 'item1' },
            { id: 'i2', text: 'item2' },
          ],
        },
        {
          id: 'i3',
          text: 'item3',
        },
        {
          id: 'i4',
          disabled: true,
          text: 'item4',
        },
        {
          id: 'category2',
          text: 'category2',
          disabled: true,
          items: [
            { id: 'i5', text: 'item5' },
            { id: 'i6', text: 'item6' },
          ],
        },
      ];

      const wrapper = renderButtonDropdown({ ...props, items: mixItems });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, mixItems);
    });

    test('treats nested categories as first level category', () => {
      const withNestedCategories = [
        {
          id: 'id1',
          text: 'category1',
          items: [
            {
              id: 'id2',
              text: 'category2',
              items: [
                { id: 'i2', text: 'item2' },
                { id: 'i3', text: 'item3' },
              ],
            },
            { id: 'i1', text: 'item1' },
          ],
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: withNestedCategories });
      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, withNestedCategories);
    });

    test('gets expandable category by id', () => {
      const groupedCategories = [
        {
          id: 'category1',
          text: 'category1',
          items: [
            { id: 'i1', text: 'item1' },
            { id: 'i2', text: 'item2' },
          ],
        },
        {
          id: 'i3',
          text: 'item3',
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, expandableGroups: true, items: groupedCategories });
      wrapper.openDropdown();
      expect(wrapper.findExpandableCategoryById('category1')!.getElement()).toHaveTextContent('category1');
    });

    it('should not render empty category header', () => {
      const categoryWithoutHeader = [
        {
          items: [
            { id: 'i1', text: 'item1' },
            { id: 'i2', text: 'item2' },
          ],
        },
        {
          disabled: true,
          items: [
            { id: 'i5', text: 'item5' },
            { id: 'i6', text: 'item6' },
          ],
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: categoryWithoutHeader });

      wrapper.openDropdown();
      expect(wrapper.findOpenDropdown()!.find(`.${categoryStyles.header}`)).toBe(null);
    });

    it('should render links', () => {
      const simpleItems = [
        {
          id: 'i1',
          text: 'item1',
          href: 'https://amazon.com',
          external: true,
          externalIconAriaLabel: '(opens new tab)',
        },
        { id: 'i2', text: 'item2' },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: simpleItems });

      wrapper.openDropdown();
      checkRenderedItems(wrapper.findOpenDropdown()!, simpleItems);

      const anchor = wrapper.findItemById('i1')!.find('a')!.getElement();
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
      expect(anchor).toHaveAttribute('href', simpleItems[0].href);
    });

    it('external links have correct attributes', () => {
      const simpleItems = [
        {
          id: 'i1',
          text: 'item1',
          href: 'https://amazon.com',
          external: true,
          externalIconAriaLabel: '(opens new tab)',
        },
        {
          id: 'i2',
          text: 'item2',
          href: 'https://amazon.com',
        },
        {
          id: 'i3',
          text: 'item3',
          href: 'https://amazon.com',
          disabled: true,
          external: true,
          externalIconAriaLabel: '(opens new tab)',
        },
      ];
      const wrapper = renderButtonDropdown({ ...props, items: simpleItems });

      wrapper.openDropdown();

      const anchor = wrapper.findItemById('i1')!.find('a')!;
      expect(anchor.getElement()).toHaveAttribute('target', '_blank');
      expect(anchor.getElement()).toHaveAttribute('rel', 'noopener noreferrer');
      expect(anchor.getElement()).toHaveAttribute('href', simpleItems[0].href);

      const icon = anchor.find('[role="img"]')!;
      expect(icon.getElement()).toHaveAttribute('aria-label', simpleItems[0].externalIconAriaLabel);
    });

    it('items without a link cannot be external', () => {
      const simpleItems = [{ id: 'i1', text: 'item1', external: true }];
      const wrapper = renderButtonDropdown({ ...props, items: simpleItems });

      wrapper.openDropdown();
      expect(wrapper.findItemById('i1')!.findIcon()).toBeFalsy();
    });

    describe('should render icons', () => {
      const url = 'data:image/png;base64,aaaa';
      const svg = (
        <svg className="test-svg">
          <circle className="test-svg-inner" cx="8" cy="8" r="7" />
        </svg>
      );

      const iconItems: Array<ButtonDropdownProps.Item> = [
        { id: 'i1', text: 'item1', iconName: 'settings' },
        { id: 'i2', text: 'item2', iconUrl: url, iconAlt: 'iconAlt' },
        { id: 'i3', text: 'item3', iconSvg: svg },
      ];

      it('with regular options', () => {
        const wrapper = renderButtonDropdown({ ...props, items: iconItems });

        wrapper.openDropdown();
        checkRenderedItems(wrapper.findOpenDropdown()!, iconItems);
      });

      it('with link options', () => {
        const iconLinkItems = iconItems.map(item => ({
          ...item,
          href: 'https://amazon.com',
        }));
        iconLinkItems[0] = {
          ...iconLinkItems[0],
          external: true,
          externalIconAriaLabel: '(opens new tab)',
        };
        const wrapper = renderButtonDropdown({ ...props, items: iconLinkItems });

        wrapper.openDropdown();
        checkRenderedItems(wrapper.findOpenDropdown()!, iconLinkItems);
      });

      it('with appropriate alt text', () => {
        const wrapper = renderButtonDropdown({ ...props, items: iconItems });

        wrapper.openDropdown();
        expect(wrapper.findItemById('i2')!.find('img')!.getElement()).toHaveAttribute('alt', 'iconAlt');
      });

      it('on left and right side for external links', () => {
        const items = [
          {
            id: 'i1',
            text: 'item1',
            iconSvg: svg,
            href: 'https://amazon.com',
            external: true,
            externalIconAriaLabel: '(opens new tab)',
          },
        ];
        const wrapper = renderButtonDropdown({ ...props, items: items });

        wrapper.openDropdown();
        expect(wrapper.findItemById('i1')!.findAllByClassName(IconWrapper.rootSelector)).toHaveLength(2);
      });
    });
  });
});

describe('Internal ButtonDropdown badge property', () => {
  it('should render badge when defined', () => {
    const items: InternalButtonDropdownProps['items'] = [
      { id: 'i1', text: 'item1', iconName: 'settings', badge: true },
    ];
    const wrapper = renderButtonDropdown({ variant: 'icon', items: items });

    wrapper.openDropdown();
    expect(wrapper.findByClassName(iconStyles.badge)?.getElement()).toBeInTheDocument();
  });

  it('should render badge on trigger when item has badge', () => {
    const items: InternalButtonDropdownProps['items'] = [
      { id: 'i1', text: 'item1', iconName: 'settings', badge: true },
    ];
    const wrapper = renderButtonDropdown({ variant: 'icon', items: items });

    wrapper.openDropdown();
    expect(wrapper.findAllByClassName(iconStyles.badge)?.map(item => item.getElement())).toHaveLength(2);
  });
});
