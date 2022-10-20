// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { PropertyFilterProps } from './interfaces';

// eslint-disable-next-line @cloudscape-design/ban-files
import PropertyFilter from './index';
import { useI18NContext } from '../i18n/context';
import { PropertyFilterI18n } from '../i18n/interfaces';

// TODO: create a utility function to merge PropertyFilterProps and PropertyFilterI18n
type PropertyFilterI18nProps = PropertyFilterProps & {
  i18nStrings: Partial<PropertyFilterProps['i18nStrings']>;
};

export default function PropertyFilterI18nComponent(props: PropertyFilterI18nProps) {
  const messages = useI18NContext({ componentName: 'property-filter' });

  return (
    <PropertyFilter
      {...props}
      {...messages}
      i18nStrings={
        {
          ...props.i18nStrings,
          ...messages.i18nStrings,
          removeTokenButtonAriaLabel: (token: any) => {
            if (props.i18nStrings.removeTokenButtonAriaLabel) {
              return props.i18nStrings.removeTokenButtonAriaLabel(token);
            }
            throw new Error('Missing removeTokenButtonAriaLabel');
          },
        } as any
      }
    />
  );
}
