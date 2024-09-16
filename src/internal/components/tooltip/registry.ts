// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type OnClose = () => void;

let callbacks: Array<OnClose> = [];
let listenerRegistered = false;

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    callbacks.forEach(callback => callback());
  }
};

export const registerTooltip = (onClose: OnClose) => {
  callbacks.forEach(callback => callback());
  callbacks.push(onClose);
  if (!listenerRegistered) {
    listenerRegistered = true;
    document.addEventListener('keydown', onKeyDown);
  }
  return () => {
    deregisterTooltip(onClose);
  };
};

const deregisterTooltip = (onClose: OnClose) => {
  callbacks = callbacks.filter(callback => callback !== onClose);
  if (listenerRegistered && callbacks.length === 0) {
    listenerRegistered = false;
    document.removeEventListener('keydown', onKeyDown);
  }
};
