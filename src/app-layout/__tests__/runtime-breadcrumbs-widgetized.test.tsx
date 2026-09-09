// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, cleanup, render, waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import * as widgetPlugins from '../../../lib/components/internal/plugins/widget';
import { clearBreadcrumbsConsumer } from '../../../lib/components/internal/plugins/widget/core';
import createWrapper from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout } from './utils';

const wrapper = createWrapper();
const defaultItems: BreadcrumbGroupProps['items'] = [
  { text: 'Home', href: '/home' },
  { text: 'Resource', href: '/resource' },
];

function getAppLayoutBreadcrumbGroup() {
  return wrapper.findAppLayout()?.findBreadcrumbs()?.findBreadcrumbGroup();
}

function registerExternalContainer(container: HTMLElement) {
  const received: Array<BreadcrumbGroupProps | null> = [];
  const registration = widgetPlugins.registerBreadcrumbsConsumer({
    onBreadcrumbsChange: breadcrumbs => {
      received.push(breadcrumbs);
      container.textContent = breadcrumbs?.items.map(item => item.text).join(' / ') ?? '';
    },
  });
  return { received, registration };
}

function ExternalBreadcrumbGroup() {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbGroupProps | null>(null);

  React.useEffect(
    () => widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: setBreadcrumbs }).unregister,
    []
  );

  if (!breadcrumbs) {
    return null;
  }

  const sinkProps = { ...breadcrumbs, __disableGlobalization: true } as React.ComponentProps<typeof BreadcrumbGroup>;
  return <BreadcrumbGroup {...sinkProps} />;
}

beforeEach(() => {
  clearBreadcrumbsConsumer();
});

afterEach(() => {
  cleanup();
  clearBreadcrumbsConsumer();
  expect(awsuiPluginsInternal.breadcrumbs.getStateForTesting()).toEqual({
    appLayoutUpdateCallback: null,
    breadcrumbInstances: [],
    breadcrumbRegistrations: [],
  });
});

