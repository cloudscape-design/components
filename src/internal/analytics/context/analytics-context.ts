// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';
import { FunnelType } from '../interfaces';

export interface BaseContextProps {
  funnelInteractionId: string | undefined;
}

export interface FunnelContextValue extends BaseContextProps {
  funnelType: FunnelType;
  optionalStepNumbers: number[];
  totalFunnelSteps: number;
  funnelSubmit: () => void;
  funnelCancel: () => void;
  setFunnelInteractionId: (funnelInteractionId: string) => void;
}

export interface FunnelStepContextValue extends BaseContextProps {
  stepNameSelector: string;
  stepNumber: number;
}

export interface FunnelSubStepContextValue extends FunnelStepContextValue {
  subStepId: string;
  subStepSelector: string;
  subStepNameSelector: string;
  stepNumber: number;
}

export const FunnelContext = createContext<FunnelContextValue>({
  funnelInteractionId: undefined,
  setFunnelInteractionId: () => {},
  funnelType: 'single-page',
  optionalStepNumbers: [],
  totalFunnelSteps: 0,
  funnelSubmit: () => {},
  funnelCancel: () => {},
});

export const FunnelStepContext = createContext<FunnelStepContextValue>({
  funnelInteractionId: undefined,
  stepNameSelector: '',
  stepNumber: 0,
});

export const FunnelSubStepContext = createContext<FunnelSubStepContextValue>({
  funnelInteractionId: undefined,
  subStepId: '',
  stepNumber: 0,
  stepNameSelector: '',
  subStepSelector: '',
  subStepNameSelector: '',
});
