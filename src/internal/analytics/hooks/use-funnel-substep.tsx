// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, useEffect, useMemo, useState } from 'react';

import { useFocusTracker } from '../../hooks/use-focus-tracker';
import { FunnelSubstep } from '../funnel';
import { AnalyticsMetadata } from '../interfaces';
import { useFunnelContext } from './use-funnel';

import headerAnalyticsSelectors from '../../../header/analytics-metadata/styles.css.js';

export const useFunnelSubstep = (rootRef: MutableRefObject<HTMLElement | null>, metadata?: AnalyticsMetadata) => {
  const funnel = useFunnelContext();
  const [, setValue] = useState<number>(-1);

  const funnelSubstep = useMemo(() => {
    const funnelSubstep = new FunnelSubstep();
    funnelSubstep.addObserver({
      update: () => {
        setValue(Math.random()); // Trigger a re-render
      },
    });
    return funnelSubstep;
  }, [setValue]);

  useEffect(() => {
    if (!funnel || !funnel.controller) {
      return;
    }

    const substepName =
      (rootRef?.current as HTMLDivElement)?.querySelector<HTMLHeadingElement>(
        `.${headerAnalyticsSelectors['heading-text']}`
      )?.innerText || '';
    funnelSubstep.setName(substepName);
    funnelSubstep.setMetadata(metadata);
    funnel.controller.currentStep?.registerSubstep(funnelSubstep);

    return () => {
      funnel.controller?.currentStep?.unregisterSubstep(funnelSubstep);
    };
  }, [funnel, funnelSubstep, metadata, rootRef]);

  useFocusTracker({
    rootRef,
    onBlur: () => {
      funnel?.controller?.currentStep?.setCurrentSubstep(undefined);
    },
    onFocus: () => {
      funnel?.controller?.currentStep?.setCurrentSubstep(funnelSubstep);
    },
  });

  return funnelSubstep;
};
