// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';

import { useFocusTracker } from '../../hooks/use-focus-tracker';
import { FunnelSubstep } from '../funnel';
import { AnalyticsMetadata } from '../interfaces';
import { useFunnelContext } from './use-funnel';

import headerAnalyticsSelectors from '../../../header/analytics-metadata/styles.css.js';

const getSubstepName = (rootRef: MutableRefObject<HTMLElement | null>): string => {
  return (
    rootRef.current?.querySelector<HTMLHeadingElement>(`.${headerAnalyticsSelectors['heading-text']}`)?.innerText || ''
  );
};

export const useFunnelSubstep = (rootRef: MutableRefObject<HTMLElement | null>, metadata?: AnalyticsMetadata) => {
  const funnelContext = useFunnelContext();
  const [, setTriggerRender] = useState<number>(0);

  const funnelSubstep = useMemo(() => {
    const substep = new FunnelSubstep();
    substep.addObserver({
      update: () => {
        setTriggerRender(prev => prev + 1);
      },
    });
    return substep;
  }, []);

  useEffect(() => {
    const substepName = getSubstepName(rootRef);
    funnelSubstep.setName(substepName);
    funnelSubstep.setMetadata(metadata);
  }, [funnelContext, funnelSubstep, rootRef, metadata]);

  useEffect(() => {
    funnelContext?.controller?.currentStep?.registerSubstep(funnelSubstep);
  }, [funnelContext?.controller?.currentStep, funnelSubstep]);

  useEffect(() => {
    return () => {
      (async () => {
        await funnelSubstep.complete();
        funnelSubstep.context?.unregisterSubstep(funnelSubstep);
      })();
    };
  }, [funnelSubstep]);

  const handleBlur = useCallback(() => {
    funnelContext?.controller?.currentStep?.setCurrentSubstep(undefined);
  }, [funnelContext]);

  const handleFocus = useCallback(() => {
    funnelContext?.controller?.currentStep?.setCurrentSubstep(funnelSubstep);
  }, [funnelContext, funnelSubstep]);

  useFocusTracker({
    rootRef,
    onBlur: handleBlur,
    onFocus: handleFocus,
  });

  return funnelSubstep;
};
