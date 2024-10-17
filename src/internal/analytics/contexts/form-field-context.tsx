// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext } from 'react';

export interface FormFieldContextProps {
  label: () => string;
  errorText?: () => string;
}

export const FormFieldContext = createContext<FormFieldContextProps | null>(null);

export const FormFieldProvider = ({
  children,
  label,
  errorText,
}: { children?: React.ReactNode } & FormFieldContextProps) => {
  return <FormFieldContext.Provider value={{ label, errorText }}>{children}</FormFieldContext.Provider>;
};
