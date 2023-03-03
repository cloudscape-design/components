// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { PointerEvent as ReactPointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { areOrdersEqual, getFlatOptionIds, getSortedOptions } from './reorder-utils';
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
  onChange: (value: { itemOrder?: ReadonlyArray<string>; visibleItems: ReadonlyArray<string> }) => void;
  visibleItems?: ReadonlyArray<string>;
  itemOrder?: ReadonlyArray<string>;
}

export default function VisibleContentPreference({
  title,
  options,
  visibleItems = [],
  itemOrder = getFlatOptionIds(options),
  onChange,
  reorderContent,
}: VisibleContentPreferenceProps) {
  const idPrefix = useUniqueId('visible-content');

  const flatOptionsIds = getFlatOptionIds(options);

  const onToggle = (id: string) => {
    const order = reorderContent ? itemOrder : undefined;
    if (!isVisible(id, visibleItems)) {
      onChange({
        itemOrder: order,
        visibleItems: [...visibleItems, id].sort(
          (firstId, secondId) => flatOptionsIds.indexOf(firstId) - flatOptionsIds.indexOf(secondId)
        ),
      });
    } else {
      onChange({ itemOrder: order, visibleItems: visibleItems.filter(currentId => currentId !== id) });
    }
  };

  const outerGroupLabelId = `${idPrefix}-outer`;

  const optionRefs = useRef<Record<string, HTMLElement | null>>({});
  const verticalCenters = useRef<Record<string, number>>();
  const initialCursorPosition = useRef<Coordinates>();
  const initialDraggedOptionVerticalCenter = useRef<number>();
  const draggedOptionVerticalOffset = useRef(0);
  const draggedOptionId = useRef<string | null>(null);
  const [dragAmount, setDragAmount] = useState({ x: 0, y: 0 });
  const onPointerMove = useThrottledEventHandler((event: PointerEvent) => {
    if (initialCursorPosition.current && draggedOptionId.current && verticalCenters.current) {
      const coordinates = Coordinates.fromEvent(event);
      const dragX = coordinates.x - initialCursorPosition.current.x;
      const dragY = coordinates.y - initialCursorPosition.current.y;
      const newOrder = reorderOptions({
        draggedOptionId: draggedOptionId.current,
        verticalCenters: verticalCenters.current,
        dragAmount: dragY,
      });
      if (!areOrdersEqual(itemOrder, newOrder)) {
        onChange({ itemOrder: newOrder, visibleItems });
      }
      setDragAmount({
        x: dragX,
        y: dragY,
      });
    }
  }, 10);

  useLayoutEffect(() => {
    if (optionRefs.current && draggedOptionId.current && initialDraggedOptionVerticalCenter.current) {
      const newCenter = calculateCenter(draggedOptionId.current);
      if (newCenter) {
        const newCenterWithoutTransform = newCenter - (dragAmount.y - draggedOptionVerticalOffset.current);
        draggedOptionVerticalOffset.current = newCenterWithoutTransform - initialDraggedOptionVerticalCenter.current;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemOrder]);

  const calculatePositions = () => {
    const centers: Record<string, number> = {};
    for (const id of Object.keys(optionRefs.current)) {
      const center = calculateCenter(id);
      if (center) {
        centers[id] = center;
      }
    }
    verticalCenters.current = centers;
  };

  const calculateCenter = (id: string) => {
    const rect = optionRefs.current[id]?.getBoundingClientRect();
    if (rect) {
      return rect.top + rect.height / 2;
    }
  };

  const onPointerUp = useStableEventHandler(() => {
    onPointerMove.cancel();
    draggedOptionId.current = null;
    window.removeEventListener('pointermove', onPointerMove);
    setDragAmount({ x: 0, y: 0 });
  });

  const onPointerDown = (event: ReactPointerEvent) => {
    initialCursorPosition.current = Coordinates.fromEvent(event);
    draggedOptionVerticalOffset.current = 0;
    calculatePositions();
    if (draggedOptionId.current && verticalCenters.current) {
      initialDraggedOptionVerticalCenter.current = verticalCenters.current[draggedOptionId.current];
    }
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
                {getSortedOptions({ options: optionGroup.options, order: itemOrder }).map(option => {
                  const labelId = `${idPrefix}-${optionGroupIndex}-${option.id}`;
                  return (
                    <div
                      key={option.id}
                      className={clsx(
                        className('option').className,
                        draggedOptionId.current === option.id && className('option-dragged').className
                      )}
                    >
                      <div
                        className={clsx(
                          className('option-content').className,
                          reorderContent && styles.draggable,
                          draggedOptionId.current === option.id && styles.dragged
                        )}
                        style={
                          draggedOptionId.current === option.id
                            ? {
                                transform: `translate(${dragAmount.x + 2}px, ${
                                  dragAmount.y - draggedOptionVerticalOffset.current + 2
                                }px)`,
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
                            checked={isVisible(option.id, visibleItems)}
                            onChange={() => onToggle(option.id)}
                            disabled={option.editable === false}
                            controlId={labelId}
                          />
                        </div>
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
