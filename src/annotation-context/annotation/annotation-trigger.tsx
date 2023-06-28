// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import styles from './styles.css.js';
import { AnnotationIcon } from './annotation-icon';
import { AnnotationContextProps } from '../interfaces';

export interface AnnotationTriggerProps {
  open: boolean;

  onClick: () => void;

  i18nStrings: AnnotationContextProps['i18nStrings'];
  taskLocalStepIndex: number;
  totalLocalSteps: number;
}

export default React.forwardRef<HTMLButtonElement, AnnotationTriggerProps>(function AnnotationTrigger(
  { open, onClick: onClickHandler, i18nStrings, taskLocalStepIndex, totalLocalSteps }: AnnotationTriggerProps,
  ref
) {
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      onClickHandler();
    },
    [onClickHandler]
  );

  return (
    <button
      ref={ref}
      className={styles.hotspot}
      aria-haspopup="dialog"
      aria-label={i18nStrings.labelHotspot(open, taskLocalStepIndex ?? 0, totalLocalSteps ?? 0)}
      onClick={onClick}
    >
      <AnnotationIcon open={open} />
    </button>
  );
});
