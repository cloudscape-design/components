// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Divider from '../../../lib/components/divider';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/divider/styles.css.js';

function renderDivider(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDivider()!;
}

describe('Divider', () => {
  test('renders an hr element by default', () => {
    expect(renderDivider(<Divider />).getElement().tagName).toBe('HR');
  });

  test('applies root CSS class', () => {
    expect(renderDivider(<Divider />).getElement()).toHaveClass(styles.divider);
  });
});

describe('semantic prop', () => {
  test('is decorative by default (role="presentation")', () => {
    expect(renderDivider(<Divider />).getElement()).toHaveAttribute('role', 'presentation');
  });

  test('semantic=false sets role="presentation" and no aria-orientation', () => {
    const el = renderDivider(<Divider semantic={false} />).getElement();
    expect(el).toHaveAttribute('role', 'presentation');
    expect(el).not.toHaveAttribute('aria-orientation');
  });

  test('semantic=true sets role="separator" and aria-orientation="horizontal" by default', () => {
    const el = renderDivider(<Divider semantic={true} />).getElement();
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });
});

describe('orientation prop', () => {
  test('horizontal renders an hr element', () => {
    expect(renderDivider(<Divider orientation="horizontal" />).getElement().tagName).toBe('HR');
  });

  test('vertical renders a div element', () => {
    expect(renderDivider(<Divider orientation="vertical" />).getElement().tagName).toBe('DIV');
  });

  test('semantic=true with vertical sets aria-orientation="vertical"', () => {
    const el = renderDivider(<Divider semantic={true} orientation="vertical" />).getElement();
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });
});

describe('children (label)', () => {
  test('renders a div when children is set', () => {
    expect(renderDivider(<Divider>OR</Divider>).getElement().tagName).toBe('DIV');
  });

  test('findLabel returns the label element with correct text', () => {
    const wrapper = renderDivider(<Divider>OR</Divider>);
    expect(wrapper.findLabel()!.getElement()).toHaveTextContent('OR');
  });

  test('findLabel returns null when no children', () => {
    expect(renderDivider(<Divider />).findLabel()).toBeNull();
  });

  test('children is ignored for vertical orientation', () => {
    const wrapper = renderDivider(<Divider orientation="vertical">OR</Divider>);
    expect(wrapper.getElement().tagName).toBe('DIV');
    expect(wrapper.findLabel()).toBeNull();
  });

  test('semantic label sets aria-labelledby pointing to the label element', () => {
    const wrapper = renderDivider(<Divider semantic={true}>OR</Divider>);
    const root = wrapper.getElement();
    const labelEl = wrapper.findLabel()!.getElement();

    expect(root).toHaveAttribute('aria-labelledby', labelEl.id);
    expect(labelEl.id).toBeTruthy();
  });

  test('non-semantic label does not set aria-labelledby', () => {
    const wrapper = renderDivider(<Divider semantic={false}>OR</Divider>);
    expect(wrapper.getElement()).not.toHaveAttribute('aria-labelledby');
  });
});

describe('ariaLabel prop', () => {
  test('semantic divider applies aria-label', () => {
    const el = renderDivider(<Divider semantic={true} ariaLabel="Section separator" />).getElement();
    expect(el).toHaveAttribute('aria-label', 'Section separator');
  });

  test('non-semantic divider does not apply aria-label', () => {
    const el = renderDivider(<Divider semantic={false} ariaLabel="Section separator" />).getElement();
    expect(el).not.toHaveAttribute('aria-label');
  });

  test('ariaLabel takes precedence over aria-labelledby when both label and ariaLabel are set', () => {
    const wrapper = renderDivider(
      <Divider semantic={true} ariaLabel="Custom label">
        OR
      </Divider>
    );
    const root = wrapper.getElement();
    expect(root).toHaveAttribute('aria-label', 'Custom label');
    expect(root).not.toHaveAttribute('aria-labelledby');
  });
});

describe('nativeAttributes', () => {
  test('adds data attributes', () => {
    const { container } = render(<Divider nativeAttributes={{ 'data-testid': 'my-divider' }} />);
    expect(container.querySelector('[data-testid="my-divider"]')).not.toBeNull();
  });

  test('concatenates className', () => {
    const { container } = render(<Divider nativeAttributes={{ className: 'custom-class' }} />);
    expect(container.firstChild).toHaveClass(styles.divider);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
