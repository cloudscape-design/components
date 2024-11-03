// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useFunnelContext } from '../../../internal/analytics/funnel/hooks/use-funnel';
import { LinkProps } from '../../interfaces';

export const useLinkFunnel = (variant: LinkProps['variant'], external: boolean) => {
  const funnelContext = useFunnelContext();

  const eventHandlers: { onFollow: LinkProps['onFollow'] } = {
    onFollow: () => {
      funnelContext?.controller?.currentStep?.currentSubstep?.logInteractation({
        componentName: 'link',
        metadata: {
          variant: `${variant}`,
          external,
        },
      });
    },
  };

  return { eventHandlers };
};
