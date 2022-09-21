// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import styles from './styles.css.js';
import { AnnotationIcon } from './annotation-icon';
import useFocusVisible from '../../internal/hooks/focus-visible/index.js';
import { AnnotationContextProps } from '../interfaces';

export interface AnnotationTriggerProps {
  open: boolean;

  onClick: () => void;

  i18nStrings: AnnotationContextProps['i18nStrings'];
}

export default React.forwardRef<HTMLButtonElement, AnnotationTriggerProps>(function AnnotationTrigger(
  { open, onClick: onClickHandler, i18nStrings }: AnnotationTriggerProps,
  ref
) {
  const focusVisible = useFocusVisible();

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onClickHandler();
    },
    [onClickHandler]
  );

  return (
    <button
      ref={ref}
      className={styles.hotspot}
      aria-haspopup="dialog"
      aria-label={i18nStrings.labelHotspot(open)}
      onClick={onClick}
      {...focusVisible}
    >
      <AnnotationIcon open={open} />
    </button>
  );
});
