// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Container, { ContainerProps } from '../../../lib/components/container';
import InternalContainer from '../../../lib/components/container/internal';
import Header, { HeaderProps } from '../../../lib/components/header';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/container/analytics-metadata/styles.css.js';

function renderContainer(props: ContainerProps) {
  const renderResult = render(
    <Container {...props}>
      <div className="test-content" />
    </Container>
  );
  return createWrapper(renderResult.container).findContainer()!.find('.test-content')!.getElement();
}

const getMetadataContexts = (label: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Container',
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
describe('Container renders correct analytics metadata', () => {
  describe.each(['h1', 'h2', 'h3'])('With %s', heading => {
    test('with a native heading', () => {
      const label = 'Container header';
      const NativeTag = heading as keyof JSX.IntrinsicElements;
      const element = renderContainer({
        header: (
          <div>
            <NativeTag>{label}</NativeTag>
            <div>Additional text</div>
          </div>
        ),
      });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadataContexts(label));
    });
    test('with a Header component', () => {
      const label = 'Container header';
      const element = renderContainer({
        header: (
          <Header counter="100" info="Info" variant={heading as HeaderProps['variant']}>
            {label}
          </Header>
        ),
      });
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadataContexts(label));
    });
  });
});

test('Internal Container does not render "component" metadata', () => {
  const renderResult = render(
    <InternalContainer header={<h1>Label</h1>}>
      <div className="test-content" />
    </InternalContainer>
  );
  const element = createWrapper(renderResult.container).findContainer()!.find('.test-content')!.getElement();
  expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
});
