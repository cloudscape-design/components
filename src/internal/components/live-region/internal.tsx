// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../../base-component';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { useMergeRefs } from '../../hooks/use-merge-refs';
import { assertive, polite } from './controller';
import { LiveRegionProps } from './interfaces';

import styles from './styles.css.js';

// Export announcers for components that want to imperatively announce content.
export { polite, assertive };

export interface InternalLiveRegionProps extends InternalBaseComponentProps, LiveRegionProps {
  /**
   * The delay between each announcement from this live region. You should
   * leave this set to the default unless this live region is commonly
   * interrupted by other actions (like text entry in text filtering).
   */
  delay?: number;

  /**
   * Use a list of strings and/or refs to existing elements for building the
   * announcement text. If this property is set, `children` and `message` will
   * be ignored.
   */
  sources?: ReadonlyArray<string | React.RefObject<HTMLElement> | undefined>;
}

export default function InternalLiveRegion({
  assertive: isAssertive = false,
  hidden = false,
  tagName: TagName = 'div',
  delay,
  sources,
  message,
  children,
  className,
  __internalRootRef,
  ...restProps
}: InternalLiveRegionProps) {
  const baseProps = getBaseProps(restProps);
  const childrenRef = useRef<HTMLSpanElement & HTMLDivElement>(null);
  const ref = useMergeRefs(childrenRef, __internalRootRef);

  // The announcer is a globally managed singleton. We're using a ref
  // here because we're entering imperative land when using the controller
  // and we don't want things like double-rendering to double-announce
  // content.
  const previousSourceContentRef = useRef<string>();

  // Lazily initialize live region containers globally.
  useEffect(() => {
    polite.initialize();
    assertive.initialize();
  }, []);

  useEffect(() => {
    // We have to do this because `inert` isn't properly supported until
    // React 19 and this seems much more maintainable than version detection.
    // `inert` is better than `hidden` because it also blocks pointer and
    // focus events as well as hiding the contents from screen readers.
    // https://github.com/facebook/react/issues/17157
    if (childrenRef.current) {
      childrenRef.current.inert = hidden;
    }
  }, [hidden]);

  useEffect(() => {
    const content = sources
      ? getSourceContent(sources)
      : message
        ? message
        : childrenRef.current
          ? extractTextContent(childrenRef.current)
          : undefined;

    if (content && content !== previousSourceContentRef.current) {
      const announcer = isAssertive ? assertive : polite;
      announcer.announce(content, delay);
    }
    previousSourceContentRef.current = content;
  });

  return (
    <TagName ref={ref} {...baseProps} className={clsx(styles.root, className)} hidden={hidden}>
      {children}
    </TagName>
  );
}

function extractTextContent(node: HTMLElement): string {
  // This only extracts text content from the node including all its children which is enough for now.
  // To make it more powerful, it is possible to create a more sophisticated extractor with respect to
  // ARIA properties to ignore aria-hidden nodes and read ARIA labels from the live content.
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}

function getSourceContent(source: ReadonlyArray<string | React.RefObject<HTMLElement> | undefined>): string {
  return source
    .map(item => {
      if (!item || typeof item === 'string') {
        return item;
      }
      if (item.current) {
        return extractTextContent(item.current);
      }
    })
    .filter(Boolean)
    .join(' ');
}
