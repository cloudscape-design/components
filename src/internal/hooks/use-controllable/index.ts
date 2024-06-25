// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SetStateAction, useRef, useState } from 'react';
import { useStableCallback, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isDevelopment } from '../../is-development';

interface PropertyDescription {
  componentName: string;
  controlledProp: string;
  changeHandler: string;
}

/**
 * This hook allows you to make a component that can be used both in controlled mode and uncontrolled mode.
 * Pass in your component's props, and then implement your component as if it was only controlled.
 * When calling onChange callbacks (or the equivalent for your property), you need to call both the callback returned by this function
 * as well as the callback provided in your component's props.
 *
 * A component determines its mode (either controlled or uncontrolled) on the first render and keeps it for its lifetime. The mode cannot
 * be switched later.
 *
 *
 * Example usage:
 * ```jsx
 * const [checked, setChecked] = useControllable(
 *     props,
 *     props.defaultEnabled ?? false,
 *     {
 *        componentName: 'MyCheckboxComponent',
 *        controlledProp: 'enabled',
 *        changeHandler: 'onCheckedStatusChange'
 *     }
 * )
 *
 * return
 *  <input
 *   type="checkbox"
 *   checked={checked}
 *   onChange={event => {
 *    setChecked(event.target.checked);
 *    fireNonCancelableEvent(props.onCheckedStatusChange, { checked: event.target.checked })
 *   }} />
 * ```
 *
 * @param controlledValue value for the controlled mode
 * @param controlledHandler update handler for controlled mode
 * @param defaultValue initial value for uncontrolled mode
 * @param description property metadata
 */
export function useControllable<ValueType>(
  controlledValue: ValueType,
  controlledHandler: ((...args: any[]) => unknown) | undefined,
  defaultValue: ValueType,
  { componentName, changeHandler, controlledProp }: PropertyDescription
) {
  if (isDevelopment && controlledValue !== undefined && controlledHandler === undefined) {
    readonlyWarning(componentName, controlledProp, changeHandler);
  }

  // This is the value that is used if the component is uncontrolled.
  const [valueState, setValue] = useState(defaultValue);
  const [valueHasBeenSet, setValueHasBeenSet] = useState(false);
  const lastControlled = useRef<boolean | undefined>();

  const setUncontrolledValue = useStableCallback((newValue: SetStateAction<ValueType>) => {
    if (isDevelopment) {
      // Print a warning if the component switches between controlled and uncontrolled mode.
      if (lastControlled.current === undefined) {
        lastControlled.current = !!controlledHandler;
      } else if (lastControlled.current !== !!controlledHandler) {
        dynamicControllabilityWarning(componentName, controlledProp, lastControlled.current, !!controlledHandler);
      }
    }
    setValue(newValue);
    setValueHasBeenSet(true);
  });

  // We track changes to the defaultValue
  const currentUncontrolledValue = valueHasBeenSet ? valueState : defaultValue;

  return [controlledValue ?? currentUncontrolledValue, setUncontrolledValue] as const;
}

function readonlyWarning(componentName: string, controlledProp: string, changeHandler: string) {
  warnOnce(
    componentName,
    `You provided a \`${controlledProp}\` prop without an \`${changeHandler}\` handler. This will render a non-interactive component.`
  );
}

function dynamicControllabilityWarning(
  componentName: string,
  controlledProp: string,
  wasControlled: boolean,
  nowControlled: boolean
) {
  const initialMode = wasControlled ? 'controlled' : 'uncontrolled';
  const modeNow = nowControlled ? 'controlled' : 'uncontrolled';
  warnOnce(
    componentName,
    `A component tried to change ${initialMode} '${controlledProp}' property to be ${modeNow}. ` +
      `This is not supported. Properties should not switch from ${initialMode} to ${modeNow} (or vice versa). ` +
      `Decide between using a controlled or uncontrolled mode for the lifetime of the component. ` +
      `More info: https://fb.me/react-controlled-components`
  );
}
