// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import {
  persistSeenFeatureNotifications,
  retrieveSeenFeatureNotifications,
} from '../../../lib/components/internal/persistence';
import * as awsuiWidgetPlugins from '../../../lib/components/internal/plugins/widget';
import * as awsuiWidgetInternal from '../../../lib/components/internal/plugins/widget/core';
import { FeatureNotificationsPayload } from '../../../lib/components/internal/plugins/widget/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import FeaturePromptWrapper from '../../../lib/components/test-utils/dom/internal/feature-prompt';
import { describeEachAppLayout } from './utils';

// Mock dates for consistent testing
const mockDate2025 = new Date('2025-01-15');
const mockDate2024 = new Date('2024-12-01');
const mockDateOld = new Date('2024-08-01'); // More than 90 days ago from mock current date

const mockCurrentDate = new Date('2025-01-20');

const featureNotificationsDefaults: FeatureNotificationsPayload<string> = {
  id: 'test-feature-notifications',
  features: [
    {
      id: 'feature-1',
      header: 'New Feature 1 Header',
      content: 'This is the first new feature content',
      contentCategory: 'Category A',
      releaseDate: mockDate2025,
    },
    {
      id: 'feature-2',
      header: 'New Feature 2 Header',
      content: 'This is the second new feature content',
      releaseDate: mockDate2024,
    },
    {
      id: 'feature-old',
      header: 'Old Feature Header',
      content: 'This is an old feature that should be filtered out by default',
      releaseDate: mockDateOld,
    },
  ],
  featuresPageLink: '/features-page',
  mountItem: (container, data) => {
    container.textContent = data;
  },
};

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

jest.mock('../../../lib/components/internal/persistence', () => ({
  retrieveSeenFeatureNotifications: jest.fn(),
  persistSeenFeatureNotifications: jest.fn(),
}));

const mockRetrieveSeenFeatureNotifications = jest.mocked(retrieveSeenFeatureNotifications);
const mockPersistSeenFeatureNotifications = jest.mocked(persistSeenFeatureNotifications);

beforeEach(() => {
  awsuiWidgetInternal.clearInitialMessages();
  jest.resetAllMocks();
  mockRetrieveSeenFeatureNotifications.mockResolvedValue({});
  mockPersistSeenFeatureNotifications.mockResolvedValue();

  // Mock current date for consistent filtering
  jest.useFakeTimers();
  jest.setSystemTime(mockCurrentDate);
});

afterEach(() => {
  jest.useRealTimers();
});

function delay() {
  return act(() => {
    jest.runAllTimers();
    return Promise.resolve();
  });
}

async function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, ...rest } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  await delay();
  return {
    wrapper,
    container,
    rerender,
    ...rest,
  };
}

describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
  test('registers feature notifications correctly', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;
    const featureItems = activeDrawerWrapper.findList()!.findItems()!;

    expect(activeDrawerWrapper.getElement()).toBeTruthy();

    // We expect 2 out of 3 features to be rendered since the default filter
    // excludes features older than 90 days, leaving only 2 valid features
    expect(featureItems).toHaveLength(2);

    // Check content
    expect(featureItems[0].findContent().getElement()).toHaveTextContent('New Feature 1 Header');
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent(
      'This is the first new feature content'
    );
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent('Category A');
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent('2025-01-15');

    expect(featureItems[1].findContent().getElement()).toHaveTextContent('New Feature 2 Header');
    expect(featureItems[1].findSecondaryContent()!.getElement()).toHaveTextContent(
      'This is the second new feature content'
    );
    expect(featureItems[1].findSecondaryContent()!.getElement()).toHaveTextContent('2024-12-01');

    expect(activeDrawerWrapper!.find('a')!.getElement()).toHaveAttribute('href', '/features-page');
  });

  test('registers feature notifications correctly with no mountItem', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications({ ...featureNotificationsDefaults, mountItem: undefined });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;
    const featureItems = activeDrawerWrapper.findList()!.findItems()!;

    expect(activeDrawerWrapper.getElement()).toBeTruthy();

    // We expect 2 out of 3 features to be rendered since the default filter
    // excludes features older than 90 days, leaving only 2 valid features
    expect(featureItems).toHaveLength(2);

    // Check content
    expect(featureItems[0].findContent().getElement()).toHaveTextContent('New Feature 1 Header');
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent(
      'This is the first new feature content'
    );
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent('Category A');
    expect(featureItems[0].findSecondaryContent()!.getElement()).toHaveTextContent('2025-01-15');

    expect(featureItems[1].findContent().getElement()).toHaveTextContent('New Feature 2 Header');
    expect(featureItems[1].findSecondaryContent()!.getElement()).toHaveTextContent(
      'This is the second new feature content'
    );
    expect(featureItems[1].findSecondaryContent()!.getElement()).toHaveTextContent('2024-12-01');

    expect(activeDrawerWrapper!.find('a')!.getElement()).toHaveAttribute('href', '/features-page');
  });

  test('supports custom filterFeatures function', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications({
      ...featureNotificationsDefaults,
      filterFeatures: feature => {
        const halfYearAgo = new Date();
        halfYearAgo.setDate(halfYearAgo.getDate() - 180);
        return feature.releaseDate >= halfYearAgo;
      },
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;
    const featureItems = activeDrawerWrapper.findList()!.findItems()!;

    expect(activeDrawerWrapper.getElement()).toBeTruthy();

    // We expect all features to be rendered since the default filter has been overridden
    expect(featureItems).toHaveLength(3);
  });

  test('shows feature prompt for a latest features', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { container } = await renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent('This is the first new feature content');
    featurePromptWrapper.findDismissButton()!.click();
    expect(featurePromptWrapper.findContent()).toBeFalsy();
  });

  test('shows feature prompt for a latest unseen features', async () => {
    mockRetrieveSeenFeatureNotifications.mockResolvedValue({ 'feature-1': mockDate2025.toString() });
    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { container } = await renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
      'This is the second new feature content'
    );
  });

  test('should not show feature prompt for unseen features is suppressed', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = await renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();
  });

  test('shows feature prompt via triggering showFeaturePromptIfPossible when possible', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = await renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    awsuiWidgetPlugins.showFeaturePromptIfPossible();

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the first new feature content'
      );
    });
  });

  test('should not show feature prompt if all feature are seen', async () => {
    mockRetrieveSeenFeatureNotifications.mockResolvedValue({
      'feature-1': mockDate2025.toString(),
      'feature-2': mockDate2024.toString(),
      'feature-old': mockDateOld.toString(),
    });
    awsuiWidgetPlugins.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = await renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    awsuiWidgetPlugins.showFeaturePromptIfPossible();

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()).toBeFalsy();
    });
  });

  test('filters outdated seen features when marking all as read', async () => {
    const oldSeenFeatureDate = new Date(mockCurrentDate);
    oldSeenFeatureDate.setDate(oldSeenFeatureDate.getDate() - 200); // More than 180 days ago

    const recentSeenFeatureDate = new Date(mockCurrentDate);
    recentSeenFeatureDate.setDate(recentSeenFeatureDate.getDate() - 100); // Less than 180 days ago

    const seenFeatures = {
      'old-seen-feature': oldSeenFeatureDate.toISOString(),
      'recent-seen-feature': recentSeenFeatureDate.toISOString(),
      'feature-1': mockDate2025.toISOString(),
    };

    mockRetrieveSeenFeatureNotifications.mockResolvedValue(seenFeatures);

    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = await renderComponent(<AppLayout />);

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    await waitFor(() => {
      expect(mockPersistSeenFeatureNotifications).toHaveBeenCalled();
    });

    const persistedFeaturesMap = mockPersistSeenFeatureNotifications.mock.calls[0][1];

    expect(persistedFeaturesMap).toHaveProperty('feature-1');
    expect(persistedFeaturesMap).toHaveProperty('feature-2');
    expect(persistedFeaturesMap).toHaveProperty('recent-seen-feature');
    expect(persistedFeaturesMap).not.toHaveProperty('old-seen-feature');
  });

  // test('handles empty features array', () => {
  //   const emptyFeatures: FeatureNotificationsPayload<string> = {
  //     id: 'empty-features',
  //     features: [],
  //     mountItem: (container, data) => {
  //       container.textContent = data;
  //     },
  //   };
  //
  //   awsuiWidgetPlugins.registerFeatureNotifications(emptyFeatures);
  //   const { wrapper } = renderComponent(<AppLayout />);
  //   expect(wrapper.getElement()).toBeInTheDocument();
  // });
  //
  // test('isAppLayoutReady works correctly with feature notifications', async () => {
  //   expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(false);
  //
  //   awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
  //
  //   const { rerender } = renderComponent(<AppLayout />);
  //   expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(true);
  //   await expect(awsuiWidgetPlugins.whenAppLayoutReady()).resolves.toBe(undefined);
  //
  //   rerender(<></>);
  //   expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(false);
  // });
});
