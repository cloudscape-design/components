// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useState } from 'react';
import clsx from 'clsx';

import { Instance } from '../table/generate-data';
import { checkMatches, columnDefinitions, dataAttributes, items } from './commons';

import styles from './styles.scss';

export default function Demo() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  return (
    <table
      className={clsx(styles['custom-table-table'])}
      onMouseOver={event => setCoordinates({ x: event.clientX, y: event.clientY })}
    >
      <thead>
        <tr>
          <th colSpan={columnDefinitions.length}>
            State management with memo, x: {coordinates.x}, y: {coordinates.y}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, rowIndex) => (
          <tr key={item.id}>
            {columnDefinitions.map((column, colIndex) => (
              <TableCell
                matches={checkMatches(coordinates, { rowIndex, colIndex })}
                key={column.key}
                column={column}
                item={item}
                {...dataAttributes}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TableCell = memo(
  ({
    matches,
    item,
    column,
    ...data
  }: {
    matches: boolean;
    item: Instance;
    column: { label: string; render: (item: Instance) => React.ReactNode };
  }) => (
    <td className={clsx(styles['custom-table-cell'])} style={{ background: matches ? 'yellow' : undefined }} {...data}>
      {column.render(item)}
    </td>
  )
);
