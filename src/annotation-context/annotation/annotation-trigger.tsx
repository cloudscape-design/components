// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import styles from './styles.css.js';
import { AnnotationIcon } from './annotation-icon';
import useFocusVisible from '../../internal/hooks/focus-visible/index.js';
import { AnnotationContextProps } from '../interfaces';
import { joinStrings } from '../../internal/utils/strings/join-strings.js';

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
  const focusVisible = useFocusVisible();

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
      aria-label={joinStrings(
        i18nStrings.labelHotspot(open),
        i18nStrings.stepCounterText(taskLocalStepIndex ?? 0, totalLocalSteps ?? 0)
      )}
      onClick={onClick}
      {...focusVisible}
    >
      <AnnotationIcon open={open} />
    </button>
  );
});
