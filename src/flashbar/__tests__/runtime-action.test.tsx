// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { ActionConfig } from '../../../lib/components/internal/plugins/controllers/action-buttons';
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

test('propagates state changes to update callback', async () => {
  const updateContentSpy = jest.fn();
  const testAction: ActionConfig = {
    ...defaultAction,
    updateContent: (container, context) => updateContentSpy(context.contentRef.current?.textContent),
  };

  awsuiPlugins.flashbar.registerAction(testAction);
  const { rerender } = render(<Flashbar items={[{ ...defaultItem, content: 'Initial content' }]} />);
  await delay();
  expect(updateContentSpy).toHaveBeenCalledTimes(0);
  rerender(<Flashbar items={[{ ...defaultItem, content: 'Updated content' }]} />);
  expect(updateContentSpy).toHaveBeenCalledTimes(1);
  expect(updateContentSpy).toHaveBeenCalledWith('Updated content');
});

test('container reference is permanent between mount/update/unmount', async () => {
  let container: HTMLElement | null = null;
  const testAction: ActionConfig = {
    id: 'test-action',
    mountContent: jest.fn(newContainer => (container = newContainer)),
    updateContent: jest.fn(newContainer => expect(container).toBe(newContainer)),
    unmountContent: jest.fn(newContainer => expect(container).toBe(newContainer)),
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  const { rerender } = render(<Flashbar items={[{ ...defaultItem }]} />);
  await delay();
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.updateContent).toHaveBeenCalledTimes(0);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(0);
  rerender(<Flashbar items={[{ ...defaultItem }]} />);
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.updateContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(0);
  rerender(<></>);
  expect(testAction.mountContent).toHaveBeenCalledTimes(1);
  expect(testAction.updateContent).toHaveBeenCalledTimes(1);
  expect(testAction.unmountContent).toHaveBeenCalledTimes(1);
});

test('allows conditionally render content when an item changes', async () => {
  const unmount = (container: HTMLElement) => (container.innerHTML = '');
  const renderIfApplicable = (container: HTMLElement, content: string) => {
    if (content.includes('permission')) {
      container.innerHTML = '<button data-testid="troubleshooter"></button>';
    } else {
      unmount(container);
    }
  };
  const testAction: ActionConfig = {
    ...defaultAction,
    mountContent: (container, { contentRef }) => renderIfApplicable(container, contentRef.current!.textContent!),
    updateContent: (container, { contentRef }) => renderIfApplicable(container, contentRef.current!.textContent!),
    unmountContent: unmount,
  };
  awsuiPlugins.flashbar.registerAction(testAction);
  const { rerender, queryAllByTestId } = render(<Flashbar items={[{ id: '1', content: 'random content' }]} />);
  await delay();
  expect(queryAllByTestId('troubleshooter')).toHaveLength(0);

  // add new notification matching the pattern
  rerender(
    <Flashbar
      items={[
        { id: '1', content: 'random content' },
        { id: '2', content: 'permission issue' },
      ]}
    />
  );
  await delay();
  expect(queryAllByTestId('troubleshooter')).toHaveLength(1);

  // update the existing notification to match the pattern
  rerender(
    <Flashbar
      items={[
        { id: '1', content: 'permission issue dynamic' },
        { id: '2', content: 'permission issue' },
      ]}
    />
  );
  expect(queryAllByTestId('troubleshooter')).toHaveLength(2);

  // update the existing notification to not match the pattern anymore
  rerender(
    <Flashbar
      items={[
        { id: '1', content: 'resolved issue' },
        { id: '2', content: 'permission issue' },
      ]}
    />
  );
  expect(queryAllByTestId('troubleshooter')).toHaveLength(1);
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
