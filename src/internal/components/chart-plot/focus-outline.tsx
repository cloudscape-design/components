// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import styles from './styles.css.js';
import useFocusVisible from '../../hooks/focus-visible/index';

export interface FocusOutlineProps {
  elementKey?: null | string | number | boolean;
  elementRef?: React.RefObject<SVGSVGElement | SVGGElement>;
  offset?: number;
}

export default function FocusOutline({ elementKey, elementRef, offset = 0 }: FocusOutlineProps) {
  const ref = useRef<SVGRectElement>(null);
  const { 'data-awsui-focus-visible': focusVisible } = useFocusVisible();

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
  offset: number
) {
  el.setAttribute('x', (position.x - offset).toString());
  el.setAttribute('y', (position.y - offset).toString());
  el.setAttribute('width', (position.width + 2 * offset).toString());
  el.setAttribute('height', (position.height + 2 * offset).toString());
  el.style.visibility = 'visible';
}

function hideOutline(el: SVGRectElement) {
  el.style.visibility = 'hidden';
  el.removeAttribute('x');
  el.removeAttribute('y');
  el.removeAttribute('width');
  el.removeAttribute('height');
}
