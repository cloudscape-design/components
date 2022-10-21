// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import PropertyFilter, { PropertyFilterProps } from './index';
import { useI18NContext } from '../i18n/context';
import { PropertyFilterI18n } from '../i18n/interfaces/property-filter';

type PropertyFilterI18nProps = Omit<PropertyFilterProps, 'i18nStrings'> & {
  i18nStrings?: Omit<PropertyFilterProps['i18nStrings'], keyof PropertyFilterI18n['i18nStrings']> &
    Partial<PropertyFilterI18n['i18nStrings']>;
};

export default function PropertyFilterI18nComponent(props: PropertyFilterI18nProps) {
  const i18n = useI18NContext('property-filter');
  return <PropertyFilter {...props} {...i18n} i18nStrings={{ ...props.i18nStrings, ...i18n.i18nStrings }} />;
}
