// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getDateLabel } from '../intl';

describe('getDateLabel', () => {
  test('should return local date string for the sepcified date', () => {
    expect(getDateLabel('en-US', new Date(2017, 0, 5))).toEqual('Thursday, January 5, 2017');
  });
});
