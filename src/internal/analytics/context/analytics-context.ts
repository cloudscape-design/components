// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, RefObject, createContext } from 'react';
import { FunnelType, SubStepConfiguration } from '../interfaces';
import { getFunnelNameSelector } from '../selectors';

export type FunnelState = 'default' | 'validating' | 'complete' | 'cancelled';

export interface FunnelContextValue {
  funnelInteractionId: string | undefined;
  funnelType: FunnelType;
  funnelNameSelector: string;
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
  latestFocusCleanupFunction: MutableRefObject<undefined | (() => void)>;
  isInFunnel: boolean;
  wizardCount: MutableRefObject<number>;
}

export interface FunnelStepContextValue {
  stepNameSelector: string;
  stepNumber: number;
  funnelStepProps?: Record<string, string | number | boolean | undefined>;
  subStepCount: MutableRefObject<number>;
  isInStep: boolean;
  funnelInteractionId: string | undefined;
  /** This function is called when the list of substeps in this step changes.  */
  onStepChange: () => void;
  subStepConfiguration: MutableRefObject<Record<number, SubStepConfiguration[]> | undefined>;
}

export interface FunnelSubStepContextValue {
  subStepId: string;
  subStepSelector: string;
  subStepNameSelector: string;
  subStepRef: MutableRefObject<HTMLDivElement | null>;
  mousePressed: MutableRefObject<boolean>;
  /**
   * `isFocusedSubStep` is almost the same as checking if document.activeElement
   * is a child of the curren substep. However, `isFocusedSubStep` stays true
   * while the mouse button is pressed down, even though some browsers move the focus
   * to the body element during that time.
   */
  isFocusedSubStep: MutableRefObject<boolean>;

  /**
   * The focus cleanup function should be run when the user leaves the substep.
   */
  focusCleanupFunction: MutableRefObject<undefined | (() => void)>;
  isNestedSubStep: boolean;
  funnelSubStepProps?: Record<string, string | number | boolean | undefined>;
}

/* istanbul ignore next */
export const FunnelContext = createContext<FunnelContextValue>({
  funnelInteractionId: undefined,
  funnelNameSelector: getFunnelNameSelector(),
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
  latestFocusCleanupFunction: { current: undefined },
  isInFunnel: false,
  wizardCount: { current: 0 },
});

export const FunnelStepContext = createContext<FunnelStepContextValue>({
  stepNameSelector: '',
  stepNumber: 0,
  subStepCount: { current: 0 },
  isInStep: false,
  funnelInteractionId: undefined,
  onStepChange: () => {},
  subStepConfiguration: { current: [] },
});

export const FunnelSubStepContext = createContext<FunnelSubStepContextValue>({
  subStepId: '',
  subStepSelector: '',
  subStepNameSelector: '',
  subStepRef: { current: null },
  isNestedSubStep: false,
  mousePressed: { current: false },
  isFocusedSubStep: { current: false },
  focusCleanupFunction: { current: undefined },
});

export const FunnelNameSelectorContext = createContext<string | undefined>(undefined);
