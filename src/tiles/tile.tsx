// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import RadioButton from '../radio-group/radio-button';
import { TilesProps } from './interfaces';

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
  ({ item, selected, name, breakpoint, onChange, readOnly }: TileProps, forwardedRef: React.Ref<HTMLInputElement>) => {
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
      >
        <div className={clsx(styles.control, { [styles['no-image']]: !item.image })}>
          <RadioButton
            checked={selected}
            ref={mergedRef}
            name={name}
            value={item.value}
            label={item.label}
            description={item.description}
            disabled={item.disabled}
            controlId={item.controlId}
            readOnly={readOnly}
          />
        </div>
        {item.image && <div className={clsx(styles.image, { [styles.disabled]: !!item.disabled })}>{item.image}</div>}
      </div>
    );
  }
);
