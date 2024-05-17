// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';

import { TilesProps } from './interfaces';
import RadioButton from '../radio-group/radio-button';
import styles from './styles.css.js';

import { fireNonCancelableEvent } from '../internal/events';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

interface TileProps {
  item: TilesProps.TilesDefinition;
  selected: boolean;
  name: string;
  onChange: TilesProps['onChange'];
}

export const Tile = React.forwardRef(
  ({ item, selected, name, onChange }: TileProps, forwardedRef: React.Ref<HTMLInputElement>) => {
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
          { [styles.refresh]: isVisualRefresh }
        )}
        data-value={item.value}
        onClick={() => {
          if (item.disabled) {
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
          />
        </div>
        {item.image && <div className={clsx(styles.image, { [styles.disabled]: !!item.disabled })}>{item.image}</div>}
      </div>
    );
  }
);
