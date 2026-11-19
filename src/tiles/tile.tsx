// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import RadioButton from '../internal/components/radio-button';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { TilesProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

interface TileProps {
  item: TilesProps.TilesDefinition;
  selected: boolean;
  name: string;
  breakpoint: ReturnType<typeof useContainerBreakpoints>[0];
  onChange: TilesProps['onChange'];
  readOnly?: boolean;
}

export const Tile = React.forwardRef(
  (
    { item, selected, name, breakpoint, onChange, readOnly, ...rest }: TileProps,
    forwardedRef: React.Ref<HTMLInputElement>
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const isVisualRefresh = useVisualRefresh();

    const mergedRef = useMergeRefs(internalRef, forwardedRef);

    return (
      <div
        className={clsx(
          styles['tile-container'],
          { [styles['has-metadata']]: item.description || item.image },
          { [styles.selected]: selected },
          { [styles.disabled]: !!item.disabled },
          { [styles.readonly]: readOnly },
          { [styles.refresh]: isVisualRefresh },
          styles[`breakpoint-${breakpoint}`]
        )}
        data-value={item.value}
        onClick={() => {
          if (item.disabled || readOnly) {
            return;
          }
          internalRef.current?.focus();
          if (!selected) {
            fireNonCancelableEvent(onChange, { value: item.value });
          }
        }}
        {...copyAnalyticsMetadataAttribute(rest)}
      >
        <div className={clsx(styles.control, { [styles['no-image']]: !item.image })}>
          <RadioButton
            checked={selected}
            ref={mergedRef}
            name={name}
            value={item.value}
            description={item.description}
            disabled={item.disabled}
            controlId={item.controlId}
            readOnly={readOnly}
            className={clsx(analyticsSelectors['radio-button'], selected && analyticsSelectors.selected)}
          >
            {item.label}
          </RadioButton>
        </div>
        {item.image && <div className={clsx(styles.image, { [styles.disabled]: !!item.disabled })}>{item.image}</div>}
      </div>
    );
  }
);
