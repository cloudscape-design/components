// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentFormatFunction } from '../../internal/i18n/context';
import { S3ResourceSelectorProps } from '../interfaces';

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
const SCHEME = 's3://';
const BUCKET_FIRST_CHAR = /^[a-z0-9]{1}/;
const CAPITAL_LETTER = /[A-Z]/;
const DNS_NAME = /^(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/;

function checkBucketNameLength(bucketName: string) {
  return 3 <= bucketName.length && bucketName.length <= 63;
}

export function extractBucketName(uri: string) {
  const [bucketName, ...rest] = uri.replace(SCHEME, '').split('/');
  return [bucketName, rest.join('/')];
}

export function validate(uri: string) {
  if (uri === '') {
    return undefined;
  }
  if (uri.slice(0, SCHEME.length) !== SCHEME) {
    return 'validationPathMustBegin' as const;
  }
  const [bucketName] = extractBucketName(uri);
  if (!BUCKET_FIRST_CHAR.test(bucketName)) {
    return 'validationBucketLowerCase' as const;
  }
  if (CAPITAL_LETTER.test(bucketName)) {
    return 'validationBucketMustNotContain' as const;
  }
  if (!checkBucketNameLength(bucketName)) {
    return 'validationBucketLength' as const;
  }
  if (!DNS_NAME.test(bucketName)) {
    return 'validationBucketMustComplyDns' as const;
  }
  return undefined;
}

export function getErrorText(
  i18n: ComponentFormatFunction<'s3-resource-selector'>,
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined,
  errorCode: ReturnType<typeof validate>
) {
  return errorCode ? i18n(`i18nStrings.${errorCode}`, i18nStrings?.[errorCode]) : undefined;
}
