// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import CollectionPreferences, { CollectionPreferencesProps } from '../../../lib/components/collection-preferences';
import { GeneratedAnalyticsMetadataCollectionPreferencesComponent } from '../../../lib/components/collection-preferences/analytics-metadata/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';
import {
  contentDensityPreference,
  contentDisplayPreference,
  pageSizePreference,
  stickyColumnsPreference,
  stripedRowsPreference,
  visibleContentPreference,
  wrapLinesPreference,
} from './shared';

import labels from '../../../lib/components/collection-preferences/analytics-metadata/styles.css.js';

function renderCollectionPreferences(props: CollectionPreferencesProps = {}) {
  const renderResult = render(
    <CollectionPreferences
      title="Preferences title"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      preferences={{}}
      onConfirm={() => {}}
      {...props}
    />
  );
  return createWrapper(renderResult.container).findCollectionPreferences()!;
}

const getMetadata = (
  properties: Partial<GeneratedAnalyticsMetadataCollectionPreferencesComponent['properties']> = {},
  innerContextArea?: string
) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.CollectionPreferences',
          label: 'Preferences title',
          properties: {
            disabled: 'false',
            ...properties,
          },
        },
      },
    ],
  };
  if (innerContextArea) {
    metadata.contexts![0].detail.innerContext = { preference: innerContextArea };
  }
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('CollectionPreferences renders correct analytics metadata', () => {
  describe('buttons', () => {
    test('on trigger button', () => {
      const wrapper = renderCollectionPreferences();
      const triggerButton = wrapper.findTriggerButton().getElement();
      validateComponentNameAndLabels(triggerButton, labels);
      expect(getGeneratedAnalyticsMetadata(triggerButton)).toEqual({
        action: 'open',
        detail: {
          label: 'Preferences title',
        },
        ...getMetadata(),
      });
    });
    test('on dismiss button', () => {
      const wrapper = renderCollectionPreferences();
      wrapper.findTriggerButton().click();
      const dismissButton = wrapper.findModal()!.findDismissButton().getElement();
      validateComponentNameAndLabels(dismissButton, labels);
      expect(getGeneratedAnalyticsMetadata(dismissButton)).toEqual({
        action: 'dismiss',
        detail: {
          label: 'Cancel',
        },
        ...getMetadata(),
      });
    });

    test('on cancel button', () => {
      const wrapper = renderCollectionPreferences();
      wrapper.findTriggerButton().click();
      const cancelButton = wrapper.findModal()!.findCancelButton()!.getElement();
      validateComponentNameAndLabels(cancelButton, labels);
      expect(getGeneratedAnalyticsMetadata(cancelButton)).toEqual({
        action: 'cancel',
        detail: {
          label: 'Cancel',
        },
        ...getMetadata(),
      });
    });

    test('on confirm button', () => {
      const wrapper = renderCollectionPreferences();
      wrapper.findTriggerButton().click();
      const confirmButton = wrapper.findModal()!.findConfirmButton()!.getElement();
      validateComponentNameAndLabels(confirmButton, labels);
      expect(getGeneratedAnalyticsMetadata(confirmButton)).toEqual({
        action: 'confirm',
        detail: {
          label: 'Confirm',
        },
        ...getMetadata(),
      });
    });
  });
  describe('component properties', () => {
    const actionMetadata = {
      action: 'open',
      detail: {
        label: 'Preferences title',
      },
    };
    test('disabled', () => {
      const wrapper = renderCollectionPreferences({ disabled: true });
      const triggerButton = wrapper.findTriggerButton().getElement();
      validateComponentNameAndLabels(triggerButton, labels);
      expect(getGeneratedAnalyticsMetadata(triggerButton)).toEqual(getMetadata({ disabled: 'true' }));
    });
    test('with preferences', () => {
      const wrapper = renderCollectionPreferences({
        preferences: {
          pageSize: 30,
          wrapLines: true,
          stripedRows: false,
          contentDensity: 'compact',
          visibleContent: ['a', 'b', 'c'],
          stickyColumns: {
            first: 1,
            last: 2,
          },
          contentDisplay: [
            { id: 'id1', visible: true },
            { id: 'id2', visible: false },
            { id: 'id3', visible: true },
          ],
        },
      });
      const triggerButton = wrapper.findTriggerButton().getElement();
      validateComponentNameAndLabels(triggerButton, labels);
      expect(getGeneratedAnalyticsMetadata(triggerButton)).toEqual({
        ...actionMetadata,
        ...getMetadata({
          pageSize: '30',
          wrapLines: 'true',
          stripedRows: 'false',
          contentDensity: 'compact',
          visibleContentCount: '3',
          stickyColumnsFirst: '1',
          stickyColumnsLast: '2',
          contentDisplayVisibleCount: '2',
        }),
      });
    });
    test('with undefined first sticky columns', () => {
      const wrapper = renderCollectionPreferences({
        preferences: {
          stickyColumns: {
            last: 2,
          },
        },
      });
      const triggerButton = wrapper.findTriggerButton().getElement();
      validateComponentNameAndLabels(triggerButton, labels);
      expect(getGeneratedAnalyticsMetadata(triggerButton)).toEqual({
        ...actionMetadata,
        ...getMetadata({
          stickyColumnsLast: '2',
        }),
      });
    });
    test('with undefined last sticky columns', () => {
      const wrapper = renderCollectionPreferences({
        preferences: {
          stickyColumns: {
            first: 1,
          },
        },
      });
      const triggerButton = wrapper.findTriggerButton().getElement();
      validateComponentNameAndLabels(triggerButton, labels);
      expect(getGeneratedAnalyticsMetadata(triggerButton)).toEqual({
        ...actionMetadata,
        ...getMetadata({
          stickyColumnsFirst: '1',
        }),
      });
    });
  });
  describe('component innerContexts', () => {
    test('with pageSize preference', () => {
      const wrapper = renderCollectionPreferences({
        pageSizePreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findPageSizePreference()!.findOptions()![0].findNativeInput().getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual({
        action: 'select',
        detail: {
          label: '10 items',
          position: '1',
          value: '10',
        },
        ...getMetadata({}, 'pageSize'),
      });
    });
    test('with wrapLines preference', () => {
      const wrapper = renderCollectionPreferences({
        wrapLinesPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findWrapLinesPreference()!.findNativeInput().getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual({
        action: 'select',
        detail: {
          label: 'Wrap lines label',
          selected: 'true',
        },
        ...getMetadata({}, 'wrapLines'),
      });
    });
    test('with stripedRows preference', () => {
      const wrapper = renderCollectionPreferences({
        stripedRowsPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findStripedRowsPreference()!.findNativeInput().getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual({
        action: 'select',
        detail: {
          label: 'Striped rows label',
          selected: 'true',
        },
        ...getMetadata({}, 'stripedRows'),
      });
    });
    test('with contentDensity preference', () => {
      const wrapper = renderCollectionPreferences({
        contentDensityPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findContentDensityPreference()!.findNativeInput().getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual({
        action: 'select',
        detail: {
          label: 'Compact mode',
          selected: 'true',
        },
        ...getMetadata({}, 'contentDensity'),
      });
    });
    test('with stickyColumns preference', () => {
      const wrapper = renderCollectionPreferences({
        stickyColumnsPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper
        .findModal()!
        .findStickyColumnsPreference()!
        .findRadioGroup()
        .findInputByValue('1')!
        .getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual({
        action: 'select',
        detail: {
          label: 'First column',
          position: '2',
          value: '1',
        },
        ...getMetadata({}, 'stickyColumns'),
      });
    });

    test('with visibleContent preference', () => {
      const wrapper = renderCollectionPreferences({
        visibleContentPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findVisibleContentPreference()!.getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual(getMetadata({}, 'visibleContent'));
    });

    test('with contentDisplay preference', () => {
      const wrapper = renderCollectionPreferences({
        contentDisplayPreference,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findContentDisplayPreference()!.getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual(getMetadata({}, 'contentDisplay'));
    });

    test('with custom preference', () => {
      const wrapper = renderCollectionPreferences({
        customPreference: () => <div></div>,
      });

      wrapper.findTriggerButton().click();

      const area = wrapper.findModal()!.findCustomPreference()!.getElement();
      expect(getGeneratedAnalyticsMetadata(area)).toEqual(getMetadata({}, 'custom'));
    });
  });
});
