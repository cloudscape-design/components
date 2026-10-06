// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// The element type is recoverable from the attributes type: `React.DOMAttributes<E>` carries `E` in every
// event handler's `currentTarget`. Falls back to `HTMLElement` for attribute types that target a non-HTML element.
export type NativeElement<T> =
  T extends React.DOMAttributes<infer E> ? (E extends HTMLElement ? E : HTMLElement) : HTMLElement;

export type NativeAttributes<T extends React.HTMLAttributes<HTMLElement>> = Omit<T, 'children'> &
  Record<`data-${string}`, string> & { readonly ref?: React.Ref<NativeElement<T>> };
