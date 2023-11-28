// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { PageHeaderProps } from './interfaces';
import InternalGrid from '../grid/internal';
import InternalContainer from '../container/internal';
import { getVisualContextClassname } from '../internal/components/visual-context';
import InternalBox from '../box/internal';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import styles from './styles.css.js';

type InternalPageHeaderProps = PageHeaderProps & InternalBaseComponentProps;

// Default grid definition when secondaryContent is present
const defaultGridDefinition = [{ colspan: { default: 12, m: 8 } }, { colspan: { default: 12, m: 4 } }];

const InternalPageHeader = ({
  children,
  variant,
  maxWidth,
  actions,
  colorMode,
  description,
  gridDefinition,
  metadata,
  secondaryContent,
  subHeading,
  tags,
  background,
  backgroundCss,
  withContainer,
  __internalRootRef,
  ...props
}: InternalPageHeaderProps) => {
  const baseProps = getBaseProps(props);
  const headerGridDefinition = gridDefinition ?? (secondaryContent ? defaultGridDefinition : [{ colspan: 12 }]);

  const mainHeaderContent = (
    <>
      <h1 className={clsx(styles.title, styles[`title-${variant}`])}>{children}</h1>
      {subHeading && <div className={clsx(styles.subheading, styles[`subheading-${variant}`])}>{subHeading}</div>}
      {description && <div className={clsx(styles.description)}>{description}</div>}
      {metadata && <div className={clsx(styles.metadata)}>{metadata}</div>}
      {tags && <div className={clsx(styles.tags)}>{tags}</div>}
      {actions && <div className={clsx(styles.actions)}>{actions}</div>}
    </>
  );

  const hasCustomBackground = background || backgroundCss;

  return (
    <div
      {...baseProps}
      ref={__internalRootRef}
      className={clsx(baseProps.className, styles.root, colorMode === 'dark' && styles.dark)}
    >
      {hasCustomBackground && (
        <div className={styles.background} style={backgroundCss ? { background: backgroundCss } : {}}>
          {background}
        </div>
      )}
      <div className={styles.wrapper} style={maxWidth ? { maxWidth } : {}}>
        <InternalGrid gridDefinition={headerGridDefinition}>
          <div
            className={clsx(
              styles['main-header'],
              colorMode === 'dark' && getVisualContextClassname('dark-page-header')
            )}
          >
            {withContainer ? (
              <InternalContainer>
                <InternalBox padding="s">{mainHeaderContent}</InternalBox>
              </InternalContainer>
            ) : (
              mainHeaderContent
            )}
          </div>

          {secondaryContent && <div className={clsx(styles.secondary)}>{secondaryContent}</div>}
        </InternalGrid>
      </div>
    </div>
  );
};

export default InternalPageHeader;
