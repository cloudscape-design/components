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
  <>
    <dt className={styles.label}>
      <label className={styles['key-label']}>{label}</label>
      <InfoLinkLabelContext.Provider value={label}>
        {info && <span className={styles.info}>{info}</span>}
      </InfoLinkLabelContext.Provider>
    </dt>
    <dd className={styles.description}>{value}</dd>
  </>
);

const InternalKeyValuePairGroup = ({ label, value }: { label?: React.ReactNode; value: React.ReactNode }) => (
  <>
    {label && <dt className={styles.groupTitle}>{label}</dt>}
    <dd className={styles.description}>{value}</dd>
  </>
);

const InternalKeyValuePairs = React.forwardRef(
  ({ columns = 1, items, className, ...rest }: KeyValuePairsProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div {...rest} className={clsx(styles['key-value-pairs'], className)} ref={ref}>
        {/*
          minColumnWidth={150} is set to use FlexibleColumnLayout which has only 1 nested div wrapper for column items,
          otherwise GridColumnLayout will be used which has 2 nested div, which is not a11y compatible for dl -> dt/dd relationship
        */}
        <ColumnLayout tagOverride="dl" columns={Math.min(columns, 4)} variant="text-grid" minColumnWidth={150}>
          {items.map((pair, index) => {
            if ('items' in pair) {
              return (
                /* InternalKeyValuePairGroup tells react to treat the dt-dd pair inside as an individual item.
                 * Otherwise, without this component, they will be rendered as a list, which ruins the html structure.
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
                    <dl className={styles.list}>
                      {pair.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
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
