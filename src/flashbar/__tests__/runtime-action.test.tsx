// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { ActionConfig } from '../../../lib/components/internal/plugins/controllers/action-buttons';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';

const defaultAction: ActionConfig = {
  id: 'test-action',
  mountContent: container => {
    const button = document.createElement('button');
    button.dataset.testid = 'test-action';
    container.appendChild(button);
  },
  unmountContent: container => (container.innerHTML = ''),
};

const defaultItem: FlashbarProps.MessageDefinition = {};

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

afterEach(() => {
  awsuiPluginsInternal.flashbar.clearRegisteredActions();
});

test('renders runtime action button initially', async () => {
  awsuiPlugins.flashbar.registerAction(defaultAction);
  render(<Flashbar items={[defaultItem]} />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action button asynchronously', async () => {
  render(<Flashbar items={[defaultItem]} />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeFalsy();
  awsuiPlugins.flashbar.registerAction(defaultAction);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action along with the props one', async () => {
  awsuiPlugins.flashbar.registerAction(defaultAction);
  render(<Flashbar items={[{ ...defaultItem, action: <button data-testid="own-button">test</button> }]} />);
  await delay();
  expect(screen.queryByTestId('own-button')).toBeTruthy();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action button on multiple instances', async () => {
  awsuiPlugins.flashbar.registerAction(defaultAction);
  render(
    <Flashbar
      items={[
        { ...defaultItem, header: 'First' },
        { ...defaultItem, header: 'Second' },
      ]}
    />
  );
  await delay();
  expect(screen.queryAllByTestId('test-action')).toHaveLength(2);
});

test('renders multiple actions on multiple instances', async () => {
  awsuiPlugins.flashbar.registerAction({
    ...defaultAction,
    id: 'first',
    mountContent: (container, context) => {
      const button = document.createElement('button');
      button.dataset.testid = 'runtime-action';
      button.textContent = context.type + '-first';
      container.appendChild(button);
    },
  });
  awsuiPlugins.flashbar.registerAction({
    ...defaultAction,
    id: 'second',
    mountContent: (container, context) => {
      const button = document.createElement('button');
      button.dataset.testid = 'runtime-action';
      button.textContent = context.type + '-second';
      container.appendChild(button);
    },
  });
  render(
    <Flashbar
      items={[
        { ...defaultItem, type: 'success' },
        { ...defaultItem, type: 'error' },
      ]}
    />
  );
  await delay();
  const items = createWrapper().findFlashbar()!.findItems();
  const getTextContent = (wrapper: ElementWrapper) => wrapper.getElement().textContent;
  expect(items[0].findAll('button[data-testid="runtime-action"]').map(getTextContent)).toEqual([
    'success-first',
    'success-second',
  ]);
  expect(items[1].findAll('button[data-testid="runtime-action"]').map(getTextContent)).toEqual([
    'error-first',
    'error-second',
  ]);
});

test('allows skipping actions for some items', async () => {
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: (container, context) => {
      if (context.type !== 'error') {
        return;
      }
      defaultAction.mountContent(container, context);
    },
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  render(
    <Flashbar
      items={[
        { ...defaultItem, type: 'info' },
        { ...defaultItem, type: 'error' },
      ]}
    />
  );
  await delay();
  expect(screen.queryAllByTestId('test-action')).toHaveLength(1);
});

test('maintains action button state when dismissing a message', async () => {
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: (container, context) => {
      if (context.type !== 'error') {
        return;
      }
      defaultAction.mountContent(container, context);
    },
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  const items: Array<FlashbarProps.MessageDefinition> = [
    { ...defaultItem, id: '1', type: 'info' },
    { ...defaultItem, id: '2', type: 'error' },
  ];
  const { rerender } = render(<Flashbar items={items} />);
  await delay();
  expect(screen.queryAllByTestId('test-action')).toHaveLength(1);

  rerender(<Flashbar items={[items[1]]} />);
  await delay();
  expect(screen.queryAllByTestId('test-action')).toHaveLength(1);
});

test('propagates flash message context into callback', async () => {
  const onClick = jest.fn();
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: (container, context) => {
      const button = document.createElement('button');
      button.dataset.testid = 'test-action';
      button.onclick = () => onClick(context);
      container.appendChild(button);
    },
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  render(<Flashbar items={[{ ...defaultItem, header: 'Test header', content: 'Test content' }]} />);
  await delay();
  fireEvent.click(screen.getByTestId('test-action'));
  expect(onClick).toHaveBeenCalledWith({
    type: 'info',
    headerRef: { current: expect.any(HTMLElement) },
    contentRef: { current: expect.any(HTMLElement) },
  });
});

test('cleans up on unmount', async () => {
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: jest.fn(),
    unmountContent: jest.fn(),
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  const { rerender } = render(<Flashbar items={[defaultItem]} />);
  await delay();
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(0);
  rerender(<></>);
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(1);
});
