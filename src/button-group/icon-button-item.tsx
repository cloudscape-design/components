// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { ButtonGroupProps } from './interfaces.js';
import { InternalButton } from '../button/internal.js';
import { ButtonProps } from '../button/interfaces.js';
import { CancelableEventHandler, ClickDetail } from '../internal/events/index.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
import clsx from 'clsx';

const IconButtonItem = forwardRef(
  (
    {
      item,
      onItemClick,
    }: {
      item: ButtonGroupProps.IconButton;
      onItemClick?: CancelableEventHandler<ClickDetail>;
    },
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const hasIcon = item.iconName || item.iconUrl || item.iconSvg;

    if (!hasIcon) {
      warnOnce('ButtonGroup', `Missing icon for item with id: ${item.id}`);
    }

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
        className={clsx(styles.item, testUtilStyles['button-group-item'])}
      >
        {item.text}
      </InternalButton>
    );
  }
);

export default IconButtonItem;
