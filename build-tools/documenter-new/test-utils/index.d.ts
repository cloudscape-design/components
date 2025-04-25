// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TypeDocAndTSOptions } from 'typedoc';

import { TestUtilsDoc } from './interfaces';
export declare function documentTestUtils(
  options: Partial<TypeDocAndTSOptions>,
  filteringGlob: string
): Array<TestUtilsDoc>;
