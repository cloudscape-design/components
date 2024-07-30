// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
// import { ButtonProps } from '../../button/interfaces.js';
import TriggerButton from '../visual-refresh/trigger-button';
// import TriggerButton, {  TriggerButtonProps } from '../visual-refresh/trigger-button';
import { render } from '@testing-library/react';
// import createWrapper from '../../../lib/components/test-utils/dom';

// const wrappers = {
//   triggerButton: createWrapper().findButton(),
//   triggerWrapper: createWrapper().findByClassName("trigger-wrapper"),
//   tooltip: createWrapper().findByClassName(tooltipStyles.root),
//   tooltipContent: createWrapper().findByClassName(popoverStyles.content),
// };

// const testIf = (condition: boolean) => (condition ? test : test.skip);

// const mockProps = {
//   ariaLabel: "Aria label",
//   className: "class-from-props",
// iconName: "external",
// iconSvg?: React.ReactNode;
// ariaExpanded: boolean | undefined;
// ariaControls?: string;
// testId: "mockTestId",
// tooltipText?: string;
// selected?: boolean;
// badge?: boolean;
// highContrastHeader?: boolean;
// }

// function renderTriggerButton(props:  TriggerButtonProps | {} = {}) {
//   const renderProps = {...mockProps, ...props};
//   const renderResult = render(
//       <TriggerButton {...mockProps as any} />
//   );
//   return {
//     wrapper: createWrapper(renderResult.container),
//     ...renderResult,
//   }
// }

describe('Toolbar desktop trigger-button', () => {
  it('renders correctly with iconName', () => {
    const mockButtonClick = jest.fn();
    const result = render(<TriggerButton ariaExpanded={false} onClick={mockButtonClick} />);
    expect(result.container).toBeTruthy();
    // const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
    // console.log(ref)
    // const result = renderTriggerButton({} as TriggerButtonProps, ref as any);
    // const button = result.wrapper.findButton();
    // expect(button).toBeTruthy();
    // expect(button!.getElement().ariaLabel).toEqual(mockProps.ariaLabel);
    // expect(result.wrapper.findIcon()).toBeTruthy();
    // expect(result.wrapper.findByClassName(tooltipStyles.root)).toBeNull();
  });

  // it("renders correctly with iconSvg", () => {
  //   const iconTestId="icon-test-id"
  //   const icon = (
  //     <svg data-testid={iconTestId} viewBox="0 0 24 24">
  //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  //     </svg>
  //   );
  //   const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
  //   const result = renderTriggerButton({
  //     iconSvg: icon,
  //   } as TriggerButtonProps, ref);
  //   const button = result.wrapper.findButton();
  //   expect(button).toBeTruthy();
  //   expect(button!.getElement().ariaLabel).toEqual(mockProps.ariaLabel);
  //   expect(wrapper.findIcon()).toBeTruthy();
  //   expect(result.getByTestId(iconTestId)).toBeTruthy();
  //   expect(wrapper.findByClassName(tooltipStyles.root)).toBeNull();
  // });

  // it("does not render without either an iconName or iconSVG prop", () => {
  //   const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
  //   const result = renderTriggerButton({
  //     iconName: "",
  //     iconSvg: "",
  //   }, ref);
  //   expect(result.wrapper.findButton()).toBeNull();
  //   expect(wrapper.findIcon()).toBeTruthy();
  //   expect(wrapper.findByClassName(tooltipStyles.root)).toBeNull();
  // })

  // describe("Trigger wrapper events", () => {
  //   it("SDFSD", () => {
  //     const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
  //     const wrapper = renderTriggerButton({} as TriggerButtonProps, ref)
  //     expect(wrapper.findTooltip()).toBeNull();

  //   })
  // })

  // describe('Ref', () => {
  //   test('can be used to focus the component', () => {
  //     const ref = React.createRef<React.Ref<ButtonProps.Ref>>();
  //     const wrapper = renderWrappedTriggerButton({} as TriggerButtonProps, ref)
  //     const triggerButton = wrapper.findTrigger().getElement();
  //     expect(document.activeElement).not.toBe(triggerButton);
  //     (ref.current as any)!.focus();
  //     expect(document.activeElement).toBe(triggerButton);
  //   });
  // })
});
