// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import { PerformanceMetrics } from '../../analytics';
import { ModalContextProps, useModalContext } from '../../context/modal-context';
import { useEffectOnUpdate } from '../use-effect-on-update';

/**
 *
 */
export const usePrimaryButtonModalComponentAnalytics = (
  isPrimaryButton: boolean,
  elementRef: React.RefObject<HTMLElement>,
  dependencies: React.DependencyList
) => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!isPrimaryButton || !elementRef.current || !modalContext.isInModal) {
      return;
    }
    modalContext.componentLoadingCount.current++;
    if (!isElementVisible(elementRef.current)) {
      return;
    }

    modalContext.componentLoadingCount.current--;
    emitModalContentReadyMetric(modalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isElementVisible = (htmlElement: HTMLElement) => {
    if (!htmlElement) {
      return true;
    }
    return (
      htmlElement.offsetWidth > 0 &&
      htmlElement.offsetHeight > 0 &&
      getComputedStyle(htmlElement).visibility !== 'hidden'
    );
  };

  useEffectOnUpdate(() => {
    if (!isPrimaryButton || !elementRef.current || !modalContext.isInModal) {
      return;
    }
    const elementVisible =
      elementRef.current.offsetWidth > 0 &&
      elementRef.current.offsetHeight > 0 &&
      getComputedStyle(elementRef.current).visibility !== 'hidden';

    if (!elementVisible) {
      return;
    }

    modalContext.componentLoadingCount.current--;
    emitModalContentReadyMetric(modalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const useModalComponentAnalytics = () => {
  const modalContext = useModalContext();
  useEffect(() => {
    if (!modalContext.isInModal) {
      return;
    }
    modalContext.componentLoadingCount.current++;
    return () => {
      modalContext.componentLoadingCount.current--;
      emitModalContentReadyMetric(modalContext);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const emitModalContentReadyMetric = (modalContext: ModalContextProps) => {
  const { componentLoadingCount, loadStartTime, instanceIdentifier, componentIdentifier, performanceMetricLogged } =
    modalContext;
  if (componentLoadingCount.current === 0 && loadStartTime.current !== null && !performanceMetricLogged.current) {
    const timeToContentReadyInModal = performance.now() - loadStartTime.current;
    PerformanceMetrics.modalPerformanceData({
      timeToContentReadyInModal,
      instanceIdentifier: instanceIdentifier,
      componentIdentifier: componentIdentifier,
    });
    performanceMetricLogged.current = true;
  }
};
