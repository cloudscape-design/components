// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BufferEvent, TrackEventDetail } from './interfaces';

const analytics = {
  eventBuffer: [] as BufferEvent<any>[],
  eventBufferMaxSize: 1000,
  trackEvent: function (target: HTMLElement, eventName: string, { detail, componentName }: TrackEventDetail<any>) {
    if (this.eventBuffer.length < this.eventBufferMaxSize) {
      const domSnapshot = document.body.cloneNode(true) as HTMLElement;
      this.eventBuffer.push({
        event: {
          target,
          eventName,
          componentName,
          detail,
        },
        domSnapshot,
      });
    }
  },
};

(window as any).__awsui__ = (window as any).__awsui__ || { analytics };
