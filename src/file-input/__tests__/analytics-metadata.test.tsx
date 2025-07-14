// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import { GeneratedAnalyticsMetadataFileInputClick } from '../../../lib/components/file-input/analytics-metadata/interfaces.js';
import FileInput, { FileInputProps } from '../../../lib/components/file-input/index.js';
import InternalFileInput from '../../../lib/components/file-input/internal.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils.js';

import labels from '../../../lib/components/button/analytics-metadata/styles.css.js';

function renderFileInput(props: Partial<FileInputProps> = {}) {
  const renderResult = render(<FileInput value={[]} onChange={() => {}} {...props} />);
  return createWrapper(renderResult.container).findFileInput()!.findTrigger();
}

const getMetadata = (label: string) => {
  const analyticsAction: GeneratedAnalyticsMetadataFileInputClick = {
    action: 'click',
    detail: { label },
  };
  const metadata: GeneratedAnalyticsMetadataFragment = {
    ...analyticsAction,
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.FileInput',
          label,
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('FileInput renders correct analytics metadata', () => {
  describe('with button variant', () => {
    test('and children', () => {
      const wrapper = renderFileInput({ variant: 'button', children: 'Upload files' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Upload files'));
    });
    test('and aria-label', () => {
      const wrapper = renderFileInput({ variant: 'button', ariaLabel: 'Upload files' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Upload files'));
    });
    test('and both children and aria-label', () => {
      const wrapper = renderFileInput({ variant: 'button', children: 'Upload files', ariaLabel: 'Another label' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Upload files'));
    });
  });
  describe('with icon variant', () => {
    test('and children', () => {
      const wrapper = renderFileInput({ variant: 'icon', children: 'Upload files' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Upload files'));
    });
    test('and aria-label', () => {
      const wrapper = renderFileInput({ variant: 'icon', ariaLabel: 'Upload files' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Upload files'));
    });
    test('and both children and aria-label', () => {
      const wrapper = renderFileInput({ variant: 'icon', children: 'Upload files', ariaLabel: 'Another label' });
      validateComponentNameAndLabels(wrapper.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('Another label'));
    });
  });
});
describe('Internal FileInput', () => {
  test('does not render "component" metadata', () => {
    const renderResult = render(
      <InternalFileInput value={[]} onChange={() => {}}>
        inline button text
      </InternalFileInput>
    );
    const wrapper = createWrapper(renderResult.container).findFileInput()!.findTrigger();
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({
      action: 'click',
      detail: {
        label: 'inline button text',
      },
    });
  });
});
