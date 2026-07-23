// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import ContentDisplayPreferenceCore from '../collection-preferences/content-display';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ContentDisplayPreferenceProps } from './interfaces';

import styles from './styles.css.js';

type InternalContentDisplayPreferenceProps = ContentDisplayPreferenceProps & InternalBaseComponentProps;

export default function InternalContentDisplayPreference({
  options,
  groups,
  value,
  title,
  description,
  enableColumnFiltering,
  i18nStrings,
  liveAnnouncementDndStarted,
  liveAnnouncementDndItemReordered,
  liveAnnouncementDndItemCommitted,
  liveAnnouncementDndDiscarded,
  liveAnnouncementDndGroupLabel,
  dragHandleAriaLabel,
  dragHandleAriaDescription,
  onChange,
  __internalRootRef,
  ...rest
}: InternalContentDisplayPreferenceProps) {
  const baseProps = getBaseProps(rest);
  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <ContentDisplayPreferenceCore
        options={options}
        groups={groups}
        value={value}
        title={title}
        description={description}
        enableColumnFiltering={enableColumnFiltering}
        i18nStrings={i18nStrings}
        liveAnnouncementDndStarted={liveAnnouncementDndStarted}
        liveAnnouncementDndItemReordered={liveAnnouncementDndItemReordered}
        liveAnnouncementDndItemCommitted={liveAnnouncementDndItemCommitted}
        liveAnnouncementDndDiscarded={liveAnnouncementDndDiscarded}
        liveAnnouncementDndGroupLabel={liveAnnouncementDndGroupLabel}
        dragHandleAriaLabel={dragHandleAriaLabel}
        dragHandleAriaDescription={dragHandleAriaDescription}
        onChange={newValue => fireNonCancelableEvent(onChange, { value: newValue })}
      />
    </div>
  );
}
