// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Handler } from '../interfaces';

export const render: Handler = ({ detail, target }) => {
  if (!detail?.configuration.analytics) {
    return;
  }

  target.setAttribute('data-analytics-flashbar', detail.configuration.analytics.type); // LEGACY
  target.setAttribute('data-analytics-property-type', detail.configuration.analytics.type);
};
