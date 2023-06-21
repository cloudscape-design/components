// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Ace } from 'ace-builds';

import { KeyCode } from '../internal/keycode';
import FocusLock from '../internal/components/focus-lock';

import { InternalButton } from '../button/internal';
import { ResizableBox } from './resizable-box';

import styles from './styles.css.js';

const ANNOTATION_ITEM_HEIGHT = 31;
const PANE_ANNOTATIONS_PADDING = 12;
const MIN_HEIGHT = 3 * ANNOTATION_ITEM_HEIGHT + 2 * PANE_ANNOTATIONS_PADDING;

export interface PaneProps {
  id: string;

  visible: boolean;
  annotations: Ace.Annotation[];
  highlighted?: Ace.Annotation;

  cursorPositionLabel?: (row: number, column: number) => string;
  closeButtonAriaLabel?: string;

  onClose: () => void;
  onAnnotationClick: (annotation: Ace.Annotation) => void;
  onAnnotationClear: () => void;
}

export const Pane = ({
  id,
  visible,
  annotations,
  highlighted,
  onClose,
  onAnnotationClick,
  onAnnotationClear,
  cursorPositionLabel,
  closeButtonAriaLabel,
}: PaneProps) => {
  const [paneHeight, setPaneHeight] = useState(MIN_HEIGHT);
  const listRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!highlighted) {
      return;
    }
    const { row, column } = highlighted;
    const highlightedAnnotationIndex = annotations.indexOf(
      annotations.filter(a => a.row === row && a.column === column)[0]
    );

    if (highlightedAnnotationIndex > -1) {
      const errorItem = listRef.current?.children[highlightedAnnotationIndex] as HTMLElement | undefined;
      errorItem?.focus();
    }
  }, [highlighted, annotations]);

  const onItemFocus = () => {
    onAnnotationClear();
  };

  const onItemClick = (annotation: Ace.Annotation) => {
    onAnnotationClick(annotation);
  };

  const onItemKeyDown = (annotation: Ace.Annotation, event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) {
      event.preventDefault();
      onAnnotationClick(annotation);
    }
  };

  const onEscKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.escape) {
      event.preventDefault();
      onClose();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div id={id} className={styles.pane} onKeyDown={onEscKeyDown} role="tabpanel">
      <ResizableBox height={paneHeight} minHeight={MIN_HEIGHT} onResize={newHeight => setPaneHeight(newHeight)}>
        <FocusLock disabled={!visible} className={styles['focus-lock']} autoFocus={true} restoreFocus={true}>
          <div className={styles.pane__list} tabIndex={-1}>
            <table className={styles.pane__table} role="presentation">
              <colgroup>
                <col style={{ width: 1 } /* shrink to fit content */} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody ref={listRef}>
                {annotations.map((annotation, i) => (
                  <tr
                    key={i}
                    className={clsx(styles.pane__item, {
                      [styles['pane__item--highlighted']]: annotation === highlighted,
                    })}
                    onFocus={onItemFocus}
                    onMouseOver={onAnnotationClear}
                    onClick={onItemClick.bind(null, annotation)}
                    onKeyDown={onItemKeyDown.bind(null, annotation)}
                    tabIndex={0}
                    role="link"
                  >
                    <td className={clsx(styles.pane__location, styles.pane__cell)} tabIndex={-1}>
                      {cursorPositionLabel?.((annotation.row || 0) + 1, (annotation.column || 0) + 1) ?? ''}
                    </td>
                    <td className={clsx(styles.pane__description, styles.pane__cell)} tabIndex={-1}>
                      {annotation.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles['pane__close-container']}>
            <InternalButton
              formAction="none"
              variant="icon"
              iconName="close"
              onClick={onClose}
              ariaLabel={closeButtonAriaLabel}
            />
          </div>
        </FocusLock>
      </ResizableBox>
    </div>
  );
};
