// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @cloudscape-design/prefer-live-region */

import React, { memo, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../../base-component';
import { assertive, polite } from './controller';

import styles from './styles.css.js';

export interface LiveRegionProps extends BaseComponentProps {
  tagName?: 'span' | 'div';
  assertive?: boolean;
  visible?: boolean;
  delay?: number;
  children?: React.ReactNode;

  /**
   * Use a list of strings and/or existing DOM elements for building the
   * announcement text. This avoids rendering separate content just for this
   * LiveRegion.
   *
   * If this property is set, the `children` will be ignored.
   */
  source?: Array<string | React.RefObject<HTMLElement> | undefined>;
}

/**
 * The live region is hidden in the layout, but visible for screen readers.
 * It's purpose it to announce changes e.g. when custom navigation logic is used.
 *
 * The way live region works differently in different browsers and screen readers and
 * it is recommended to manually test every new implementation.
 *
 * If you notice there are different words being merged together,
 * check if there are text nodes not being wrapped in elements, like:
 * ```
 * <LiveRegion>
 *   {title}
 *   <span><Details /></span>
 * </LiveRegion>
 * ```
 *
 * To fix, wrap "title" in an element:
 * ```
 * <LiveRegion>
 *   <span>{title}</span>
 *   <span><Details /></span>
 * </LiveRegion>
 * ```
 *
 * Or create a single text node if possible:
 * ```
 * <LiveRegion>
 *   {`${title} ${details}`}
 * </LiveRegion>
 * ```
 *
 * The live region is always atomic, because non-atomic regions can be treated by screen readers
 * differently and produce unexpected results. To imitate non-atomic announcements simply use
 * multiple live regions:
 * ```
 * <>
 *   <LiveRegion>{title}</LiveRegion>
 *   <LiveRegion><Details /></LiveRegion>
 * </>
 * ```
 *
 * If you place interactive content inside the LiveRegion, the content will still be
 * interactive (e.g. as a tab stop). Consider using the `source` property instead.
 */
export default memo(LiveRegion);

function LiveRegion({
  assertive: isAssertive = false,
  visible = false,
  tagName: TagName = 'span',
  delay,
  children,
  id,
  source,
  ...restProps
}: LiveRegionProps) {
  const sourceRef = useRef<HTMLSpanElement & HTMLDivElement>(null);
  const previousSourceContentRef = useRef<string>();

  useEffect(() => {
    polite.initialize();
    assertive.initialize();
  }, []);

  useEffect(() => {
    const content = source
      ? getSourceContent(source)
      : sourceRef.current
        ? extractInnerText(sourceRef.current)
        : undefined;

    if (content && content !== previousSourceContentRef.current) {
      (isAssertive ? assertive : polite).announce(content, delay);
      previousSourceContentRef.current = content;
    }
  });

  if (!visible || source) {
    return null;
  }

  return (
    <TagName ref={sourceRef} id={id} {...restProps} className={clsx(styles.root, restProps.className)}>
      {children}
    </TagName>
  );
}

// This only extracts text content from the node including all its children which is enough for now.
// To make it more powerful, it is possible to create a more sophisticated extractor with respect to
// ARIA properties to ignore aria-hidden nodes and read ARIA labels from the live content.
function extractInnerText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s+/g, ' ').trim();
}

function getSourceContent(source: Exclude<LiveRegionProps['source'], undefined>) {
  return source
    .map(item => {
      if (!item) {
        return undefined;
      }
      if (typeof item === 'string') {
        return item;
      }
      if (item.current) {
        return extractInnerText(item.current);
      }
    })
    .filter(Boolean)
    .join(' ');
}
