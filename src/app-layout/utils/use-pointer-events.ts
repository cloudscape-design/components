// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';

import {
  getIsRtl,
  getLogicalBoundingClientRect,
  getLogicalClientX,
} from '@cloudscape-design/component-toolkit/internal';

import { SizeControlProps } from './interfaces';

import styles from '../resize/styles.css.js';

export const usePointerEvents = ({ position, panelRef, handleRef, onResize }: SizeControlProps) => {
  const onDocumentPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!panelRef || !panelRef.current || !handleRef || !handleRef.current) {
        return;
      }

      if (position === 'side') {
        const mouseClientX = getLogicalClientX(event, getIsRtl(panelRef.current)) || 0;

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = getLogicalBoundingClientRect(handleRef.current).inlineSize / 2;
        const width = getLogicalBoundingClientRect(panelRef.current).insetInlineEnd - mouseClientX + handleOffset;

        onResize(width);
      } else {
        const mouseClientY = event.clientY || 0;

        // The handle offset aligns the cursor with the middle of the resize handle.
        const handleOffset = getLogicalBoundingClientRect(handleRef.current).blockSize / 2;
        const height = getLogicalBoundingClientRect(panelRef.current).insetBlockEnd - mouseClientY + handleOffset;

        onResize(height);
      }
    },
    [position, panelRef, handleRef, onResize]
  );

  const onDocumentPointerUp = useCallback(() => {
    const panelElement = panelRef?.current;
    /* istanbul ignore if  */
    if (!panelElement) {
      return;
    }
    const currentDocument = panelElement.ownerDocument;

    currentDocument.body.classList.remove(styles['resize-active']);
    currentDocument.body.classList.remove(styles[`resize-${position}`]);
    currentDocument.removeEventListener('pointerup', onDocumentPointerUp);
    currentDocument.removeEventListener('pointermove', onDocumentPointerMove);
  }, [panelRef, onDocumentPointerMove, position]);

  const onSliderPointerDown = useCallback(() => {
    const panelElement = panelRef?.current;
    /* istanbul ignore if  */
    if (!panelElement) {
      return;
    }
    const currentDocument = panelElement.ownerDocument;
    currentDocument.body.classList.add(styles['resize-active']);
    currentDocument.body.classList.add(styles[`resize-${position}`]);
    currentDocument.addEventListener('pointerup', onDocumentPointerUp);
    currentDocument.addEventListener('pointermove', onDocumentPointerMove);
  }, [panelRef, onDocumentPointerMove, onDocumentPointerUp, position]);

  return onSliderPointerDown;
};
