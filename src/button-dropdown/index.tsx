// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ButtonDropdownProps } from './interfaces';
import InternalButtonDropdown from './internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import styles from './styles.css.js';
import { getAnalyticsMetadataAttribute } from '../internal/analytics/autocapture/utils';

export { ButtonDropdownProps };

const ButtonDropdown = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      expandableGroups = false,
      expandToViewport = false,
      ariaLabel,
      children,
      onItemClick,
      onItemFollow,
      mainAction,
      ...props
    }: ButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ButtonDropdown', {
      props: { expandToViewport, expandableGroups, variant },
    });
    const baseProps = getBaseProps(props);
    return (
      <InternalButtonDropdown
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        items={items}
        variant={variant}
        loading={loading}
        loadingText={loadingText}
        disabled={disabled}
        expandableGroups={expandableGroups}
        expandToViewport={expandToViewport}
        ariaLabel={ariaLabel}
        onItemClick={onItemClick}
        onItemFollow={onItemFollow}
        mainAction={mainAction}
        {...getAnalyticsMetadataAttribute({
          component: {
            name: 'ButtonDropdown',
            label: `.${styles['trigger-label']}`,
            properties: { variant },
          },
        })}
      >
        {children}
      </InternalButtonDropdown>
    );
  }
);

applyDisplayName(ButtonDropdown, 'ButtonDropdown');
export default ButtonDropdown;
