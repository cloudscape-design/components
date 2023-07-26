// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, RefObject, createContext } from 'react';
import { FunnelType } from '../interfaces';

export type FunnelState = 'default' | 'validating' | 'complete' | 'cancelled';

export interface FunnelContextValue {
  funnelInteractionId: string | undefined;
  funnelType: FunnelType;
  optionalStepNumbers: number[];
  totalFunnelSteps: number;
  funnelSubmit: () => void;
  funnelCancel: () => void;
  setFunnelInteractionId: (funnelInteractionId: string) => void;
  submissionAttempt: number;
  funnelNextOrSubmitAttempt: () => void;
  funnelState: RefObject<FunnelState>;
  errorCount: MutableRefObject<number>;
  loadingButtonCount: MutableRefObject<number>;
}

export interface FunnelStepContextValue {
  stepNameSelector: string;
  stepNumber: number;
  funnelStepProps?: Record<string, string | number | boolean | undefined>;
  subStepCount: MutableRefObject<number>;
}

export interface FunnelSubStepContextValue {
  subStepId: string;
  subStepSelector: string;
  subStepNameSelector: string;
  subStepRef: MutableRefObject<HTMLDivElement | null>;
  isNestedSubStep: boolean;
  funnelSubStepProps?: Record<string, string | number | boolean | undefined>;
}

/* istanbul ignore next */
export const FunnelContext = createContext<FunnelContextValue>({
  funnelInteractionId: undefined,
  setFunnelInteractionId: () => {},
  funnelType: 'single-page',
  optionalStepNumbers: [],
  totalFunnelSteps: 0,
  funnelSubmit: () => {},
  funnelCancel: () => {},
  submissionAttempt: 0,
  funnelNextOrSubmitAttempt: () => {},
  funnelState: { current: 'default' },
  errorCount: { current: 0 },
  loadingButtonCount: { current: 0 },
});

export const FunnelStepContext = createContext<FunnelStepContextValue>({
  stepNameSelector: '',
  stepNumber: 0,
  subStepCount: { current: 0 },
});

export const FunnelSubStepContext = createContext<FunnelSubStepContextValue>({
  subStepId: '',
  subStepSelector: '',
  subStepNameSelector: '',
  subStepRef: { current: null },
  isNestedSubStep: false,
});
