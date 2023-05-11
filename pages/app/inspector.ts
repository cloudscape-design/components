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

let originalBodyPadding = '';
let panel: null | HTMLElement = null;

function createTokensPanel() {
  originalBodyPadding = document.body.style.paddingRight;
  document.body.style.paddingRight = '300px';

  panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.zIndex = '10000';
  panel.style.top = '0px';
  panel.style.bottom = '0px';
  panel.style.right = '0px';
  panel.style.width = '300px';
  panel.style.padding = '16px';
  panel.style.background = 'white';
  document.body.append(panel);
}

function destroyTokensPanel() {
  document.body.style.paddingRight = originalBodyPadding;
  panel?.remove();
}

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
        cursor.style.zIndex = '9999';
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
      if (nextElement && nextElement !== element && nextElement !== panel && !panel?.contains(nextElement)) {
        const tokens: string[] = [];
        for (const style of stylesMapping) {
          if (nextElement.matches(style.selector)) {
            tokens.push(...style.tokens);
          }
        }

        let current: null | Element = nextElement;
        const parents: string[] = [];
        for (let i = 0; i < 5; i++) {
          if ((current as any).__awsuiMetadata__) {
            break;
          }

          current = current.parentElement;
          if (!current) {
            break;
          }
          const parentName = (current as any).__awsuiMetadata__?.name ?? current.tagName;
          parents.push(parentName);
        }

        console.log(nextElement.tagName, { tokens, parents });

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

    createTokensPanel();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      destroyTokensPanel();
    };
  }, []);
}
