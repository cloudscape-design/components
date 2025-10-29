// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadata,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Cards, { CardsProps } from '../../../lib/components/cards';
import {
  GeneratedAnalyticsMetadataCardsDeselect,
  GeneratedAnalyticsMetadataCardsSelect,
} from '../../../lib/components/cards/analytics-metadata/interfaces';
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

const getMetadata = (
  additionalProperties: Record<string, string | Array<string> | undefined>,
  event?: GeneratedAnalyticsMetadataCardsSelect | GeneratedAnalyticsMetadataCardsDeselect,
  innerContext?: Record<string, string>
) => {
  const metadata: Partial<GeneratedAnalyticsMetadata> = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Cards',
          label: componentLabel,
          properties: {
            itemsCount: '4',
            ...additionalProperties,
          },
        },
      },
    ],
  };
  if (event && event.detail) {
    metadata.contexts![0].detail.innerContext = {
      position: event.detail.position,
      item: event.detail.item,
    };
  }
  if (innerContext) {
    metadata.contexts![0].detail.innerContext = innerContext;
  }
  return { ...event, ...metadata };
};

const findSelectionInput = (wrapper: CardsWrapper, index: number) =>
  wrapper.findItems()![index].findSelectionArea()!.find('input')!.getElement();

const getItem = (index: number, trackBy: string | undefined) => (trackBy ? items[index].value : `${index}`);

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

          const selectedItems = trackBy ? ['third', 'fourth'] : undefined;

          const firstSelectionArea = findSelectionInput(wrapper, 0);
          validateComponentNameAndLabels(firstSelectionArea, labels);
          const selectEvent: GeneratedAnalyticsMetadataCardsSelect = {
            action: 'select',
            detail: { label: 'first', position: '1', item: getItem(0, trackBy) },
          };
          const firstMetadata = getMetadata(
            { selectedItemsCount: '2', selectedItems, selectionType: 'multi', variant: 'full-page' },
            selectEvent
          );
          expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toEqual(firstMetadata);
          if (entireCardClickable) {
            expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())).toEqual(
              firstMetadata
            );
          }

          const disabledSelectionArea = findSelectionInput(wrapper, 1);
          validateComponentNameAndLabels(disabledSelectionArea, labels);
          const secondMetadata = getMetadata(
            { selectedItemsCount: '2', selectedItems, selectionType: 'multi', variant: 'full-page' },
            undefined,
            {
              position: '2',
              item: getItem(1, trackBy),
            }
          );
          expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toEqual(secondMetadata);
          if (entireCardClickable) {
            expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())).toEqual(
              secondMetadata
            );
          }

          const thirdSelectionArea = findSelectionInput(wrapper, 2);
          validateComponentNameAndLabels(thirdSelectionArea, labels);
          const deselectEvent: GeneratedAnalyticsMetadataCardsDeselect = {
            action: 'deselect',
            detail: { label: 'third', position: '3', item: getItem(2, trackBy) },
          };
          const thirdMetadata = getMetadata(
            { selectedItemsCount: '2', selectedItems, selectionType: 'multi', variant: 'full-page' },
            deselectEvent
          );
          expect(getGeneratedAnalyticsMetadata(thirdSelectionArea)).toEqual(thirdMetadata);
          if (entireCardClickable) {
            expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[2]!.findCardHeader()!.getElement())).toEqual(
              thirdMetadata
            );
          }
        });
        test('single', () => {
          const wrapper = renderCards({
            selectionType: 'single',
            selectedItems: [items[2]],
            trackBy,
            entireCardClickable,
          });

          const selectedItems = trackBy ? ['third'] : undefined;

          const firstSelectionArea = findSelectionInput(wrapper, 0);
          validateComponentNameAndLabels(firstSelectionArea, labels);
          const firstMetadata = getMetadata(
            { selectedItemsCount: '1', selectedItems, selectionType: 'single', variant: 'container' },
            {
              action: 'select',
              detail: { label: 'first', position: '1', item: getItem(0, trackBy) },
            }
          );
          expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toEqual(firstMetadata);
          if (entireCardClickable) {
            expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())).toEqual(
              firstMetadata
            );
          }

          const disabledSelectionArea = findSelectionInput(wrapper, 1);
          validateComponentNameAndLabels(disabledSelectionArea, labels);
          const secondMetadata = getMetadata(
            { selectedItemsCount: '1', selectedItems, selectionType: 'single', variant: 'container' },
            undefined,
            {
              position: '2',
              item: getItem(1, trackBy),
            }
          );
          expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toEqual(secondMetadata);
          if (entireCardClickable) {
            expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())).toEqual(
              secondMetadata
            );
          }
        });
      });
      test('without selected values', () => {
        const wrapper = renderCards({
          selectionType: 'multi',
          trackBy,
        });

        const selectedItems = trackBy ? [] : undefined;

        const firstSelectionArea = findSelectionInput(wrapper, 0);
        validateComponentNameAndLabels(firstSelectionArea, labels);
        const selectEvent: GeneratedAnalyticsMetadataCardsSelect = {
          action: 'select',
          detail: { label: 'first', position: '1', item: getItem(0, trackBy) },
        };
        const firstMetadata = getMetadata(
          { selectedItemsCount: '0', selectedItems, selectionType: 'multi', variant: 'container' },
          selectEvent
        );
        expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toEqual(firstMetadata);
      });
    });
  });
  describe('without selection', () => {
    test.each([false, true])('with entireCardClickable=%s', entireCardClickable => {
      const wrapper = renderCards({ entireCardClickable, trackBy: 'value' });
      const componentDetails = {
        selectedItemsCount: '0',
        selectedItems: [],
        selectionType: 'none',
        variant: 'container',
      };
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[0]!.findCardHeader()!.getElement())).toEqual(
        getMetadata(componentDetails, undefined, {
          position: '1',
          item: 'first',
        })
      );
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[1]!.findCardHeader()!.getElement())).toEqual(
        getMetadata(componentDetails, undefined, {
          position: '2',
          item: 'second',
        })
      );
      expect(getGeneratedAnalyticsMetadata(wrapper.findItems()[2]!.findCardHeader()!.getElement())).toEqual(
        getMetadata(componentDetails, undefined, {
          position: '3',
          item: 'third',
        })
      );
    });
  });
});
