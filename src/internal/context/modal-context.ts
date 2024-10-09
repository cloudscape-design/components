// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, MutableRefObject, useContext } from 'react';

export interface ModalContextProps {
  isInModal: boolean;
  componentLoadingCount: MutableRefObject<number>;
  loadCompleteTime: MutableRefObject<number>;
}

export const ModalContext = createContext<ModalContextProps>({
  isInModal: false,
  componentLoadingCount: { current: 0 },
  loadCompleteTime: { current: 0 },
});

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  return modalContext;
};
