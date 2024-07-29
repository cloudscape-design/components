// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useInternalI18n } from '../i18n/context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SplitPanelProps } from './interfaces';
import { SplitPanelInternal } from './internal';

export { SplitPanelProps };

export default function SplitPanel({
  hidePreferencesButton = false,
  closeBehavior = 'collapse',
  i18nStrings = {},
  ...restProps
}: SplitPanelProps) {
  const { __internalRootRef } = useBaseComponent('SplitPanel', {
    props: { closeBehavior, hidePreferencesButton },
  });
  const i18n = useInternalI18n('split-panel');
  return (
    <SplitPanelInternal
      {...restProps}
      ref={__internalRootRef}
      hidePreferencesButton={hidePreferencesButton}
      closeBehavior={closeBehavior}
      i18nStrings={{
        ...i18nStrings,
        closeButtonAriaLabel: i18n('i18nStrings.closeButtonAriaLabel', i18nStrings?.closeButtonAriaLabel),
        openButtonAriaLabel: i18n('i18nStrings.openButtonAriaLabel', i18nStrings?.openButtonAriaLabel),
        resizeHandleAriaLabel: i18n('i18nStrings.resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel),
        preferencesTitle: i18n('i18nStrings.preferencesTitle', i18nStrings?.preferencesTitle),
        preferencesConfirm: i18n('i18nStrings.preferencesConfirm', i18nStrings?.preferencesConfirm),
        preferencesCancel: i18n('i18nStrings.preferencesCancel', i18nStrings?.preferencesCancel),
        preferencesPositionLabel: i18n('i18nStrings.preferencesPositionLabel', i18nStrings?.preferencesPositionLabel),
        preferencesPositionDescription: i18n(
          'i18nStrings.preferencesPositionDescription',
          i18nStrings?.preferencesPositionDescription
        ),
        preferencesPositionBottom: i18n(
          'i18nStrings.preferencesPositionBottom',
          i18nStrings?.preferencesPositionBottom
        ),
        preferencesPositionSide: i18n('i18nStrings.preferencesPositionSide', i18nStrings?.preferencesPositionSide),
      }}
    />
  );
}

applyDisplayName(SplitPanel, 'SplitPanel');
