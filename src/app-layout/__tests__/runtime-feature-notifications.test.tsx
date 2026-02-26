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
import * as awsuiWidgetInternal from '../../../lib/components/internal/plugins/widget/core';
import { FeatureNotificationsPayload } from '../../../lib/components/internal/plugins/widget/interfaces';
import { featureNotifications } from '../../../lib/components/plugins';
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

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, ...rest } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  return {
    wrapper,
    container,
    rerender,
    ...rest,
  };
}

describeEachAppLayout(() => {
  test('[backward compatibility] registerFeatureNotifications does not crash the page', () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    render(<AppLayout />);
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'] }, ({ size }) => {
  test('registers feature notifications correctly', () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = renderComponent(<AppLayout />);
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

  test('registers feature notifications correctly with no mountItem', () => {
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, mountItem: undefined });
    const { wrapper } = renderComponent(<AppLayout />);
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

  test('registerFeatureNotifications should override previous call when called multiple times', async () => {
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, mountItem: undefined });
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;
    const featureItems = activeDrawerWrapper.findList()!.findItems()!;

    expect(activeDrawerWrapper.getElement()).toBeTruthy();

    expect(featureItems).toHaveLength(2);

    // override
    featureNotifications.registerFeatureNotifications({
      ...featureNotificationsDefaults,
      features: [
        {
          id: 'feature-new',
          header: 'New new Feature 1 Header',
          content: 'This is the first new feature content',
          contentCategory: 'Category A',
          releaseDate: mockDate2025,
        },
      ],
    });

    await waitFor(() => {
      const featureItems = activeDrawerWrapper.findList()!.findItems()!;
      expect(featureItems).toHaveLength(1);
      expect(featureItems[0].findContent().getElement()).toHaveTextContent('New new Feature 1 Header');
    });
  });

  test('clears feature notifications correctly', () => {
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, mountItem: undefined });
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    featureNotifications.clearFeatureNotifications();
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeFalsy();
  });

  test('supports custom filterFeatures function', () => {
    featureNotifications.registerFeatureNotifications({
      ...featureNotificationsDefaults,
      filterFeatures: feature => {
        const halfYearAgo = new Date();
        halfYearAgo.setDate(halfYearAgo.getDate() - 180);
        return feature.releaseDate >= halfYearAgo;
      },
    });
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;
    const featureItems = activeDrawerWrapper.findList()!.findItems()!;

    expect(activeDrawerWrapper.getElement()).toBeTruthy();

    // We expect all features to be rendered since the default filter has been overridden
    expect(featureItems).toHaveLength(3);
  });

  test('shows feature prompt for latest features', async () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { container } = renderComponent(<AppLayout />);
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);

    await waitFor(() => {
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the first new feature content'
      );
    });
  });

  test('should focus on the drawer trigger button when feature prompt is dismissed', async () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { container, wrapper } = await renderComponent(
      <TestI18nProvider messages={i18nMessages}>
        <AppLayout />
      </TestI18nProvider>
    );
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent('This is the first new feature content');

    featurePromptWrapper.findDismissButton()!.click();
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement()).toHaveFocus();
    // ensure the built-in tooltip on the trigger button (not the feature prompt) doesn't appear after focus changes.
    expect(wrapper.findDrawerTriggerTooltip()).toBeFalsy();
    fireEvent.pointerEnter(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement());
    // ensure the built-in tooltip on the trigger button (not the feature prompt) doesn't appear after focus changes.
    expect(wrapper.findDrawerTriggerTooltip()).toBeFalsy();

    // ensure the built-in tooltip is restored
    fireEvent.pointerLeave(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement());
    await delay();
    fireEvent.pointerEnter(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement());
    expect(wrapper.findDrawerTriggerTooltip()).not.toBeFalsy();
  });

  test('renders labels from i18n provider', async () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = await renderComponent(
      <TestI18nProvider messages={i18nMessages}>
        <AppLayout />
      </TestI18nProvider>
    );
    await delay();

    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.getElement()).toHaveAttribute(
      'aria-label',
      'Show feature notifications'
    );
    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    const activeDrawerWrapper = wrapper.findActiveDrawer()!;

    expect(activeDrawerWrapper.getElement()).toHaveAttribute('aria-label', 'Feature notifications');
    expect(activeDrawerWrapper.getElement()).toHaveTextContent('Latest feature releases');
    expect(activeDrawerWrapper.getElement()).toHaveTextContent('View all feature releases');
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Close notifications');
    if (size === 'desktop') {
      expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute(
        'aria-label',
        'Resize feature notifications'
      );
    }
  });

  test('shows feature prompt for a latest unseen features', async () => {
    mockRetrieveFeatureNotifications.mockResolvedValue({ 'feature-1': mockDate2025.toString() });
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { container } = renderComponent(<AppLayout />);
    await delay();

    await waitFor(() => {
      const featurePromptWrapper = new FeaturePromptWrapper(container);
      expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent(
        'This is the second new feature content'
      );
    });
  });

  test('should not show feature prompt for unseen features when suppressed', async () => {
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = renderComponent(<AppLayout />);
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();
  });

  test('shows feature prompt via triggering showFeaturePromptIfPossible when possible', async () => {
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = renderComponent(<AppLayout />);
    await delay();

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    featureNotifications.showFeaturePromptIfPossible();

    await delay();
    expect(featurePromptWrapper.findContent()!.getElement()).toHaveTextContent('This is the first new feature content');
  });

  test('should not show feature prompt if all feature are seen', () => {
    mockRetrieveFeatureNotifications.mockResolvedValue({
      'feature-1': mockDate2025.toString(),
      'feature-2': mockDate2024.toString(),
      'feature-old': mockDateOld.toString(),
    });
    featureNotifications.registerFeatureNotifications({ ...featureNotificationsDefaults, suppressFeaturePrompt: true });
    const { container } = renderComponent(<AppLayout />);

    const featurePromptWrapper = new FeaturePromptWrapper(container);
    expect(featurePromptWrapper.findContent()).toBeFalsy();

    featureNotifications.showFeaturePromptIfPossible();

    expect(featurePromptWrapper.findContent()).toBeFalsy();
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

    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = renderComponent(<AppLayout />);
    await delay();

    wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)!.click();

    expect(mockPersistFeatureNotifications).toHaveBeenCalled();

    const persistedFeaturesMap = mockPersistFeatureNotifications.mock.calls[0][1];

    expect(persistedFeaturesMap).toHaveProperty('feature-1');
    expect(persistedFeaturesMap).toHaveProperty('feature-2');
    expect(persistedFeaturesMap).toHaveProperty('recent-seen-feature');
    expect(persistedFeaturesMap).not.toHaveProperty('old-seen-feature');
  });

  test('handles empty features array', () => {
    const emptyFeatures: FeatureNotificationsPayload<string> = {
      id: 'empty-features',
      features: [],
      mountItem: (container, data) => {
        container.textContent = data;
      },
    };

    featureNotifications.registerFeatureNotifications(emptyFeatures);
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById('empty-features')).toBeFalsy();
  });

  test('renders feature notifications drawer alongside tools', () => {
    featureNotifications.registerFeatureNotifications(featureNotificationsDefaults);
    const { wrapper } = renderComponent(
      <TestI18nProvider messages={i18nMessages}>
        <AppLayout tools="Tools content" ariaLabels={{ toolsToggle: 'Tools' }} />
      </TestI18nProvider>
    );

    // Both feature notifications and tools should be available
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    expect(wrapper.findDrawerTriggerById(featureNotificationsDefaults.id)).toBeTruthy();
    expect(wrapper.findToolsToggle()).toBeTruthy();
  });
});
