// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, MutableRefObject, RefObject, useContext } from 'react';

export interface ModalContextProps {
  isInModal: boolean;
  loadStartTime: RefObject<number>;
  componentLoadingCount: MutableRefObject<number>;
  performanceMetricLogged: MutableRefObject<boolean>;
  instanceIdentifier?: string;
  componentIdentifier?: string;
}

export const ModalContext = createContext<ModalContextProps>({
  isInModal: false,
  componentLoadingCount: { current: 0 },
  loadStartTime: { current: 0 },
  performanceMetricLogged: { current: false },
});

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  return modalContext;
};
