// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, ReactNode, useContext, useEffect } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

// Framework-neutral field registry. Form controls describe themselves and expose
// a programmatic setter that routes through their own change path. A host opts in
// by installing a registry on this key; Cloudscape only ever reads it.

export const FIELD_REGISTRY_KEY = Symbol.for('awsui.field-registry');

export type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'tiles'
  | 'autosuggest';

export interface FieldDescriptor {
  /** Stable identifier — the control's controlId, or a generated fallback. */
  name: string;
  /** Human label, sourced from the enclosing FormField when present. */
  label?: string;
  type: FieldType;
  /** Current value, in the control's own shape. */
  value: unknown;
  /** Available choices, for choice controls. */
  options?: ReadonlyArray<{ label?: string; value?: string }>;
  disabled?: boolean;
  /**
   * Sets the value through the control's OWN onChange. The control resolves the
   * argument to the shape it emits, so shape correctness lives with the control.
   * Returns false when the argument could not be resolved to a valid value, so a
   * caller never reports success for a write that did not happen.
   */
  setValue: (next: unknown) => boolean | void;
}

export interface FieldRegistry {
  register(descriptor: FieldDescriptor): void;
  unregister(name: string): void;
}

/** The host-installed registry, or null when no host has opted in. */
function getRegistry(): FieldRegistry | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return (window as unknown as Record<symbol, FieldRegistry | undefined>)[FIELD_REGISTRY_KEY] ?? null;
}

/** FormField publishes its label here so controls can report a human label. */
export const FieldLabelContext = createContext<ReactNode>(undefined);

/** What a control passes; name and label are optional and filled in by the hook. */
export type FieldRegistrationInput = Omit<FieldDescriptor, 'name' | 'label'> & {
  name?: string;
  label?: ReactNode;
};

/**
 * Registers the control while it is mounted. No-op when no host registry is
 * installed, so there is zero behavior change unless a host opts in. The human
 * label comes from the enclosing FormField unless the control supplies its own.
 */
export function useFieldRegistration(input: FieldRegistrationInput | null): void {
  const contextLabel = useContext(FieldLabelContext);
  const fallbackId = useUniqueId('awsui-field');
  useEffect(() => {
    const registry = getRegistry();
    if (!registry || !input) {
      return;
    }
    const rawLabel = contextLabel ?? input.label;
    const descriptor: FieldDescriptor = {
      ...input,
      name: input.name ?? fallbackId,
      label: typeof rawLabel === 'string' ? rawLabel : undefined,
    };
    registry.register(descriptor);
    return () => registry.unregister(descriptor.name);
    // Re-run every render so value/options/setValue stay current in the registry.
  });
}
