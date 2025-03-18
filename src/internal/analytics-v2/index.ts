// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MutableRefObject, useEffect, useLayoutEffect } from 'react';

import * as handlers from './handlers';
import { Handler, TrackEventDetail } from './interfaces';
import { kebabCaseToCamelCase } from './utils';

export function trackEvent(target: HTMLElement, eventName: string, { componentName, detail = {} }: TrackEventDetail) {
  const normalizedEventName = kebabCaseToCamelCase(eventName);

  const componentHandlers = (handlers as any)[componentName] || handlers.fallback;
  if (componentHandlers) {
    const componentHandler: Handler =
      componentHandlers[normalizedEventName] || (handlers.fallback as any)[normalizedEventName];

    if (componentHandler) {
      componentHandler({ target, eventName, componentName, detail });
    }
  }
}

export function useTrackPropertyLayoutEffect(
  ref: MutableRefObject<any> | null | undefined,
  componentName: string,
  propertyName: string,
  propertyValue: any
) {
  useLayoutEffect(() => {
    if (ref && ref.current) {
      trackEvent(ref.current, 'property-change', {
        componentName,
        detail: {
          name: propertyName,
          value: propertyValue,
        },
      } as TrackEventDetail);
    }
  }, [ref, propertyValue, propertyName, componentName]);
}

export function useTrackPropertyEffect(
  ref: MutableRefObject<any> | null | undefined,
  componentName: string,
  propertyName: string,
  propertyValue: any
) {
  useEffect(() => {
    if (ref && ref.current) {
      trackEvent(ref.current, 'property-change', {
        componentName,
        detail: {
          name: propertyName,
          value: propertyValue,
        },
      } as TrackEventDetail);
    }
  }, [ref, propertyValue, propertyName, componentName]);
}
