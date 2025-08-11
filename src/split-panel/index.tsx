// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { useInternalI18n } from '../i18n/context.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { SplitPanelProps } from './interfaces.js';
import { SplitPanelInternal } from './internal.js';

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
  const i18nModal = useInternalI18n('modal');

  return (
    <SplitPanelInternal
      {...restProps}
      __internalRootRef={__internalRootRef}
      hidePreferencesButton={hidePreferencesButton}
      closeBehavior={closeBehavior}
      i18nStrings={{
        ...i18nStrings,
        closeButtonAriaLabel: i18n('i18nStrings.closeButtonAriaLabel', i18nStrings?.closeButtonAriaLabel),
        openButtonAriaLabel: i18n('i18nStrings.openButtonAriaLabel', i18nStrings?.openButtonAriaLabel),
        resizeHandleAriaLabel: i18n('i18nStrings.resizeHandleAriaLabel', i18nStrings?.resizeHandleAriaLabel),
        resizeHandleTooltipText: i18n('i18nStrings.resizeHandleTooltipText', i18nStrings?.resizeHandleTooltipText),
        preferencesTitle: i18n('i18nStrings.preferencesTitle', i18nStrings?.preferencesTitle),
        preferencesConfirm: i18n('i18nStrings.preferencesConfirm', i18nStrings?.preferencesConfirm),
        preferencesCancel: i18n('i18nStrings.preferencesCancel', i18nStrings?.preferencesCancel),
        preferencesCloseAriaLabel:
          i18nModal('closeAriaLabel', i18nStrings?.preferencesCloseAriaLabel) || i18nStrings?.preferencesCancel,
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
