// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.css.js';
import { Offset } from '../interfaces';
import { isModifierKey } from '../../hooks/focus-visible';

export interface FocusOutlineProps {
  elementKey?: null | string | number | boolean;
  elementRef?: React.RefObject<SVGSVGElement | SVGGElement>;
  offset?: Offset;
}

function useFocusVisibleState() {
  const [focusVisible, setFocusVisible] = useState(false);
  useEffect(() => {
    function handleMousedown() {
      return setFocusVisible(false);
    }

    function handleKeydown(event: KeyboardEvent) {
      // we do not want to highlight focused element
      // when special keys are pressed
      if (!isModifierKey(event)) {
        setFocusVisible(true);
      }
    }

    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  return focusVisible;
}

export default function FocusOutline({ elementKey, elementRef, offset = 0 }: FocusOutlineProps) {
  const ref = useRef<SVGRectElement>(null);
  const focusVisible = useFocusVisibleState();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (focusVisible && elementKey && elementRef && elementRef.current && elementRef.current.getBBox) {
      const element = elementRef.current.getBBox();
      showOutline(ref.current, element, offset);
    } else {
      hideOutline(ref.current);
    }
  }, [focusVisible, elementKey, elementRef, offset]);

  return <rect ref={ref} aria-hidden="true" className={styles['focus-outline']} rx="2" />;
}

function showOutline(
  el: SVGRectElement,
  position: { x: number; y: number; width: number; height: number },
  offset: Offset
) {
  const offsetX = typeof offset === 'number' ? offset : offset.x;
  const offsetY = typeof offset === 'number' ? offset : offset.y;
  el.setAttribute('x', (position.x - offsetX).toString());
  el.setAttribute('y', (position.y - offsetY).toString());
  el.setAttribute('width', (position.width + 2 * offsetX).toString());
  el.setAttribute('height', (position.height + 2 * offsetY).toString());
  el.style.visibility = 'visible';
}

function hideOutline(el: SVGRectElement) {
  el.style.visibility = 'hidden';
  el.removeAttribute('x');
  el.removeAttribute('y');
  el.removeAttribute('width');
  el.removeAttribute('height');
}
