// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Icon from '../../../lib/components/icon';
import ItemCard from '../../../lib/components/item-card';
import InternalItemCard from '../../../lib/components/item-card/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/item-card/styles.css.js';

function renderItemCard(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container);
  const itemCard = wrapper.findItemCard()!;
  return { wrapper, itemCard };
}

test('renders children content', () => {
  const { itemCard } = renderItemCard(<ItemCard>test content</ItemCard>);
  expect(itemCard.getElement()).toHaveTextContent('test content');
});

test('renders without header, footer, or actions by default', () => {
  const { itemCard } = renderItemCard(<ItemCard>content only</ItemCard>);
  expect(itemCard.findHeader()).toBeNull();
  expect(itemCard.findFooter()).toBeNull();
  expect(itemCard.getElement()).toHaveTextContent('content only');
});

test('renders header when provided', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Card title">content</ItemCard>);
  const header = itemCard.findHeader();
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('Card title');
});

test('renders header text content', () => {
  const { itemCard } = renderItemCard(<ItemCard header="My Header">content</ItemCard>);
  const header = itemCard.findHeader();
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('My Header');
});

test('renders description when provided', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Title" description="A description">
      content
    </ItemCard>
  );
  const description = itemCard.findDescription();
  expect(description).not.toBeNull();
  expect(description!.getElement()).toHaveTextContent('A description');
});

test('renders footer when provided', () => {
  const { itemCard } = renderItemCard(<ItemCard footer="Footer text">content</ItemCard>);
  const footer = itemCard.findFooter();
  expect(footer).not.toBeNull();
  expect(footer!.getElement()).toHaveTextContent('Footer text');
});

test('does not render footer element when footer is not provided', () => {
  const { itemCard } = renderItemCard(<ItemCard>content</ItemCard>);
  expect(itemCard.findFooter()).toBeNull();
});

test('renders actions in the header area', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Title" actions={<button>Action</button>}>
      content
    </ItemCard>
  );
  const actions = itemCard.findActions();
  expect(actions).not.toBeNull();
  expect(actions!.getElement()).toHaveTextContent('Action');
});

test('renders header and actions together', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Title" actions={<button>Action</button>}>
      content
    </ItemCard>
  );
  expect(itemCard.findHeader()!.getElement()).toHaveTextContent('Title');
  expect(itemCard.findActions()!.getElement()).toHaveTextContent('Action');
});

test('renders all parts together: header, description, actions, children, footer', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Header" description="Description" actions={<button>Act</button>} footer="Footer">
      Body
    </ItemCard>
  );
  expect(itemCard.findHeader()!.getElement()).toHaveTextContent('Header');
  expect(itemCard.findDescription()!.getElement()).toHaveTextContent('Description');
  expect(itemCard.findActions()!.getElement()).toHaveTextContent('Act');
  expect(itemCard.findContent()!.getElement()).toHaveTextContent('Body');
  expect(itemCard.findFooter()!.getElement()).toHaveTextContent('Footer');
});

test('does not render body when children are not provided', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title" />);
  expect(itemCard.findContent()).toBeNull();
});

