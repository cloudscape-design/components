// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface AppLayoutErrorEntry {
  appLayoutPart: string;
  message: string;
}

export interface ErrorBoundaryApiInternal {
  recordError: (entry: AppLayoutErrorEntry) => void;
  getErrors: () => ReadonlyArray<AppLayoutErrorEntry>;
  clearErrors: () => void;
}

const MAX_RECORDED_ERRORS = 50;

// Aggregates app layout error-boundary catches so integration/canary tests can assert on real boundary
// catches instead of scraping the console. Installed on the plugin API, so every same-origin frame
// resolves to the one instance on the top window and errors from child iframes funnel to a single place.
export class ErrorBoundaryController {
  #errors: Array<AppLayoutErrorEntry> = [];

  recordError = (entry: AppLayoutErrorEntry) => {
    this.#errors.push(entry);
    if (this.#errors.length > MAX_RECORDED_ERRORS) {
      this.#errors.shift();
    }
  };

  getErrors = (): ReadonlyArray<AppLayoutErrorEntry> => this.#errors.slice();

  clearErrors = () => {
    this.#errors.length = 0;
  };

  installInternal(internalApi: Partial<ErrorBoundaryApiInternal> = {}): ErrorBoundaryApiInternal {
    internalApi.recordError ??= this.recordError;
    internalApi.getErrors ??= this.getErrors;
    internalApi.clearErrors ??= this.clearErrors;

    return internalApi as ErrorBoundaryApiInternal;
  }
}
