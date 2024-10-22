// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { InternalButtonProps } from '../../button/internal';

export interface ButtonContextProps {
  onClick?: ({ variant }: { variant: InternalButtonProps['variant'] }) => void;
  onLoadingChange?: ({
    variant,
    value,
  }: {
    variant: InternalButtonProps['variant'];
    value: InternalButtonProps['loading'];
  }) => void;
}

export const ButtonContext = createContext<ButtonContextProps | null>(null);

export function useButtonContext() {
  return useContext(ButtonContext);
}
