// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useRandomId } from '../use-unique-id';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { useModalContext } from '../../context/modal-context';

/*
This hook allows setting an HTML attribute after the first render, without rerendering the component.
*/
function usePerformanceMarkAttribute(elementRef: React.RefObject<HTMLElement>, value: string) {
  const attributeName = 'data-analytics-performance-mark';

  const attributeValueRef = useRef<string | undefined>();

  useEffect(() => {
    // With this effect, we apply the attribute only on the client, to avoid hydration errors.
    attributeValueRef.current = value;
    elementRef.current?.setAttribute(attributeName, value);
  }, [value, elementRef]);

  return {
    [attributeName]: attributeValueRef.current,
  };
}

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
  const attributes = usePerformanceMarkAttribute(elementRef, id);

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
  }, dependencies);

  return attributes;
}
