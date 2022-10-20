// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface PaginationI18n {
  ariaLabels: {
    nextPageLabel: string;
    pageLabel: ({ pageNumber }: { pageNumber: string }) => string;
    previousPageLabel: string;
  };
}
