// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, MutableRefObject, useContext } from 'react';

export interface ModalContextProps {
  isInModal: boolean;
  componentLoadingCount: MutableRefObject<number>;
  emitTimeToContentReadyInModal: (loadCompleteTime: number) => void;
}

export const ModalContext = createContext<ModalContextProps>({
  isInModal: false,
  componentLoadingCount: { current: 0 },
  emitTimeToContentReadyInModal: () => {},
});

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  return modalContext;
};
