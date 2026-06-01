// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { InternalIconContext } from '../icon-provider/context';
import { getBaseProps } from '../internal/base-component';
import customCSSPropertiesMap from '../internal/generated/custom-css-properties';
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
 * Used to compute the stroke-width scale factor when a pixel override is provided.
 * These must match the CSS `inline-size` values from the SCSS $_icon-sizes map
 * (i.e. the actual rendered size of the SVG element without any override).
 * Note: "small" uses $size-icon-normal (16px), same as "normal".
 */
const BASE_SIZE_PX: Record<string, number> = {
  'x-small': 12,
  small: 16,
  normal: 16,
  medium: 20,
  big: 32,
  large: 48,
};

/**
 * CSS scale factors for each icon size variant.
 * These match the scaleFactor values in mixins.scss and represent how much
 * the SVG viewBox is scaled up relative to the base 16×16 coordinate system.
 * The stroke-width must be divided by this factor to render at the intended visual size.
 */
const SCALE_FACTOR: Record<string, number> = {
  'x-small': 0.75,
  small: 1,
  normal: 1,
  medium: 1.25,
  big: 2,
  large: 3,
};

interface SizeOverrideResult {
  /** Target pixel size for the icon wrapper and SVG. */
  size?: number;
  /** Pre-formatted CSS stroke-width value (e.g. "1.5px") that overrides the token value. */
  strokeWidth?: string;
  /** Unitless scale factor applied to the token stroke-width to compensate for a size override. */
  strokeScale?: number;
}

/**
 * Computes the CSS custom property values needed to apply size and stroke-width overrides
 * for a given icon size variant.
 *
 * When a size override is active, the stroke-width must be compensated so the visual stroke
 * stays at the themed value. When an explicit stroke-width override is also provided, it takes
 * precedence and incorporates both the SVG scale factor and any size compensation.
 */
function computeSizeOverrides({
  sizeOverrides,
  strokeWidthOverrides,
  iconSize,
}: {
  sizeOverrides: Partial<Record<string, number>>;
  strokeWidthOverrides: Partial<Record<string, number>>;
  iconSize: string;
}): SizeOverrideResult {
  const result: SizeOverrideResult = {};

  // Fall back to empty maps if either is undefined (e.g. older context versions).
  if (!sizeOverrides) {
    sizeOverrides = {};
  }
  if (!strokeWidthOverrides) {
    strokeWidthOverrides = {};
  }

  const targetSizePx = sizeOverrides[iconSize];
  if (targetSizePx !== undefined) {
    result.size = targetSizePx;
    const basePx = BASE_SIZE_PX[iconSize];
    if (basePx !== undefined && targetSizePx !== basePx) {
      result.strokeScale = basePx / targetSizePx;
    }
  }

  const rawStroke = strokeWidthOverrides[iconSize];
  if (rawStroke !== undefined) {
    const scaleFactor = SCALE_FACTOR[iconSize] ?? 1;
    const basePx = BASE_SIZE_PX[iconSize];
    const sizeCompensation = result.size !== undefined && basePx !== undefined ? basePx / result.size : 1;
    result.strokeWidth = `${(rawStroke / scaleFactor) * sizeCompensation}px`;
  }

  return result;
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
    return !!fontSize && fontSize <= 12 ? 'x-small' : 'small';
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
  const { icons, sizeOverrides, strokeWidthOverrides } = useContext(InternalIconContext);
  const iconRef = useRef<HTMLElement>(null);
  // To ensure a re-render is triggered on visual mode changes
  useVisualRefresh();
  const [parentHeight, setParentHeight] = useState<number | null>(null);
  const [parentFontSize, setParentFontSize] = useState<number | null>(null);

  // Determine the effective size class for CSS purposes
  const contextualSize = size === 'inherit';
  const iconSize = contextualSize ? iconSizeMap(parentHeight, parentFontSize) : size;

  // Build inline styles for the wrapper span.
  // When a size override is active, we set --icon-size-override which the CSS uses
  // for both the span's inline-size and the child SVG's inline-size/block-size.
  const inlineStyles: React.CSSProperties = {};
  const setVar = (key: string, value: string | number) => ((inlineStyles as Record<string, unknown>)[key] = value);

  if (contextualSize && parentHeight !== null) {
    // Keep the wrapper at line-height so the inline-flex container stays tall enough
    // for correct text alignment. align-items: center will center the icon within it,
    // even when a size override makes the icon smaller than the line-height.
    inlineStyles.height = `${parentHeight}px`;
  }

  // Apply size and stroke-width overrides from IconProvider for the resolved size variant.
  // For size="inherit", iconSize is the variant resolved from the measured line-height
  // (e.g. "small"), so provider overrides for that variant are respected.
  const override = computeSizeOverrides({ sizeOverrides, strokeWidthOverrides, iconSize });
  if (override.size) {
    setVar(customCSSPropertiesMap.iconSizeOverride, `${override.size}px`);
  }
  if (override.strokeWidth) {
    setVar(customCSSPropertiesMap.iconStrokeWidthOverride, override.strokeWidth);
  } else if (override.strokeScale) {
    setVar(customCSSPropertiesMap.iconStrokeScale, override.strokeScale);
  }

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
    if (name === 'gen-ai' && (iconSize === 'small' || iconSize === 'x-small')) {
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
