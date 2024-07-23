// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { TilesProps } from './interfaces';
import { Tile } from './tile';

import styles from './styles.css.js';

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
      readOnly,
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
        aria-readonly={readOnly ? 'true' : undefined}
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
                readOnly={readOnly}
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
