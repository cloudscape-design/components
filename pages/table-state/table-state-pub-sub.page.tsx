// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { checkMatches, columnDefinitions, Coordinates, dataAttributes, items } from './commons';

import styles from './styles.scss';

interface Listener<T> {
  selector: (state: State) => T;
  cb: (state: T) => void;
}

interface State {
  color: string;
  coordinates: Coordinates;
}

class CoordinatesStore {
  private state: State;
  private listeners: Listener<any>[] = [];

  constructor(color: string) {
    this.state = { color, coordinates: { x: 0, y: 0 } };
  }

  get = () => {
    return this.state;
  };

  set = (cb: (prev: State) => State) => {
    const prev = this.state;
    this.state = cb(prev);
    this.listeners.forEach(listener => {
      const prevSelected = listener.selector(prev);
      const nextSelected = listener.selector(this.state);
      if (nextSelected !== prevSelected) {
        listener.cb(nextSelected);
      }
    });
  };

  subscribe<T>(listener: Listener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(stored => stored !== listener);
    };
  }
}

const colors = ['yellow', 'red', 'green', 'purple', 'blue', 'orange', 'pink'];

export default function Demo() {
  const coordinatesStore = useMemo(() => new CoordinatesStore(colors[0]), []);

  // useEffect(() => {
  //   setInterval(() => {
  //     const index = Math.floor(Math.random() * colors.length);
  //     coordinatesStore.set(prev => ({ ...prev, color: colors[index] }));
  //   }, 1000);
  // }, [coordinatesStore]);

  return (
    <table
      className={clsx(styles['custom-table-table'])}
      onMouseOver={event =>
        coordinatesStore.set(prev => ({ ...prev, coordinates: { x: event.clientX, y: event.clientY } }))
      }
    >
      <Thead coordinatesStore={coordinatesStore} />
      <tbody>
        {items.map((item, rowIndex) => (
          <tr key={item.id}>
            {columnDefinitions.map((column, colIndex) => (
              <TableCell
                key={column.key}
                rowIndex={rowIndex}
                colIndex={colIndex}
                coordinatesStore={coordinatesStore}
                {...dataAttributes}
              >
                {column.render(item)}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Thead = ({ coordinatesStore }: { coordinatesStore: CoordinatesStore }) => {
  const [state, setState] = useState(() => coordinatesStore.get());
  useEffect(() => coordinatesStore.subscribe({ selector: s => s, cb: setState }), [coordinatesStore]);
  return (
    <thead>
      <tr>
        <th colSpan={columnDefinitions.length}>
          State management with pub/sub store, x: {state.coordinates.x}, y: {state.coordinates.y}, color: {state.color}
        </th>
      </tr>
    </thead>
  );
};

const TableCell = ({
  colIndex,
  rowIndex,
  children,
  coordinatesStore,
  ...data
}: {
  colIndex: number;
  rowIndex: number;
  children: React.ReactNode;
  coordinatesStore: CoordinatesStore;
}) => {
  const [color, setColor] = useState(() => colorSelector(coordinatesStore.get(), { rowIndex, colIndex }));
  useEffect(
    () =>
      coordinatesStore.subscribe({
        selector: cs => colorSelector(cs, { rowIndex, colIndex }),
        cb: setColor,
      }),
    [colIndex, rowIndex, coordinatesStore]
  );
  return (
    <td className={clsx(styles['custom-table-cell'])} style={{ background: color ?? undefined }} {...data}>
      {children}
    </td>
  );
};

function colorSelector(state: State, indices: { rowIndex: number; colIndex: number }): string | null {
  return checkMatches(state.coordinates, indices) ? state.color : null;
}