test('shares the consumer registry with a same-origin parent window', () => {
  const originalParentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent')!;
  const parentWindow = {} as Window;
  Object.defineProperty(parentWindow, 'parent', { value: parentWindow });
  Object.defineProperty(window, 'parent', { configurable: true, value: parentWindow });
  let unregister = () => {};

  try {
    const first = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: jest.fn() });
    unregister = first.unregister;
    const second = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: jest.fn() });

    expect(first.registered).toBe(true);
    expect(second.registered).toBe(false);
  } finally {
    unregister();
    Object.defineProperty(window, 'parent', originalParentDescriptor);
  }
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  test('renders slot breadcrumbs in an external container and restores App Layout on unregister', async () => {
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    const { received, registration } = registerExternalContainer(externalContainer);

    expect(received).toEqual([null]);

    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultItems} />} />);

    await waitFor(() => expect(externalContainer).toHaveTextContent('Home / Resource'));
    expect(getAppLayoutBreadcrumbGroup()).toBeFalsy();

    act(() => registration.unregister());
    await waitFor(() => expect(getAppLayoutBreadcrumbGroup()).toBeTruthy());
    externalContainer.remove();
  });

  test('preserves the producing BreadcrumbGroup event handlers', async () => {
    const onFollow = jest.fn();
    const externalContainer = document.createElement('div');
    const { received } = registerExternalContainer(externalContainer);

    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultItems} onFollow={onFollow} />} />);

    await waitFor(() => expect(received[received.length - 1]?.items).toEqual(defaultItems));
    expect(received[received.length - 1]?.onFollow).toBe(onFollow);
  });

  test('publishes updates to slot breadcrumbs without replacing the consumer', async () => {
    const externalContainer = document.createElement('div');
    const { received } = registerExternalContainer(externalContainer);
    const { rerender } = render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultItems} />} />);

    await waitFor(() => expect(received[received.length - 1]?.items).toEqual(defaultItems));

    const updatedItems = [{ text: 'Updated', href: '/updated' }];
    rerender(<AppLayout breadcrumbs={<BreadcrumbGroup items={updatedItems} />} />);

    await waitFor(() => expect(received[received.length - 1]?.items).toEqual(updatedItems));
  });

  test('renders a non-registering BreadcrumbGroup in a separate React root', async () => {
    const onFollow = jest.fn(event => event.preventDefault());
    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultItems} onFollow={onFollow} />} />);
    await waitFor(() => expect(getAppLayoutBreadcrumbGroup()).toBeTruthy());

    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    const externalRoot = render(<ExternalBreadcrumbGroup />, { container: externalContainer });

    const externalWrapper = createWrapper(externalContainer);
    await waitFor(() => expect(externalWrapper.findBreadcrumbGroup()).toBeTruthy());
    expect(getAppLayoutBreadcrumbGroup()).toBeFalsy();

    externalWrapper.findBreadcrumbGroup()!.findBreadcrumbLink(1)!.click();
    expect(onFollow).toHaveBeenCalledTimes(1);
    externalRoot.unmount();
    externalContainer.remove();
  });

  test('moves discovered breadcrumbs outside App Layout and publishes updates', async () => {
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    registerExternalContainer(externalContainer);

    const { rerender } = render(
      <AppLayout content={<BreadcrumbGroup items={[{ text: 'Original', href: '/original' }]} />} />
    );

    await waitFor(() => expect(externalContainer).toHaveTextContent('Original'));
    expect(getAppLayoutBreadcrumbGroup()).toBeFalsy();

    rerender(<AppLayout content={<BreadcrumbGroup items={[{ text: 'Changed', href: '/changed' }]} />} />);
    await waitFor(() => expect(externalContainer).toHaveTextContent('Changed'));
    expect(getAppLayoutBreadcrumbGroup()).toBeFalsy();
    externalContainer.remove();
  });

  test('supports a consumer that registers after App Layout mounts', async () => {
    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultItems} />} />);
    await waitFor(() => expect(getAppLayoutBreadcrumbGroup()).toBeTruthy());

    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    act(() => {
      registerExternalContainer(externalContainer);
    });

    await waitFor(() => expect(externalContainer).toHaveTextContent('Home / Resource'));
    expect(getAppLayoutBreadcrumbGroup()).toBeFalsy();
    externalContainer.remove();
  });

  test('keeps unsupported custom breadcrumb content in App Layout', async () => {
    const onBreadcrumbsChange = jest.fn();
    widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange });

    render(<AppLayout breadcrumbs={<div data-testid="custom-breadcrumbs">Custom breadcrumbs</div>} />);

    await waitFor(() => expect(wrapper.find('[data-testid="custom-breadcrumbs"]')).toBeTruthy());
    expect(onBreadcrumbsChange).toHaveBeenLastCalledWith(null);
  });

  test('uses the outer App Layout slot when layouts are nested', async () => {
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    registerExternalContainer(externalContainer);

    render(
      <AppLayout
        breadcrumbs={<BreadcrumbGroup items={[{ text: 'Outer', href: '/outer' }]} />}
        content={
          <AppLayout
            navigationHide={true}
            toolsHide={true}
            breadcrumbs={<BreadcrumbGroup items={[{ text: 'Inner', href: '/inner' }]} />}
          />
        }
      />
    );

    await waitFor(() => expect(externalContainer).toHaveTextContent('Outer'));
    expect(externalContainer).not.toHaveTextContent('Inner');
    expect(wrapper.findAllBreadcrumbGroups()).toHaveLength(0);
    externalContainer.remove();
  });

  test('refuses a second external consumer', () => {
    const first = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: jest.fn() });
    const secondCallback = jest.fn();
    const second = widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: secondCallback });

    expect(first.registered).toBe(true);
    expect(second.registered).toBe(false);
    expect(secondCallback).not.toHaveBeenCalled();

    second.unregister();
    expect(widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: jest.fn() }).registered).toBe(false);

    first.unregister();
    expect(widgetPlugins.registerBreadcrumbsConsumer({ onBreadcrumbsChange: jest.fn() }).registered).toBe(true);
  });
});
