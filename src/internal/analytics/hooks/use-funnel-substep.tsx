// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, useEffect, useMemo, useState } from 'react';

import { useFocusTracker } from '../../hooks/use-focus-tracker';
import { FunnelSubstep } from '../funnel';
import { useFunnelContext } from './use-funnel';

import headerAnalyticsSelectors from '../../../header/analytics-metadata/styles.css.js';

export const useFunnelSubstep = (rootRef: MutableRefObject<HTMLElement | null>) => {
  const { funnel } = useFunnelContext();
  const [, setValue] = useState<number>(-1);

  const funnelSubstep = useMemo(() => {
    const funnelSubstep = new FunnelSubstep();
    funnelSubstep.addObserver({
      update: () => {
        setValue(Math.random());
      },
    });
    return funnelSubstep;
  }, [setValue]);

  useEffect(() => {
    if (!funnel) {
      return;
    }

    const substepName =
      (rootRef?.current as HTMLDivElement)?.querySelector<HTMLHeadingElement>(
        `.${headerAnalyticsSelectors['heading-text']}`
      )?.innerText || '';
    funnelSubstep.setName(substepName);
    funnel.currentStep?.registerSubstep(funnelSubstep);

    return () => {
      funnel.currentStep?.unregisterSubstep(funnelSubstep);
    };
  }, [funnel, funnelSubstep, rootRef]);

  useFocusTracker({
    rootRef,
    onBlur: () => {
      funnel?.currentStep?.setCurrentSubstep(undefined);
    },
    onFocus: () => {
      funnel?.currentStep?.setCurrentSubstep(funnelSubstep);
    },
  });

  return funnelSubstep;
};
