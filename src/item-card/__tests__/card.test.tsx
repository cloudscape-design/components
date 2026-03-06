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
  const root = wrapper.findByClassName(styles.root)!;
  return { wrapper, root };
}

test('renders children content', () => {
  const { root } = renderItemCard(<ItemCard>test content</ItemCard>);
  expect(root.getElement()).toHaveTextContent('test content');
});

test('renders without header, footer, or actions by default', () => {
  const { root } = renderItemCard(<ItemCard>content only</ItemCard>);
  expect(root.findByClassName(styles.header)).toBeNull();
  expect(root.findByClassName(styles.footer)).toBeNull();
  expect(root.getElement()).toHaveTextContent('content only');
});

test('renders header when provided', () => {
  const { root } = renderItemCard(<ItemCard header="Card title">content</ItemCard>);
  const header = root.findByClassName(styles.header);
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('Card title');
});

test('renders header-inner element for header text', () => {
  const { root } = renderItemCard(<ItemCard header="My Header">content</ItemCard>);
  const headerInner = root.findByClassName(styles['header-inner']);
  expect(headerInner).not.toBeNull();
  expect(headerInner!.getElement()).toHaveTextContent('My Header');
});

test('renders description when provided', () => {
  const { root } = renderItemCard(
    <ItemCard header="Title" description="A description">
      content
    </ItemCard>
  );
  const description = root.findByClassName(styles.description);
  expect(description).not.toBeNull();
  expect(description!.getElement()).toHaveTextContent('A description');
});

test('renders footer when provided', () => {
  const { root } = renderItemCard(<ItemCard footer="Footer text">content</ItemCard>);
  const footer = root.findByClassName(styles.footer);
  expect(footer).not.toBeNull();
  expect(footer!.getElement()).toHaveTextContent('Footer text');
});

test('does not render footer element when footer is not provided', () => {
  const { root } = renderItemCard(<ItemCard>content</ItemCard>);
  expect(root.findByClassName(styles.footer)).toBeNull();
});

test('renders actions in the header area', () => {
  const { root } = renderItemCard(
    <ItemCard header="Title" actions={<button>Action</button>}>
      content
    </ItemCard>
  );
  const header = root.findByClassName(styles.header);
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('Action');
});

test('renders header with with-actions class when actions are provided', () => {
  const { root } = renderItemCard(
    <ItemCard header="Title" actions={<button>Action</button>}>
      content
    </ItemCard>
  );
  const header = root.findByClassName(styles.header);
  expect(header!.getElement()).toHaveClass(styles['with-actions']);
});

test('renders header without with-actions class when no actions', () => {
  const { root } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  const header = root.findByClassName(styles.header);
  expect(header!.getElement()).not.toHaveClass(styles['with-actions']);
});

