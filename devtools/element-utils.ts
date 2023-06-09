// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TokenMetadata } from './interfaces';
import { selectorsMapping } from './selectors-mapping';

export function getElementTokens(element: Element): TokenMetadata[] {
  const isVR = !!document.querySelector('.awsui-visual-refresh');
  const tokens: TokenMetadata[] = [];
  for (const style of selectorsMapping) {
    try {
      if (element.matches(style.selector)) {
        tokens.push(...style.tokens);
      }
    } catch (error) {
      console.warn(`Invalid selector: "${style.selector}".`);
    }
  }
  return uniqBy(tokens, token => token.section + ':' + token.name).map(token => ({
    ...token,
    description: isVR ? token.descriptionVR : token.description,
  }));
}

export function getElementName(element: Element): string {
  const componentName = (element as any).__awsuiMetadata__?.name;
  if (componentName) {
    return componentName;
  }

  let current: null | Element = element;
  while (current) {
    const componentName = (current as any).__awsuiMetadata__?.name;
    if (componentName) {
      return `${componentName} - ${getComponentSegmentName(element)}`;
    }
    current = current.parentElement;
  }

  return element.tagName;
}

export function getElementContext(element: Element): null | string {
  let current: null | Element = element;
  while (current) {
    const contextClassName = Array.from(current.classList).find(className => className.startsWith('awsui-context-'));
    if (contextClassName) {
      return contextClassName.slice('awsui-context-'.length);
    }
    current = current.parentElement;
  }
  return null;
}

export function readTokenValue(element: Element, token: TokenMetadata): string {
  return window.getComputedStyle(element).getPropertyValue(token.cssName) ?? '';
}

function getComponentSegmentName(element: Element): string {
  const segmentNames = [
    'action',
    'area',
    'bar',
    'body',
    'button',
    'container',
    'content',
    'footer',
    'group',
    'header',
    'header',
    'list',
    'panel',
    'section',
    'tools',
  ];

  const classNames = Array.from(element.classList).filter(className => className.startsWith('awsui_'));

  for (const className of classNames) {
    const [, qualifier] = className.split('_');
    for (const segmentName of segmentNames) {
      if (qualifier.includes(segmentName)) {
        return qualifier;
      }
    }
  }

  return 'part';
}

function uniqBy<I, P>(allItems: I[], getProperty: (item: I) => P): I[] {
  const propertiesSet = new Set<P>();
  const uniqueItems: I[] = [];

  for (const item of allItems) {
    const property = getProperty(item);
    if (!propertiesSet.has(property)) {
      propertiesSet.add(property);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}
