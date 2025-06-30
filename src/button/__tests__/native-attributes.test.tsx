// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/button/styles.css.js';

describe('Button native attributes', () => {
  test('passes nativeAttributes to the button element', () => {
    const { container } = render(
      <Button
        nativeAttributes={{
          'data-testid': 'test-button',
          'aria-controls': 'controlled-element',
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAttribute('data-testid', 'test-button');
    expect(wrapper.getElement()).toHaveAttribute('aria-controls', 'controlled-element');
  });

  test('passes nativeAttributes to the anchor element when href is provided', () => {
    const { container } = render(
      <Button
        href="https://example.com"
        nativeAttributes={{
          'data-testid': 'test-link',
          'aria-controls': 'controlled-element',
        }}
      >
        Link text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAttribute('data-testid', 'test-link');
    expect(wrapper.getElement()).toHaveAttribute('aria-controls', 'controlled-element');
    expect(wrapper.getElement().tagName).toBe('A');
  });

  test('overrides built-in attributes with nativeAttributes', () => {
    const { container } = render(
      <Button
        ariaLabel="Button label"
        nativeAttributes={{
          'aria-label': 'Override label',
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveAccessibleName('Override label');
  });

  test('combines built-in className with any provided in nativeAttributes', () => {
    const { container } = render(
      <Button
        ariaLabel="Button label"
        nativeAttributes={{
          className: 'my-additional-class',
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;

    expect(wrapper.getElement()).toHaveClass('my-additional-class');
    expect(wrapper.getElement()).toHaveClass(styles.button);
  });

  test('events get chained', () => {
    const mainClick = jest.fn();
    const nativeClick = jest.fn();
    const { container } = render(
      <Button
        ariaLabel="Button label"
        onClick={mainClick}
        nativeAttributes={{
          onClick: nativeClick
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;
    wrapper.click();
    expect(mainClick).toHaveBeenCalled();
    expect(nativeClick).toHaveBeenCalled();
  })

  test('events can be cancelled', () => {
    const mainClick = jest.fn();
    const { container } = render(
      <Button
        ariaLabel="Button label"
        onClick={mainClick}
        nativeAttributes={{
          onClick: e => e.preventDefault()
        }}
      >
        Button text
      </Button>
    );
    const wrapper = createWrapper(container).findButton()!;
    wrapper.click();
    expect(mainClick).not.toHaveBeenCalled();
  })

  describe('function variant of nativeAttributes', () => {
    test('can extend existing attributes', () => {
      const { container } = render(
        <Button
          ariaLabel="Button label"
          nativeAttributes={(attributes) => ({
            ...attributes,
            className: `${attributes.className} my-additional-class`
          })}
        >
          Button text
        </Button>
      );
      const wrapper = createWrapper(container).findButton()!;
      expect(wrapper.getElement()).toHaveClass('my-additional-class');
      expect(wrapper.getElement()).toHaveClass(styles.button);
    });

    test('can override attributes', () => {
      const { container } = render(
        <Button
          ariaLabel="Button label"
          nativeAttributes={(attributes) => ({
            ...attributes,
            className: 'my-custom-class'
          })}
        >
          Button text
        </Button>
      );
      const wrapper = createWrapper(container).find('button')!;
      expect(wrapper.getElement()).toHaveClass('my-custom-class');
      expect(wrapper.getElement()).not.toHaveClass(styles.button);
    });

    test('can remove attributes', () => {
      const { container } = render(
        <Button
          ariaLabel="Button label"
          nativeAttributes={() => ({})}
        >
          Button text
        </Button>
      );
      const wrapper = createWrapper(container).find('button')!;
      expect(wrapper.getElement()).not.toHaveClass(styles.button);
    });

    test('can override event', () => {
      const mainOnClick = jest.fn();
      const { container } = render(
        <Button
          ariaLabel="Button label"
          onClick={mainOnClick}
          nativeAttributes={(attributes) => ({
            ...attributes,
            onClick: () => {}
          })}
        >
          Button text
        </Button>
      );
      const wrapper = createWrapper(container).findButton()!;
      wrapper.click();
      expect(mainOnClick).not.toHaveBeenCalled();
    });
    test('can extend event', () => {
      const mainOnClick = jest.fn();
      const { container } = render(
        <Button
          ariaLabel="Button label"
          onClick={mainOnClick}
          nativeAttributes={(attributes) => ({
            ...attributes,
            onClick: (event) => {
              attributes.onClick?.(event as any);
            }
          })}
        >
          Button text
        </Button>
      );
      const wrapper = createWrapper(container).findButton()!;
      wrapper.click();
      expect(mainOnClick).toHaveBeenCalled();
    })
  });
});
