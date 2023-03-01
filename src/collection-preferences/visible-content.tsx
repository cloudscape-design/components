// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import InternalSpaceBetween from '../space-between/internal';
import InternalToggle from '../toggle/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import DragHandle from '../internal/drag-handle';
import { useThrottledEventHandler } from '../internal/utils/use-throttled-event-handler';
import { Coordinates } from '../internal/utils/coordinates';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import clsx from 'clsx';
import { getSortedOptions } from './reorder-utils';
import { reorderOptions } from './reorder-utils';

const isVisible = (id: string, visibleIds: ReadonlyArray<string>) => visibleIds.indexOf(id) !== -1;

interface ClassNameProps {
  className: string;
}
const className = (suffix: string): ClassNameProps => ({
  className: styles[`visible-content-${suffix}`],
});

interface VisibleContentPreferenceProps extends CollectionPreferencesProps.VisibleContentPreference {
  reorderContent?: boolean;
  onChange: (value: ReadonlyArray<string>) => void;
  value?: ReadonlyArray<string>;
}

export default function VisibleContentPreference({
  title,
  options,
  value = [],
  onChange,
  reorderContent,
}: VisibleContentPreferenceProps) {
  const idPrefix = useUniqueId('visible-content');

  const flatOptionsIds = options.reduce<string[]>(
    (ids, group) => [...ids, ...group.options.reduce<string[]>((groupIds, option) => [...groupIds, option.id], [])],
    []
  );

  const onToggle = (id: string) => {
    if (!isVisible(id, value)) {
      onChange(
        [...value, id].sort((firstId, secondId) => flatOptionsIds.indexOf(firstId) - flatOptionsIds.indexOf(secondId))
      );
    } else {
      onChange(value.filter(currentId => currentId !== id));
    }
  };

  const outerGroupLabelId = `${idPrefix}-outer`;

  const [contentOrder, setContentOrder] = useState(flatOptionsIds);
  const optionRefs = useRef<Record<string, HTMLElement | null>>({});
  const verticalCenters = useRef<Record<string, number>>();
  const initialCursorPosition = useRef<Coordinates>();
  const draggedOptionId = useRef<string | null>(null);
  const [dragAmount, setDragAmount] = useState({ x: 0, y: 0 });
  const onPointerMove = useThrottledEventHandler((event: PointerEvent) => {
    if (initialCursorPosition.current && draggedOptionId.current && verticalCenters.current) {
      const coordinates = Coordinates.fromEvent(event);
      const dragY = coordinates.y - initialCursorPosition.current.y;
      const newOrder = reorderOptions({
        draggedOptionId: draggedOptionId.current,
        verticalCenters: verticalCenters.current,
        dragAmount: dragY,
      });
      setContentOrder(newOrder);
      setDragAmount({
        x: coordinates.x - initialCursorPosition.current.x,
        y: dragY,
      });
    }
  }, 10);

  const onPointerUp = useStableEventHandler(() => {
    onPointerMove.cancel();
    window.removeEventListener('pointermove', onPointerMove);
    setDragAmount({ x: 0, y: 0 });
  });

  const onPointerDown = (event: ReactPointerEvent) => {
    initialCursorPosition.current = Coordinates.fromEvent(event);
    const centers: Record<string, number> = {};
    for (const id of Object.keys(optionRefs.current)) {
      const rect = optionRefs.current[id]?.getBoundingClientRect();
      if (rect) {
        centers[id] = rect.top + rect.height / 2;
      }
    }
    verticalCenters.current = centers;
    console.log(verticalCenters.current);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointermove', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  return (
    <div className={styles['visible-content']}>
      <h3 {...className('title')} id={outerGroupLabelId}>
        {title}
      </h3>
      <InternalSpaceBetween {...className('groups')} size="xs">
        {options.map((optionGroup, optionGroupIndex) => {
          const groupLabelId = `${idPrefix}-${optionGroupIndex}`;
          return (
            <div
              key={optionGroupIndex}
              {...className('group')}
              role="group"
              aria-labelledby={`${outerGroupLabelId} ${groupLabelId}`}
            >
              <div {...className('group-label')} id={groupLabelId}>
                {optionGroup.label}
              </div>
              <div>
                {getSortedOptions({ options: optionGroup.options, order: contentOrder }).map((option, optionIndex) => {
                  const labelId = `${idPrefix}-${optionGroupIndex}-${option.id}`;
                  return (
                    <div
                      key={optionIndex}
                      className={clsx(className('option').className, reorderContent && styles.draggable)}
                      style={
                        draggedOptionId.current === option.id
                          ? {
                              transform: `translate(${dragAmount.x}px, ${dragAmount.y}px)`,
                            }
                          : undefined
                      }
                      ref={element => (optionRefs.current[option.id] = element)}
                    >
                      {reorderContent && (
                        <DragHandle
                          ariaLabelledBy={''}
                          ariaDescribedBy={''}
                          onPointerDown={event => {
                            draggedOptionId.current = option.id;
                            onPointerDown(event);
                          }}
                          onKeyDown={function (event: React.KeyboardEvent<Element>): void {
                            console.log(event);
                            throw new Error('Function not implemented.');
                          }}
                        />
                      )}
                      <label {...className('option-label')} htmlFor={labelId}>
                        {option.label}
                      </label>
                      <div {...className('toggle')}>
                        <InternalToggle
                          checked={isVisible(option.id, value)}
                          onChange={() => onToggle(option.id)}
                          disabled={option.editable === false}
                          controlId={labelId}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </InternalSpaceBetween>
    </div>
  );
}
