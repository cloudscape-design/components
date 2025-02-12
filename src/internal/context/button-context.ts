// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

import { InternalButtonProps } from '../../button/internal';

export interface ButtonContextProps {
  onClick: ({ variant, formAction }: Pick<InternalButtonProps, 'variant' | 'formAction'>) => void;
}

export const ButtonContext = createContext<ButtonContextProps>({
  onClick: () => {},
});

export function useButtonContext() {
  return useContext(ButtonContext);
}
