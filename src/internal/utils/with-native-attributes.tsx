// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import type { NativeAttributes } from '../../types/native-attributes';

export type SkipWarnings = boolean | string[];

type NativeAttributesProps<AT extends React.HTMLAttributes<HTMLElement>> = {
  tag: string;
  children?: ReactNode;
  skipWarnings?: SkipWarnings;
  nativeAttributes?: NativeAttributes<AT>;
  componentName: string;
} & Omit<NativeAttributes<AT>, 'ref'>;
interface ForwardRefType {
  <ET extends HTMLElement, AT extends React.HTMLAttributes<ET>>(
    props: NativeAttributesProps<AT> & { ref?: React.Ref<ET> }
  ): JSX.Element;
}

export function processAttributes<ET extends HTMLElement, AT extends React.HTMLAttributes<ET>>(
  rest: Omit<NativeAttributesProps<AT>, 'children' | 'tag' | 'skipWarnings' | 'componentName' | 'nativeAttributes'>,
  componentName: string,
  nativeAttributes?: NativeAttributes<AT>,
  skipWarnings?: SkipWarnings
) {
  return Object.entries(nativeAttributes || {}).reduce(
    (acc, [key, value]) => {
      // concatenate className
      if (key === 'className') {
        acc[key] = clsx(rest.className, value);

        // merge style
      } else if (key === 'style') {
        acc[key] = { ...rest.style, ...value };

        // chain event handlers
      } else if (key.match(/^on[A-Z]/) && typeof value === 'function' && key in rest) {
        acc[key] = (event: Event) => {
          value(event);
          if (!event.defaultPrevented) {
            (rest as any)[key](event);
          }
        };

        // override other attributes, warning if it already exists
      } else {
        if (key in rest && (!skipWarnings || (skipWarnings !== true && !skipWarnings.includes(key)))) {
          warnOnce(componentName, `Overriding native attribute [${key}] which has a Cloudscape-provided value`);
        }
        acc[key] = value;
      }
      return acc;
    },
    { ...rest } as any
  );
}

export default React.forwardRef(
  <ET extends HTMLElement, AT extends React.HTMLAttributes<ET>>(
    { tag, nativeAttributes, children, skipWarnings, componentName, ...rest }: NativeAttributesProps<AT>,
    ref: React.ForwardedRef<ET>
  ) => {
    const Tag = tag;

    // Merge the internal forwarded ref with the consumer-provided ref from nativeAttributes.
    // `NativeElement<AT>` resolves to `ET` at every call site (`AT extends HTMLAttributes<ET>`), but stays
    // deferred inside the generic body, so the two ref types have to be unified explicitly.
    const mergedRef = useMergeRefs(ref, nativeAttributes?.ref as React.Ref<ET> | undefined);

    const processedAttributes = processAttributes<ET, AT>(rest, componentName, nativeAttributes, skipWarnings);

    return (
      <Tag {...processedAttributes} ref={mergedRef}>
        {children}
      </Tag>
    );
  }
) as ForwardRefType;

// Backward-compatibility re-export for consumers importing this public type from the internal path.
export { NativeAttributes } from '../../types/native-attributes';
