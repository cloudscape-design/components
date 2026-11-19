// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TopNavigation, { TopNavigationProps } from '../../../lib/components/top-navigation';

const I18N_STRINGS: TopNavigationProps.I18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Close',
};

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const renderTopNavigation = (props: PickPartial<TopNavigationProps, 'i18nStrings'>) => {
  const { container } = render(<TopNavigation i18nStrings={I18N_STRINGS} {...props} />);
  return createWrapper(container).findTopNavigation()!;
};
