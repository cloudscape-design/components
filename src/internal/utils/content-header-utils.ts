// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from './global-flags';

export const shouldRemoveHighContrastHeader = !!getGlobalFlag('removeHighContrastHeader');
export const contentHeaderClassName = shouldRemoveHighContrastHeader ? '' : 'awsui-context-content-header';
