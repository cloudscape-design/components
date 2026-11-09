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

const REVEAL_SCROLL_DELAY = 250;

const plainText = (node: ReactNode) => (typeof node === 'string' && node.trim() ? node : undefined);

function scrollIntoView(element: HTMLElement | null | undefined) {
  element?.scrollIntoView({ block: 'center', behavior: isMotionDisabled(element) ? 'auto' : 'smooth' });
}

export function useFieldRegistration(input: FieldRegistrationInput | null): void {
  const fieldState = useContext(FieldStateContext);
  const reveal = useContext(FieldRevealContext);
  const fallbackName = useUniqueId('awsui-field');
  const registration = useRef<FieldRegistration | null>(null);

  useEffect(
    () => () => {
      registration.current?.cleanup();
      registration.current = null;
    },
    []
  );

  useEffect(() => {
    const label = [fieldState?.label, ...(input?.labels ?? [])].map(plainText).find(Boolean);
    if (!input?.register || !label) {
      registration.current?.cleanup();
      registration.current = null;
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
      blur: input.blur,
      setValue: next => {
        if (input.disabled || input.readOnly || !input.setValue(next)) {
          return false;
        }
        const opened = reveal?.() ?? false;
        if (opened) {
          setTimeout(() => scrollIntoView(input.scrollTarget?.()), REVEAL_SCROLL_DELAY);
        } else {
          scrollIntoView(input.scrollTarget?.());
        }
        return true;
      },
    };
    if (registration.current) {
      registration.current.update(descriptor);
    } else {
      registration.current = awsuiPluginsInternal.fieldRegistry.registerField(descriptor);
    }
  });
}
