// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { buckets } from './buckets';
import { objects } from './objects';
import { versions } from './versions';

// These mocks represent real S3 API
// https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html

export const fetchBuckets = () => Promise.resolve(buckets);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchObjects = (_prefix: string) => Promise.resolve(objects);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchVersions = (_prefix: string) => Promise.resolve(versions);
