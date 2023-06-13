// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, createContext } from 'react';

import { InternalButtonProps } from '../../button/internal';

export interface ButtonContextProps {
  onClick: ({ variant }: { variant: InternalButtonProps['variant'] }) => void;
}

export const ButtonContext = createContext<ButtonContextProps>({
  onClick: () => {},
});

export function useButtonContext() {
  return useContext(ButtonContext);
}
