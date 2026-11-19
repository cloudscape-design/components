// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// When updating the list of key codes, don't forget
// to modify corresponding list in test-utils
// to avoid failing unit tests
export enum KeyCode {
  pageUp = 33,
  pageDown = 34,
  end = 35,
  home = 36,
  backspace = 8,
  space = 32,
  down = 40,
  left = 37,
  right = 39,
  up = 38,
  escape = 27,
  enter = 13,
  tab = 9,
}

// Additional keycodes used by prompt-input that are not part of the
// test-utils-core KeyCode enum. Defined separately to keep the enum
// compatible with the external type used by ElementWrapper.keydown().
export const KeyCodeDelete = 46;
export const KeyCodeA = 65;
