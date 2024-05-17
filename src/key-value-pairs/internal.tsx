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

const InternalKeyValuePairs = React.forwardRef(
  ({ columns, className, ...rest }: KeyValuePairsProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div {...rest} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
        {!!columns?.length && (
          <ColumnLayout columns={columns.length} variant="text-grid">
            {columns.map((column, columnIndex) => (
              <div className={styles.column} key={columnIndex}>
                {column.title && (
                  <Box variant="h3" padding="n">
                    {column.title}
                  </Box>
                )}
                <dl className={styles.list}>
                  {column.items.map((item, itemIndex) => (
                    <div key={columnIndex + itemIndex}>
                      <dt className={styles.key}>
                        <label className={styles['key-label']}>{item.key}</label>
                        <InfoLinkLabelContext.Provider value={item.key}>
                          {item.info && <span className={styles.info}>{item.info}</span>}
                        </InfoLinkLabelContext.Provider>
                      </dt>
                      <dd className={styles.description}>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </ColumnLayout>
        )}
      </div>
    );
  }
);

export default InternalKeyValuePairs;