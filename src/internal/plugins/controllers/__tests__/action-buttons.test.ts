// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  ActionButtonsController,
  ActionConfig,
} from '../../../../../lib/components/internal/plugins/controllers/action-buttons';

const testAction: ActionConfig = { id: 'test-action', mountContent: () => {}, unmountContent: () => {} };

function delay() {
  return new Promise(resolve => setTimeout(resolve));
}

test('notifies about registered action', async () => {
  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  controller.onActionRegistered(onAction);
  controller.registerAction(testAction);
  expect(onAction).not.toHaveBeenCalled();
  await delay();
  expect(onAction).toHaveBeenCalledWith([testAction]);
});

test('returns empty array when there is no registered action', async () => {
  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  controller.onActionRegistered(onAction);
  await delay();
  expect(onAction).toHaveBeenCalledWith([]);
});

test('notifies about delayed registered action', async () => {
  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  controller.onActionRegistered(onAction);
  await delay();
  onAction.mockReset();
  controller.registerAction(testAction);
  await delay();
  expect(onAction).toHaveBeenCalledWith([testAction]);
});

test('change listener is not called after cleanup', async () => {
  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  const cleanup = controller.onActionRegistered(onAction);
  await delay();
  onAction.mockReset();
  cleanup();
  controller.registerAction(testAction);
  await delay();
  expect(onAction).not.toHaveBeenCalled();
});

test('supports multiple consumers', async () => {
  const onActionFirst = jest.fn();
  const onActionSecond = jest.fn();
  const controller = new ActionButtonsController();
  controller.onActionRegistered(onActionFirst);
  controller.onActionRegistered(onActionSecond);
  controller.registerAction(testAction);
  await delay();
  expect(onActionFirst).toHaveBeenCalledWith([testAction]);
  expect(onActionSecond).toHaveBeenCalledWith([testAction]);
});

test('supports multiple registered actions', async () => {
  const firstAction = { id: 'first action' } as ActionConfig;
  const secondAction = { id: 'second action' } as ActionConfig;
  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  controller.registerAction(firstAction);
  controller.registerAction(secondAction);
  controller.onActionRegistered(onAction);
  await delay();
  expect(onAction).toHaveBeenCalledWith([firstAction, secondAction]);
});

test('registers multiple actions in sorted order', async () => {
  const firstAction = { id: 'first action', orderPriority: 10 } as ActionConfig;
  const secondAction = { id: 'second action' } as ActionConfig;
  const thirdAction = { id: 'third action', orderPriority: 1 } as ActionConfig;

  const onAction = jest.fn();
  const controller = new ActionButtonsController();
  controller.registerAction(firstAction);
  controller.registerAction(secondAction);
  controller.registerAction(thirdAction);
  controller.onActionRegistered(onAction);
  await delay();
  expect(onAction).toHaveBeenCalledWith([firstAction, thirdAction, secondAction]);
});
