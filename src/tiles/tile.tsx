// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';

import { TilesProps } from './interfaces';
import RadioButton from '../radio-group/radio-button';
import styles from './styles.css.js';

import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { fireNonCancelableEvent } from '../internal/events';

interface TileProps {
  item: TilesProps.TilesDefinition;
  selected: boolean;
  name: string;
  breakpoint: ReturnType<typeof useContainerBreakpoints>[0];
  onChange: TilesProps['onChange'];
}

export function Tile({ item, selected, name, breakpoint, onChange }: TileProps) {
  const radioButtonRef = useRef<HTMLInputElement>(null);
  const controlId = item.controlId || `${name}-value-${item.value}`;

  return (
    <div
      className={clsx(
        styles['tile-container'],
        { [styles['has-metadata']]: item.description || item.image },
        { [styles.selected]: selected },
        { [styles.disabled]: !!item.disabled },
        styles[`breakpoint-${breakpoint}`]
      )}
      data-value={item.value}
      onClick={() => {
        if (item.disabled) {
          return;
        }
        radioButtonRef.current?.focus();
        if (!selected) {
          fireNonCancelableEvent(onChange, { value: item.value });
        }
      }}
    >
      <div className={clsx(styles.control, { [styles['no-image']]: !item.image })}>
        <RadioButton
          checked={selected}
          ref={radioButtonRef}
          name={name}
          value={item.value}
          label={item.label}
          description={item.description}
          disabled={item.disabled}
          controlId={controlId}
        />
      </div>
      {item.image && <div className={clsx(styles.image, { [styles.disabled]: !!item.disabled })}>{item.image}</div>}
    </div>
  );
}
