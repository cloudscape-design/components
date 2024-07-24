// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';

import { AnnotationContextProps } from '../interfaces';
import AnnotationTrigger from './annotation-trigger';

export interface AnnotationProps {
  globalStepIndex: number;

  onOpen: (stepId: number) => void;

  i18nStrings: AnnotationContextProps['i18nStrings'];

  focusOnRender: boolean;
  totalLocalSteps: number;
  taskLocalStepIndex: number;
}

export function ClosedAnnotation({
  globalStepIndex,
  onOpen,
  i18nStrings,
  focusOnRender,
  totalLocalSteps,
  taskLocalStepIndex,
}: AnnotationProps) {
  const [hotspotRef, setHotspotRef] = useState<HTMLButtonElement | null>(null);
  const onClick = useCallback(() => {
    onOpen(globalStepIndex);
  }, [globalStepIndex, onOpen]);

  useEffect(() => {
    if (focusOnRender && hotspotRef) {
      hotspotRef.focus();
    }
  }, [focusOnRender, hotspotRef]);

  return (
    <AnnotationTrigger
      open={false}
      onClick={onClick}
      i18nStrings={i18nStrings}
      ref={setHotspotRef}
      totalLocalSteps={totalLocalSteps}
      taskLocalStepIndex={taskLocalStepIndex}
    />
  );
}
