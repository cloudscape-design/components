// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ContentLayoutProps } from './interfaces';
import customCssProps from '../internal/generated/custom-css-properties';
import { getBaseProps } from '../internal/base-component';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

export { ContentLayoutProps };

export default function ContentLayout({ children, disableOverlap, header, ...rest }: ContentLayoutProps) {
  const baseProps = getBaseProps(rest);
  const { hasBreadcrumbs } = useAppLayoutContext();

  const rootElement = useRef<HTMLDivElement>(null);
  const { __internalRootRef } = useBaseComponent('ContentLayout');
  const mergedRef = useMergeRefs(rootElement, __internalRootRef);
  const [overlapHeight, overlapElement] = useContainerQuery(rect => rect.height);
  const isVisualRefresh = useVisualRefresh();

  /**
   * Disable the overlap if the component is missing either a header or child
   * content. If the component is not using visual refresh then the overlap
   * will not be displayed at all. This is handled in the CSS not the JavaScript.
   */
  const isOverlapDisabled = !children || !header || disableOverlap;

  /**
   * Instead of using the AppLayout context and useDynamicOverlap hook, the overlapHeight
   * custom property was lifted to the body element. The property is still private and
   * namespaced, but can be overridden as needed by internal components. This is similar
   * to how we add a 'block-body-scroll' class the body dynamically when drawers
   * are opened on mobile viewports.
   */
  document.body.style.setProperty(`${customCssProps.overlapHeight}`, `${overlapHeight}px`);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.layout, {
        [styles['is-overlap-disabled']]: isOverlapDisabled,
        [styles['is-visual-refresh']]: isVisualRefresh,
      })}
      ref={mergedRef}
    >
      <div
        className={clsx(
          styles.background,
          { [styles['is-overlap-disabled']]: isOverlapDisabled },
          'awsui-context-content-header'
        )}
        ref={overlapElement}
      />

      {header && (
        <div
          className={clsx(
            styles.header,
            { [styles['has-breadcrumbs']]: isVisualRefresh && hasBreadcrumbs },
            'awsui-context-content-header'
          )}
        >
          {header}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}

applyDisplayName(ContentLayout, 'ContentLayout');
