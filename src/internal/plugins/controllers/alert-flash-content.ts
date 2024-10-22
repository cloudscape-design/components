// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import debounce from '../../debounce';

// this code should not depend on React typings, because it is portable between major versions
interface RefShim<T> {
  current: T | null;
}

export interface AlertFlashContentContext {
  type: string;
  headerRef: RefShim<HTMLElement>;
  contentRef: RefShim<HTMLElement>;
}

interface AlertFlashContentInitialContext {
  type: string;
  header?: ReactNode;
  content?: ReactNode;
}

export type ReplacementType = 'original' | 'remove' | 'replaced';

export interface ReplacementApi {
  hideHeader(): void;
  restoreHeader(): void;
  replaceHeader(replacer: (container: HTMLElement) => void): void;
  hideContent(): void;
  restoreContent(): void;
  replaceContent(replacer: (container: HTMLElement) => void): void;
}

export interface AlertFlashContentResult {
  update: () => void;
  unmount: (containers: { replacementHeaderContainer: HTMLElement; replacementContentContainer: HTMLElement }) => void;
}

export interface AlertFlashContentConfig {
  id: string;
  runReplacer: (context: AlertFlashContentContext, replacementApi: ReplacementApi) => AlertFlashContentResult;
  initialCheck?: (context: AlertFlashContentInitialContext) => boolean;
}

export type AlertFlashContentRegistrationListener = (provider: AlertFlashContentConfig) => () => void;

export interface AlertFlashContentApiPublic {
  registerContentReplacer(config: AlertFlashContentConfig): void;
}

export interface AlertFlashContentApiInternal {
  clearRegisteredReplacer(): void;
  onContentRegistered(listener: AlertFlashContentRegistrationListener): () => void;
  initialCheck(context: AlertFlashContentInitialContext): boolean;
}

export class AlertFlashContentController {
  #listeners: Array<AlertFlashContentRegistrationListener> = [];
  #cleanups = new Map<AlertFlashContentRegistrationListener, () => void>();
  #provider?: AlertFlashContentConfig;

  #scheduleUpdate = debounce(
    () =>
      this.#listeners.forEach(listener => {
        if (this.#provider) {
          const cleanup = listener(this.#provider);
          this.#cleanups.set(listener, cleanup);
        }
      }),
    0
  );

  registerContentReplacer = (content: AlertFlashContentConfig) => {
    if (this.#provider) {
      console.warn(
        `Cannot call \`registerContentReplacer\` with new provider: provider with id "${this.#provider.id}" already registered.`
      );
      return;
    }
    this.#provider = content;

    // Notify existing components if registration happens after the components are rendered.
    this.#scheduleUpdate();
  };

  clearRegisteredReplacer = () => {
    this.#provider = undefined;
  };

  initialCheck = (context: AlertFlashContentInitialContext): boolean => {
    if (this.#provider?.initialCheck) {
      return this.#provider.initialCheck(context);
    }
    return false;
  };

  onContentRegistered = (listener: AlertFlashContentRegistrationListener) => {
    if (this.#provider) {
      const cleanup = listener(this.#provider);
      this.#listeners.push(listener);
      this.#cleanups.set(listener, cleanup);
    } else {
      this.#listeners.push(listener);
    }
    return () => {
      this.#cleanups.get(listener)?.();
      this.#listeners = this.#listeners.filter(item => item !== listener);
      this.#cleanups.delete(listener);
    };
  };

  installPublic(api: Partial<AlertFlashContentApiPublic> = {}): AlertFlashContentApiPublic {
    api.registerContentReplacer ??= this.registerContentReplacer;
    return api as AlertFlashContentApiPublic;
  }

  installInternal(internalApi: Partial<AlertFlashContentApiInternal> = {}): AlertFlashContentApiInternal {
    internalApi.clearRegisteredReplacer ??= this.clearRegisteredReplacer;
    internalApi.onContentRegistered ??= this.onContentRegistered;
    internalApi.initialCheck ??= this.initialCheck;
    return internalApi as AlertFlashContentApiInternal;
  }
}
