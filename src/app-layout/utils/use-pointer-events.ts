// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import styles from '../styles.css.js';
import { SizeControlProps } from './interfaces';

export const usePointerEvents = ({
  position,
  panelRef,
  handleRef,
  setSidePanelWidth,
  setBottomPanelHeight,
  hasTransitions = false,
}: SizeControlProps) => {
  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!panelRef || !panelRef.current || !handleRef || !handleRef.current) {
        return;
      }

      panelRef.current.classList.remove(styles['with-motion']);

      if (position === 'side') {
        const mouseClientX = event.clientX;

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = handleRef.current.getBoundingClientRect().width / 2;
        const width = panelRef.current.getBoundingClientRect().right - mouseClientX + handleOffset;

        setSidePanelWidth(width);
      } else {
        const mouseClientY = event.clientY;

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = handleRef.current.getBoundingClientRect().height / 2;
        const height = panelRef.current.getBoundingClientRect().bottom - mouseClientY + handleOffset;

        setBottomPanelHeight(height);
      }
    },
    [position, panelRef, handleRef, setSidePanelWidth, setBottomPanelHeight]
  );

  const onDocumentPointerUp = useCallback(() => {
    if (!panelRef || !panelRef.current) {
      return;
    }

    if (hasTransitions) {
      panelRef.current.classList.add(styles['with-motion']);
    }
    document.body.classList.remove(styles['resize-active']);
    document.body.classList.remove(styles[`resize-${position}`]);
    document.removeEventListener('pointerup', onDocumentPointerUp);
    document.removeEventListener('pointermove', onDocumentPointerMove);
  }, [panelRef, onDocumentPointerMove, position, hasTransitions]);

  const onSliderPointerDown = useCallback(() => {
    document.body.classList.add(styles['resize-active']);
    document.body.classList.add(styles[`resize-${position}`]);
    document.addEventListener('pointerup', onDocumentPointerUp);
    document.addEventListener('pointermove', onDocumentPointerMove);
  }, [onDocumentPointerMove, onDocumentPointerUp, position]);

  return onSliderPointerDown;
};
