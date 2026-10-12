// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Box from '../box/internal';
import ColumnLayout from '../column-layout/internal';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { KeyValuePairsProps } from './interfaces';

import styles from './styles.css.js';

/**
 * Upper bound on `columns`. The underlying ColumnLayout is built around twelve units, so this
 * matches its own maximum rather than introducing a separate limit.
 */
const MAX_COLUMNS = 12;

const InternalKeyValuePair = ({ label, info, value, id }: KeyValuePairsProps.Pair) => {
  const kvPairId = useUniqueId('kv-pair-');

  return (
    <>
      <dt className={styles.term}>
        <div className={styles['key-label']} id={id || kvPairId}>
          {label}
        </div>
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
      minColumnWidth,
      ...rest
    }: KeyValuePairsProps & Required<Pick<KeyValuePairsProps, 'columns'>>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // Mirrors the limit ColumnLayout imposes, so the warning names this component rather than the
    // one it delegates to. Clamping here also means ColumnLayout never sees an out-of-range value
    // and so cannot warn a second time about the same prop.
    if (columns > MAX_COLUMNS) {
      warnOnce(
        'Key-value pairs',
        `\`columns\` (${columns}) exceeds the maximum of ${MAX_COLUMNS}. Rendering ${MAX_COLUMNS} columns instead.`
      );
    }

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
          A minColumnWidth is always passed (KeyValuePairs defaults it to 150) so that ColumnLayout
          picks FlexibleColumnLayout, which wraps each column item in a single div. GridColumnLayout
          wraps in two, which breaks the dl -> dt/dd relationship a11y relies on.
        */}
          <ColumnLayout
            __tagOverride="dl"
            columns={Math.min(columns, MAX_COLUMNS)}
            variant="text-grid"
            minColumnWidth={minColumnWidth}
          >
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
