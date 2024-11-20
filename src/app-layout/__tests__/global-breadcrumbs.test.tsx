// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useState } from 'react';
import { act, render, cleanup, waitFor } from '@testing-library/react';
import { describeEachAppLayout } from './utils';
import createWrapper from '../../../lib/components/test-utils/dom';
import AppLayout from '../../../lib/components/app-layout';
import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

const wrapper = createWrapper();

const defaultBreadcrumbs: Array<BreadcrumbGroupProps.Item> = [
  { text: 'Home', href: '/home' },
  { text: 'Page', href: '/home/page' },
];

const defaultAppLayoutProps = {
  // Suppress warning in runtime drawers API
  __disableRuntimeDrawers: true,
  // Suppress warning about duplicate tools which are rendered by default
  toolsHide: true,
};

function findAllBreadcrumbsInstances() {
  return wrapper.findAllBreadcrumbGroups();
}

function findDiscoveredBreadcrumbs() {
  return wrapper.findAppLayout()!.find('[data-awsui-discovered-breadcrumbs="true"]');
}

function findAppLayoutBreadcrumbItems() {
  return wrapper.findAppLayout()!.findBreadcrumbs()!.findBreadcrumbGroup()!.findBreadcrumbLinks();
}

function findRootBreadcrumb() {
  return wrapper.findAppLayout()!.findBreadcrumbs()!.findBreadcrumbGroup()!.findBreadcrumbLink(1)!;
}

function delay() {
  // longer than a setTimeout(..., 0) used inside the implementation
  return act(() => new Promise(resolve => setTimeout(resolve, 10)));
}

async function renderAsync(jsx: React.ReactElement) {
  render(jsx);
  await waitFor(() => {
    expect(findDiscoveredBreadcrumbs()).toBeTruthy();
    expect(findAllBreadcrumbsInstances()).toHaveLength(1);
  });
}

