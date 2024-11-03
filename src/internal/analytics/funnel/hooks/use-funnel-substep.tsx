// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, useEffect, useMemo, useState } from 'react';

import { useFocusTracker } from '../../../hooks/use-focus-tracker';
import { AnalyticsMetadata } from '../../interfaces';
import { FunnelSubstep } from '../core/funnel-substep';
import { useFunnelContext } from './use-funnel';

import headerAnalyticsSelectors from '../../../../header/analytics-metadata/styles.css.js';

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

    return () => {
      funnelSubstep.context?.unregisterSubstep(funnelSubstep);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = async () => {
    await funnelContext?.controller?.currentStep?.setCurrentSubstep(undefined);
  };

  const handleFocus = async () => {
    await funnelContext?.controller?.currentStep?.setCurrentSubstep(funnelSubstep);
  };

  useFocusTracker({
    rootRef,
    onBlur: handleBlur,
    onFocus: handleFocus,
  });

  return funnelSubstep;
};
