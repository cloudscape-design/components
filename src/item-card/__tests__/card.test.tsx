// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ItemCard from '../../../lib/components/item-card';
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

test('renders header-inner element for header text', () => {
  const { itemCard } = renderItemCard(<ItemCard header="My Header">content</ItemCard>);
  const headerInner = itemCard.findByClassName(styles['header-inner']);
  expect(headerInner).not.toBeNull();
  expect(headerInner!.getElement()).toHaveTextContent('My Header');
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

test('renders header with with-actions class when actions are provided', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Title" actions={<button>Action</button>}>
      content
    </ItemCard>
  );
  const header = itemCard.findHeader();
  expect(header!.getElement()).toHaveClass(styles['with-actions']);
});

test('renders header without with-actions class when no actions', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  const header = itemCard.findHeader();
  expect(header!.getElement()).not.toHaveClass(styles['with-actions']);
});

test('renders all parts together: header, description, actions, children, footer', () => {
  const { itemCard } = renderItemCard(
    <ItemCard header="Header" description="Description" actions={<button>Act</button>} footer="Footer">
      Body
    </ItemCard>
  );
  expect(itemCard.findHeader()).not.toBeNull();
  expect(itemCard.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Header');
  expect(itemCard.findDescription()!.getElement()).toHaveTextContent('Description');
  expect(itemCard.findContent()!.getElement()).toHaveTextContent('Body');
  expect(itemCard.findFooter()!.getElement()).toHaveTextContent('Footer');
});

test('applies no-header class when header row is empty', () => {
  const { itemCard } = renderItemCard(<ItemCard>content only</ItemCard>);
  expect(itemCard.getElement()).toHaveClass(styles['no-header']);
});

test('does not apply no-header class when header is provided', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  expect(itemCard.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only actions are provided', () => {
  const { itemCard } = renderItemCard(<ItemCard actions={<button>Act</button>}>content</ItemCard>);
  expect(itemCard.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only description is provided', () => {
  const { itemCard } = renderItemCard(<ItemCard description="Desc">content</ItemCard>);
  expect(itemCard.getElement()).not.toHaveClass(styles['no-header']);
});

test('applies no-content class when children are not provided', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title" />);
  expect(itemCard.getElement()).toHaveClass(styles['no-content']);
});

test('does not apply no-content class when children are provided', () => {
  const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  expect(itemCard.getElement()).not.toHaveClass(styles['no-content']);
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
    const header = itemCard.findHeader();
    expect(header!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to header by default', () => {
    const { itemCard } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
    const header = itemCard.findHeader();
    expect(header!.getElement()).not.toHaveClass(styles['no-padding']);
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
  test('renders icon when iconName is provided', () => {
    const { itemCard } = renderItemCard(
      <ItemCard header="Title" iconName="settings">
        content
      </ItemCard>
    );
    // The header area should be rendered when an icon is present
    expect(itemCard.findHeader()).not.toBeNull();
  });

  test('renders header area even without header text when icon is provided', () => {
    const { itemCard } = renderItemCard(<ItemCard iconName="settings">content</ItemCard>);
    expect(itemCard.findHeader()).not.toBeNull();
    expect(itemCard.getElement()).not.toHaveClass(styles['no-header']);
  });

  test('renders icon from iconSvg', () => {
    const svgElement = (
      <svg focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );
    const { itemCard } = renderItemCard(
      <ItemCard header="Title" iconSvg={svgElement}>
        content
      </ItemCard>
    );
    expect(itemCard.findHeader()).not.toBeNull();
  });

  test('renders icon from iconUrl', () => {
    const { itemCard } = renderItemCard(
      <ItemCard header="Title" iconUrl="/icon.png" iconAlt="custom icon">
        content
      </ItemCard>
    );
    expect(itemCard.findHeader()).not.toBeNull();
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

    const header = itemCard.findHeader()!;
    expect(getComputedStyle(header.getElement()).getPropertyValue('padding-block')).toBe('10px');
    expect(getComputedStyle(header.getElement()).getPropertyValue('padding-inline')).toBe('20px');

    const footer = itemCard.findFooter()!;
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-color')).toBe('red');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-width')).toBe('2px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-block')).toBe('15px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-inline')).toBe('25px');
  });
});

test('renders with empty header still shows header area when actions provided', () => {
  const { itemCard } = renderItemCard(<ItemCard actions={<button>Click</button>}>content</ItemCard>);
  expect(itemCard.findHeader()).not.toBeNull();
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
  expect(itemCard.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Custom Header');
  expect(itemCard.findFooter()!.getElement()).toHaveTextContent('Custom Footer');
});
