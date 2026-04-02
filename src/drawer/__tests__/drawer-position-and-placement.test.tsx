// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Drawer from '../../../lib/components/drawer/next';
import createWrapper from '../../../lib/components/test-utils/dom';

import drawerStyles from '../../../lib/components/drawer/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDrawer()!;
}

function getDrawerElement(jsx: React.ReactElement) {
  return renderDrawer(jsx).getElement();
}

describe('position=static (default)', () => {
  test('has no inline position style', () => {
    const el = getDrawerElement(<Drawer />);
    expect(el).not.toHaveStyle({ position: 'absolute' });
    expect(el).not.toHaveStyle({ position: 'fixed' });
    expect(el).not.toHaveStyle({ position: 'sticky' });
  });

  test('applies position-static class', () => {
    const el = getDrawerElement(<Drawer />);
    expect(el.className).toContain(drawerStyles['position-static']);
  });
});

describe('position=absolute', () => {
  test('applies position:absolute and zIndex', () => {
    const el = getDrawerElement(<Drawer position="absolute" placement="end" zIndex={10} />);
    expect(el).toHaveStyle({ position: 'absolute', zIndex: '10' });
  });

  test('applies position-absolute class', () => {
    const el = getDrawerElement(<Drawer position="absolute" placement="end" />);
    expect(el.className).toContain(drawerStyles['position-absolute']);
  });

  test('placement=end: applies insetInlineEnd and block insets from offset', () => {
    const el = getDrawerElement(
      <Drawer position="absolute" placement="end" offset={{ end: 16, top: 8, bottom: 24 }} />
    );
    expect(el).toHaveStyle({ insetInlineEnd: '16px', insetBlockStart: '8px', insetBlockEnd: '24px' });
  });

  test('placement=start: applies insetInlineStart and block insets from offset', () => {
    const el = getDrawerElement(
      <Drawer position="absolute" placement="start" offset={{ start: 10, top: 5, bottom: 15 }} />
    );
    expect(el).toHaveStyle({ insetInlineStart: '10px', insetBlockStart: '5px', insetBlockEnd: '15px' });
  });

  test('placement=top: applies insetBlockStart and inline insets from offset', () => {
    const el = getDrawerElement(
      <Drawer position="absolute" placement="top" offset={{ top: 10, start: 20, end: 30 }} />
    );
    expect(el).toHaveStyle({ insetBlockStart: '10px', insetInlineStart: '20px', insetInlineEnd: '30px' });
  });

  test('placement=bottom: applies insetBlockEnd and inline insets from offset', () => {
    const el = getDrawerElement(
      <Drawer position="absolute" placement="bottom" offset={{ bottom: 10, start: 20, end: 30 }} />
    );
    expect(el).toHaveStyle({ insetBlockEnd: '10px', insetInlineStart: '20px', insetInlineEnd: '30px' });
  });
});

describe('position=fixed', () => {
  test('applies position:fixed', () => {
    const el = getDrawerElement(<Drawer position="fixed" />);
    expect(el).toHaveStyle({ position: 'fixed' });
  });

  test('applies position-fixed class', () => {
    const el = getDrawerElement(<Drawer position="fixed" placement="bottom" />);
    expect(el.className).toContain(drawerStyles['position-fixed']);
  });

  test('applies offset insets', () => {
    const el = getDrawerElement(
      <Drawer position="fixed" placement="start" offset={{ start: 8, top: 4, bottom: 12 }} />
    );
    expect(el).toHaveStyle({ insetInlineStart: '8px', insetBlockStart: '4px', insetBlockEnd: '12px' });
  });
});

describe('position=sticky', () => {
  test('applies position:sticky and position-sticky class', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="top" />);
    expect(el).toHaveStyle({ position: 'sticky' });
    expect(el.className).toContain(drawerStyles['position-sticky']);
  });

  test('placement=top: applies stickyOffset.top as insetBlockStart', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="top" stickyOffset={{ top: 50 }} />);
    expect(el).toHaveStyle({ insetBlockStart: '50px' });
  });

  test('placement=top: applies offset as margins and inlineSize', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="top" offset={{ top: 10, start: 20, end: 30 }} />);
    expect(el).toHaveStyle({
      marginBlockStart: '10px',
      marginInlineStart: '20px',
      marginInlineEnd: '30px',
      inlineSize: 'calc(100% - 50px)',
    });
  });

  test('placement=bottom: applies stickyOffset.bottom as insetBlockEnd', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="bottom" stickyOffset={{ bottom: 40 }} />);
    expect(el).toHaveStyle({ insetBlockEnd: '40px' });
  });

  test('placement=bottom: applies offset as margins and inlineSize', () => {
    const el = getDrawerElement(
      <Drawer position="sticky" placement="bottom" offset={{ bottom: 10, start: 15, end: 25 }} />
    );
    expect(el).toHaveStyle({
      marginBlockEnd: '10px',
      marginInlineStart: '15px',
      marginInlineEnd: '25px',
      inlineSize: 'calc(100% - 40px)',
    });
  });

  test('placement=start falls back to static, applies no position style, and warns', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="start" />);
    expect(el.className).toContain(drawerStyles['position-static']);
    expect(el).not.toHaveStyle({ position: 'sticky' });
    expect(warnOnce).toHaveBeenCalledWith('Drawer', expect.stringContaining('placement="start"'));
  });

  test('placement=end falls back to static, applies no position style, and warns', () => {
    const el = getDrawerElement(<Drawer position="sticky" placement="end" />);
    expect(el.className).toContain(drawerStyles['position-static']);
    expect(el).not.toHaveStyle({ position: 'sticky' });
    expect(warnOnce).toHaveBeenCalledWith('Drawer', expect.stringContaining('placement="end"'));
  });
});
