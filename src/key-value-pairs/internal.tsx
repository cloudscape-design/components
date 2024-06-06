// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { KeyValuePairsProps } from './interfaces';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import ColumnLayout from '../column-layout/internal';
import Box from '../box/internal';

export { KeyValuePairsProps };

const InternalKeyValuePair = (props: KeyValuePairsProps.KeyValuePair) => (
  <div className={styles.item}>
    <dt className={styles.label}>
      <label className={styles['key-label']}>{props.label}</label>
      <InfoLinkLabelContext.Provider value={props.label}>
        {props.info && <span className={styles.info}>{props.info}</span>}
      </InfoLinkLabelContext.Provider>
    </dt>
    <dd className={styles.description}>{props.value}</dd>
  </div>
);

const InternalKeyValuePairs = React.forwardRef((props: KeyValuePairsProps, ref: React.Ref<HTMLDivElement>) => {
  const { layout, className } = props;
  if (layout === 'columns') {
    const { columns } = props;

    return (
      <div id={props.id} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
        <ColumnLayout columns={Math.min(columns.length, 4)} variant="text-grid">
          {columns.map((column, columnIndex) => (
            <div className={styles.column} key={columnIndex}>
              {column.title && (
                <Box variant="h3" padding="n">
                  {column.title}
                </Box>
              )}
              <dl className={styles.list}>
                {column.items.map((item, itemIndex) => (
                  <InternalKeyValuePair key={itemIndex} {...item} />
                ))}
              </dl>
            </div>
          ))}
        </ColumnLayout>
      </div>
    );
  }

  const { columnsNumber, pairs } = props;

  return (
    <div id={props.id} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
      <ColumnLayout columns={columnsNumber} variant="text-grid">
        {pairs.map((item, index) => (
          <InternalKeyValuePair key={index} {...item} />
        ))}
      </ColumnLayout>
    </div>
  );
});

export default InternalKeyValuePairs;
