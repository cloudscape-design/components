// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../keycode';
import { createSingletonState } from '../use-singleton-handler';

const useFocusSingleton = createSingletonState<boolean>({
  initialState: false,
  factory: setIsKeyboard => {
    const handleMousedown = () => setIsKeyboard(false);
    const handleKeydown = (event: KeyboardEvent) => {
      // we do not want to highlight focused element
      // when special keys are pressed
      const isSpecialKey = [KeyCode.shift, KeyCode.alt, KeyCode.control, KeyCode.meta].indexOf(event.keyCode) > -1;

      if (!isSpecialKey) {
        setIsKeyboard(true);
      }
    };
    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('keydown', handleKeydown);
    };
  },
});

export default function useFocusVisible() {
  const visible = useFocusSingleton();
  return visible ? { 'data-awsui-focus-visible': visible } : {};
}
