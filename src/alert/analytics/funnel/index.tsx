// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect } from 'react';

import { useFunnelContext } from '../../../internal/analytics/funnel/hooks/use-funnel';
import { AlertProps } from '../../interfaces';

import analyticsSelectors from '../../analytics-metadata/styles.css.js';

interface UseFunnelAnalytics {
  rootRef: RefObject<HTMLDivElement>;
  type: AlertProps['type'];
}

export const useAlertFunnel = ({ rootRef, type }: UseFunnelAnalytics) => {
  const funnelContext = useFunnelContext();

  useEffect(() => {
    if (!funnelContext || !funnelContext.controller) {
      return;
    }

    let errorText = '';
    if (type === 'error') {
      errorText = rootRef.current?.querySelector<HTMLDivElement>(`.${analyticsSelectors.content}`)?.innerText || '';
    }

    const parentSubstepElement = rootRef.current?.closest('[data-funnel-substep-id]'); // TODO: Move to helper function
    if (parentSubstepElement) {
      const substepId = parentSubstepElement?.getAttribute('data-funnel-substep-id'); // TODO: Move selectors to own file
      funnelContext?.controller?.currentStep?.substeps.forEach(substep => {
        if (substep.id === substepId) {
          funnelContext?.controller?.currentStep?.currentSubstep?.error({
            errorText,
            scope: {
              source: 'alert',
              context: 'funnel-substep',
            },
          });
        }
      });
    } else if (funnelContext?.controller?.currentStep) {
      funnelContext?.controller?.currentStep?.error({ errorText, scope: { source: 'alert', context: 'funnel-step' } });
    } else {
      funnelContext?.controller?.error({ errorText, scope: { source: 'alert', context: 'funnel' } });
    }
  }, [funnelContext, type, rootRef]);
};
