// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export default function ResizeHandleIcon({ className }: { className?: string }) {
  return (
    <svg
      focusable={false}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden={true}
    >
      <path d="M2 10H14" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
