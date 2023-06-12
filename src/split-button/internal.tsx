// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { isValidElement, useEffect, useRef } from 'react';
import { SplitButtonProps } from './interfaces';
import styles from './styles.css.js';
import { warnOnce } from '../internal/logging';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';

// eslint-disable-next-line @cloudscape-design/ban-files
import Button, { ButtonProps } from '../button';
import buttonStyles from '../button/styles.css.js';

// eslint-disable-next-line @cloudscape-design/ban-files
import ButtonDropdown, { ButtonDropdownProps } from '../button-dropdown';

interface InternalSplitButtonProps extends SplitButtonProps, InternalBaseComponentProps {}

export default function InternalSplitButton({ children, __internalRootRef, ...props }: InternalSplitButtonProps) {
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const ref = useMergeRefs(splitButtonRef, __internalRootRef);
  const baseProps = getBaseProps(props);

  useEffect(() => {
    if (splitButtonRef.current) {
      getTriggers(splitButtonRef.current).forEach(buttonEl => buttonEl.classList.add(styles.trigger));
    }
  });

  return (
    <div ref={ref} {...baseProps} className={clsx(baseProps.className, styles.root)}>
      {validateChildren(children).map(({ element, classes }) => (
        <div key={element.key} className={clsx(classes)}>
          {element}
        </div>
      ))}
    </div>
  );
}

interface ChildWrapper {
  element: React.ReactElement<ButtonProps> | React.ReactElement<ButtonDropdownProps>;
  classes: string[];
}

function validateChildren(children: React.ReactNode): ChildWrapper[] {
  let firstElementVariant: undefined | 'normal' | 'primary';
  const childrenElements: ChildWrapper[] = [];
  const flattenedChildren = flattenChildren(children);

  for (let index = 0; index < flattenedChildren.length; index++) {
    const child = flattenedChildren[index];
    const isLastChild = index === flattenedChildren.length - 1;

    if (!isValidElement(child)) {
      warnOnce('SplitButton', 'Element children must be valid React elements.');
      continue;
    }

    const buttonElement = createButton(child, firstElementVariant);
    const buttonDropdownElement = createButtonDropdown(child, firstElementVariant);
    const elementToAdd = buttonElement || buttonDropdownElement;
    const elementClasses: string[] = [styles.item];

    if (!elementToAdd) {
      warnOnce('SplitButton', 'Only Button and ButtonDropdown are allowed as component children.');
      continue;
    }

    const elementVariant = getVariant(elementToAdd);
    if (!firstElementVariant) {
      firstElementVariant = elementVariant === 'normal' || elementVariant === 'primary' ? elementVariant : 'normal';
    }
    elementClasses.push(styles[`item-${firstElementVariant}`]);

    if (elementVariant !== 'normal' && elementVariant !== 'primary') {
      warnOnce('SplitButton', 'Only "normal" and "primary" variants are allowed.');
    }

    if (getVariant(elementToAdd) !== firstElementVariant) {
      warnOnce('SplitButton', 'All children must be of the same variant.');
    }

    if (buttonDropdownElement && !buttonDropdownElement.props.children && !isLastChild) {
      warnOnce('SplitButton', 'ButtonDropdown without label is only allowed at the last position.');
      break;
    }

    if (buttonDropdownElement && !buttonDropdownElement.props.children) {
      elementClasses.push(styles['item-icon-dropdown']);
    }

    childrenElements.push({ element: elementToAdd, classes: elementClasses });
  }

  if (childrenElements.length < 2) {
    warnOnce('SplitButton', 'The component requires at least 2 children.');
    return [];
  }

  return childrenElements;
}

function createButton(
  element: React.ReactElement,
  forcedVariant?: 'normal' | 'primary'
): null | React.ReactElement<ButtonProps> {
  if (element.type !== Button) {
    return null;
  }

  const {
    disabled,
    loading,
    loadingText,
    iconName,
    iconAlign,
    iconUrl,
    iconSvg,
    iconAlt,
    ariaLabel,
    ariaDescribedby,
    href,
    target,
    rel,
    download,
    children,
    onClick,
    onFollow,
    variant,
  } = element.props as ButtonProps;

  return React.cloneElement(
    { ...element, type: element.type },
    {
      formAction: 'none',
      variant: forcedVariant ?? variant,
      disabled,
      loading,
      loadingText,
      iconName,
      iconAlign,
      iconUrl,
      iconSvg,
      iconAlt,
      ariaLabel,
      ariaDescribedby,
      href,
      target,
      rel,
      download,
      children,
      onClick,
      onFollow,
    }
  );
}

function createButtonDropdown(
  element: React.ReactElement,
  forcedVariant?: 'normal' | 'primary'
): null | React.ReactElement<ButtonDropdownProps> {
  if (element.type !== ButtonDropdown) {
    return null;
  }

  const {
    items,
    disabled,
    loading,
    loadingText,
    expandToViewport,
    expandableGroups,
    ariaLabel,
    children,
    onItemClick,
    onItemFollow,
    variant,
  } = element.props as ButtonDropdownProps;

  return React.cloneElement(
    { ...element, type: element.type },
    {
      variant: forcedVariant ?? variant,
      items,
      disabled,
      loading,
      loadingText,
      expandToViewport,
      expandableGroups,
      ariaLabel,
      children,
      onItemClick,
      onItemFollow,
    }
  );
}

function getTriggers(root: HTMLElement) {
  return Array.from(root.querySelectorAll(`.${buttonStyles.button}`));
}

function getVariant(element: React.ReactElement<ButtonProps> | React.ReactElement<ButtonDropdownProps>) {
  return element.props.variant ?? 'normal';
}
