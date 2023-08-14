// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';
import { LinkProps } from '../../link/interfaces';

export const LinkDefaultVariantContext = createContext<{ defaultVariant: LinkProps.Variant }>({
  defaultVariant: 'secondary',
});
