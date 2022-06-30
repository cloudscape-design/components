// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { extractBucketName, validate } from '../validation';

test('extractBucketName', () => {
  expect(extractBucketName('s3://bucket-1/folder-1/object-1')).toEqual(['bucket-1', 'folder-1/object-1']);
  expect(extractBucketName('s3://')).toEqual(['', '']);
  expect(extractBucketName('')).toEqual(['', '']);
});

describe('validate', () => {
  test('valid strings', () => {
    expect(validate('')).toEqual(undefined);
    expect(validate('s3://bucket-1')).toEqual(undefined);
    expect(validate('s3://bucket-1/path')).toEqual(undefined);
    expect(validate('s3://bucket-1/path$')).toEqual(undefined);
    expect(validate('s3://1-bucket')).toEqual(undefined);
    expect(validate(`s3://b${'u'.repeat(62)}/path`)).toEqual(undefined);
    expect(validate('s3://123.test-bucket.name')).toEqual(undefined);
  });

  test('validates protocol prefix', () => {
    expect(validate('https://')).toEqual('validationPathMustBegin');
  });

  test('validates bucket first char', () => {
    expect(validate('s3://')).toEqual('validationBucketLowerCase');
    expect(validate('s3://-bucket1')).toEqual('validationBucketLowerCase');
    expect(validate('s3://Bucket-1')).toEqual('validationBucketLowerCase');
  });

  test('validates no capital letters in the bucket', () => {
    expect(validate('s3://bucket-1-New')).toEqual('validationBucketMustNotContain');
  });

  test('validates bucket name length', () => {
    expect(validate(`s3://bu`)).toEqual('validationBucketLength');
    expect(validate(`s3://b${'u'.repeat(63)}`)).toEqual('validationBucketLength');
  });

  test('validates dns name compliance', () => {
    expect(validate('s3://bucket-1$')).toEqual('validationBucketMustComplyDns');
    expect(validate('s3://b@cket')).toEqual('validationBucketMustComplyDns');
    expect(validate('s3://bf-msm-s-app01.stage-ad.')).toEqual('validationBucketMustComplyDns');
  });
});
