// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ContentLayoutProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
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
  const overlapElement = useDynamicOverlap();
  const isVisualRefresh = useVisualRefresh();

  /**
   * Disable the overlap if the component is missing either a header or child
   * content. If the component is not using visual refresh then the overlap
   * will not be displayed at all. This is handled in the CSS not the JavaScript.
   */
  const isOverlapDisabled = !children || !header || disableOverlap;

  // changes to use subgrid instead of useDynamicOverlap hook
  const supportsSubgrid = CSS.supports('grid-template-columns', 'subgrid');

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
        ref={!supportsSubgrid ? overlapElement : null}
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
