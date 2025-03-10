// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AwsUiNode, Handler } from '../interfaces';
import { render as containerRender } from './container.handler';

const isContainerVariant = (target: AwsUiNode) => {
  const variant = target.__awsuiMetadata__.props?.variant;
  return variant === 'container' || variant === 'stacked';
};

export const render: Handler = event => {
  if (!isContainerVariant(event.target as AwsUiNode)) {
    return;
  }

  return containerRender(event);
};
