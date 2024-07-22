// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import Box from '../box/internal';
import ColumnLayout from '../column-layout/internal';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { KeyValuePairsProps } from './interfaces';

import styles from './styles.css.js';

const InternalKeyValuePair = ({ label, info, value, id }: KeyValuePairsProps.Pair) => {
  const kvPairId = useUniqueId('kv-pair-');

  return (
    <>
      <dt className={styles.term}>
        <label className={styles['key-label']} id={id || kvPairId}>
          {label}
        </label>
        <InfoLinkLabelContext.Provider value={id || kvPairId}>
          {info && <span className={styles.info}>{info}</span>}
        </InfoLinkLabelContext.Provider>
      </dt>
      <dd className={styles.detail}>{value}</dd>
    </>
  );
};

const InternalKeyValuePairGroup = ({ label, value }: { label?: React.ReactNode; value: React.ReactNode }) => (
  <>
    {label && <dt className={styles['group-title']}>{label}</dt>}
    <dd className={styles.detail}>{value}</dd>
  </>
);

const InternalKeyValuePairs = React.forwardRef(
  (
    {
      columns,
      items,
      className,
      ariaLabel,
      ariaLabelledby,
      ...rest
    }: KeyValuePairsProps & Required<Pick<KeyValuePairsProps, 'columns'>>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <div
          {...rest}
          className={clsx(styles['key-value-pairs'], className)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          ref={ref}
        >
          {/*
          minColumnWidth={150} is set to use FlexibleColumnLayout which has only 1 nested div wrapper for column items,
          otherwise GridColumnLayout will be used, which has 2 nested div, therefore it is not a11y compatible for dl -> dt/dd relationship
        */}
          <ColumnLayout __tagOverride="dl" columns={Math.min(columns, 4)} variant="text-grid" minColumnWidth={150}>
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
      </LinkDefaultVariantContext.Provider>
    );
  }
);

export default InternalKeyValuePairs;
