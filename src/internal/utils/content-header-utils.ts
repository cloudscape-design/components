// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from './global-flags';

export const contentHeaderClassName: string = getGlobalFlag('removeHighContrastHeader')
  ? ''
  : 'awsui-context-content-header';

export const isHighContrastHeaderActive = !!getGlobalFlag('removeHighContrastHeader');
