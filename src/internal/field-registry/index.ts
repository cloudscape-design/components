// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { awsuiPluginsInternal } from '../plugins/api';
import type { FieldRegistration, FieldWriter } from '../plugins/controllers/field-registry';

export type FieldType = 'input' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle';

export interface FieldOption {
  label?: ReactNode;
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

export type FieldWriteResult = 'changed' | 'unchanged' | false;

export interface FieldRegistrationInput {
  name?: string;
  type: FieldType;
  value: unknown;
  options?: ReadonlyArray<FieldOption>;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  statusType?: string;
  labels?: ReadonlyArray<ReactNode>;
  setValue: (next: unknown) => FieldWriteResult;
  blur?: () => void;
}

interface RegisteredField {
  field: FieldDescriptor;
  write: FieldWriter;
  registration: FieldRegistration | null;
}

const plainText = (node: ReactNode) => (typeof node === 'string' && node.trim() ? node : undefined);

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

function resolveAll(waiting: { current: Array<() => void> }) {
  const resolvers = waiting.current;
  waiting.current = [];
  resolvers.forEach(resolve => resolve());
}

export function useFieldRegistration(enabled: boolean, input: FieldRegistrationInput): void {
  const fieldState = useContext(FieldStateContext);
  const reveal = useContext(FieldRevealContext);
  const id = useUniqueId('awsui-field-');
  const entry = useRef<RegisteredField | null>(null);
  const waitingForRender = useRef<Array<() => void>>([]);

  const label = [fieldState?.label, ...(input.labels ?? [])].map(plainText).find(Boolean);
  const registered = enabled && !!label;
  const { name, type, value, options, disabled, readOnly, statusType } = input;
  const invalid = !!input.invalid || !!fieldState?.errorText;
  const errorText = plainText(fieldState?.errorText);
  const warningText = plainText(fieldState?.warningText);

  const write = useStableCallback(
    (next: unknown) =>
      new Promise<void>((resolve, reject) => {
        if (input.disabled || input.readOnly) {
          reject(new Error(input.disabled ? 'The field is disabled.' : 'The field is read-only.'));
          return;
        }
        // React 16 can run the re-render's effects before setValue returns, so the write waits from the start.
        waitingForRender.current.push(resolve);
        const result = input.setValue(next);
        if (result === 'changed') {
          reveal?.();
          return;
        }
        waitingForRender.current = waitingForRender.current.filter(waiting => waiting !== resolve);
        if (result) {
          resolve();
        } else {
          reject(new Error('The field does not accept this value.'));
        }
      })
  );

  const blur = useStableCallback(() => input.blur?.());

  useEffect(() => {
    if (!registered) {
      return;
    }
    return () => {
      if (entry.current) {
        untrack(entry.current);
        entry.current = null;
      }
      resolveAll(waitingForRender);
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
    if (waitingForRender.current.length > 0) {
      blur();
      resolveAll(waitingForRender);
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
    blur,
  ]);
}
