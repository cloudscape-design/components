// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This function is in a separate file to allow for mocking in unit tests
export default function () {
  return 'scrollBehavior' in document.documentElement.style;
}
