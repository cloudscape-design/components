// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { SizeControlProps } from '../interfaces';
import styles from '../styles.css.js';

export const useMouseEvents = ({
  position,
  splitPanelRef,
  setSidePanelWidth,
  setBottomPanelHeight,
}: SizeControlProps) => {
  const onDocumentMouseMove = useCallback(
    (event: MouseEvent) => {
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

  const onDocumentMouseUp = useCallback(() => {
    document.body.classList.remove(styles['resize-active']);
    document.body.classList.remove(styles[`resize-${position}`]);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }, [onDocumentMouseMove, position]);

  const onSliderMouseDown = useCallback(() => {
    document.body.classList.add(styles['resize-active']);
    document.body.classList.add(styles[`resize-${position}`]);
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
  }, [onDocumentMouseMove, onDocumentMouseUp, position]);

  return onSliderMouseDown;
};
