// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { TilesProps } from './interfaces';
import styles from './styles.css.js';

import { useFormFieldContext } from '../internal/context/form-field-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { Tile } from './tile';
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group';

const COLUMN_TRIGGERS: TilesProps.Breakpoint[] = ['default', 'xxs', 'xs'];

type InternalTilesProps = TilesProps & InternalBaseComponentProps;

const InternalTiles = React.forwardRef(
  (
    {
      name,
      value,
      items,
      ariaLabel,
      ariaRequired,
      ariaControls,
      columns,
      onChange,
      __internalRootRef = null,
      ...rest
    }: InternalTilesProps,
    ref: React.Ref<TilesProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(rest);
    const generatedName = useUniqueId('awsui-tiles-');

    const [tileRef, tileRefIndex] = useRadioGroupForwardFocus(ref, items, value);
    const [breakpoint, breakpointRef] = useContainerBreakpoints(COLUMN_TRIGGERS);
    const mergedRef = useMergeRefs(breakpointRef, __internalRootRef);

    const columnCount = getColumnCount(items, columns);

    return (
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-required={ariaRequired}
        aria-controls={ariaControls}
        {...baseProps}
        className={clsx(baseProps.className, styles.root)}
        ref={mergedRef}
      >
        <div className={clsx(styles.columns, styles[`column-${columnCount}`])}>
          {items &&
            items.map((item, index) => (
              <Tile
                ref={index === tileRefIndex ? tileRef : undefined}
                key={item.value}
                item={item}
                selected={item.value === value}
                name={name || generatedName}
                breakpoint={breakpoint}
                onChange={onChange}
              />
            ))}
        </div>
      </div>
    );
  }
);

function getColumnCount(
  items: ReadonlyArray<TilesProps.TilesDefinition> | undefined,
  columns: number | undefined
): number {
  if (columns) {
    return columns;
  }

  const nItems = items ? items.length : 0;
  const columnsLookup: Record<number, number> = {
    0: 1,
    1: 1,
    2: 2,
    4: 2,
    8: 2,
  };
  return columnsLookup[nItems] || 3;
}

export default InternalTiles;
