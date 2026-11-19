// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { useModalContext } from '../../context/modal-context';

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
        modalContext.emitTimeToContentReadyInModal(performance.now());
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
      modalContext.emitTimeToContentReadyInModal(performance.now());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
