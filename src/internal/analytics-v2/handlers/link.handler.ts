// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Handler, LinkDetail } from '../interfaces';
import { getFunnel } from '../utils/funnel';

export const click: Handler = ({ target, detail }) => {
  const funnel = getFunnel(target);
  if (!funnel) {
    return;
  }

  const { external, variant } = detail as LinkDetail;
  if (external) {
    funnel.interaction('external');
    return;
  }

  if (variant === 'info') {
    funnel.interaction('info');
    return;
  }
};