afterEach(() => {
  // force unmount for all rendered component to run clean state assertions
  cleanup();
  const state = awsuiPluginsInternal.breadcrumbs.getStateForTesting();
  expect(state).toEqual({
    appLayoutUpdateCallback: null,
    breadcrumbInstances: [],
    breadcrumbRegistrations: [],
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  test('renders normal breadcrumbs when no app layout is present', async () => {
    render(<BreadcrumbGroup items={defaultBreadcrumbs} />);
    await delay();
    expect(findAllBreadcrumbsInstances()).toHaveLength(1);
    expect(wrapper.findBreadcrumbGroup()!.findBreadcrumbLinks()).toHaveLength(2);
  });

  test('renders normal breadcrumbs when placed inside the breadcrumbs slot', async () => {
    render(<AppLayout breadcrumbs={<BreadcrumbGroup items={defaultBreadcrumbs} />} />);
    await delay();
    expect(findDiscoveredBreadcrumbs()).toBeFalsy();
    expect(findAppLayoutBreadcrumbItems()).toHaveLength(2);
  });

  test('no relocation happens on the initial render', () => {
    render(<AppLayout content={<BreadcrumbGroup items={defaultBreadcrumbs} />} />);
    expect(findAllBreadcrumbsInstances()).toHaveLength(1);
    expect(findDiscoveredBreadcrumbs()).toBeFalsy();
    expect(wrapper.findAppLayout()!.findBreadcrumbs()).toBeFalsy();
    expect(wrapper.findAppLayout()!.findContentRegion().findBreadcrumbGroup()).toBeTruthy();
  });

  test('renders breadcrumbs adjacent to app layout', async () => {
    await renderAsync(
      <>
        <AppLayout />
        <BreadcrumbGroup items={defaultBreadcrumbs} />
      </>
    );
    expect(findAppLayoutBreadcrumbItems()).toHaveLength(2);
  });

  test('renders breadcrumbs inside app layout content slot', async () => {
    await renderAsync(<AppLayout content={<BreadcrumbGroup items={defaultBreadcrumbs} />} />);
    expect(findAppLayoutBreadcrumbItems()).toHaveLength(2);
  });

  test('event handlers work for relocated breadcrumbs', async () => {
    const onFollow = jest.fn(event => event.preventDefault());
    await renderAsync(<AppLayout content={<BreadcrumbGroup items={defaultBreadcrumbs} onFollow={onFollow} />} />);
    findRootBreadcrumb().click();
    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ href: '/home', text: 'Home' }),
      })
    );
  });

  test('when breadcrumbs are rendered in multiple slots, the one in the breadcrumbs slot takes precedence', async () => {
    render(
      <AppLayout
        breadcrumbs={<BreadcrumbGroup items={[{ text: 'First', href: '/first' }]} />}
        content={<BreadcrumbGroup items={[{ text: 'Second', href: '/second' }]} />}
      />
    );
    await delay();
    expect(findAllBreadcrumbsInstances()).toHaveLength(2);
    expect(findDiscoveredBreadcrumbs()).toBeFalsy();
    expect(findRootBreadcrumb().getElement()).toHaveTextContent('First');
  });

  test('when multiple breadcrumbs instances are present the latest is applied', async () => {
    await renderAsync(
      <AppLayout
        content={
          <>
            <BreadcrumbGroup items={[{ text: 'First', href: '/first' }]} />
            <BreadcrumbGroup items={[{ text: 'Second', href: '/second' }]} />
          </>
        }
      />
    );
    expect(findAppLayoutBreadcrumbItems()).toHaveLength(1);
    expect(findRootBreadcrumb().getElement()).toHaveTextContent('Second');
  });

  test('when multiple app layouts rendered, only the first instance receives breadcrumbs', async () => {
    await renderAsync(
      <>
        <AppLayout {...defaultAppLayoutProps} data-testid="first" />
        <AppLayout
          {...defaultAppLayoutProps}
          data-testid="second"
          navigationHide={true}
          content={<BreadcrumbGroup items={defaultBreadcrumbs} />}
        />
      </>
    );
    expect(
      wrapper
        .find('[data-testid="first"]')!
        .findAppLayout()!
        .findBreadcrumbs()!
        .findBreadcrumbGroup()!
        .findBreadcrumbLinks()
    ).toHaveLength(2);
    expect(wrapper.find('[data-testid="second"]')!.findAppLayout()!.findBreadcrumbs()).toBeFalsy();
  });

  test('when multiple nested app layouts rendered, the outer instance receives breadcrumbs', async () => {
    await renderAsync(
      <>
        <AppLayout
          {...defaultAppLayoutProps}
          data-testid="first"
          content={
            <AppLayout
              {...defaultAppLayoutProps}
              data-testid="second"
              navigationHide={true}
              breadcrumbs={<BreadcrumbGroup items={defaultBreadcrumbs} />}
            />
          }
        />
      </>
    );
    expect(
      wrapper
        .find('[data-testid="first"]')!
        .findAppLayout()!
        .findBreadcrumbs()!
        .findBreadcrumbGroup()!
        .findBreadcrumbLinks()
    ).toHaveLength(2);
    expect(wrapper.find('[data-testid="second"]')!.findAppLayout()!.findBreadcrumbs()).toBeFalsy();
  });

  test('updates when a single breadcrumbs instance changes', async () => {
    function DynamicBreadcrumb() {
      const [changed, setChanged] = useState(false);
      return (
        <>
          <button data-testid="change-button" onClick={() => setChanged(true)}>
            Change
          </button>
          <BreadcrumbGroup items={[{ text: changed ? 'Changed' : 'Original', href: '/home' }]} />
        </>
      );
    }
    await renderAsync(<AppLayout content={<DynamicBreadcrumb />} />);
    expect(findRootBreadcrumb().getElement()).toHaveTextContent('Original');

    wrapper.find('[data-testid="change-button"]')!.click();
    await waitFor(() => {
      expect(findRootBreadcrumb().getElement()).toHaveTextContent('Changed');
    });
  });

  test('updates when a new breadcrumb instance mounts and unmounts', async () => {
    function ConditionalBreadcrumb() {
      const [rendered, setRendered] = useState(false);
      return (
        <>
          <label>
            <input
              data-testid="render-toggle"
              type="checkbox"
              checked={rendered}
              onChange={event => setRendered(event.target.checked)}
            />
            Render
          </label>
          {rendered ? <BreadcrumbGroup items={[{ text: 'Conditional', href: '/home' }]} /> : null}
        </>
      );
    }
    await renderAsync(
      <AppLayout
        content={
          <>
            <BreadcrumbGroup items={[{ text: 'Static', href: '/home' }]} />
            <ConditionalBreadcrumb />
          </>
        }
      />
    );
    expect(findRootBreadcrumb().getElement()).toHaveTextContent('Static');

    wrapper.find('[data-testid="render-toggle"]')!.click();
    await waitFor(() => {
      expect(findAllBreadcrumbsInstances()).toHaveLength(1);
      expect(findRootBreadcrumb().getElement()).toHaveTextContent('Conditional');
    });

    wrapper.find('[data-testid="render-toggle"]')!.click();
    await waitFor(() => {
      expect(findAllBreadcrumbsInstances()).toHaveLength(1);
      expect(findRootBreadcrumb().getElement()).toHaveTextContent('Static');
    });
  });

  test('renders breadcrumbs locally again after app layout de-registers', async () => {
    function DestructibleLayout() {
      const [mounted, setMounted] = useState(true);
      return mounted ? (
        <AppLayout
          content={
            <button data-testid="unmount" onClick={() => setMounted(false)}>
              Unmount
            </button>
          }
        />
      ) : null;
    }

    await renderAsync(
      <>
        <div data-testid="local-breadcrumbs">
          <BreadcrumbGroup items={defaultBreadcrumbs} />
        </div>

        <DestructibleLayout />
      </>
    );
    expect(wrapper.find('[data-testid="local-breadcrumbs"]')!.findBreadcrumbGroup()).toBeFalsy();

    wrapper.find('[data-testid="unmount"]')!.click();
    await waitFor(() => {
      expect(wrapper.find('[data-testid="local-breadcrumbs"]')!.findBreadcrumbGroup()).toBeTruthy();
    });
  });

  test('allows opt-out from this behavior', async () => {
    render(
      <AppLayout
        content={
          <>
            <BreadcrumbGroup items={defaultBreadcrumbs} />
            <BreadcrumbGroup items={[{ text: 'Local', href: '' }]} {...{ __disableGlobalization: true }} />
          </>
        }
      />
    );
    await waitFor(() =>
      expect(wrapper.findAppLayout()!.find('[data-awsui-discovered-breadcrumbs="true"]')).toBeTruthy()
    );
    expect(findAllBreadcrumbsInstances()).toHaveLength(2);
  });
});

