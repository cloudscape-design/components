// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import S3ResourceSelector, { S3ResourceSelectorProps } from './index';
import { useI18NContext } from '../i18n/context';

type S3ResourceSelectorI18nProps = S3ResourceSelectorProps & {
  i18nStrings: Partial<S3ResourceSelectorProps['i18nStrings']> & {
    labelFiltering: (itemsType: string) => string;
  };
};

export default function S3ResourceSelectorI18nComponent(props: S3ResourceSelectorI18nProps) {
  const i18n = useI18NContext('s3-resource-selector');

  // TODO: resolve
  return <S3ResourceSelector {...props} i18nStrings={{ ...props.i18nStrings, ...i18n.i18nStrings } as any} />;
}
