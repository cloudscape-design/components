// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export const ModalContext = createContext<{ isInModal: boolean }>({ isInModal: false });

export const useModalContext = () => {
  const modalContext = useContext(ModalContext);
  return modalContext;
};
