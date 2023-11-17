// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Alert from '../../../lib/components/alert';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { ActionConfig } from '../../../lib/components/internal/plugins/controllers/action-buttons';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';

const defaultAction: ActionConfig = {
  id: 'test-action',
  mountContent: container => {
    const button = document.createElement('button');
    button.dataset.testid = 'test-action';
    container.appendChild(button);
  },
  unmountContent: container => (container.innerHTML = ''),
};

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

afterEach(() => {
  awsuiPluginsInternal.alert.clearRegisteredActions();
});

test('renders runtime action button initially', async () => {
  awsuiPlugins.alert.registerAction(defaultAction);
  render(<Alert />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action button asynchronously', async () => {
  render(<Alert />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeFalsy();
  awsuiPlugins.alert.registerAction(defaultAction);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action along with the props one', async () => {
  awsuiPlugins.alert.registerAction(defaultAction);
  render(<Alert action={<button data-testid="own-button">test</button>} />);
  await delay();
  expect(screen.queryByTestId('own-button')).toBeTruthy();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('renders runtime action button on multiple instances', async () => {
  awsuiPlugins.alert.registerAction(defaultAction);
  render(
    <>
      <Alert />
      <Alert />
    </>
  );
  await delay();
  expect(screen.queryAllByTestId('test-action')).toHaveLength(2);
});

test('propagates alert context into callback', async () => {
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
  awsuiPlugins.alert.registerAction(testAction);
  render(<Alert header="Test header">Test content</Alert>);
  await delay();
  fireEvent.click(screen.getByTestId('test-action'));
  expect(onClick).toHaveBeenCalledWith({
    type: 'info',
    headerRef: { current: expect.any(HTMLElement) },
    contentRef: { current: expect.any(HTMLElement) },
  });
});

test('allows skipping rendering actions', async () => {
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: (container, context) => {
      if (context.type !== 'error') {
        return;
      }
      defaultAction.mountContent(container, context);
    },
  };
  awsuiPlugins.alert.registerAction(testAction);
  const { rerender } = render(<Alert type="info" />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeFalsy();
  rerender(<Alert type="error" />);
  await delay();
  expect(screen.queryByTestId('test-action')).toBeTruthy();
});

test('cleans up on unmount', async () => {
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: jest.fn(),
    unmountContent: jest.fn(),
  };
  awsuiPlugins.alert.registerAction(testAction);
  const { rerender } = render(<Alert />);
  await delay();
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(0);
  rerender(<></>);
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(1);
});
