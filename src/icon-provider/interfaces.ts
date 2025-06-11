// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import generatedIcons from '../icon/generated/icons';
import { BaseComponentProps } from '../internal/base-component';

export interface IconProviderProps extends BaseComponentProps {
  children: ReactNode;
  icons: IconProviderProps.Icons | null;
}

export namespace IconProviderProps {
  export type Icons = Partial<{
    [name in keyof typeof generatedIcons]: JSX.Element;
  }>;
}
