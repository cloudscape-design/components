// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { SizeControlProps } from '../interfaces';
import styles from '../styles.css.js';

export const usePointerEvents = ({
  position,
  splitPanelRef,
  handleRef,
  setSidePanelWidth,
  setBottomPanelHeight,
}: SizeControlProps) => {
  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!splitPanelRef || !splitPanelRef.current || !handleRef || !handleRef.current) {
        return;
      }

      if (position === 'side') {
        const mouseClientX = event.clientX;
        console.log('im here and the position is side!');

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = handleRef.current.getBoundingClientRect().width / 2;
        const width = splitPanelRef.current.getBoundingClientRect().right - mouseClientX + handleOffset;

        setSidePanelWidth(width);
      } else {
        const mouseClientY = event.clientY;

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = handleRef.current.getBoundingClientRect().height / 2;
        const height = splitPanelRef.current.getBoundingClientRect().bottom - mouseClientY + handleOffset;

        setBottomPanelHeight(height);
      }
    },
    [position, splitPanelRef, handleRef, setSidePanelWidth, setBottomPanelHeight]
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
