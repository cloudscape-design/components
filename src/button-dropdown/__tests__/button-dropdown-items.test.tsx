// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { InternalButtonDropdownProps } from '../../../lib/components/button-dropdown/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { isItemGroup, isLinkItem } from '../utils/utils';

import categoryStyles from '../../../lib/components/button-dropdown/category-elements/styles.css.js';
import categoryItemStyles from '../../../lib/components/button-dropdown/category-elements/styles.css.js';
import itemStyles from '../../../lib/components/button-dropdown/item-element/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';
import optionsListStyles from '../../../lib/components/internal/components/options-list/styles.css.js';

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const checkRenderedGroup = (
  renderedItem: ElementWrapper,
  group: ButtonDropdownProps.ItemGroup,
  parentIsDisabled: boolean
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
    if (group.disabled) {
      expect(element.querySelector(`.${categoryItemStyles['items-list-container']}`)).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    }
  }

  if (group.iconName || group.iconSvg || group.iconUrl) {
    expect(renderedItem.findIcon()).toBeTruthy();
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

  renderedItems.forEach((renderedItem: ElementWrapper, index: number) => {
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
        <svg className="test-svg" focusable="false">
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
        expect(wrapper.findItemById('i1')!.findAllIcons()).toHaveLength(2);
      });

      test.each([true, false])('in category headers when expandableGroups is %s', expandableGroups => {
        const svg = (
          <svg className="test-svg" focusable="false">
            <circle className="test-svg-inner" cx="8" cy="8" r="7" />
          </svg>
        );
        const groupedCategories: ButtonDropdownProps.ItemOrGroup[] = [
          {
            id: 'category1',
            text: 'category1',
            iconName: 'folder',
            items: [{ id: 'i1', text: 'item1' }],
          },
          {
            id: 'category2',
            text: 'category2',
            iconUrl: 'data:image/png;base64,aaaa',
            items: [{ id: 'i2', text: 'item2' }],
          },
          {
            id: 'category3',
            text: 'category3',
            iconSvg: svg,
            items: [{ id: 'i3', text: 'item3' }],
          },
        ];
        const wrapper = renderButtonDropdown({ ...props, expandableGroups, items: groupedCategories });
        wrapper.openDropdown();

        if (expandableGroups) {
          expect(wrapper.findExpandableCategoryById('category1')!.findIcon()).toBeTruthy();
          expect(wrapper.findExpandableCategoryById('category2')!.findIcon()).toBeTruthy();
          expect(wrapper.findExpandableCategoryById('category3')!.findIcon()).toBeTruthy();
        } else {
          expect(wrapper.findOpenDropdown()!.findAllIcons()).toHaveLength(3);
        }
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

  it('should render secondaryText and labelTag', () => {
    const items = [
      { id: 'i1', text: 'Option 1', secondaryText: 'Description 1', labelTag: 'Ctrl+D 1' },
      { id: 'i2', text: 'Option 2', secondaryText: 'Description 2', labelTag: 'Ctrl+D 2' },
    ];
    const wrapper = renderButtonDropdown({ items });
    wrapper.openDropdown();

    const item1 = wrapper.findItemById('i1')!;
    expect(item1.getElement()).toHaveTextContent('Option 1');
    expect(item1.getElement()).toHaveTextContent('Description 1');
    expect(item1.getElement()).toHaveTextContent('Ctrl+D 1');

    const item2 = wrapper.findItemById('i2')!;
    expect(item2.getElement()).toHaveTextContent('Option 2');
    expect(item2.getElement()).toHaveTextContent('Description 2');
    expect(item2.getElement()).toHaveTextContent('Ctrl+D 2');
  });
});

test('findItems and findItemById support disabled filter', () => {
  const items: ButtonDropdownProps.Items = [
    { id: 'e1', text: 'Enabled' },
    { id: 'd1', text: 'Disabled', disabled: true },
  ];
  const wrapper = renderButtonDropdown({ items });
  wrapper.openDropdown();

  expect(wrapper.findItems()).toHaveLength(2);
  expect(wrapper.findItems({ disabled: true })).toHaveLength(1);
  expect(wrapper.findItems({ disabled: false })).toHaveLength(1);
  expect(wrapper.findItemById('d1', { disabled: true })).not.toBeNull();
  expect(wrapper.findItemById('e1', { disabled: true })).toBeNull();
});

test('disabled category items are found with disabled filter', () => {
  const items: ButtonDropdownProps.Items = [{ text: 'Category', disabled: true, items: [{ id: 'c1', text: 'Item' }] }];
  const wrapper = renderButtonDropdown({ items });
  wrapper.openDropdown();

  expect(wrapper.findItems({ disabled: true })).toHaveLength(1);
  expect(wrapper.findItemById('c1', { disabled: true })).not.toBeNull();
});

describe('ButtonDropdown download property', () => {
  const testProps = { expandToViewport: false };

  it('should render download attribute with boolean true value', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'download-item',
        text: 'Download file',
        href: 'https://example.com/file.pdf',
        download: true,
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('download-item')!.find('a')!.getElement();
    expect(anchor).toHaveAttribute('download', '');
    expect(anchor).toHaveAttribute('href', 'https://example.com/file.pdf');
  });

  it('should render download attribute with string value', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'download-item',
        text: 'Download file',
        href: 'https://example.com/file.pdf',
        download: 'custom-filename.pdf',
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('download-item')!.find('a')!.getElement();
    expect(anchor).toHaveAttribute('download', 'custom-filename.pdf');
    expect(anchor).toHaveAttribute('href', 'https://example.com/file.pdf');
  });

  it('should not render download attribute when download is false', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'no-download-item',
        text: 'Regular link',
        href: 'https://example.com/page',
        download: false,
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('no-download-item')!.find('a')!.getElement();
    expect(anchor).not.toHaveAttribute('download');
    expect(anchor).toHaveAttribute('href', 'https://example.com/page');
  });

  it('should not render download attribute when download is not specified', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'regular-item',
        text: 'Regular link',
        href: 'https://example.com/page',
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('regular-item')!.find('a')!.getElement();
    expect(anchor).not.toHaveAttribute('download');
    expect(anchor).toHaveAttribute('href', 'https://example.com/page');
  });

  it('should not render download attribute when href is not provided', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'no-href-item',
        text: 'Button item',
        download: true,
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const item = wrapper.findItemById('no-href-item')!;
    expect(item.find('a')).toBe(null);
    expect(item.getElement()).toHaveTextContent('Button item');
  });

  it('should not render download attribute when item is disabled', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'disabled-download-item',
        text: 'Disabled download',
        href: 'https://example.com/file.pdf',
        download: 'filename.pdf',
        disabled: true,
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('disabled-download-item')!.find('a')!.getElement();
    expect(anchor).not.toHaveAttribute('download');
    expect(anchor).not.toHaveAttribute('href');
  });

  it('should not render download attribute when parent category is disabled', () => {
    const items: ButtonDropdownProps.Items = [
      {
        text: 'Disabled category',
        disabled: true,
        items: [
          {
            id: 'category-download-item',
            text: 'Download in disabled category',
            href: 'https://example.com/file.pdf',
            download: true,
          },
        ],
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('category-download-item')!.find('a')!.getElement();
    expect(anchor).not.toHaveAttribute('download');
    expect(anchor).not.toHaveAttribute('href');
  });

  it('should render download attribute with external link', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'external-download-item',
        text: 'Download external file',
        href: 'https://external.com/file.pdf',
        download: 'external-file.pdf',
        external: true,
        externalIconAriaLabel: '(opens new tab)',
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const anchor = wrapper.findItemById('external-download-item')!.find('a')!.getElement();
    expect(anchor).toHaveAttribute('download', 'external-file.pdf');
    expect(anchor).toHaveAttribute('href', 'https://external.com/file.pdf');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render download attribute in nested category items', () => {
    const items: ButtonDropdownProps.Items = [
      {
        text: 'Downloads',
        items: [
          {
            id: 'nested-download-item',
            text: 'Download nested file',
            href: 'https://example.com/nested-file.pdf',
            download: 'nested-filename.pdf',
          },
          {
            id: 'nested-regular-item',
            text: 'Regular nested link',
            href: 'https://example.com/page',
          },
        ],
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    const downloadAnchor = wrapper.findItemById('nested-download-item')!.find('a')!.getElement();
    expect(downloadAnchor).toHaveAttribute('download', 'nested-filename.pdf');
    expect(downloadAnchor).toHaveAttribute('href', 'https://example.com/nested-file.pdf');

    const regularAnchor = wrapper.findItemById('nested-regular-item')!.find('a')!.getElement();
    expect(regularAnchor).not.toHaveAttribute('download');
    expect(regularAnchor).toHaveAttribute('href', 'https://example.com/page');
  });

  it('should handle mixed items with and without download', () => {
    const items: ButtonDropdownProps.Items = [
      {
        id: 'download-boolean',
        text: 'Download with boolean',
        href: 'https://example.com/file1.pdf',
        download: true,
      },
      {
        id: 'download-string',
        text: 'Download with string',
        href: 'https://example.com/file2.pdf',
        download: 'custom-name.pdf',
      },
      {
        id: 'regular-link',
        text: 'Regular link',
        href: 'https://example.com/page',
      },
      {
        id: 'button-item',
        text: 'Button item',
      },
    ];
    const wrapper = renderButtonDropdown({ ...testProps, items });
    wrapper.openDropdown();

    // Check download with boolean
    const booleanAnchor = wrapper.findItemById('download-boolean')!.find('a')!.getElement();
    expect(booleanAnchor).toHaveAttribute('download', '');

    // Check download with string
    const stringAnchor = wrapper.findItemById('download-string')!.find('a')!.getElement();
    expect(stringAnchor).toHaveAttribute('download', 'custom-name.pdf');

    // Check regular link
    const regularAnchor = wrapper.findItemById('regular-link')!.find('a')!.getElement();
    expect(regularAnchor).not.toHaveAttribute('download');

    // Check button item (no anchor)
    const buttonItem = wrapper.findItemById('button-item')!;
    expect(buttonItem.find('a')).toBe(null);
  });
});
