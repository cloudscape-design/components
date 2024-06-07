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

const InternalKeyValuePair = ({ label, info, value }: KeyValuePairsProps.KeyValuePair) => (
  <div className={styles.item}>
    <dt className={styles.label}>
      <label className={styles['key-label']}>{label}</label>
      <InfoLinkLabelContext.Provider value={label}>
        {info && <span className={styles.info}>{info}</span>}
      </InfoLinkLabelContext.Provider>
    </dt>
    <dd className={styles.description}>{value}</dd>
  </div>
);

const InternalKeyValuePairs = React.forwardRef(
  ({ columns = 1, items, className, ...rest }: KeyValuePairsProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div {...rest} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
        <ColumnLayout tagOverride="dl" columns={Math.min(columns, 4)} variant="text-grid">
          {items.map((pair, pairIndex) => {
            if ('items' in pair) {
              return (
                <div className={styles.column} key={pairIndex}>
                  {pair.title && (
                    <Box variant="h3" padding="n">
                      {pair.title}
                    </Box>
                  )}
                  <dl className={styles.list}>
                    {pair.items.map((item, itemIndex) => (
                      <InternalKeyValuePair key={itemIndex} {...item} />
                    ))}
                  </dl>
                </div>
              );
            }

            return <InternalKeyValuePair key={pairIndex} {...pair} />;
          })}
        </ColumnLayout>
      </div>
    );
  }
);

export default InternalKeyValuePairs;
