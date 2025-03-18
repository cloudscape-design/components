// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Handler } from '../interfaces';

// Handle async loading breadcrumbs
export const propertyChange: Handler = () => {
  console.log('breadcrumbs value changed');
};
