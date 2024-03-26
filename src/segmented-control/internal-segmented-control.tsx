// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import handleKeyDown from '../internal/utils/handle-key-down';
import { KeyCode } from '../internal/keycode';
import { fireNonCancelableEvent } from '../internal/events';
import { SegmentedControlProps } from './interfaces';
import { Segment } from './segment';
import styles from './styles.css.js';

export default function InternalSegmentedControl({
  selectedId,
  options,
  label,
  ariaLabelledby,
  onChange,
}: SegmentedControlProps) {
  const segmentByIdRef = useRef<{ [id: string]: HTMLButtonElement }>({});
  const selectedOptions = (options || []).filter(option => {
    return option.id === selectedId;
  });
  const currentSelectedOption = selectedOptions.length ? selectedOptions[0] : null;
  const enabledSegments = (options || []).filter(option => !option.disabled);

  const moveHighlight = (event: React.KeyboardEvent<HTMLButtonElement>, activeIndex: number) => {
    if (event.keyCode !== KeyCode.right && event.keyCode !== KeyCode.left) {
      return;
    }

    let nextIndex = activeIndex;

    handleKeyDown({
      onInlineStart: () => (nextIndex = activeIndex === 0 ? enabledSegments.length - 1 : activeIndex - 1),
      onInlineEnd: () => (nextIndex = activeIndex + 1 === enabledSegments.length ? 0 : activeIndex + 1),
    })(event);

    const nextSegmentId = enabledSegments[nextIndex].id;
    segmentByIdRef.current[nextSegmentId]?.focus();
  };

  return (
    <div
      className={clsx(styles['segment-part'], styles[`segment-count-${options?.length}`])}
      aria-label={label}
      aria-labelledby={ariaLabelledby}
      role="toolbar"
    >
      {options &&
        options.map((option: SegmentedControlProps.Option, index) => {
          const isActive = selectedId === option.id;
          const enabledSegmentIndex = enabledSegments.indexOf(option);
          let tabIndex = isActive ? 0 : -1;
          if (currentSelectedOption === null && enabledSegmentIndex === 0) {
            tabIndex = 0;
          }
          return (
            <Segment
              key={index}
              id={option.id}
              disabled={!!option.disabled}
              iconName={option.iconName}
              iconAlt={option.iconAlt}
              iconUrl={option.iconUrl}
              iconSvg={option.iconSvg}
              text={option.text}
              isActive={isActive}
              tabIndex={tabIndex}
              ref={node => {
                if (node) {
                  segmentByIdRef.current[option.id] = node;
                } else {
                  delete segmentByIdRef.current[option.id];
                }
              }}
              onClick={() => {
                if (selectedId !== option.id) {
                  fireNonCancelableEvent(onChange, { selectedId: option.id });
                }
              }}
              onKeyDown={event => moveHighlight(event, enabledSegmentIndex)}
            />
          );
        })}
    </div>
  );
}
