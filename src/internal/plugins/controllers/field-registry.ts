// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';
import type { FieldDescriptor } from '../../field-registry';

export type FieldsListener = (fields: ReadonlyArray<FieldDescriptor>) => void;

export interface FieldRegistration {
  update(descriptor: FieldDescriptor): void;
  cleanup(): void;
}

export interface FieldRegistryApiPublic {
  registerListener(listener: FieldsListener): () => void;
}

export interface FieldRegistryApiInternal {
  registerField(descriptor: FieldDescriptor): FieldRegistration;
}

export class FieldRegistryController {
  #entries = new Set<{ descriptor: FieldDescriptor }>();
  #listeners = new Set<FieldsListener>();

  #snapshot = () => [...this.#entries].map(entry => entry.descriptor);

  #notify = debounce(() => {
    const fields = this.#snapshot();
    this.#listeners.forEach(listener => listener(fields));
  }, 0);

  registerListener = (listener: FieldsListener) => {
    this.#listeners.add(listener);
    listener(this.#snapshot());
    return () => {
      this.#listeners.delete(listener);
    };
  };

  registerField = (descriptor: FieldDescriptor): FieldRegistration => {
    const entry = { descriptor };
    this.#entries.add(entry);
    this.#notify();
    return {
      update: next => {
        entry.descriptor = next;
        this.#notify();
      },
      cleanup: () => {
        this.#entries.delete(entry);
        this.#notify();
      },
    };
  };

  installPublic(api: Partial<FieldRegistryApiPublic> = {}): FieldRegistryApiPublic {
    api.registerListener ??= this.registerListener;
    return api as FieldRegistryApiPublic;
  }

  installInternal(api: Partial<FieldRegistryApiInternal> = {}): FieldRegistryApiInternal {
    api.registerField ??= this.registerField;
    return api as FieldRegistryApiInternal;
  }
}
