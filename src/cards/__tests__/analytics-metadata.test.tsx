// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Cards, { CardsProps } from '../../../lib/components/cards';
import Header from '../../../lib/components/header';
import Link from '../../../lib/components/link';
import createWrapper, { CardsWrapper } from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import cardslabels from '../../../lib/components/cards/analytics-metadata/styles.css.js';
import abstractSwitchlabels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';

const labels = { ...abstractSwitchlabels, ...cardslabels };
interface CardsItem {
  value: string;
  description: string;
}

const items: Array<CardsItem> = [
  { value: 'first', description: 'First choice.' },
  { value: 'second', description: 'Second choice' },
  { value: 'third', description: 'Third choice' },
  { value: 'fourth', description: 'Fourth choice' },
];

const cardDefinition: CardsProps['cardDefinition'] = {
  header: item => <Link href="#">{item.value}</Link>,
  sections: [
    {
      id: 'description',
      header: 'Description',
      content: item => item.description,
    },
  ],
};

const componentLabel = 'Header for cards';
const isItemDisabled = (item: CardsItem) => item.value === 'second';

function renderCards(props: Partial<CardsProps>) {
  const renderResult = render(
    <Cards
      {...props}
      items={items}
      cardDefinition={cardDefinition}
      header={
        typeof props.header !== 'undefined' ? (
          props.header
        ) : (
          <Header variant="h2" counter="2" info="Info">
            {componentLabel}
          </Header>
        )
      }
      isItemDisabled={isItemDisabled}
    />
  );
  return createWrapper(renderResult.container).findCards()!;
}

const findSelectionInput = (wrapper: CardsWrapper, index: number) =>
  wrapper.findItems()![index].findSelectionArea()!.find('input')!.getElement();

beforeAll(() => {
  activateAnalyticsMetadata(true);
});

describe('Cards renders correct analytics metadata', () => {
  describe('selection', () => {
    describe.each(['value', undefined])('with trackBy=%s', trackBy => {
      describe.each([false, true])('with entireCardClickable=%s', entireCardClickable => {
        test('multiple', () => {
          const wrapper = renderCards({
            selectionType: 'multi',
            selectedItems: [items[2], items[3]],
            variant: 'full-page',
            entireCardClickable,
            trackBy,
          });

          const firstSelectionArea = findSelectionInput(wrapper, 0);
          validateComponentNameAndLabels(firstSelectionArea, labels);
          expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toMatchSnapshot();
          if (entireCardClickable) {
            expect(
              getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())
            ).toMatchSnapshot();
          }

          const disabledSelectionArea = findSelectionInput(wrapper, 1);
          validateComponentNameAndLabels(disabledSelectionArea, labels);
          expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toMatchSnapshot();
          if (entireCardClickable) {
            expect(
              getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())
            ).toMatchSnapshot();
          }

          const thirdSelectionArea = findSelectionInput(wrapper, 2);
          validateComponentNameAndLabels(thirdSelectionArea, labels);
          expect(getGeneratedAnalyticsMetadata(thirdSelectionArea)).toMatchSnapshot();
          if (entireCardClickable) {
            expect(
              getGeneratedAnalyticsMetadata(wrapper.findItems()[2]!.findCardHeader()!.getElement())
            ).toMatchSnapshot();
          }
        });
        test('single', () => {
          const wrapper = renderCards({
            selectionType: 'single',
            selectedItems: [items[2]],
            trackBy,
            entireCardClickable,
          });

          const firstSelectionArea = findSelectionInput(wrapper, 0);
          validateComponentNameAndLabels(firstSelectionArea, labels);
          expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toMatchSnapshot();
          if (entireCardClickable) {
            expect(
              getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())
            ).toMatchSnapshot();
          }

          const disabledSelectionArea = findSelectionInput(wrapper, 1);
          validateComponentNameAndLabels(disabledSelectionArea, labels);
          expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toMatchSnapshot();
          if (entireCardClickable) {
            expect(
              getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())
            ).toMatchSnapshot();
          }
        });
      });
      test('without selected values', () => {
        const wrapper = renderCards({
          selectionType: 'multi',
          trackBy,
        });

        const firstSelectionArea = findSelectionInput(wrapper, 0);
        validateComponentNameAndLabels(firstSelectionArea, labels);
        expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toMatchSnapshot();
      });
    });
  });
  describe('without selection', () => {
    test.each([false, true])('with entireCardClickable=%s', entireCardClickable => {
      const wrapper = renderCards({ entireCardClickable, trackBy: 'value' });
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())).toMatchSnapshot();
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())).toMatchSnapshot();
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[2]!.findCardHeader()!.getElement())).toMatchSnapshot();
    });
  });
});
