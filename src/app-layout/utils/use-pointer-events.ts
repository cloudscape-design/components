// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import styles from '../styles.css.js';

export interface SizeControlProps {
  position: 'side' | 'bottom';
  panelRef?: React.RefObject<HTMLDivElement>;
  handleRef?: React.RefObject<HTMLDivElement>;
  setSidePanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
}

export const usePointerEvents = ({
  position,
  panelRef,
  handleRef,
  setSidePanelWidth,
  setBottomPanelHeight,
}: SizeControlProps) => {
  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!panelRef || !panelRef.current || !handleRef || !handleRef.current) {
        return;
      }

      panelRef.current.style.transitionProperty = 'none';

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
    document.body.classList.remove(styles['resize-active']);
    document.body.classList.remove(styles[`resize-${position}`]);
    document.removeEventListener('pointerup', onDocumentPointerUp);
    document.removeEventListener('pointermove', onDocumentPointerMove);
    panelRef.current.style.transitionProperty = 'border-color, opacity, width';
  }, [panelRef, onDocumentPointerMove, position]);

  const onSliderPointerDown = useCallback(() => {
    document.body.classList.add(styles['resize-active']);
    document.body.classList.add(styles[`resize-${position}`]);
    document.addEventListener('pointerup', onDocumentPointerUp);
    document.addEventListener('pointermove', onDocumentPointerMove);
  }, [onDocumentPointerMove, onDocumentPointerUp, position]);

  return onSliderPointerDown;
};
