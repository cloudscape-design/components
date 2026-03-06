// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Card from '../../../lib/components/card';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/card/styles.css.js';

function renderCard(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container);
  const root = wrapper.findByClassName(styles.root)!;
  return { wrapper, root };
}

test('renders children content', () => {
  const { root } = renderCard(<Card>test content</Card>);
  expect(root.getElement()).toHaveTextContent('test content');
});

test('renders without header, footer, or actions by default', () => {
  const { root } = renderCard(<Card>content only</Card>);
  expect(root.findByClassName(styles.header)).toBeNull();
  expect(root.findByClassName(styles.footer)).toBeNull();
  expect(root.getElement()).toHaveTextContent('content only');
});

test('renders header when provided', () => {
  const { root } = renderCard(<Card header="Card title">content</Card>);
  const header = root.findByClassName(styles.header);
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('Card title');
});

test('renders header-inner element for header text', () => {
  const { root } = renderCard(<Card header="My Header">content</Card>);
  const headerInner = root.findByClassName(styles['header-inner']);
  expect(headerInner).not.toBeNull();
  expect(headerInner!.getElement()).toHaveTextContent('My Header');
});

test('renders description when provided', () => {
  const { root } = renderCard(
    <Card header="Title" description="A description">
      content
    </Card>
  );
  const description = root.findByClassName(styles.description);
  expect(description).not.toBeNull();
  expect(description!.getElement()).toHaveTextContent('A description');
});

test('renders footer when provided', () => {
  const { root } = renderCard(<Card footer="Footer text">content</Card>);
  const footer = root.findByClassName(styles.footer);
  expect(footer).not.toBeNull();
  expect(footer!.getElement()).toHaveTextContent('Footer text');
});

test('does not render footer element when footer is not provided', () => {
  const { root } = renderCard(<Card>content</Card>);
  expect(root.findByClassName(styles.footer)).toBeNull();
});

test('renders actions in the header area', () => {
  const { root } = renderCard(
    <Card header="Title" actions={<button>Action</button>}>
      content
    </Card>
  );
  const header = root.findByClassName(styles.header);
  expect(header).not.toBeNull();
  expect(header!.getElement()).toHaveTextContent('Action');
});

test('renders header with with-actions class when actions are provided', () => {
  const { root } = renderCard(
    <Card header="Title" actions={<button>Action</button>}>
      content
    </Card>
  );
  const header = root.findByClassName(styles.header);
  expect(header!.getElement()).toHaveClass(styles['with-actions']);
});

test('renders header without with-actions class when no actions', () => {
  const { root } = renderCard(<Card header="Title">content</Card>);
  const header = root.findByClassName(styles.header);
  expect(header!.getElement()).not.toHaveClass(styles['with-actions']);
});

