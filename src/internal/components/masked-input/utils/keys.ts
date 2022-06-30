// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../../keycode';

const isSpecialCommand = (keyCode: number): boolean => {
  return keyCode > 7 && keyCode < 47 && keyCode !== KeyCode.space;
};

const isClipboardCommand = (ctrlKey: boolean, metaKey: boolean): boolean => ctrlKey || metaKey;

export const isCommand = (keyCode: number, ctrlKey: boolean, metaKey: boolean): boolean =>
  isSpecialCommand(keyCode) || isClipboardCommand(ctrlKey, metaKey);
export const isDigit = (char: string): boolean => !isNaN(parseInt(char, 10));
