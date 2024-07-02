// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { InternalButton } from '../button/internal.js';
import { ButtonProps } from '../button/interfaces.js';
import { ClickDetail } from '../internal/events/index.js';
import styles from './styles.css.js';

const IconButtonItem = forwardRef(
  (
    {
      item,
      showInlineFeedback,
      onItemClick,
    }: {
      item: ButtonGroupProps.IconButton;
      showInlineFeedback?: boolean;
      onItemClick?: (event: CustomEvent<ClickDetail>) => void;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    return (
      <InternalButton
        variant="icon"
        loading={item.loading}
        loadingText={item.loadingText}
        disabled={item.disabled}
        iconName={hasIcon ? item.iconName : 'close'}
        iconAlt={item.text}
        iconSvg={item.iconSvg}
        ariaLabel={item.text}
        onClick={onItemClick}
        ref={ref}
        data-testid={item.id}
        className={styles.item}
        __focusable={showInlineFeedback}
        __iconWithLabel={showInlineFeedback}
        __pressed={showInlineFeedback}
      >
        {showInlineFeedback && item.feedbackText ? item.feedbackText : item.text}
      </InternalButton>
    );
  }
);

export default IconButtonItem;