describe('without feature flag', () => {
  test('breadcrumbs are not globalized', async () => {
    render(<AppLayout content={<BreadcrumbGroup items={defaultBreadcrumbs} />} />);
    await delay();
    expect(findAllBreadcrumbsInstances()).toHaveLength(1);
    expect(wrapper.findAppLayout()!.findBreadcrumbs()).toBeFalsy();
    expect(wrapper.findAppLayout()!.findContentRegion().findBreadcrumbGroup()).toBeTruthy();
  });
});

test('renders analytics metadata information', async () => {
  activateAnalyticsMetadata(true);
  render(<AppLayout content={<BreadcrumbGroup items={defaultBreadcrumbs} ariaLabel="global breadcrumbs" />} />);
  await delay();
  const breadcrumbsWrapper = wrapper.findAppLayout()!.findContentRegion().findBreadcrumbGroup()!;
  const firstBreadcrumb = breadcrumbsWrapper.findBreadcrumbLink(1)!.getElement();
  expect(getGeneratedAnalyticsMetadata(firstBreadcrumb)).toEqual({
    action: 'click',
    detail: {
      position: '1',
      label: 'Home',
      href: '/home',
    },
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.BreadcrumbGroup',
          label: 'global breadcrumbs',
        },
      },
    ],
  });
});
