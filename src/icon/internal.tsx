// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import {
  InternalIconContext,
  InternalIconSizeOverrideContext,
  InternalIconStrokeWidthOverrideContext,
} from '../icon-provider/context';
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
  const icons = useContext(InternalIconContext);
  const sizeOverrides = useContext(InternalIconSizeOverrideContext);
  const strokeWidthOverrides = useContext(InternalIconStrokeWidthOverrideContext);
  const iconRef = useRef<HTMLElement>(null);
  // To ensure a re-render is triggered on visual mode changes
  useVisualRefresh();
  const [parentHeight, setParentHeight] = useState<number | null>(null);
  const [parentFontSize, setParentFontSize] = useState<number | null>(null);

  // Determine the effective size class for CSS purposes
  const contextualSize = size === 'inherit';
  const iconSize = contextualSize ? iconSizeMap(parentHeight, parentFontSize) : size;

  // Compute the target pixel size and stroke-width scale from the override.
  // Instead of CSS `scale`, we directly set inline-size on both the span and SVG.
  // The stroke-width scale compensates so the themed stroke remains visually consistent.
  // The CSS uses: stroke-width: calc(token / cssScaleFactor * var(--icon-stroke-scale, 1))
  // By setting --icon-stroke-scale to basePx/targetPx, the visual stroke stays at the themed value.
  let targetSizePx: number | undefined;
  let strokeScale: number | undefined;
  if (!contextualSize) {
    const override = sizeOverrides[iconSize];
    if (override !== undefined) {
      const basePx = BASE_SIZE_PX[iconSize];
      targetSizePx = override;
      if (basePx !== undefined && targetSizePx !== basePx) {
        strokeScale = basePx / targetSizePx;
      }
    }
  }

  // Resolve explicit stroke-width override from the IconProvider strokeWidths prop.
  // When set, this takes precedence over both the token value and the automatic compensation.
  // The value is specified in desired visual (screen) pixels. Two adjustments are needed:
  //   1. Divide by scaleFactor — the SVG viewBox is scaled up for larger variants (e.g. 3× for "large"),
  //      so the CSS stroke-width must be smaller to render at the intended visual size.
  //   2. If a size override is also active, multiply by (basePx / targetPx) to convert from
  //      screen pixels to viewBox units.
  let strokeWidthOverride: string | undefined;
  if (!contextualSize) {
    const rawStroke = strokeWidthOverrides[iconSize];
    if (rawStroke !== undefined) {
      const scaleFactor = SCALE_FACTOR[iconSize] ?? 1;
      const basePx = BASE_SIZE_PX[iconSize];
      const sizeCompensation = targetSizePx !== undefined && basePx !== undefined ? basePx / targetSizePx : 1;
      strokeWidthOverride = `${(rawStroke / scaleFactor) * sizeCompensation}px`;
    }
  }

  // Build inline styles for the wrapper span.
  // When a size override is active, we set --icon-size-override which the CSS uses
  // for both the span's inline-size and the child SVG's inline-size/block-size.
  const inlineStyles: React.CSSProperties = {
    ...(contextualSize && parentHeight !== null ? { height: `${parentHeight}px` } : {}),
    ...(targetSizePx !== undefined ? ({ '--icon-size-override': `${targetSizePx}px` } as React.CSSProperties) : {}),
    ...(strokeWidthOverride
      ? ({ '--icon-stroke-width-override': strokeWidthOverride } as React.CSSProperties)
      : strokeScale
        ? ({ '--icon-stroke-scale': strokeScale } as React.CSSProperties)
        : {}),
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
