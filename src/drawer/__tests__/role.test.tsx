// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import NextDrawer from '../../../lib/components/drawer/next';

import drawerStyles from '../../../lib/components/drawer/styles.selectors.js';

function getDrawerElement(container: HTMLElement) {
  return container.querySelector<HTMLElement>(`.${drawerStyles.drawer}`)!;
}

describe('role defaults', () => {
  test('defaults to presentation for static position', () => {
    const { container } = render(<NextDrawer position="static">content</NextDrawer>);
    expect(getDrawerElement(container)).not.toHaveAttribute('role');
  });

  test('defaults to region for non-static positions', () => {
    for (const position of ['fixed', 'absolute', 'sticky'] as const) {
      const { container } = render(
        <NextDrawer position={position} open={true} onClose={jest.fn()}>
          content
        </NextDrawer>
      );
      expect(getDrawerElement(container)).toHaveAttribute('role', 'region');
    }
  });
});

describe('role="region"', () => {
  test('drawer has role=region', () => {
    const { container } = render(<NextDrawer role="region">content</NextDrawer>);
    expect(getDrawerElement(container)).toHaveAttribute('role', 'region');
  });

  test('drawer has tabIndex=-1', () => {
    const { container } = render(<NextDrawer role="region">content</NextDrawer>);
    expect(getDrawerElement(container)).toHaveAttribute('tabindex', '-1');
  });

  test('labelled by header by default', () => {
    const { container } = render(
      <NextDrawer role="region" header="My drawer">
        content
      </NextDrawer>
    );
    const drawer = getDrawerElement(container);
    const labelledById = drawer.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    expect(container.querySelector(`#${labelledById}`)?.textContent).toBe('My drawer');
  });

  test('no aria-labelledby when header is not provided', () => {
    const { container } = render(<NextDrawer role="region">content</NextDrawer>);
    expect(getDrawerElement(container)).not.toHaveAttribute('aria-labelledby');
  });

  test('ariaLabel sets aria-label', () => {
    const { container } = render(
      <NextDrawer role="region" ariaLabel="Custom label">
        content
      </NextDrawer>
    );
    expect(getDrawerElement(container)).toHaveAttribute('aria-label', 'Custom label');
  });

  test('ariaLabel suppresses default aria-labelledby', () => {
    const { container } = render(
      <NextDrawer role="region" header="Header" ariaLabel="Custom label">
        content
      </NextDrawer>
    );
    const drawer = getDrawerElement(container);
    expect(drawer).toHaveAttribute('aria-label', 'Custom label');
    expect(drawer).not.toHaveAttribute('aria-labelledby');
  });

  test('ariaLabelledby overrides default header labelling', () => {
    const { container } = render(
      <NextDrawer role="region" header="Header" ariaLabelledby="custom-id">
        content
      </NextDrawer>
    );
    expect(getDrawerElement(container)).toHaveAttribute('aria-labelledby', 'custom-id');
  });
});

describe('role="presentation"', () => {
  test('drawer has no role attribute', () => {
    const { container } = render(<NextDrawer role="presentation">content</NextDrawer>);
    expect(getDrawerElement(container)).not.toHaveAttribute('role');
  });

  test('drawer has no tabIndex', () => {
    const { container } = render(<NextDrawer role="presentation">content</NextDrawer>);
    expect(getDrawerElement(container)).not.toHaveAttribute('tabindex');
  });

  test('ariaLabel is not applied', () => {
    const { container } = render(
      <NextDrawer role="presentation" ariaLabel="ignored">
        content
      </NextDrawer>
    );
    expect(getDrawerElement(container)).not.toHaveAttribute('aria-label');
  });

  test('ariaLabelledby is not applied', () => {
    const { container } = render(
      <NextDrawer role="presentation" header="Header">
        content
      </NextDrawer>
    );
    expect(getDrawerElement(container)).not.toHaveAttribute('aria-labelledby');
  });
});
