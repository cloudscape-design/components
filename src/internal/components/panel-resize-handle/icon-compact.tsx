// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export default function ResizeHandleIconCompact({ className }: { className?: string }) {
  return (
    <svg
      focusable={false}
      className={className}
      aria-hidden={true}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="14" height="1.5" x="0" y="50%" />
    </svg>
  );
}
