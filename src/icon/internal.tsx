// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { InternalIconContext, InternalIconSizeOverrideContext } from '../icon-provider/context';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { IconProps } from './interfaces';

import styles from './styles.css.js';

type InternalIconProps = IconProps &
  InternalBaseComponentProps & {
    badge?: boolean;
  };

/**
 * Base pixel sizes for each named icon size variant.
 * Used to compute the scale factor when a pixel override is provided.
 */
const BASE_SIZE_PX: Record<string, number> = {
  small: 12,
  normal: 16,
  medium: 20,
  big: 24,
  large: 48,
};

/**
 * Parses a pixel string like "12px" and returns the numeric value, or undefined if invalid.
 */
function parsePx(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  return match ? parseFloat(match[1]) : undefined;
}

function iconSizeMap(height: number | null, fontSize?: number | null) {
  if (height === null) {
    // This is the best guess for the contextual height while server rendering.
    return 'normal';
  }

  // Only display medium size icon when both line-height >= 24px AND font-size >= 20px
  // This prevents icons from becoming medium size inappropriately
  if (height >= 50) {
    return 'large';
  } else if (height >= 36) {
    return 'big';
  } else if (height >= 24 && !!fontSize && fontSize >= 20) {
    return 'medium';
  } else if (height <= 16) {
    return 'small';
  } else {
    return 'normal';
  }
}

const InternalIcon = ({
  name,
  size = 'normal',
  variant = 'normal',
  url,
  alt,
  ariaLabel,
  svg,
  badge,
  nativeAttributes,
  __internalRootRef,
  ...props
}: InternalIconProps) => {
  const icons = useContext(InternalIconContext);
  const sizeOverrides = useContext(InternalIconSizeOverrideContext);
  const iconRef = useRef<HTMLElement>(null);
  // To ensure a re-render is triggered on visual mode changes
  useVisualRefresh();
  const [parentHeight, setParentHeight] = useState<number | null>(null);
  const [parentFontSize, setParentFontSize] = useState<number | null>(null);

  // Check if there's a pixel override for the "inherit" size variant.
  // If so, we switch from contextual sizing to the "normal" size class and apply a scale.
  const inheritOverride = sizeOverrides.inherit;
  const hasInheritOverride = size === 'inherit' && inheritOverride !== undefined;

  // Determine the effective size class for CSS purposes
  const effectiveSize = hasInheritOverride ? 'normal' : size;
  const contextualSize = effectiveSize === 'inherit';
  const iconSize = contextualSize ? iconSizeMap(parentHeight, parentFontSize) : effectiveSize;

  // Compute the scale factor from the pixel override
  let scaleFactor = 1;
  if (hasInheritOverride) {
    // For inherit override, scale relative to the "normal" base (16px)
    const targetPx = parsePx(inheritOverride);
    if (targetPx !== undefined) {
      scaleFactor = targetPx / BASE_SIZE_PX.normal;
    }
  } else if (!contextualSize) {
    // For non-contextual sizes, check if there's an override for this size variant
    const override = sizeOverrides[iconSize];
    if (override !== undefined) {
      const targetPx = parsePx(override);
      const basePx = BASE_SIZE_PX[iconSize];
      if (targetPx !== undefined && basePx !== undefined) {
        scaleFactor = targetPx / basePx;
      }
    }
  }

  // Build inline styles.
  // We use the CSS `scale` property instead of `transform: scale(...)` so that it composes
  // with any `transform: rotate(...)` applied by parent components (e.g. expandable-section,
  // button-dropdown caret rotation). Using `transform` inline would override CSS transforms.
  // Counter-scale the stroke-width so it remains visually consistent regardless of scaling.
  // The CSS uses: stroke-width: calc(token / cssScaleFactor * var(--icon-stroke-scale, 1))
  // By setting --icon-stroke-scale to 1/scaleFactor, the visual stroke stays at the themed value.
  const strokeScale = scaleFactor !== 1 ? 1 / scaleFactor : undefined;
  const inlineStyles: React.CSSProperties = {
    ...(contextualSize && parentHeight !== null ? { height: `${parentHeight}px` } : {}),
    ...(scaleFactor !== 1 ? { scale: `${scaleFactor}` } : {}),
    ...(strokeScale ? ({ '--icon-stroke-scale': strokeScale } as React.CSSProperties) : {}),
  };

  const baseProps = getBaseProps(props);

  baseProps.className = clsx(
    baseProps.className,
    styles.icon,
    contextualSize && styles['icon-flex-height'],
    badge && styles.badge,
    !contextualSize && styles[`size-${iconSize}-mapped-height`],
    styles[`size-${iconSize}`],
    styles[`variant-${variant}`],
    styles[`name-${name}`]
  );

  // Possible infinite loop is not a concern here because line
  // height should not change without an external state update.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!contextualSize || !iconRef.current) {
      return;
    }
    const computedStyle = getComputedStyle(iconRef.current);
    const { lineHeight, fontSize } = computedStyle;
    const newParentHeight = parseInt(lineHeight, 10);
    const newParentFontSize = parseInt(fontSize, 10);
    setParentHeight(newParentHeight);
    setParentFontSize(newParentFontSize);
  });

  const mergedRef = useMergeRefs(iconRef, __internalRootRef);
  const hasAriaLabel = typeof ariaLabel === 'string';
  const labelAttributes = hasAriaLabel ? { role: 'img', 'aria-label': ariaLabel } : {};

  if (svg) {
    if (url) {
      warnOnce(
        'Icon',
        'You have specified both `url` and `svg`. `svg` will take precedence and `url` will be ignored.'
      );
    }
    return (
      <WithNativeAttributes
        {...baseProps}
        {...labelAttributes}
        tag="span"
        componentName="Icon"
        nativeAttributes={nativeAttributes}
        ref={mergedRef}
        aria-hidden={!hasAriaLabel}
        style={inlineStyles}
      >
        {svg}
      </WithNativeAttributes>
    );
  }

  if (url) {
    return (
      <WithNativeAttributes
        {...baseProps}
        tag="span"
        componentName="Icon"
        nativeAttributes={nativeAttributes}
        ref={mergedRef}
        style={inlineStyles}
      >
        <img src={url} alt={ariaLabel ?? alt} />
      </WithNativeAttributes>
    );
  }

  const validIcon = name && Object.prototype.hasOwnProperty.call(icons, name);

  function iconMap(name: IconProps.Name) {
    if (name === 'gen-ai' && iconSize === 'small') {
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          aria-hidden="true"
          data-testid="gen-ai-filled"
        >
          <path
            d="m8 4.4 1.018 2.582L11.6 8 9.018 9.018 8 11.6 6.982 9.018 4.4 8l2.582-1.018L8 4.4ZM2.405 2.41l.002-.003.003-.002-.003-.002-.002-.003-.002.003-.003.002.003.002.002.003Z"
            className="filled"
          />
        </svg>
      );
    } else {
      const icon = icons[name];
      if (!icon) {
        warnOnce(
          'Icon',
          `You have specified \`name="${name}"\` but no icon with that name was found in the current IconProvider context. If this is a custom icon, ensure your app is wrapped in an \`IconProvider\` with the icon defined via \`defineIcons\`.`
        );
      }
      return icon;
    }
  }

  return (
    <WithNativeAttributes
      {...baseProps}
      {...labelAttributes}
      tag="span"
      componentName="Icon"
      nativeAttributes={nativeAttributes}
      ref={mergedRef}
      style={inlineStyles}
    >
      {validIcon ? iconMap(name) : undefined}
    </WithNativeAttributes>
  );
};

export { InternalIconProps };
export default InternalIcon;
