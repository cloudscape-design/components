// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';

import { isMotionDisabled, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { awsuiPluginsInternal } from '../plugins/api';
import type { FieldRegistration } from '../plugins/controllers/field-registry';

export type FieldType = 'input' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle';

export interface FieldOption {
  label?: string;
  value?: string;
  disabled?: boolean;
  options?: ReadonlyArray<FieldOption>;
}

export interface FieldDescriptor {
  name: string;
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
  setValue: (next: unknown) => boolean;
  blur?: () => void;
}

export interface FieldState {
  label?: ReactNode;
  errorText?: ReactNode;
  warningText?: ReactNode;
}

export const FieldStateContext = createContext<FieldState | null>(null);

export const FieldRevealContext = createContext<(() => boolean) | null>(null);

export interface FieldRegistrationInput {
  register?: boolean;
  name?: string;
  type: FieldType;
  value: unknown;
  options?: ReadonlyArray<FieldOption>;
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
  descriptor: FieldDescriptor;
  registration: FieldRegistration | null;
}

const REVEAL_SCROLL_DELAY = 250;

const DATA_KEYS = [
  'name',
  'label',
  'type',
  'disabled',
  'readOnly',
  'invalid',
  'errorText',
  'warningText',
  'statusType',
] as const;

const plainText = (node: ReactNode) => (typeof node === 'string' && node.trim() ? node : undefined);

const sameValue = (a: unknown, b: unknown) =>
  a === b || (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => item === b[i]));

function sameOptions(a?: ReadonlyArray<FieldOption>, b?: ReadonlyArray<FieldOption>): boolean {
  return (
    a === b ||
    (!!a &&
      !!b &&
      a.length === b.length &&
      a.every(
        (option, i) =>
          option.label === b[i].label &&
          option.value === b[i].value &&
          option.disabled === b[i].disabled &&
          sameOptions(option.options, b[i].options)
      ))
  );
}

const sameData = (a: FieldDescriptor, b: FieldDescriptor) =>
  DATA_KEYS.every(key => a[key] === b[key]) &&
  !!a.blur === !!b.blur &&
  sameValue(a.value, b.value) &&
  sameOptions(a.options, b.options);

function scrollIntoView(element: HTMLElement | null | undefined) {
  element?.scrollIntoView({ block: 'center', behavior: isMotionDisabled(element) ? 'auto' : 'smooth' });
}

// A frame's React tree doesn't unmount when the frame reloads or is removed, so its fields would stay
// in a registry owned by the parent window. They are removed when the page is hidden instead.
const registeredFields = new Set<RegisteredField>();

const onPageHide = () => {
  registeredFields.forEach(field => {
    field.registration?.cleanup();
    field.registration = null;
  });
};

const onPageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    registeredFields.forEach(field => {
      field.registration ??= awsuiPluginsInternal.fieldRegistry.registerField(field.descriptor);
    });
  }
};

function track(field: RegisteredField) {
  if (registeredFields.size === 0) {
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
  }
  registeredFields.add(field);
}

function untrack(field: RegisteredField) {
  field.registration?.cleanup();
  registeredFields.delete(field);
  if (registeredFields.size === 0) {
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  }
}

export function useFieldRegistration(input: FieldRegistrationInput | null): void {
  const fieldState = useContext(FieldStateContext);
  const reveal = useContext(FieldRevealContext);
  const fallbackName = useUniqueId('awsui-field');
  const latest = useRef({ input, reveal });
  const field = useRef<RegisteredField | null>(null);

  const actions = useRef({
    setValue: (next: unknown) => {
      const { input: current, reveal: revealField } = latest.current;
      if (!current || current.disabled || current.readOnly || !current.setValue(next)) {
        return false;
      }
      if (revealField?.()) {
        setTimeout(() => scrollIntoView(latest.current.input?.scrollTarget?.()), REVEAL_SCROLL_DELAY);
      } else {
        scrollIntoView(current.scrollTarget?.());
      }
      return true;
    },
    blur: () => latest.current.input?.blur?.(),
  });

  useEffect(
    () => () => {
      if (field.current) {
        untrack(field.current);
        field.current = null;
      }
    },
    []
  );

  useEffect(() => {
    latest.current = { input, reveal };
    const label = [fieldState?.label, ...(input?.labels ?? [])].map(plainText).find(Boolean);
    if (!input?.register || !label) {
      if (field.current) {
        untrack(field.current);
        field.current = null;
      }
      return;
    }
    const descriptor: FieldDescriptor = {
      name: input.name ?? fallbackName,
      label,
      type: input.type,
      value: input.value,
      options: input.options,
      disabled: input.disabled,
      readOnly: input.readOnly,
      invalid: !!input.invalid || !!fieldState?.errorText,
      errorText: plainText(fieldState?.errorText),
      warningText: plainText(fieldState?.warningText),
      statusType: input.statusType,
      setValue: actions.current.setValue,
      blur: input.blur ? actions.current.blur : undefined,
    };
    if (!field.current) {
      field.current = { descriptor, registration: awsuiPluginsInternal.fieldRegistry.registerField(descriptor) };
      track(field.current);
    } else if (!sameData(field.current.descriptor, descriptor)) {
      field.current.descriptor = descriptor;
      field.current.registration?.update(descriptor);
    }
  });
}
