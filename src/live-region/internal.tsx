// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { LiveRegionController } from './controller';
import { LiveRegionProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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

export interface InternalLiveRegionRef {
  /**
   * Force the live region to announce the message, even if it's the same as
   * the previously announced message.
   *
   * This is useful when making status updates after a change (e.g. filtering)
   * where the new message might be the same as the old one, but the announcement
   * also serves to tell screen reader users that the action was performed.
   */
  reannounce(): void;
}

export default React.forwardRef(function InternalLiveRegion(
  {
    assertive = false,
    hidden = false,
    tagName: TagName = 'div',
    delay,
    sources,
    children,
    __internalRootRef,
    className,
    ...restProps
  }: InternalLiveRegionProps,
  ref: React.Ref<InternalLiveRegionRef>
) {
  const baseProps = getBaseProps(restProps);
  const childrenRef = useRef<HTMLSpanElement & HTMLDivElement>(null);
  const mergedRef = useMergeRefs(childrenRef, __internalRootRef);

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

  // Initialize the live region controller inside an effect. We have to do this
  // because the controller depends on DOM elements, which aren't available on the
  // server.
  const liveRegionControllerRef = useRef<LiveRegionController | undefined>();
  useEffect(() => {
    const liveRegionController = new LiveRegionController(assertive ? 'assertive' : 'polite');
    liveRegionControllerRef.current = liveRegionController;
    return () => {
      liveRegionController.destroy();
      liveRegionControllerRef.current = undefined;
    };
  }, [assertive]);

  const getContent = () => {
    if (sources) {
      return getSourceContent(sources);
    }
    if (childrenRef.current) {
      return extractTextContent(childrenRef.current);
    }
  };

  // Call the controller on every render. The controller will deduplicate the
  // message against the previous announcement internally.
  useEffect(() => {
    liveRegionControllerRef.current?.announce({ message: getContent(), delay });
  });

  useImperativeHandle(ref, () => ({
    reannounce() {
      liveRegionControllerRef.current?.announce({ message: getContent(), delay, forceReannounce: true });
    },
  }));

  return (
    <TagName
      ref={mergedRef}
      {...baseProps}
      className={clsx(styles.root, testUtilStyles.root, className)}
      hidden={hidden}
      // https://github.com/facebook/react/issues/17157#issuecomment-2127180687
      {...{ inert: hidden ? '' : undefined }}
    >
      {children}
    </TagName>
  );
});

function extractTextContent(node: HTMLElement): string {
  // We use the text content of the node as the announcement text.
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