test('renders all parts together: header, description, actions, children, footer', () => {
  const { root } = renderItemCard(
    <ItemCard header="Header" description="Description" actions={<button>Act</button>} footer="Footer">
      Body
    </ItemCard>
  );
  expect(root.findByClassName(styles.header)).not.toBeNull();
  expect(root.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Header');
  expect(root.findByClassName(styles.description)!.getElement()).toHaveTextContent('Description');
  expect(root.findByClassName(styles.body)!.getElement()).toHaveTextContent('Body');
  expect(root.findByClassName(styles.footer)!.getElement()).toHaveTextContent('Footer');
});

test('applies no-header class when header row is empty', () => {
  const { root } = renderItemCard(<ItemCard>content only</ItemCard>);
  expect(root.getElement()).toHaveClass(styles['no-header']);
});

test('does not apply no-header class when header is provided', () => {
  const { root } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only actions are provided', () => {
  const { root } = renderItemCard(<ItemCard actions={<button>Act</button>}>content</ItemCard>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only description is provided', () => {
  const { root } = renderItemCard(<ItemCard description="Desc">content</ItemCard>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('applies no-content class when children are not provided', () => {
  const { root } = renderItemCard(<ItemCard header="Title" />);
  expect(root.getElement()).toHaveClass(styles['no-content']);
});

test('does not apply no-content class when children are provided', () => {
  const { root } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
  expect(root.getElement()).not.toHaveClass(styles['no-content']);
});

test('does not render body when children are not provided', () => {
  const { root } = renderItemCard(<ItemCard header="Title" />);
  expect(root.findByClassName(styles.body)).toBeNull();
});

describe('disableHeaderPaddings', () => {
  test('applies no-padding class to header when disableHeaderPaddings is true', () => {
    const { root } = renderItemCard(
      <ItemCard header="Title" disableHeaderPaddings={true}>
        content
      </ItemCard>
    );
    const header = root.findByClassName(styles.header);
    expect(header!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to header by default', () => {
    const { root } = renderItemCard(<ItemCard header="Title">content</ItemCard>);
    const header = root.findByClassName(styles.header);
    expect(header!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableContentPaddings', () => {
  test('applies no-padding class to body when disableContentPaddings is true', () => {
    const { root } = renderItemCard(<ItemCard disableContentPaddings={true}>content</ItemCard>);
    const body = root.findByClassName(styles.body);
    expect(body!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to body by default', () => {
    const { root } = renderItemCard(<ItemCard>content</ItemCard>);
    const body = root.findByClassName(styles.body);
    expect(body!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableFooterPaddings', () => {
  test('applies no-padding class to footer when disableFooterPaddings is true', () => {
    const { root } = renderItemCard(
      <ItemCard footer="Footer" disableFooterPaddings={true}>
        content
      </ItemCard>
    );
    const footer = root.findByClassName(styles.footer);
    expect(footer!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to footer by default', () => {
    const { root } = renderItemCard(<ItemCard footer="Footer">content</ItemCard>);
    const footer = root.findByClassName(styles.footer);
    expect(footer!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('icon', () => {
  test('renders icon when iconName is provided', () => {
    const { root } = renderItemCard(
      <ItemCard header="Title" iconName="settings">
        content
      </ItemCard>
    );
    // The header area should be rendered when an icon is present
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });

  test('renders header area even without header text when icon is provided', () => {
    const { root } = renderItemCard(<ItemCard iconName="settings">content</ItemCard>);
    expect(root.findByClassName(styles.header)).not.toBeNull();
    expect(root.getElement()).not.toHaveClass(styles['no-header']);
  });

  test('renders icon from iconSvg', () => {
    const svgElement = (
      <svg focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );
    const { root } = renderItemCard(
      <ItemCard header="Title" iconSvg={svgElement}>
        content
      </ItemCard>
    );
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });

  test('renders icon from iconUrl', () => {
    const { root } = renderItemCard(
      <ItemCard header="Title" iconUrl="/icon.png" iconAlt="custom icon">
        content
      </ItemCard>
    );
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });
});

describe('Style API', () => {
  test('applies style properties to root element', () => {
    const { root } = renderItemCard(
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

    expect(getComputedStyle(root.getElement()).getPropertyValue('border-radius')).toBe('20px');

    const body = root.findByClassName(styles.body)!;
    expect(getComputedStyle(body.getElement()).getPropertyValue('padding-block')).toBe('30px');
    expect(getComputedStyle(body.getElement()).getPropertyValue('padding-inline')).toBe('40px');

    const header = root.findByClassName(styles.header)!;
    expect(getComputedStyle(header.getElement()).getPropertyValue('padding-block')).toBe('10px');
    expect(getComputedStyle(header.getElement()).getPropertyValue('padding-inline')).toBe('20px');

    const footer = root.findByClassName(styles.footer)!;
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-color')).toBe('red');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('border-width')).toBe('2px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-block')).toBe('15px');
    expect(getComputedStyle(footer.getElement()).getPropertyValue('padding-inline')).toBe('25px');
  });
});

test('renders with empty header still shows header area when actions provided', () => {
  const { root } = renderItemCard(<ItemCard actions={<button>Click</button>}>content</ItemCard>);
  expect(root.findByClassName(styles.header)).not.toBeNull();
});

test('renders with only footer and children', () => {
  const { root } = renderItemCard(<ItemCard footer="Some footer">content</ItemCard>);
  expect(root.findByClassName(styles.header)).toBeNull();
  expect(root.findByClassName(styles.footer)).not.toBeNull();
  expect(root.findByClassName(styles.body)).not.toBeNull();
});

test('renders with only header and no children', () => {
  const { root } = renderItemCard(<ItemCard header="Title" />);
  expect(root.findByClassName(styles.header)).not.toBeNull();
  expect(root.findByClassName(styles.body)).toBeNull();
  expect(root.findByClassName(styles.footer)).toBeNull();
});

test('renders with React nodes as header and footer', () => {
  const { root } = renderItemCard(
    <ItemCard header={<span data-testid="custom-header">Custom Header</span>} footer={<div>Custom Footer</div>}>
      content
    </ItemCard>
  );
  expect(root.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Custom Header');
  expect(root.findByClassName(styles.footer)!.getElement()).toHaveTextContent('Custom Footer');
});
