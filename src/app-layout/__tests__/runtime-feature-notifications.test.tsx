// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import {
  persistFeatureNotifications,
  retrieveFeatureNotifications,
} from '../../../lib/components/internal/persistence';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import * as awsuiWidgetPlugins from '../../../lib/components/internal/plugins/widget';
import * as awsuiWidgetInternal from '../../../lib/components/internal/plugins/widget/core';
import { FeatureNotificationsPayload } from '../../../lib/components/internal/plugins/widget/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import FeaturePromptWrapper from '../../../lib/components/test-utils/dom/internal/feature-prompt';
import { describeEachAppLayout } from './utils';

const i18nMessages = {
  'features-notification-drawer': {
    'i18nStrings.title': 'Latest feature releases',
    'i18nStrings.viewAll': 'View all feature releases',
    'ariaLabels.closeButton': 'Close notifications',
    'ariaLabels.content': 'Feature notifications',
    'ariaLabels.triggerButton': 'Show feature notifications',
    'ariaLabels.resizeHandle': 'Resize feature notifications',
  },
};

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
  persistenceConfig: {
    uniqueKey: 'feature-notifications',
  },
};

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

jest.mock('../../../lib/components/internal/persistence', () => ({
  retrieveFeatureNotifications: jest.fn(),
  persistFeatureNotifications: jest.fn(),
}));

const mockRetrieveFeatureNotifications = jest.mocked(retrieveFeatureNotifications);
const mockPersistFeatureNotifications = jest.mocked(persistFeatureNotifications);

beforeEach(() => {
  awsuiPlugins.appLayout.clearRegisteredDrawersForTesting();
  awsuiWidgetInternal.clearInitialMessages();
  jest.resetAllMocks();
  mockRetrieveFeatureNotifications.mockResolvedValue({});
  mockPersistFeatureNotifications.mockResolvedValue();

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

  test('clears feature notifications correctly', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications({ ...featureNotificationsDefaults, mountItem: undefined });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    awsuiWidgetPlugins.clearFeatureNotifications();

    await delay();

    await waitFor(() => {
      expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeFalsy();
    });
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
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the first new feature content'
      );
    });
  });

  test('should focus on the drawer trigger button when feature prompt is dismissed', async () => {
    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { container, wrapper } = await renderComponent(
      <TestI18nProvider messages={i18nMessages}>
        <AppLayout />
      </TestI18nProvider>
    );
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the first new feature content'
      );
    });

    featurePromptWrapper.findDismissButton()!.click();
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement()).toHaveFocus();
    // ensure the tooltip on the trigger button is suppressed after switching the focus
    expect(wrapper.findDrawerTriggerTooltip()).toBeFalsy();
    fireEvent.pointerEnter(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement());
    // ensure the tooltip on the trigger button is suppressed after switching the focus
    expect(wrapper.findDrawerTriggerTooltip()).toBeFalsy();
  });

  test('shows feature prompt for a latest unseen features', async () => {
    mockRetrieveFeatureNotifications.mockResolvedValue({ 'feature-1': mockDate2025.toString() });
    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { container } = await renderComponent(<AppLayout />);
    await delay();

    await waitFor(() => {
      const featurePromptWrapper = new FeaturePromptWrapper(container);
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the second new feature content'
      );
    });
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

    await delay();

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the first new feature content'
      );
    });
  });

  test('should not show feature prompt if all feature are seen', async () => {
    mockRetrieveFeatureNotifications.mockResolvedValue({
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

    mockRetrieveFeatureNotifications.mockResolvedValue(seenFeatures);

    awsuiWidgetPlugins.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = await renderComponent(<AppLayout />);

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    await waitFor(() => {
      expect(mockPersistFeatureNotifications).toHaveBeenCalled();
    });

    const persistedFeaturesMap = mockPersistFeatureNotifications.mock.calls[0][1];

    expect(persistedFeaturesMap).toHaveProperty('feature-1');
    expect(persistedFeaturesMap).toHaveProperty('feature-2');
    expect(persistedFeaturesMap).toHaveProperty('recent-seen-feature');
    expect(persistedFeaturesMap).not.toHaveProperty('old-seen-feature');
  });

  test('handles empty features array', async () => {
    const emptyFeatures: FeatureNotificationsPayload<string> = {
      id: 'empty-features',
      features: [],
      mountItem: (container, data) => {
        container.textContent = data;
      },
    };

    awsuiWidgetPlugins.registerFeatureNotifications(emptyFeatures);
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById('empty-features')).toBeFalsy();
  });
});
