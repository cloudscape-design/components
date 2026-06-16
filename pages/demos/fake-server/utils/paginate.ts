// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export default function paginate<T>(items: T[], pageNumber: number, pageSize = 10) {
  const totalPages = Math.ceil(items.length / pageSize);
  return {
    paginatedItems: items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    hasNextPage: pageNumber < totalPages,
  };
}
