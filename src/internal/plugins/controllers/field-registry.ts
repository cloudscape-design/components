// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { FieldDescriptor } from '../../field-registry';

export type FieldsListener = (fields: ReadonlyArray<FieldDescriptor>) => void;

export type FieldWriter = (value: unknown) => Promise<FieldDescriptor>;

export interface FieldRegistration {
  update(field: FieldDescriptor): void;
  cleanup(): void;
}

export interface FieldRegistryApiPublic {
  registerListener(listener: FieldsListener): () => void;
  setValue(id: string, value: unknown): Promise<FieldDescriptor>;
}

export interface FieldRegistryApiInternal {
  registerField(field: FieldDescriptor, write: FieldWriter): FieldRegistration;
}

interface Entry {
  field: FieldDescriptor;
  write: FieldWriter;
}

export class FieldRegistryController {
  #entries = new Set<Entry>();
  #listeners = new Set<FieldsListener>();

  #fields = () => [...this.#entries].map(entry => entry.field);

  #notify = () => {
    const fields = this.#fields();
    this.#listeners.forEach(listener => listener(fields));
  };

  registerListener = (listener: FieldsListener) => {
    this.#listeners.add(listener);
    listener(this.#fields());
    return () => {
      this.#listeners.delete(listener);
    };
  };

  setValue = (id: string, value: unknown) => {
    const entry = [...this.#entries].find(candidate => candidate.field.id === id);
    return entry ? entry.write(value) : Promise.reject(new Error(`No field has the id "${id}".`));
  };

  registerField = (field: FieldDescriptor, write: FieldWriter): FieldRegistration => {
    const entry: Entry = { field, write };
    this.#entries.add(entry);
    this.#notify();
    return {
      update: next => {
        entry.field = next;
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
    api.setValue ??= this.setValue;
    return api as FieldRegistryApiPublic;
  }

  installInternal(api: Partial<FieldRegistryApiInternal> = {}): FieldRegistryApiInternal {
    api.registerField ??= this.registerField;
    return api as FieldRegistryApiInternal;
  }
}
