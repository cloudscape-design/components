// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import InternalSpaceBetween from '../space-between/internal';
import InternalToggle from '../toggle/internal';
import { CollectionPreferencesProps } from './interfaces';

import styles from './styles.css.js';

const isVisible = (id: string, visibleIds: ReadonlyArray<string>) => visibleIds.indexOf(id) !== -1;

interface ClassNameProps {
  className: string;
}
const className = (suffix: string): ClassNameProps => ({
  className: styles[`visible-content-${suffix}`],
});

interface VisibleContentPreferenceProps extends CollectionPreferencesProps.VisibleContentPreference {
  onChange: (value: ReadonlyArray<string>) => void;
  value?: ReadonlyArray<string>;
}

export default function VisibleContentPreference({
  title,
  options,
  value = [],
  onChange,
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

  const selectionOption = (
    option: CollectionPreferencesProps.VisibleContentOption,
    optionGroupIndex: number,
    optionIndex: number
  ) => {
    const labelId = `${idPrefix}-${optionGroupIndex}-${optionIndex}`;
    return (
      <div key={optionIndex} {...className('option')}>
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
  };

  const outerGroupLabelId = `${idPrefix}-outer`;
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
                {optionGroup.options.map((option, optionIndex) =>
                  selectionOption(option, optionGroupIndex, optionIndex)
                )}
              </div>
            </div>
          );
        })}
      </InternalSpaceBetween>
    </div>
  );
}
