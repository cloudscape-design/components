// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ItemCard, ItemCardProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

interface StyledItemCardProps extends ItemCardProps {
  rootStyled?: boolean;
  headerStyled?: boolean | 'background';
  footerStyled?: boolean | 'background';
  withContent?: boolean;
}

function StyledItemCard({ rootStyled, headerStyled, footerStyled, withContent = true, ...props }: StyledItemCardProps) {
  return (
    <ItemCard
      header="Card header"
      description="Card description"
      footer="Card footer"
      {...props}
      {...{
        styleClassNames: {
          root: rootStyled ? styles.root : undefined,
          header:
            headerStyled === 'background' ? styles['header-background'] : headerStyled ? styles.header : undefined,
          footer:
            footerStyled === 'background' ? styles['footer-background'] : footerStyled ? styles.footer : undefined,
        },
      }}
    >
      {withContent ? 'Card content' : null}
    </ItemCard>
  );
}

export default function () {
  return (
    <SimplePage title="Item card - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <div className={styles.cell}>
          <StyledItemCard rootStyled={true} headerStyled={true} footerStyled={true} variant="default" />
        </div>
        <div className={styles.cell}>
          <StyledItemCard rootStyled={true} headerStyled={true} footerStyled={true} variant="embedded" />
        </div>
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <div className={styles.cell}>
          <StyledItemCard rootStyled={true} />
        </div>
        <div className={styles.cell}>
          <StyledItemCard headerStyled={true} />
        </div>
        <div className={styles.cell}>
          <StyledItemCard footerStyled={true} />
        </div>
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <div className={styles.cell}>
          <StyledItemCard headerStyled="background" withContent={false} footer={undefined} />
        </div>
        <div className={styles.cell}>
          <StyledItemCard footerStyled="background" withContent={false} header={undefined} description={undefined} />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
