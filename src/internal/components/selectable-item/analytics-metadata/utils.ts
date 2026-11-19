// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ItemDataAttributes, SelectableItemProps } from '../interfaces';
import { GeneratedAnalyticsMetadataSelectableItemSelect } from './interfaces';

import optionAnalyticsSelectors from './../../option/analytics-metadata/styles.css.js';
import analyticsSelectors from './styles.css.js';

export const getAnalyticsSelectActionMetadata = ({
  isChild,
  value,
  ...restProps
}: Partial<SelectableItemProps>): GeneratedAnalyticsMetadataSelectableItemSelect => {
  const dataAttributes = restProps as ItemDataAttributes;

  const analyticsMetadata: GeneratedAnalyticsMetadataSelectableItemSelect = {
    action: 'select',
    detail: {
      label: {
        selector: [`.${optionAnalyticsSelectors.label}`, `.${analyticsSelectors['option-content']}`],
      },
    },
  };

  let position = undefined;
  if (
    (isChild && dataAttributes['data-group-index'] && dataAttributes['data-in-group-index']) ||
    dataAttributes['data-child-index']
  ) {
    position = `${dataAttributes['data-group-index']},${dataAttributes['data-in-group-index'] || dataAttributes['data-child-index']}`;
  } else if (dataAttributes['data-test-index']) {
    position = `${dataAttributes['data-test-index']}`;
  }
  if (position) {
    analyticsMetadata.detail.position = position;
  }
  if (value) {
    analyticsMetadata.detail.value = value;
  }
  if (isChild) {
    analyticsMetadata.detail.groupLabel = {
      root: 'body',
      selector: `.${analyticsSelectors.parent}[data-group-index="${dataAttributes['data-group-index']}"] .${analyticsSelectors['option-content']}`,
    };
  }
  return analyticsMetadata;
};
