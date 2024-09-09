// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../../debounce';

// this code should not depend on React typings, because it is portable between major versions
interface RefShim<T> {
  current: T | null;
}

export interface AlertFlashContentContext {
  type: string;
  headerRef: RefShim<HTMLElement>;
  contentRef: RefShim<HTMLElement>;
  actionsRef: RefShim<HTMLElement>;
}

export type ReplacementType = 'original' | 'remove' | ((container: HTMLElement) => void);
export type ReplacementTypeSafe = 'original' | 'remove' | true;

type RegisterReplacement = (type: 'header' | 'content', doReplacement: ReplacementType) => void;

export interface AlertFlashContentResult {
  update: () => void;
  unmount: (containers: { replacementHeaderContainer: HTMLElement; replacementContentContainer: HTMLElement }) => void;
}

export interface AlertFlashContentConfig {
  id: string;
  runReplacer: (context: AlertFlashContentContext, registerReplacement: RegisterReplacement) => AlertFlashContentResult;
}

export interface AlertFlashContentRegistrationListener {
  (provider?: AlertFlashContentConfig): void | (() => void);
  cleanup?: void | (() => void);
}

export interface AlertFlashContentApiPublic {
  registerContentReplacer(config: AlertFlashContentConfig): void;
}

export interface AlertFlashContentApiInternal {
  clearRegisteredReplacer(): void;
  onContentRegistered(listener: AlertFlashContentRegistrationListener): () => void;
}

export class AlertFlashContentController {
  #listeners: Array<AlertFlashContentRegistrationListener> = [];
  #cleanups = new Map<AlertFlashContentRegistrationListener, null | (() => void)>();
  #provider?: AlertFlashContentConfig;

  #scheduleUpdate = debounce(() => {
    this.#listeners.forEach(listener => {
      const cleanup = listener(this.#provider) ?? null;
      this.#cleanups.set(listener, cleanup);
    });
  }, 0);

  registerContentReplacer = (content: AlertFlashContentConfig) => {
    if (this.#provider) {
      console.warn(
        `Cannot call \`registerContentReplacer\` with new provider: provider with id "${this.#provider.id}" already registered.`
      );
      return;
    }
    this.#provider = content;
    this.#scheduleUpdate();
  };

  clearRegisteredReplacer = () => {
    this.#provider = undefined;
  };

  onContentRegistered = (listener: AlertFlashContentRegistrationListener) => {
    this.#listeners.push(listener);
    this.#scheduleUpdate();
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
    return internalApi as AlertFlashContentApiInternal;
  }
}
