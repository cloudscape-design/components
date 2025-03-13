// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useState } from 'react';

import { FormField, FormFieldProps, Input, InputProps } from '~components';

interface TestFieldContextType {
  errorText: string;
  setErrorText: (error: string) => void;
}

const TestFieldContext = createContext<TestFieldContextType | null>(null);

interface TestFormFieldComposition {
  Input: typeof TestInput;
}

export const TestFormField: React.FC<FormFieldProps> & TestFormFieldComposition = ({ children, ...props }) => {
  const [errorText, setErrorText] = useState<string>('');

  const contextValue = {
    errorText,
    setErrorText,
  };

  return (
    <TestFieldContext.Provider value={contextValue}>
      <FormField {...props} errorText={errorText}>
        {children}
      </FormField>
    </TestFieldContext.Provider>
  );
};

function TestInput({ value: initialValue = '', onChange, ...props }: Partial<InputProps>) {
  const [value, setValue] = useState<string>(initialValue);
  const context = useContext(TestFieldContext);

  if (!context) {
    throw new Error('TestInput must be used within a TestFormField');
  }

  const { setErrorText } = context;

  useEffect(() => {
    if (value === 'error') {
      setErrorText('This is an error message');
    } else {
      setErrorText('');
    }
  }, [value, setErrorText]);

  const handleChange: InputProps['onChange'] = event => {
    setValue(event.detail.value);
    onChange?.(event);
  };

  return <Input {...props} value={value} onChange={handleChange} />;
}

TestFormField.Input = TestInput;

interface InputControlProps extends Partial<InputProps> {
  label: string;
  testId?: string;
  formFieldProps?: Partial<FormFieldProps>;
}

export function InputControl({ label, testId, formFieldProps = {}, ...props }: InputControlProps) {
  return (
    <TestFormField label={label} {...formFieldProps} data-testid={testId}>
      <TestFormField.Input {...props} />
    </TestFormField>
  );
}
