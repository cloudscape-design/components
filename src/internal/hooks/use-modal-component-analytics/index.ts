// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { ModalContextProps, useModalContext } from '../../context/modal-context';

export const useModalContextLoadingButtonComponent = (isPrimaryButton: boolean, loading: boolean) => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!isPrimaryButton || !modalContext.isInModal) {
      return;
    }
    if (loading) {
      modalContext.componentLoadingCount.current++;
      return () => {
        modalContext.componentLoadingCount.current--;
        setModalLoadCompleteTime(modalContext);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
};

export const useModalContextLoadingComponent = () => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!modalContext.isInModal) {
      return;
    }
    modalContext.componentLoadingCount.current++;
    return () => {
      modalContext.componentLoadingCount.current--;
      setModalLoadCompleteTime(modalContext);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const setModalLoadCompleteTime = (modalContext: ModalContextProps) => {
  const { componentLoadingCount, loadCompleteTime } = modalContext;
  if (componentLoadingCount.current === 0 && loadCompleteTime.current === 0) {
    loadCompleteTime.current = performance.now();
  }
};
