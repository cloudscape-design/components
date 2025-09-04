// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export type NativeAttributes<T extends React.HTMLAttributes<HTMLElement>> =
  | (Omit<T, 'children'> & Record<`data-${string}`, string>)
  | undefined;

type NativeAttributesProps<AT extends React.HTMLAttributes<HTMLElement>> = {
  tag: string;
  children?: ReactNode;
  skipWarnings?: boolean;
  nativeAttributes: NativeAttributes<AT>;
  componentName: string;
} & NativeAttributes<AT>;
interface ForwardRefType {
  <ET extends HTMLElement, AT extends React.HTMLAttributes<ET>>(
    props: NativeAttributesProps<AT> & { ref?: React.Ref<ET> }
  ): JSX.Element;
}

export default React.forwardRef(
  <ET extends HTMLElement, AT extends React.HTMLAttributes<ET>>(
    { tag, nativeAttributes, children, skipWarnings, componentName, ...rest }: NativeAttributesProps<AT>,
    ref: React.Ref<ET>
  ) => {
    const Tag = tag;

    const processedAttributes = Object.entries(nativeAttributes || {}).reduce((acc, [key, value]) => {
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
        if (key in rest && !skipWarnings) {
          warnOnce(componentName, `Overriding native attribute [${key}] which has a Cloudscape-provided value`);
        }
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return (
      <Tag {...rest} {...processedAttributes} ref={ref}>
        {children}
      </Tag>
    );
  }
) as ForwardRefType;
