// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Form, { FormProps } from '../../../lib/components/form';
import InternalForm from '../../../lib/components/form/internal';
import Header, { HeaderProps } from '../../../lib/components/header';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/form/analytics-metadata/styles.css.js';

function renderForm(props: FormProps) {
  const renderResult = render(
    <Form {...props}>
      <div className="test-content" />
    </Form>
  );
  return createWrapper(renderResult.container).findForm()!.find('.test-content')!.getElement();
}

const getMetadataContexts = (label: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Form',
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
describe('Form renders correct analytics metadata', () => {
  describe.each(['h1', 'h2', 'h3'])('With %s', heading => {
    test('with a native heading', () => {
      const label = 'Container header';
      const NativeTag = heading as keyof JSX.IntrinsicElements;
      const element = renderForm({ header: <NativeTag>{label}</NativeTag> });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadataContexts(label));
    });
    test('with a Header component', () => {
      const label = 'Container header';
      const element = renderForm({ header: <Header variant={heading as HeaderProps['variant']}>{label}</Header> });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadataContexts(label));
    });
  });
});

test('Internal Form does not render "component" metadata', () => {
  const renderResult = render(
    <InternalForm header={<h1>Label</h1>}>
      <div className="test-content" />
    </InternalForm>
  );
  const element = createWrapper(renderResult.container).findForm()!.find('.test-content')!.getElement();
  expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
});