test('renders all parts together: header, description, actions, children, footer', () => {
  const { root } = renderCard(
    <Card header="Header" description="Description" actions={<button>Act</button>} footer="Footer">
      Body
    </Card>
  );
  expect(root.findByClassName(styles.header)).not.toBeNull();
  expect(root.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Header');
  expect(root.findByClassName(styles.description)!.getElement()).toHaveTextContent('Description');
  expect(root.findByClassName(styles.body)!.getElement()).toHaveTextContent('Body');
  expect(root.findByClassName(styles.footer)!.getElement()).toHaveTextContent('Footer');
});

test('applies no-header class when header row is empty', () => {
  const { root } = renderCard(<Card>content only</Card>);
  expect(root.getElement()).toHaveClass(styles['no-header']);
});

test('does not apply no-header class when header is provided', () => {
  const { root } = renderCard(<Card header="Title">content</Card>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only actions are provided', () => {
  const { root } = renderCard(<Card actions={<button>Act</button>}>content</Card>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('does not apply no-header class when only description is provided', () => {
  const { root } = renderCard(<Card description="Desc">content</Card>);
  expect(root.getElement()).not.toHaveClass(styles['no-header']);
});

test('applies no-content class when children are not provided', () => {
  const { root } = renderCard(<Card header="Title" />);
  expect(root.getElement()).toHaveClass(styles['no-content']);
});

test('does not apply no-content class when children are provided', () => {
  const { root } = renderCard(<Card header="Title">content</Card>);
  expect(root.getElement()).not.toHaveClass(styles['no-content']);
});

test('does not render body when children are not provided', () => {
  const { root } = renderCard(<Card header="Title" />);
  expect(root.findByClassName(styles.body)).toBeNull();
});

describe('disableHeaderPaddings', () => {
  test('applies no-padding class to header when disableHeaderPaddings is true', () => {
    const { root } = renderCard(
      <Card header="Title" disableHeaderPaddings={true}>
        content
      </Card>
    );
    const header = root.findByClassName(styles.header);
    expect(header!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to header by default', () => {
    const { root } = renderCard(<Card header="Title">content</Card>);
    const header = root.findByClassName(styles.header);
    expect(header!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableContentPaddings', () => {
  test('applies no-padding class to body when disableContentPaddings is true', () => {
    const { root } = renderCard(<Card disableContentPaddings={true}>content</Card>);
    const body = root.findByClassName(styles.body);
    expect(body!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to body by default', () => {
    const { root } = renderCard(<Card>content</Card>);
    const body = root.findByClassName(styles.body);
    expect(body!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('disableFooterPaddings', () => {
  test('applies no-padding class to footer when disableFooterPaddings is true', () => {
    const { root } = renderCard(
      <Card footer="Footer" disableFooterPaddings={true}>
        content
      </Card>
    );
    const footer = root.findByClassName(styles.footer);
    expect(footer!.getElement()).toHaveClass(styles['no-padding']);
  });

  test('does not apply no-padding class to footer by default', () => {
    const { root } = renderCard(<Card footer="Footer">content</Card>);
    const footer = root.findByClassName(styles.footer);
    expect(footer!.getElement()).not.toHaveClass(styles['no-padding']);
  });
});

describe('icon', () => {
  test('renders icon when iconName is provided', () => {
    const { root } = renderCard(
      <Card header="Title" iconName="settings">
        content
      </Card>
    );
    // The header area should be rendered when an icon is present
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });

  test('renders header area even without header text when icon is provided', () => {
    const { root } = renderCard(<Card iconName="settings">content</Card>);
    expect(root.findByClassName(styles.header)).not.toBeNull();
    expect(root.getElement()).not.toHaveClass(styles['no-header']);
  });

  test('renders icon from iconSvg', () => {
    const svgElement = (
      <svg focusable="false" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" />
      </svg>
    );
    const { root } = renderCard(
      <Card header="Title" iconSvg={svgElement}>
        content
      </Card>
    );
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });

  test('renders icon from iconUrl', () => {
    const { root } = renderCard(
      <Card header="Title" iconUrl="/icon.png" iconAlt="custom icon">
        content
      </Card>
    );
    expect(root.findByClassName(styles.header)).not.toBeNull();
  });
});

describe('Style API', () => {
  test('applies style properties to root element', () => {
    const { root } = renderCard(
      <Card
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
      </Card>
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
  const { root } = renderCard(<Card actions={<button>Click</button>}>content</Card>);
  expect(root.findByClassName(styles.header)).not.toBeNull();
});

test('renders with only footer and children', () => {
  const { root } = renderCard(<Card footer="Some footer">content</Card>);
  expect(root.findByClassName(styles.header)).toBeNull();
  expect(root.findByClassName(styles.footer)).not.toBeNull();
  expect(root.findByClassName(styles.body)).not.toBeNull();
});

test('renders with only header and no children', () => {
  const { root } = renderCard(<Card header="Title" />);
  expect(root.findByClassName(styles.header)).not.toBeNull();
  expect(root.findByClassName(styles.body)).toBeNull();
  expect(root.findByClassName(styles.footer)).toBeNull();
});

test('renders with React nodes as header and footer', () => {
  const { root } = renderCard(
    <Card header={<span data-testid="custom-header">Custom Header</span>} footer={<div>Custom Footer</div>}>
      content
    </Card>
  );
  expect(root.findByClassName(styles['header-inner'])!.getElement()).toHaveTextContent('Custom Header');
  expect(root.findByClassName(styles.footer)!.getElement()).toHaveTextContent('Custom Footer');
});
