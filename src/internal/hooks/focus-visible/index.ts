// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';
import { KeyCode } from '../../keycode';

export function isModifierKey(event: KeyboardEvent) {
  // we do not want to highlight focused element
  // when special keys are pressed
  return [KeyCode.shift, KeyCode.alt, KeyCode.control, KeyCode.meta].indexOf(event.keyCode) > -1;
}

function setIsKeyboard(active: boolean) {
  if (active) {
    document.body.setAttribute('data-awsui-focus-visible', 'true');
  } else {
    document.body.removeAttribute('data-awsui-focus-visible');
  }
}

function handleMousedown() {
  return setIsKeyboard(false);
}

function handleKeydown(event: KeyboardEvent) {
  if (!isModifierKey(event)) {
    setIsKeyboard(true);
  }
}

let componentsCount = 0;

function addListeners() {
  document.addEventListener('mousedown', handleMousedown);
  document.addEventListener('keydown', handleKeydown);
}

function removeListeners() {
  document.removeEventListener('mousedown', handleMousedown);
  document.removeEventListener('keydown', handleKeydown);
}

export default function useFocusVisible() {
  useEffect(() => {
    if (componentsCount === 0) {
      addListeners();
    }
    componentsCount++;
    return () => {
      componentsCount--;
      if (componentsCount === 0) {
        removeListeners();
      }
    };
  }, []);
}
