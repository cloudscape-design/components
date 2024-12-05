// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useModalContext } from '../../context/modal-context';
import { useDOMAttribute } from '../use-dom-attribute';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useRandomId } from '../use-unique-id';

const EVALUATE_COMPONENT_VISIBILITY_EVENT = 'awsui-evaluate-component-visibility';

/**
 * This hook manages a boolean state (`evaluateComponentVisibility`) that toggles
 * whenever a custom DOM event (`EVALUATE_COMPONENT_VISIBILITY_EVENT`) is triggered.
 *
 * (`EVALUATE_COMPONENT_VISIBILITY_EVENT`) event is removed when the component unmounts
 * @returns
 */
const useEvaluateComponentVisibility = () => {
  const [evaluateComponentVisibility, setEvaluateComponentVisibility] = useState(false);

  useEffect(() => {
    const handleEvaluateComponentVisibility = () => {
      setEvaluateComponentVisibility(prev => !prev);
    };

    document.addEventListener(EVALUATE_COMPONENT_VISIBILITY_EVENT, handleEvaluateComponentVisibility);

    return () => {
      document.removeEventListener(EVALUATE_COMPONENT_VISIBILITY_EVENT, handleEvaluateComponentVisibility);
    };
  }, []);

  return evaluateComponentVisibility;
};

/**
 * This function returns an object that needs to be spread onto the same
 * element as the `elementRef`, so that the data attribute is applied
 * correctly.
 */
export function usePerformanceMarks(
  name: string,
  enabled: boolean,
  elementRef: React.RefObject<HTMLElement>,
  getDetails: () => Record<string, string | boolean | number | undefined>,
  dependencies: React.DependencyList
) {
  const id = useRandomId();
  const { isInModal } = useModalContext();
  const attributes = useDOMAttribute(elementRef, 'data-analytics-performance-mark', id);
  const evaluateComponentVisibility = useEvaluateComponentVisibility();
  useEffect(() => {
    if (!enabled || !elementRef.current || isInModal) {
      return;
    }
    const elementVisible =
      elementRef.current.offsetWidth > 0 &&
      elementRef.current.offsetHeight > 0 &&
      getComputedStyle(elementRef.current).visibility !== 'hidden';

    if (!elementVisible) {
      return;
    }

    const renderedMarkName = `${name}Rendered`;
    performance.mark(renderedMarkName, {
      detail: {
        source: 'awsui',
        instanceIdentifier: id,
        ...getDetails(),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnUpdate(() => {
    if (!enabled || !elementRef.current || isInModal) {
      return;
    }
    const elementVisible =
      elementRef.current.offsetWidth > 0 &&
      elementRef.current.offsetHeight > 0 &&
      getComputedStyle(elementRef.current).visibility !== 'hidden';

    if (!elementVisible) {
      return;
    }
    const updatedMarkName = `${name}Updated`;
    performance.mark(updatedMarkName, {
      detail: {
        source: 'awsui',
        instanceIdentifier: id,
        ...getDetails(),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluateComponentVisibility, ...dependencies]);

  return attributes;
}
