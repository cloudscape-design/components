// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import PropertyFilter, { PropertyFilterProps } from './index';
import { useI18NContext } from '../i18n/context';

type PropertyFilterI18nProps = PropertyFilterProps & {
  filteringPlaceholder?: string;
  i18nStrings?: Partial<PropertyFilterProps['i18nStrings']>;
};

export default function PropertyFilterI18nComponent(props: PropertyFilterI18nProps) {
  const i18n = useI18NContext('property-filter');
  return <PropertyFilter {...props} {...i18n} i18nStrings={{ ...props.i18nStrings, ...i18n.i18nStrings }} />;
}
