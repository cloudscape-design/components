// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import icons from './generated/icons';
import { IconProps } from './interfaces';

import styles from './styles.css.js';

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
            d="M2.6364 1.3636L2 0L1.3636 1.3636L0 2L1.3636 2.6364L2 4L2.6364 2.6364L4 2L2.6364 1.3636Z"
            className="filled no-stroke"
          />
          <path
            d="M6.5 1C6.70534 1 6.8898 1.12554 6.96513 1.31655L8.29967 4.70033L11.6834 6.03487C11.8745 6.1102 12 6.29466 12 6.5C12 6.70534 11.8745 6.8898 11.6834 6.96513L8.29967 8.29967L6.96513 11.6834C6.8898 11.8745 6.70534 12 6.5 12C6.29466 12 6.1102 11.8745 6.03487 11.6834L4.70033 8.29967L1.31655 6.96513C1.12554 6.8898 1 6.70534 1 6.5C1 6.29466 1.12554 6.1102 1.31655 6.03487L4.70033 4.70033L6.03487 1.31655C6.1102 1.12554 6.29466 1 6.5 1Z"
            className="filled no-stroke"
          />
        </svg>
      );
    } else {
      return icons[name];
    }
  }

  return (
    <span {...baseProps} ref={mergedRef} style={inlineStyles}>
      {validIcon ? iconMap(name) : undefined}
    </span>
  );
};

export { InternalIconProps };
export default InternalIcon;
