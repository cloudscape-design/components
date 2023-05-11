// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

const stylesMapping = [
  {
    selector: '[class*="awsui_button_vjswe"][class*="awsui_variant-normal_vjswe"]',
    tokens: [
      'colorBorderButtonNormalDefault',
      'colorBorderButtonNormalHover',
      'colorTextButtonNormalHover',
      'colorTextButtonNormalActive',
    ],
  },
  {
    selector: '[class*="awsui_button_vjswe"][class*="awsui_variant-normal_vjswe"][class*="awsui_disabled_vjswe"]',
    tokens: ['colorBorderButtonNormalDisabled', 'colorTextInteractiveDisabled'],
  },
] as const;

export function useInspector() {
  useEffect(() => {
    let element: null | Element = null;
    let cursor: null | HTMLElement = null;

    function placeCursor() {
      if (element) {
        cursor?.remove();

        const elementRect = element.getBoundingClientRect();

        cursor = document.createElement('div');
        cursor.style.position = 'fixed';
        cursor.style.zIndex = '10000';
        cursor.style.boxSizing = 'border-box';
        cursor.style.left = elementRect.left + 'px';
        cursor.style.top = elementRect.top + 'px';
        cursor.style.width = elementRect.width + 'px';
        cursor.style.height = elementRect.height + 'px';
        cursor.style.background = 'rgba(255, 242, 178, 0.33)';
        cursor.style.border = '1px solid #bda55d';
        cursor.style.pointerEvents = 'none';
        document.body.append(cursor);
      }
    }

    function setPointerEvents(node: Element) {
      for (const child of Array.from(node.children)) {
        if (child instanceof HTMLElement) {
          child.style.pointerEvents = 'all';
        }
      }
    }

    function onMouseMove(event: MouseEvent) {
      const nextElement = document.elementFromPoint(event.clientX, event.clientY);
      if (nextElement && nextElement !== element) {
        const tokens: string[] = [];

        for (const style of stylesMapping) {
          if (nextElement.matches(style.selector)) {
            tokens.push(...style.tokens);
          }
        }

        console.log(nextElement.tagName, tokens);

        setPointerEvents(nextElement);
      }
      element = nextElement;

      placeCursor();
    }

    function onScroll() {
      placeCursor();
    }

    function onResize() {
      placeCursor();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);
}
