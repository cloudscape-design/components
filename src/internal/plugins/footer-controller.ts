// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../debounce';

export interface FooterConfig {
  id: string;
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
}

export type FooterRegistrationListener = (config: FooterConfig | null) => void;

function deferred() {
  let resolve = () => {};
  const promise = new Promise<void>(callback => (resolve = callback));
  return { promise, resolve };
}

export class FooterController {
  private listener: FooterRegistrationListener | null = null;
  private deferredRegistration = deferred();
  private footer: FooterConfig | null = null;

  private scheduleUpdate = debounce(() => {
    this.listener?.(this.footer);
  });

  registerFooter = (footer: FooterConfig) => {
    if (this.footer) {
      console.warn('[AwsUi] [runtime footer] multiple footer registrations detected');
      return;
    }
    this.footer = footer;
    this.scheduleUpdate();
    return this.deferredRegistration.promise;
  };

  unregisterFooter = () => {
    this.footer = null;
    this.scheduleUpdate();
  };

  onFooterRegistered = (listener: FooterRegistrationListener) => {
    if (this.listener !== null) {
      console.warn('[AwsUi] [runtime footer] multiple app layout instances detected');
    }
    this.deferredRegistration.resolve();
    this.listener = listener;
    this.scheduleUpdate();
    return () => {
      this.listener = null;
    };
  };
}
