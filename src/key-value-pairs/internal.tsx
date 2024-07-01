// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { KeyValuePairsProps } from './interfaces';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import ColumnLayout from '../column-layout/internal';
import Box from '../box/internal';

const InternalKeyValuePair = ({ label, info, value }: KeyValuePairsProps.Pair) => (
  <>
    <dt className={styles.term}>
      <label className={styles['key-label']}>{label}</label>
      <InfoLinkLabelContext.Provider value={label}>
        {info && <span className={styles.info}>{info}</span>}
      </InfoLinkLabelContext.Provider>
    </dt>
    <dd className={styles.detail}>{value}</dd>
  </>
);

const InternalKeyValuePairGroup = ({ label, value }: { label?: React.ReactNode; value: React.ReactNode }) => (
  <>
    {label && <dt className={styles['group-title']}>{label}</dt>}
    <dd className={styles.detail}>{value}</dd>
  </>
);

const InternalKeyValuePairs = React.forwardRef(
  (
    { columns, items, className, ...rest }: KeyValuePairsProps & Required<Pick<KeyValuePairsProps, 'columns'>>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div {...rest} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
        {/*
          minColumnWidth={150} is set to use FlexibleColumnLayout which has only 1 nested div wrapper for column items,
          otherwise GridColumnLayout will be used, which has 2 nested div, therefore it is not a11y compatible for dl -> dt/dd relationship
        */}
        <ColumnLayout tagOverride="dl" columns={Math.min(columns, 4)} variant="text-grid" minColumnWidth={150}>
          {items.map((pair, index) => {
            if (pair.type === 'group') {
              return (
                /* InternalKeyValuePairGroup tells react to treat the dt-dd pair as an individual layout item.
                 * Otherwise, without this component, they will be rendered as a list, which ruins the html structure.
                 * InternalKeyValuePairGroup is not wrapped by div tag, because it ruins a11y compatibility for dl -> dt/dd
                 *  */
                <InternalKeyValuePairGroup
                  key={index}
                  label={
                    pair.title && (
                      <Box variant="h3" padding="n">
                        {pair.title}
                      </Box>
                    )
                  }
                  value={
                    <dl className={styles['group-list']}>
                      {pair.items.map((item, itemIndex) => (
                        <div key={itemIndex} className={styles['group-list-item']}>
                          <InternalKeyValuePair {...item} />
                        </div>
                      ))}
                    </dl>
                  }
                />
              );
            }

            return <InternalKeyValuePair key={index} {...pair} />;
          })}
        </ColumnLayout>
      </div>
    );
  }
);

export default InternalKeyValuePairs;
