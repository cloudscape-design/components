// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, memo, useContext, useState } from 'react';
import clsx from 'clsx';

import { Instance } from '../table/generate-data';
import { checkMatches, columnDefinitions, Coordinates, dataAttributes, items } from './commons';

import styles from './styles.scss';

const CoordinatesContext = createContext({
  coordinates: { x: 0, y: 0 },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCoordinates: (coordinates: Coordinates) => {},
});

function CoordinatesContextProvider({ children }: { children: React.ReactNode }) {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  return <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>{children}</CoordinatesContext.Provider>;
}

export default function Demo() {
  return (
    <CoordinatesContextProvider>
      <Table>
        <Thead />
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={item.id}>
              {columnDefinitions.map((column, colIndex) => (
                <TableCellContainer
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  key={column.key}
                  column={column}
                  item={item}
                  {...dataAttributes}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </CoordinatesContextProvider>
  );
}

const Table = ({ children }: { children: React.ReactNode }) => {
  const { setCoordinates } = useContext(CoordinatesContext);
  return (
    <table
      className={clsx(styles['custom-table-table'])}
      onMouseOver={event => setCoordinates({ x: event.clientX, y: event.clientY })}
    >
      {children}
    </table>
  );
};

const Thead = () => {
  const { coordinates } = useContext(CoordinatesContext);
  return (
    <thead>
      <tr>
        <th colSpan={columnDefinitions.length}>
          State management with context, x: {coordinates.x}, y: {coordinates.y}
        </th>
      </tr>
    </thead>
  );
};

const TableCellContainer = memo(
  ({
    colIndex,
    rowIndex,
    ...data
  }: {
    item?: Instance;
    column: { label: string; render: (item: Instance) => React.ReactNode };
    colIndex: number;
    rowIndex: number;
  }) => {
    const { coordinates } = useContext(CoordinatesContext);
    return <TableCell matches={checkMatches(coordinates, { rowIndex, colIndex })} {...data} />;
  }
);

const TableCell = memo(
  ({
    matches,
    item,
    column,
    ...data
  }: {
    matches: boolean;
    item?: Instance;
    column: { label: string; render: (item: Instance) => React.ReactNode };
  }) => (
    <td className={clsx(styles['custom-table-cell'])} style={{ background: matches ? 'yellow' : undefined }} {...data}>
      {item ? column.render(item) : column.label}
    </td>
  )
);
