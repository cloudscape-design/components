// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @cloudscape-design/prefer-live-region */

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { BaseComponentProps } from '../../base-component';
import { polite, assertive } from './controller';

import styles from './styles.css.js';

// Export announcers for components that want to imperatively announce content.
export { polite, assertive };

export interface LiveRegionProps extends BaseComponentProps {
  /**
   * Whether the announcements should be made using assertive aria-live.
   * You should almost always leave this set to false unless you have a good
   * reason.
   * @default false
   */
  assertive?: boolean;

  /**
   * The delay between each announcement from this live region. You should
   * leave this set to the default unless this live region is commonly
   * interrupted by other actions (like text entry in text filtering).
   */
  delay?: number;

  /**
   * Use a list of strings and/or refs to existing elements for building the
   * announcement text. This avoids rendering separate content twice just for
   * this LiveRegion.
   *
   * If this property is set, the `children` will be ignored.
   */
  source?: Array<string | React.RefObject<HTMLElement> | undefined>;

  /**
   * Use the rendered content as the source for the announcement text.
   *
   * If interactive content is rendered inside `children`, it will be visually
   * hidden, but still interactive. Consider using `source` instead.
   */
  children?: React.ReactNode;

  /**
   * Visibly render the contents of the live region.
   * @default false
   */
  visible?: boolean;

  /**
   * The tag to render the live region as.
   * @default "span"
   */
  tagName?: 'span' | 'div';
}

/**
 * The live region is hidden in the layout, but visible for screen readers.
 * It's purpose it to announce changes e.g. when custom navigation logic is used.
 *
 * The way live region works differently in different browsers and screen readers and
 * it is recommended to manually test every new implementation.
 *
 * ```
 * <LiveRegion source={[`${title} ${details}`]} />
 * ```
 *
 * The live region is always atomic, because non-atomic regions can be treated by screen readers
 * differently and produce unexpected results. To imitate non-atomic announcements simply use
 * multiple live regions:
 *
 * ```
 * <>
 *   <LiveRegion source={[title]} />
 *   <LiveRegion source={[someElementRef]} />
 * </>
 * ```
 */
export default function LiveRegion({
  assertive: isAssertive = false,
  visible = false,
  tagName: TagName = 'span',
  delay,
  children,
  source,
  className,
  ...restProps
}: LiveRegionProps) {
  const sourceRef = useRef<HTMLSpanElement & HTMLDivElement>(null);

  // The announcer is a globally managed singleton. We're using a ref
  // here because we're entering imperative land when using the controller
  // and we don't want things like double-rendering to double-announce
  // content.
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
      const announcer = isAssertive ? assertive : polite;
      announcer.announce(content, delay);
    }
    previousSourceContentRef.current = content;
  });

  if (source) {
    return null;
  }

  return (
    <TagName ref={sourceRef} className={clsx(styles.root, className)} hidden={!visible} {...restProps}>
      {children}
    </TagName>
  );
}

function extractInnerText(node: HTMLElement): string {
  // This only extracts text content from the node including all its children which is enough for now.
  // To make it more powerful, it is possible to create a more sophisticated extractor with respect to
  // ARIA properties to ignore aria-hidden nodes and read ARIA labels from the live content.
  return (node.innerText || '').replace(/\s+/g, ' ').trim();
}

function getSourceContent(source: Array<string | React.RefObject<HTMLElement> | undefined>): string {
  return source
    .map(item => {
      if (!item || typeof item === 'string') {
        return item;
      }
      if (item.current) {
        return extractInnerText(item.current);
      }
    })
    .filter(Boolean)
    .join(' ');
}
