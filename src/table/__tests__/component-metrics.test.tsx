// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import CollectionPreferences, {
  CollectionPreferencesProps,
} from '../../../lib/components/collection-preferences/index.js';
import { ComponentMetrics } from '../../../lib/components/internal/analytics/index.js';
import Table from '../../../lib/components/table/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { mockComponentMetrics } from '../../internal/analytics/__tests__/mocks.js';

beforeEach(() => {
  jest.useFakeTimers();
  jest.resetAllMocks();
  mockComponentMetrics();
});

afterEach(() => {
  jest.useRealTimers();
});

test('should add data-analytics-task-interaction-id to root of Table component', () => {
  const { container } = render(<Table items={[]} columnDefinitions={[]} />);
  const tableElement = createWrapper(container).findTable()!.getElement();
  expect(tableElement).toHaveAttribute('data-analytics-task-interaction-id');
});

describe('preferences', () => {
  const createDefaultProps = (): CollectionPreferencesProps => ({
    preferences: {
      pageSize: 10,
    },
    pageSizePreference: {
      options: [
        { value: 10, label: '10 resources' },
        { value: 20, label: '20 resources' },
      ],
    },
    contentDisplayPreference: {
      options: [
        {
          id: 'id',
          label: 'ID',
          alwaysVisible: true,
        },
        {
          id: 'name',
          label: 'Name',
        },
      ],
    },
    onConfirm: () => {},
  });

  const setupPreferenceChangeTest = (
    initialProps: CollectionPreferencesProps,
    updatedPreferences: Partial<CollectionPreferencesProps['preferences']>
  ) => {
    const { container, rerender } = render(
      <Table items={[]} columnDefinitions={[]} preferences={<CollectionPreferences {...initialProps} />} />
    );

    const preferencesWrapper = createWrapper(container).findCollectionPreferences()!;
    preferencesWrapper.findTriggerButton()!.click();
    preferencesWrapper.findModal()!.findConfirmButton()!.click();

    rerender(
      <Table
        items={[]}
        columnDefinitions={[]}
        preferences={
          <CollectionPreferences
            {...initialProps}
            preferences={{
              ...initialProps.preferences,
              ...updatedPreferences,
            }}
          />
        }
      />
    );

    jest.runAllTimers();

    return { container };
  };

  test('should track changes in pageSize through preferences', () => {
    const defaultProps = createDefaultProps();

    setupPreferenceChangeTest(defaultProps, { pageSize: 20 });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: expect.objectContaining({
          tablePreferences: {
            visibleColumns: [],
            resourcesPerPage: 20,
          },
        }),
      })
    );
  });

  test('should track changes in visibleContent through preferences', () => {
    const defaultProps = createDefaultProps();

    setupPreferenceChangeTest(defaultProps, { visibleContent: ['id'] });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: expect.objectContaining({
          tablePreferences: {
            visibleColumns: ['id'],
            resourcesPerPage: 10,
          },
        }),
      })
    );
  });

  test('should track changes in contentDisplay through preferences', () => {
    const defaultProps = createDefaultProps();
    const updatedContentDisplay = [
      { id: 'id', visible: true },
      { id: 'name', visible: false },
    ];

    setupPreferenceChangeTest(defaultProps, { contentDisplay: updatedContentDisplay });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: expect.objectContaining({
          tablePreferences: {
            visibleColumns: ['id'],
            resourcesPerPage: 10,
          },
        }),
      })
    );
  });

  test('should prefer contentDisplay if both visibleContent and contentDisplay are provided', () => {
    const defaultProps = createDefaultProps();

    setupPreferenceChangeTest(defaultProps, {
      visibleContent: ['name'],
      contentDisplay: [
        { id: 'id', visible: true },
        { id: 'name', visible: false },
      ],
    });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: expect.objectContaining({
          tablePreferences: {
            visibleColumns: ['id'],
            resourcesPerPage: 10,
          },
        }),
      })
    );
  });
});
