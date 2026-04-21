// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import globalVars from '../internal/styles/global-vars';
import { SomeRequired } from '../internal/types';
import { NavigationBarProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

type InternalNavigationBarProps = SomeRequired<NavigationBarProps, 'variant' | 'placement' | 'sticky'> &
  InternalBaseComponentProps;

// Registry: scrollContainer → Map<navBarElement, height>
//
// Why a registry instead of independent offset accumulation:
//
// Each sticky NavigationBar needs to know the total height of all bars above it
// so it can set its own `inset-block-start`. The naive approach — each bar reads
// the CSS variable at mount time and adds its own height — breaks when:
//   1. Bars mount simultaneously (both read 0, both set their own height, no stacking)
//   2. Sticky is toggled dynamically (bar reads stale value from before toggle)
//   3. Content wraps and bar height changes (other bars don't know to update their top)
//
// The registry solves this by being the single source of truth:
//   - All sticky horizontal NavigationBars on the same scroll container share one registry
//   - On every height change, recompute() re-sorts all bars by DOM position and
//     recalculates all inset-block-start values from scratch
//   - DOM order (compareDocumentPosition) is used, not mount order — so toggling
//     sticky in any order always produces the correct stacking
//
// The registry is keyed by the scroll container element (WeakMap) so it's
// automatically garbage collected when the container is removed from the DOM.
const registries = new WeakMap<HTMLElement, Map<HTMLElement, number>>();

function getRegistry(container: HTMLElement): Map<HTMLElement, number> {
  if (!registries.has(container)) {
    registries.set(container, new Map());
  }
  return registries.get(container)!;
}

// Recompute all sticky offsets for bars in this registry.
// Sorts by DOM position so the result is independent of mount/toggle order.
// Also updates --awsui-sticky-vertical-top-offset so Container sticky headers
// (and any other component that reads this variable) automatically offset correctly.
function recompute(registry: Map<HTMLElement, number>, container: HTMLElement) {
  const sorted = [...registry.keys()].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  );

  let offset = 0;
  for (const el of sorted) {
    el.style.setProperty('inset-block-start', `${offset}px`);
    offset += registry.get(el)!;
  }
  // Set the total offset for downstream sticky components (Container headers, etc.)
  container.style.setProperty(globalVars.stickyVerticalTopOffset, `${offset}px`);
}

function getOffsetTarget(element: HTMLElement): HTMLElement {
  // NavigationBar's sticky offset integration works with body scrolling.
  // When content scrolls inside a custom container, the table's useStickyHeader
  // ignores --awsui-sticky-vertical-top-offset (hasInnerOverflowParents guard).
  // So we always set the variable on document.body.
  return element.ownerDocument.body;
}

export default function InternalNavigationBar({
  variant,
  placement,
  sticky,
  disablePadding,
  content,
  ariaLabel,
  i18nStrings,
  __internalRootRef,
  ...restProps
}: InternalNavigationBarProps) {
  const baseProps = getBaseProps(restProps);
  const resolvedAriaLabel = i18nStrings?.ariaLabel ?? ariaLabel;
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xxs', 's']);
  const navRef = useRef<HTMLElement>(null);
  const mergedRef = useMergeRefs(__internalRootRef, breakpointRef, navRef);

  const isHorizontalSticky = sticky && (placement === 'block-start' || placement === 'block-end');

  useEffect(() => {
    if (!isHorizontalSticky || !navRef.current) {
      return;
    }

    const el = navRef.current;
    const target = getOffsetTarget(el);
    const registry = getRegistry(target);

    // Register with height 0 immediately so recompute() can assign us a slot.
    // inset-block-start will be set to 0 until the ResizeObserver fires.
    registry.set(el, 0);
    recompute(registry, target);

    // Watch our own height. On every change (initial measurement, content wrap/unwrap,
    // window resize) update the registry and recompute all offsets.
    const observer = new ResizeObserver(([entry]) => {
      registry.set(el, entry.contentRect.height);
      recompute(registry, target);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      // Remove from registry and recompute so bars below us shift up correctly.
      registry.delete(el);
      recompute(registry, target);
      el.style.removeProperty('inset-block-start');
    };
    // isHorizontalSticky combines sticky + placement — re-run if either changes.
  }, [isHorizontalSticky]);

  return (
    <nav
      {...baseProps}
      ref={mergedRef}
      aria-label={resolvedAriaLabel}
      className={clsx(
        baseProps.className,
        styles.root,
        styles[`variant-${variant}`],
        styles[`placement-${placement}`],
        testStyles.root,
        variant === 'primary' && getVisualContextClassname('top-navigation'),
        variant === 'secondary' && getVisualContextClassname('app-layout-toolbar'),
        breakpoint === 'default' && styles['breakpoint-narrow'],
        breakpoint === 'xxs' && styles['breakpoint-medium'],
        sticky && styles.sticky,
        disablePadding && styles['disable-padding']
      )}
    >
      {content && <div className={clsx(styles.content, testStyles.content)}>{content}</div>}
    </nav>
  );
}
