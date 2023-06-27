// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { isDevelopment } from '../../is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

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
 * @param handler update handler for controlled mode
 * @param defaultValue initial value for uncontrolled mode
 * @param description property metadata
 */
export function useControllable<ValueType>(
  controlledValue: ValueType,
  handler: ((...args: any[]) => unknown) | undefined,
  defaultValue: ValueType,
  { componentName, changeHandler, controlledProp }: PropertyDescription
) {
  // The decision whether a component is controlled or uncontrolled is made on its first render and cannot be changed afterwards.
  const isControlled = React.useState(controlledValue !== undefined)[0];

  if (isDevelopment) {
    // Print a warning if the component switches between controlled and uncontrolled mode.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (isControlled && handler === undefined) {
        warnOnce(
          componentName,
          `You provided a \`${controlledProp}\` prop without an \`${changeHandler}\` handler. This will render a non-interactive component.`
        );
      }
    }, [handler, isControlled, componentName, changeHandler, controlledProp]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const isControlledNow = controlledValue !== undefined;
      if (isControlled !== isControlledNow) {
        const initialMode = isControlled ? 'controlled' : 'uncontrolled';
        const modeNow = isControlledNow ? 'controlled' : 'uncontrolled';
        warnOnce(
          componentName,
          `A component tried to change ${initialMode} '${controlledProp}' property to be ${modeNow}. ` +
            `This is not supported. Properties should not switch from ${initialMode} to ${modeNow} (or vice versa). ` +
            `Decide between using a controlled or uncontrolled mode for the lifetime of the component. ` +
            `More info: https://fb.me/react-controlled-components`
        );
      }
    }, [isControlled, controlledProp, componentName, controlledValue]);
  }

  // This is the value that is used if the component is uncontrolled.
  const [valueState, setValue] = React.useState(defaultValue);
  const [valueHasBeenSet, setValueHasBeenSet] = React.useState(false);

  // We track changes to the defaultValue
  const currentUncontrolledValue = valueHasBeenSet ? valueState : defaultValue;

  const setUncontrolledValue = React.useCallback(
    (newValue: React.SetStateAction<ValueType>) => {
      setValue(newValue);
      setValueHasBeenSet(true);
    },
    [setValue, setValueHasBeenSet]
  );

  if (isControlled) {
    return [controlledValue, defaultCallback] as const;
  } else {
    return [currentUncontrolledValue, setUncontrolledValue] as const;
  }
}

function defaultCallback() {
  return void 0;
}
