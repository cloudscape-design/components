// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { HotspotProps } from '../../hotspot/interfaces';
import { AnnotationContextProps } from '../interfaces';
import { AnnotationPopover } from './annotation-popover';
import AnnotationTrigger from './annotation-trigger';

export interface AnnotationProps {
  title: string;
  content: React.ReactNode;
  alert?: React.ReactNode;

  direction: HotspotProps['direction'];

  nextButtonEnabled: boolean;
  onNextButtonClick: () => void;

  onFinish: () => void;

  previousButtonEnabled: boolean;
  onPreviousButtonClick: () => void;

  showPreviousButton: boolean;
  showFinishButton: boolean;

  taskLocalStepIndex: number;

  totalLocalSteps: number;

  onDismiss: () => void;

  i18nStrings: AnnotationContextProps['i18nStrings'];
}

export function OpenAnnotation({
  title,
  content,
  alert,

  direction,

  showPreviousButton,
  showFinishButton,
  taskLocalStepIndex,

  totalLocalSteps,

  onDismiss,

  nextButtonEnabled,
  onNextButtonClick,

  onFinish,

  previousButtonEnabled,
  onPreviousButtonClick,
  i18nStrings,
}: AnnotationProps) {
  const trackRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <AnnotationTrigger
        open={true}
        onClick={onDismiss}
        i18nStrings={i18nStrings}
        ref={trackRef}
        totalLocalSteps={totalLocalSteps}
        taskLocalStepIndex={taskLocalStepIndex}
      />

      <AnnotationPopover
        trackRef={trackRef}
        previousButtonEnabled={previousButtonEnabled}
        showPreviousButton={showPreviousButton}
        showFinishButton={showFinishButton}
        totalLocalSteps={totalLocalSteps}
        i18nStrings={i18nStrings}
        nextButtonEnabled={nextButtonEnabled}
        onDismiss={onDismiss}
        onFinish={onFinish}
        onNextButtonClick={onNextButtonClick}
        onPreviousButtonClick={onPreviousButtonClick}
        taskLocalStepIndex={taskLocalStepIndex}
        direction={direction}
        title={title}
        content={content}
        alert={alert}
      />
    </>
  );
}
