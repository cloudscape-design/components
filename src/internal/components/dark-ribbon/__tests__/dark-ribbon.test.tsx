// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import createWrapper, { ElementWrapper } from '../../../../../lib/components/test-utils/dom';
import DarkRibbon from '../../../../../lib/components/internal/components/dark-ribbon';
import styles from '../../../../../lib/components/internal/components/dark-ribbon/styles.css.js';

export function mutate(mutation: () => void) {
  return act(() => {
    mutation();
    // mutation observers are triggered asynchronously
    // https://github.com/jsdom/jsdom/blob/04f6c13f4a4d387c7fc979b8f62c6f68d8a0c639/lib/jsdom/living/helpers/mutation-observers.js#L125
    return Promise.resolve();
  });
}

function renderComponent(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container);
}

function getFillStyles(element: ElementWrapper) {
  const { height, left, right } = element.getElement().style;
  return { height, left, right };
}

const origGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
beforeEach(() => {
  HTMLElement.prototype.getBoundingClientRect = () => ({ height: 100, left: 50, right: 150 } as DOMRect);
});

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = origGetBoundingClientRect;
});

test('does not render any wrappers in non refresh mode', () => {
  const wrapper = renderComponent(<DarkRibbon isRefresh={false}>hello</DarkRibbon>);
  expect(wrapper.getElement().innerHTML).toEqual('hello');
});

test('does not render any wrappers when explicitly set to plain styling', () => {
  const wrapper = renderComponent(
    <DarkRibbon isRefresh={true} hasPlainStyling={true}>
      hello
    </DarkRibbon>
  );
  expect(wrapper.getElement().innerHTML).toEqual('hello');
});

test('renders fill element when active', () => {
  const wrapper = renderComponent(
    <DarkRibbon isRefresh={true} hasPlainStyling={false}>
      hello
    </DarkRibbon>
  );
  expect(wrapper.findByClassName(styles['background-fill'])).toBeTruthy();
});

test('sync sizes on initial render', () => {
  const wrapper = renderComponent(<DarkRibbon isRefresh={true}>hello</DarkRibbon>);
  expect(getFillStyles(wrapper.findByClassName(styles['background-fill'])!)).toEqual({
    height: '100px',
    left: '-50px',
    right: '150px',
  });
});

test('sync sizes on window resize', () => {
  const wrapper = renderComponent(<DarkRibbon isRefresh={true}>hello</DarkRibbon>);
  HTMLElement.prototype.getBoundingClientRect = () => ({ height: 100, left: 10, right: 11 } as DOMRect);
  window.dispatchEvent(new CustomEvent('resize'));
  expect(getFillStyles(wrapper.findByClassName(styles['background-fill'])!)).toEqual({
    height: '100px',
    left: '-10px',
    right: '11px',
  });
});

test('sync sizes on dom mutation', async () => {
  const wrapper = renderComponent(<DarkRibbon isRefresh={true}>hello</DarkRibbon>);
  HTMLElement.prototype.getBoundingClientRect = () => ({ height: 100, left: 10, right: 11 } as DOMRect);
  await mutate(() => wrapper.getElement().parentElement!.setAttribute('data-mutation', 'something'));
  expect(getFillStyles(wrapper.findByClassName(styles['background-fill'])!)).toEqual({
    height: '100px',
    left: '-10px',
    right: '11px',
  });
});
