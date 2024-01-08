// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from './styles.css.js';
import icons from './icons';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { IconProps } from './interfaces';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

type InternalIconProps = IconProps &
  InternalBaseComponentProps & {
    badge?: boolean;
  };

function iconSizeMap(height: number | null) {
  if (height === null) {
    // This is the best guess for the contextual height while server rendering.
    return 'normal';
  }

  if (height >= 50) {
    return 'large';
  } else if (height >= 36) {
    return 'big';
  } else if (height >= 24) {
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
  svg,
  badge,
  __internalRootRef = null,
  ...props
}: InternalIconProps) => {
  const iconRef = useRef<HTMLElement>(null);
  // To ensure a re-render is triggered on visual mode changes
  useVisualRefresh();
  const [parentHeight, setParentHeight] = useState<number | null>(null);
  const contextualSize = size === 'inherit';
  const iconSize = contextualSize ? iconSizeMap(parentHeight) : size;
  const inlineStyles = contextualSize && parentHeight !== null ? { height: `${parentHeight}px` } : {};
  const baseProps = getBaseProps(props);

  baseProps.className = clsx(
    baseProps.className,
    styles.icon,
    contextualSize && styles['icon-flex-height'],
    badge && styles.badge,
    !contextualSize && styles[`size-${iconSize}-mapped-height`],
    styles[`size-${iconSize}`],
    styles[`variant-${variant}`]
  );

  // Possible infinite loop is not a concern here because line
  // height should not change without an external state update.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!contextualSize || !iconRef.current) {
      return;
    }
    const { lineHeight } = getComputedStyle(iconRef.current);
    const newParentHeight = parseInt(lineHeight, 10);
    setParentHeight(newParentHeight);
  });

  const mergedRef = useMergeRefs(iconRef, __internalRootRef);

  if (svg) {
    if (url) {
      warnOnce(
        'Icon',
        'You have specified both `url` and `svg`. `svg` will take precedence and `url` will be ignored.'
      );
    }
    return (
      <span {...baseProps} ref={mergedRef} aria-hidden="true" style={inlineStyles}>
        {svg}
      </span>
    );
  }

  if (url) {
    return (
      <span {...baseProps} ref={mergedRef} style={inlineStyles}>
        <img src={url} alt={alt} />
      </span>
    );
  }

  const validIcon = name && Object.prototype.hasOwnProperty.call(icons, name);

  function iconMap(name: IconProps.Name) {
    const genAiFilledIcon = `<svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
        data-testid="gen-ai-filled"
      >
        <path d="m8 4.4 1.018 2.582L11.6 8 9.018 9.018 8 11.6 6.982 9.018 4.4 8l2.582-1.018L8 4.4ZM2.405 2.41l.002-.003.003-.002-.003-.002-.002-.003-.002.003-.003.002.003.002.002.003Z" class="filled"></path>
      </svg>`;

    if (name === 'gen-ai' && iconSize === 'small') {
      return genAiFilledIcon;
    } else {
      return icons[name];
    }
  }

  return (
    <span
      {...baseProps}
      // dangerouslySetInnerHTML is safe here, as we control the content coming from `icons`
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={validIcon ? { __html: iconMap(name) } : undefined}
      ref={mergedRef}
      style={inlineStyles}
    />
  );
};

export { InternalIconProps };
export default InternalIcon;
