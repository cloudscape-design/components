// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { SizeControlProps } from '../interfaces';
import styles from '../styles.css.js';

export const usePointerEvents = ({
  position,
  splitPanelRef,
  setSidePanelWidth,
  setBottomPanelHeight,
}: SizeControlProps) => {
  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!splitPanelRef || !splitPanelRef.current) {
        return;
      }

      if (position === 'side') {
        const mouseClientX = event.clientX;
        const width = splitPanelRef.current.getBoundingClientRect().right - mouseClientX;
        setSidePanelWidth(width);
      } else {
        const mouseClientY = event.clientY;
        const height = splitPanelRef.current.getBoundingClientRect().bottom - mouseClientY;
        setBottomPanelHeight(height);
      }
    },
    [position, splitPanelRef, setSidePanelWidth, setBottomPanelHeight]
  );

  const onDocumentPointerUp = useCallback(() => {
    document.body.classList.remove(styles['resize-active']);
    document.body.classList.remove(styles[`resize-${position}`]);
    document.removeEventListener('pointerup', onDocumentPointerUp);
    document.removeEventListener('pointermove', onDocumentPointerMove);
  }, [onDocumentPointerMove, position]);

  const onSliderPointerDown = useCallback(() => {
    document.body.classList.add(styles['resize-active']);
    document.body.classList.add(styles[`resize-${position}`]);
    document.addEventListener('pointerup', onDocumentPointerUp);
    document.addEventListener('pointermove', onDocumentPointerMove);
  }, [onDocumentPointerMove, onDocumentPointerUp, position]);

  return onSliderPointerDown;
};
