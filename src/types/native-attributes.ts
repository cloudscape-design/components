// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// The element type is recovered from the attributes type: `React.DOMAttributes<E>` carries `E` in every event
// handler's `currentTarget`. The fallback branches are unreachable through `NativeAttributes` (its constraint
// already requires HTML attributes), so they resolve to `never` rather than widening the ref to `HTMLElement`.
type NativeElement<T> = T extends React.DOMAttributes<infer E> ? (E extends HTMLElement ? E : never) : never;

export type NativeAttributes<T extends React.HTMLAttributes<HTMLElement>> = Omit<T, 'children'> &
  Record<`data-${string}`, string> & { readonly ref?: React.Ref<NativeElement<T>> };