describe('disableHeaderPaddings', () => {
  test('applies no-padding class to header when disableHeaderPaddings is true', () => {
    const { itemCard } = renderItemCard(
      <ItemCard header="Title" disableHeaderPaddings={true}>
        content
      </ItemCard>
    );
    const headerWrapper = itemCard.findByClassName(styles.header);
    expect(headerWrapper!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to header by default', () => {
    const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
    const headerWrapper = itemCard.findByClassName(styles.header);
    expect(headerWrapper!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableContentPaddings', () => {
  test('applies no-padding class to body when disableContentPaddings is true', () => {
    const { itemCard } = renderItemCard(<ItemCard disableContentPaddings={true}>content</ItemCard>);
    const body = itemCard.findContent();
    expect(body!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to body by default', () => {
    const { itemCard } = renderItemCard(<ItemCard>content</ItemCard>);
    const body = itemCard.findContent();
    expect(body!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableFooterPaddings', () => {
  test('applies no-padding class to footer when disableFooterPaddings is true', () => {
    const { itemCard } = renderItemCard(
      <ItemCard footer="Footer" disableFooterPaddings={true}>
        content
      </ItemCard>
    );
    const footer = itemCard.findFooter();
    expect(footer!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to footer by default', () => {
    const { itemCard } = renderItemCard(<ItemCard footer="Footer">content</ItemCard>);
    const footer = itemCard.findFooter();
    expect(footer!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('icon', () => {
  test('renders icon when icon is provided', () => {
    const { itemCard } = renderItemCard(
      <ItemCard header="Title" icon={<Icon name="settings"></Icon>}>
        content
      </ItemCard>
    );
    expect(itemCard.findIcon()).not.toBeNull();
    expect(itemCard.findHeader()).not.toBeNull();
  });

  test('renders icon and header area when icon is provided without header text', () => {
    const { itemCard } = renderItemCard(<ItemCard icon={<Icon name="settings"></Icon>}>content</ItemCard>);
    expect(itemCard.findIcon()).not.toBeNull();
  });

  test('does not render icon when icon is not provided', () => {
    const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
    expect(itemCard.findIcon()).toBeNull();
  });
});

describe('Style API', () => {
  test('applies style properties to root element', () => {
    const { itemCard } = renderItemCard(
      <ItemCard
        header="Header"
        footer="Footer"
        style={{
          root: {
            borderRadius: '20px',
          },
          content: {
            paddingBlock: '30px',
            paddingInline: '40px',
          },
          header: {
            paddingBlock: '10px',
            paddingInline: '20px',
          },
          footer: {
            root: {
              paddingBlock: '15px',
              paddingInline: '25px',
            },
            divider: {
              borderColor: 'red',
              borderWidth: '2px',
            },
          },
        }}
      >
        Content
      </ItemCard>
    );

    expect(getComputedStyle(itemCard.getElement()).getPropertyValue('border-radius')).toBe('20px');

    const body = itemCard.findContent()!;
    expect(getComputedStyle(body.getElement()).getPropertyValue('padding-block')).toBe('30px');
    expect(getComputedStyle(body.getElement()).getPropertyValue('padding-inline')).toBe('40px');

    const headerWrapper = itemCard.findByClassName(styles.header)!;
    expect(getComputedStyle(headerWrapper.getElement()).getPropertyValue('padding-block')).toBe('10px');
    expect(getComputedStyle(headerWrapper.getElement()).getPropertyValue('padding-inline')).toBe('20px');

    const footer = itemCard.findFooter()!;
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-block-start-color')).toBe('red');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-block-start-width')).toBe('2px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-block')).toBe('15px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-inline')).toBe('25px');
  });
});

test('renders actions even when header text is not provided', () => {
  const { itemCard } = renderItemCard(<ItemCard actions={<button>Click</button>}>content</ItemCard>);
  expect(itemCard.findActions()).not.toBeNull();
  expect(itemCard.findActions()!.getElement()).toHaveTextContent('Click');
});

test('renders with only footer and children', () => {
  const { itemCard } = renderItemCard(<ItemCard footer="Some footer">content</ItemCard>);
  expect(itemCard.findHeader()).toBeNull();
  expect(itemCard.findFooter()).not.toBeNull();
  expect(itemCard.findContent()).not.toBeNull();
});

test('renders with only header and no children', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title" />);
  expect(itemCard.findHeader()).not.toBeNull();
  expect(itemCard.findContent()).toBeNull();
  expect(itemCard.findFooter()).toBeNull();
});

test('renders with React nodes as header and footer', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header={<span data-testid="custom-header">Custom Header</span>} footer={<div>Custom Footer</div>}>
      content
    </ItemCard>
  );
  expect(itemCard.findHeader()!.getElement()).toHaveTextContent('Custom Header');
  expect(itemCard.findFooter()!.getElement()).toHaveTextContent('Custom Footer');
});

describe('variant', () => {
  test('applies variant-default class by default', () => {
    const { itemCard } = renderItemCard(<ItemCard>content</ItemCard>);
    expect(itemCard.getElement()).toHaveClass(styles['variant-default']);
  });

  test('applies variant-default class when variant is "default"', () => {
    const { itemCard } = renderItemCard(<ItemCard variant="default">content</ItemCard>);
    expect(itemCard.getElement()).toHaveClass(styles['variant-default']);
    expect(itemCard.getElement()).not.toHaveClass(styles['variant-embedded']);
  });

  test('applies variant-embedded class when variant is "embedded"', () => {
    const { itemCard } = renderItemCard(<ItemCard variant="embedded">content</ItemCard>);
    expect(itemCard.getElement()).toHaveClass(styles['variant-embedded']);
    expect(itemCard.getElement()).not.toHaveClass(styles['variant-default']);
  });
});

describe('nativeAttributes', () => {
  test('forwards data-* attributes to the root element', () => {
    const { itemCard } = renderItemCard(
      <ItemCard nativeAttributes={{ 'data-testid': 'my-card', 'data-custom': 'value' }}>content</ItemCard>
    );
    expect(itemCard.getElement()).toHaveAttribute('data-testid', 'my-card');
    expect(itemCard.getElement()).toHaveAttribute('data-custom', 'value');
  });

  test('forwards aria-* attributes to the root element', () => {
    const { itemCard } = renderItemCard(
      <ItemCard nativeAttributes={{ 'aria-label': 'Card label', 'aria-describedby': 'desc-id' }}>content</ItemCard>
    );
    expect(itemCard.getElement()).toHaveAttribute('aria-label', 'Card label');
    expect(itemCard.getElement()).toHaveAttribute('aria-describedby', 'desc-id');
  });

  test('forwards event handlers via nativeAttributes', () => {
    const onMouseEnter = jest.fn();
    const { itemCard } = renderItemCard(<ItemCard nativeAttributes={{ onMouseEnter }}>content</ItemCard>);
    fireEvent.mouseEnter(itemCard.getElement());
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });
});

describe('internal props', () => {
  function renderInternalItemCard(jsx: React.ReactElement) {
    const { container } = render(jsx);
    const wrapper = createWrapper(container);
    const itemCard = wrapper.findItemCard()!;
    return { wrapper, itemCard };
  }

  describe('highlighted', () => {
    it.each([true])('applies highlighted class when highlighted=%s', highlighted => {
      const { itemCard } = renderInternalItemCard(
        <InternalItemCard highlighted={highlighted}>content</InternalItemCard>
      );
      expect(itemCard.getElement()).toHaveClass(styles.highlighted);
    });

    it.each([false, undefined])('does not apply highlighted class when highlighted=%s', highlighted => {
      const { itemCard } = renderInternalItemCard(
        <InternalItemCard highlighted={highlighted}>content</InternalItemCard>
      );
      expect(itemCard.getElement()).not.toHaveClass(styles.highlighted);
    });
  });

  describe('fullHeight', () => {
    it.each([true])('applies full-height class when fullHeight=%s', fullHeight => {
      const { itemCard } = renderInternalItemCard(<InternalItemCard fullHeight={fullHeight}>content</InternalItemCard>);
      expect(itemCard.getElement()).toHaveClass(styles['full-height']);
    });

    it.each([false, undefined])('does not apply full-height class when fullHeight=%s', fullHeight => {
      const { itemCard } = renderInternalItemCard(<InternalItemCard fullHeight={fullHeight}>content</InternalItemCard>);
      expect(itemCard.getElement()).not.toHaveClass(styles['full-height']);
    });
  });
});
