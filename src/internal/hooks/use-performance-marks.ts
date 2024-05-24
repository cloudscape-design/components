// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useUniqueId } from './use-unique-id';
import { useEffectOnUpdate } from './use-effect-on-update';
import { useModalContext } from '../context/modal-context';

export function usePerformanceMarks(
  name: string,
  enabled: boolean,
  elementRef: React.RefObject<HTMLElement>,
  getDetails: () => Record<string, string | boolean | number | undefined>,
  dependencies: React.DependencyList
) {
  const id = useUniqueId();
  const { isInModal } = useModalContext();

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
}
