// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { ButtonProps } from '@cloudscape-design/components';
import InternalButton from '../button/internal.js';
import { ClickDetail } from '../internal/events/index.js';
import styles from './styles.css.js';

const FeedbackItem = forwardRef(
  (
    {
      item,
      onItemClick,
    }: {
      item: ButtonGroupProps.Feedback;
      onItemClick?: (event: CustomEvent<ClickDetail>) => void;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    return (
      <InternalButton
        variant="icon"
        disabled={true}
        iconName={hasIcon ? item.iconName : 'close'}
        iconAlt={item.text}
        iconSvg={item.iconSvg}
        ariaLabel={item.text}
        data-testid={item.id}
        className={styles.item}
        onClick={onItemClick}
        ref={ref}
        __iconWithLabel={true}
        __focusable={true}
        __pressed={true}
      >
        <span>{item.text}</span>
      </InternalButton>
    );
  }
);

export default FeedbackItem;
