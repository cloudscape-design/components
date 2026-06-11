// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export default async function fetchJson<T = unknown>(options: RequestInfo | URL): Promise<T> {
  const response = await fetch(options);
  if (!response.ok) {
    throw new Error(`Response error: ${response.status}`);
  } else {
    return response.json() as Promise<T>;
  }
}
