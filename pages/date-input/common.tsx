// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DateInputProps } from '~components';

export const getPlaceholder = ({
  granularity,
  inputFormat,
}: {
  granularity: DateInputProps.Granularity;
  inputFormat: DateInputProps.InputFormat;
}) => {
  const separator = inputFormat === 'iso' ? '-' : '/';
  return `YYYY${separator}${granularity === 'month' ? 'MM' : 'MM' + separator + 'DD'}`;
};

export const locales = [
  'ar',
  'de',
  'en-GB',
  'en-US',
  'es',
  'fr',
  'he',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'pt-BR',
  'th',
  'tr',
  'vi',
  'zh-CN',
  'zh-TW',
];
