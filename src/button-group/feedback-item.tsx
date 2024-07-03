// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import InternalIcon from '../icon/internal.js';
import clsx from 'clsx';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context.js';
import { ButtonGroupProps } from './interfaces.js';
import styles from './styles.css.js';

const FeedbackItem = ({ item }: { item: ButtonGroupProps.Feedback }) => {
  const feedbackRef = useRef<HTMLSpanElement>(null);
  const hasIcon = item.iconName || item.iconUrl || item.iconSvg;
  const [focused, setFocused] = useState(false);
  const { tabIndex } = useSingleTabStopNavigation(feedbackRef, { tabIndex: focused ? -1 : 0 });
  return (
    <span
      ref={feedbackRef}
      data-testid={item.id}
      tabIndex={tabIndex}
      className={clsx(styles.item, styles.feedback)}
      onFocus={() => setFocused(true)}
    >
      {hasIcon && <InternalIcon name={item.iconName} alt={item.iconAlt} svg={item.iconSvg} url={item.iconUrl} />}
      <span>{item.text}</span>
    </span>
  );
};

export default FeedbackItem;
