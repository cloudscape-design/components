// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, createContext } from 'react';

export interface FormContextProps {
  currentStep: number;
  setCurrentStep(ref: any): void;
  registerStep(ref: any): void;
}

export const FormContext = createContext<FormContextProps | null>(null);

export function useFormContext() {
  return useContext(FormContext);
}
