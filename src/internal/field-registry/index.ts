// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { isMotionDisabled, useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { awsuiPluginsInternal } from '../plugins/api';
import type { FieldRegistration, FieldWriter } from '../plugins/controllers/field-registry';

export type FieldType = 'input' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle';

export interface FieldOption {
  label?: string;
  value?: string;
  disabled?: boolean;
  options?: ReadonlyArray<FieldOption>;
}

export interface FieldDescriptor {
  id: string;
  name?: string;
  label: string;
  type: FieldType;
  value: unknown;
  options?: ReadonlyArray<FieldOption>;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorText?: string;
  warningText?: string;
  statusType?: string;
}

export interface FieldState {
  label?: ReactNode;
  errorText?: ReactNode;
  warningText?: ReactNode;
}

export const FieldStateContext = createContext<FieldState | null>(null);

export const FieldRevealContext = createContext<(() => void) | null>(null);

export interface OptionInput {
  label?: ReactNode;
  value?: string;
  disabled?: boolean;
  options?: ReadonlyArray<OptionInput>;
}

export interface FieldRegistrationInput {
  register?: boolean;
  name?: string;
  type: FieldType;
  value: unknown;
  options?: ReadonlyArray<OptionInput>;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  statusType?: string;
  labels?: ReadonlyArray<ReactNode>;
  setValue: (next: unknown) => boolean;
  blur?: () => void;
  scrollTarget?: () => HTMLElement | null;
}

interface RegisteredField {
  field: FieldDescriptor;
  write: FieldWriter;
  registration: FieldRegistration | null;
}

interface PendingWrite {
  validated: boolean;
  resolve: (field: FieldDescriptor) => void;
  reject: (error: Error) => void;
}

const plainText = (node: ReactNode) => (typeof node === 'string' && node.trim() ? node : undefined);

function plainOptions(options: ReadonlyArray<OptionInput>): FieldOption[] {
  return options.map(option => {
    const label = plainText(option.label);
    return {
      ...(label !== undefined && { label }),
      ...(option.value !== undefined && { value: option.value }),
      ...(option.disabled && { disabled: true }),
      ...(option.options && { options: plainOptions(option.options) }),
    };
  });
}

function scrollIntoView(element: HTMLElement | null | undefined) {
  element?.scrollIntoView({ block: 'center', behavior: isMotionDisabled(element) ? 'auto' : 'smooth' });
}

// A frame's React tree doesn't unmount when the frame reloads or is removed, so its fields would stay
// in a registry owned by the parent window. They are removed when the page is hidden instead.
const registeredFields = new Set<RegisteredField>();

const onPageHide = () => {
  registeredFields.forEach(entry => {
    entry.registration?.cleanup();
    entry.registration = null;
  });
};

const onPageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    registeredFields.forEach(entry => {
      entry.registration ??= awsuiPluginsInternal.fieldRegistry.registerField(entry.field, entry.write);
    });
  }
};

function track(entry: RegisteredField) {
  if (registeredFields.size === 0) {
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
  }
  registeredFields.add(entry);
}

function untrack(entry: RegisteredField) {
  entry.registration?.cleanup();
  registeredFields.delete(entry);
  if (registeredFields.size === 0) {
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  }
}

export function useFieldRegistration(input: FieldRegistrationInput | null): void {
  const fieldState = useContext(FieldStateContext);
  const reveal = useContext(FieldRevealContext);
  const id = useUniqueId('awsui-field-');
  const entry = useRef<RegisteredField | null>(null);
  const pending = useRef<PendingWrite | null>(null);
  const [writes, setWrites] = useState(0);

  const label = [fieldState?.label, ...(input?.labels ?? [])].map(plainText).find(Boolean);
  const registered = !!input?.register && !!label;
  const { name, type = 'input', value, disabled, readOnly, statusType } = input ?? {};
  const inputOptions = input?.options;
  const options = useMemo(() => inputOptions && plainOptions(inputOptions), [inputOptions]);
  const invalid = !!input?.invalid || !!fieldState?.errorText;
  const errorText = plainText(fieldState?.errorText);
  const warningText = plainText(fieldState?.warningText);

  const write = useStableCallback(
    (next: unknown) =>
      new Promise<FieldDescriptor>((resolve, reject) => {
        if (!input || input.disabled || input.readOnly) {
          reject(new Error(input?.readOnly ? 'The field is read-only.' : 'The field is disabled.'));
          return;
        }
        if (!input.setValue(next)) {
          reject(new Error('The field does not accept this value.'));
          return;
        }
        reveal?.();
        pending.current?.reject(new Error('A later write replaced this one.'));
        pending.current = { validated: false, resolve, reject };
        setWrites(count => count + 1);
      })
  );

  const settle = useStableCallback(() => {
    const current = pending.current;
    if (!current) {
      return;
    }
    if (!current.validated) {
      scrollIntoView(input?.scrollTarget?.());
      input?.blur?.();
      current.validated = true;
      setWrites(count => count + 1);
      return;
    }
    pending.current = null;
    if (entry.current) {
      current.resolve(entry.current.field);
    } else {
      current.reject(new Error('The field was removed.'));
    }
  });

  useEffect(() => {
    if (!registered) {
      return;
    }
    return () => {
      if (entry.current) {
        untrack(entry.current);
        entry.current = null;
      }
      pending.current?.reject(new Error('The field was removed.'));
      pending.current = null;
    };
  }, [registered]);

  useEffect(() => {
    if (!registered || !label) {
      return;
    }
    const field: FieldDescriptor = {
      id,
      name,
      label,
      type,
      value,
      options,
      disabled,
      readOnly,
      invalid,
      errorText,
      warningText,
      statusType,
    };
    if (entry.current) {
      entry.current.field = field;
      entry.current.registration?.update(field);
    } else {
      entry.current = { field, write, registration: awsuiPluginsInternal.fieldRegistry.registerField(field, write) };
      track(entry.current);
    }
  }, [
    registered,
    id,
    name,
    label,
    type,
    value,
    options,
    disabled,
    readOnly,
    invalid,
    errorText,
    warningText,
    statusType,
    write,
  ]);

  useEffect(() => {
    settle();
  }, [writes, settle]);
}
