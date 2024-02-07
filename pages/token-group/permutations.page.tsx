// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TokenGroup, { TokenGroupProps } from '~components/token-group';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import img from '../icon/custom-icon.png';

const i18nStrings: TokenGroupProps.I18nStrings = {
  limitShowFewer: 'Show less',
  limitShowMore: 'Show more',
};

const mixedItems: Array<TokenGroupProps.Item> = [
  {
    label: 'Item 1',
    labelTag: '128Gb',
    iconAlt: 'amazon-logo',
    iconUrl: img,
    description: 'This is item 1',
    tags: ['CPU-v2', '2Gb RAM'],
    disabled: false,
    dismissLabel: 'dismiss',
  },
  {
    label: 'Item 1',
    labelTag: '128Gb',
    description: 'This is item 1',
    tags: [
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
      'CPU-v2',
      '2Gb RAM',
    ],
    disabled: false,
    dismissLabel: 'dismiss',
  },
  {
    label: 'Item 1',
    labelTag: '128Gb',
    iconName: 'calendar',
    disabled: true,
    dismissLabel: 'dismiss',
  },
  {
    label: 'Item 1',
    labelTag: '128Gb',
    iconName: 'calendar',
    disabled: false,
    dismissLabel: 'dismiss',
  },
  {
    label: 'Simple and basic',
    disabled: true,
    dismissLabel: 'dismiss',
  },
];

const wordWrapItems: Array<TokenGroupProps.Item> = [
  {
    label:
      'AVeryLongWordLabelEnoughToWrapTheTabLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
    labelTag: 'Small label tag',
    dismissLabel: 'dismiss',
  },
  {
    label: 'Small label',
    labelTag:
      'AVeryLongWordLabelTagEnoughToWrapTheTabLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
    dismissLabel: 'dismiss',
  },
  {
    label:
      'A very long label, long enough to wrap the label. Ut eleifend nisi non dui imperdiet iaculis. Vestibulum volutpat est mi, nec luctus augue eleifend vel. Ut tellus nisl, ultrices mattis leo non, faucibus aliquet est. Ut eleifend nisi non dui imperdiet iaculis.',
    labelTag:
      'A very long label tag, long enough to wrap the tag label. Ut eleifend nisi non dui imperdiet iaculis. Vestibulum volutpat est mi, nec luctus augue eleifend vel. Ut tellus nisl, ultrices mattis leo non, faucibus aliquet est. Ut eleifend nisi non dui imperdiet iaculis.',
    dismissLabel: 'dismiss',
  },
  {
    label:
      'AVeryLongWordLabelEnoughToWrapTheLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
    labelTag:
      'AVeryLongWordLabelTagEnoughToWrapTheTagLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
    dismissLabel: 'dismiss',
  },
];

const withSvgItems: Array<TokenGroupProps.Item> = [
  {
    label: 'Item 1',
    labelTag: '128Gb',
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" key="0">
        <g>
          <line x1="5.5" y1="12" x2="5.5" y2="15" />
          <line x1="0.5" y1="15" x2="10.5" y2="15" />
          <rect x="1" y="5" width="9" height="7" />
          <polyline points="5 4 5 1 14 1 14 8 10 8" />
        </g>
      </svg>
    ),
    description: 'This is item 1',
    tags: ['CPU-v2', '2Gb RAM'],
    disabled: false,
    dismissLabel: 'dismiss',
  },
  {
    label: 'Item 1',
    labelTag: '128Gb',
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="7" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    ),
    disabled: true,
    dismissLabel: 'dismiss',
  },
];

const permutations = createPermutations<TokenGroupProps>([
  {
    onDismiss: [
      () => {
        /*empty handler to suppress react controlled property warning*/
      },
    ],
    i18nStrings: [i18nStrings],
    limit: [undefined, 3],
    alignment: ['horizontal', 'vertical'],
    items: [
      mixedItems,
      wordWrapItems,
      [
        {
          label: 'Small label',
          labelTag:
            'AVeryLongWordLabelTagEnoughToWrapTheLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
          iconAlt: 'amazon-logo',
          iconUrl: img,
          description: 'This is item 1',
          tags: ['CPU-v2', '2Gb RAM'],
          dismissLabel: 'dismiss',
        },
        {
          label:
            'AVeryLongWordLabelEnoughToWrapTheTagLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
          labelTag: 'Small label tag',
          iconAlt: 'amazon-logo',
          iconUrl: img,
          description: 'This is item 1',
          tags: ['CPU-v2', '2Gb RAM'],
          dismissLabel: 'dismiss',
        },
        {
          label:
            'A very long label, long enough to wrap the label. Ut eleifend nisi non dui imperdiet iaculis. Vestibulum volutpat est mi, nec luctus augue eleifend vel. Ut tellus nisl, ultrices mattis leo non, faucibus aliquet est. Ut eleifend nisi non dui imperdiet iaculis.',
          labelTag:
            'A very long label tag, long enough to wrap the tag label. Ut eleifend nisi non dui imperdiet iaculis. Vestibulum volutpat est mi, nec luctus augue eleifend vel. Ut tellus nisl, ultrices mattis leo non, faucibus aliquet est. Ut eleifend nisi non dui imperdiet iaculis.',
          iconAlt: 'amazon-logo',
          iconUrl: img,
          description: 'This is item 1',
          tags: ['CPU-v2', '2Gb RAM'],
          dismissLabel: 'dismiss',
        },
        {
          label:
            'AVeryLongWordLabelEnoughToWrapTheLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
          labelTag:
            'AVeryLongWordLabelTagEnoughToWrapTheTabLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
          iconAlt: 'amazon-logo',
          iconUrl: img,
          description: 'This is item 1',
          tags: ['CPU-v2', '2Gb RAM'],
          dismissLabel: 'dismiss',
        },
      ],
      withSvgItems,
    ],
  },

  // Non-dimissible token group
  {
    onDismiss: [undefined],
    i18nStrings: [i18nStrings],
    limit: [undefined],
    alignment: ['horizontal', 'vertical'],
    items: [mixedItems, wordWrapItems, withSvgItems],
  },
]);

export default function TokenGroupPermutations() {
  return (
    <>
      <h1>TokenGroup permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <TokenGroup {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
