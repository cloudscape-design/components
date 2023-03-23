// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import SpaceBetween from '../space-between/internal';

import { TokenGroupProps } from './interfaces';
import DismissButton from './dismiss-button';
import SelectToggle from './toggle';

import styles from './styles.css.js';

interface ItemAttributes {
  disabled?: boolean;
  dismiss?: {
    label?: string;
  };
  onDismiss: () => void;
}

export interface GenericTokenGroupProps<Item> extends BaseComponentProps, InternalBaseComponentProps {
  items: readonly Item[];
  limit?: number;
  alignment: TokenGroupProps.Alignment;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  getItemAttributes: (item: Item, itemIndex: number) => ItemAttributes;
  i18nStrings?: TokenGroupProps.I18nStrings;
}

export interface GenericTokenGroupRef {
  focusToken(tokenIndex: number): void;
}

export default forwardRef(GenericTokenGroup) as <T>(
  props: GenericTokenGroupProps<T> & { ref?: React.ForwardedRef<GenericTokenGroupRef> }
) => ReturnType<typeof GenericTokenGroup>;

function GenericTokenGroup<Item>(
  { items, alignment, renderItem, getItemAttributes, limit, __internalRootRef, ...props }: GenericTokenGroupProps<Item>,
  ref: React.Ref<GenericTokenGroupRef>
) {
  const showMoreButtonRef = useRef<HTMLButtonElement>(null);
  const dismissButtonRefs = useRef<{ [key: number]: HTMLButtonElement }>({});
  const [removedItemIndex, setRemovedItemIndex] = useState<null | number>(null);
  const [expanded, setExpanded] = useState(false);
  const controlId = useUniqueId();

  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const slicedItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  const baseProps = getBaseProps(props);
  const className = clsx(baseProps.className, styles.root, hasItems && styles['has-items']);

  useImperativeHandle(ref, () => ({
    focusToken: index => dismissButtonRefs.current[index]?.focus(),
  }));

  useEffect(() => {
    if (removedItemIndex === null) {
      return;
    }

    const activeItemIndices = Object.keys(dismissButtonRefs.current).map(key => parseInt(key));

    let closestPrevIndex = Number.NEGATIVE_INFINITY;
    let closestNextIndex = Number.POSITIVE_INFINITY;

    for (const activeIndex of activeItemIndices) {
      if (activeIndex < removedItemIndex) {
        closestPrevIndex =
          removedItemIndex - activeIndex < removedItemIndex - closestPrevIndex ? activeIndex : closestPrevIndex;
      } else {
        closestNextIndex =
          activeIndex - removedItemIndex < closestNextIndex - removedItemIndex ? activeIndex : closestNextIndex;
      }
    }

    if (dismissButtonRefs.current[closestNextIndex]) {
      dismissButtonRefs.current[closestNextIndex].focus();
    } else if (dismissButtonRefs.current[closestPrevIndex]) {
      dismissButtonRefs.current[closestPrevIndex].focus();
    } else if (showMoreButtonRef.current) {
      showMoreButtonRef.current.focus();
    }

    setRemovedItemIndex(null);
  }, [removedItemIndex]);

  return (
    <div {...baseProps} className={className} ref={__internalRootRef}>
      {hasItems && (
        <SpaceBetween id={controlId} direction={alignment} size="xs">
          {slicedItems.map((item, itemIndex) => {
            const itemAttributes = getItemAttributes(item, itemIndex);
            const onDismiss = () => {
              itemAttributes?.onDismiss();
              setRemovedItemIndex(itemIndex);
            };
            return (
              <GenericToken
                key={itemIndex}
                ref={elem => {
                  if (elem && !itemAttributes.disabled) {
                    dismissButtonRefs.current[itemIndex] = elem;
                  } else {
                    delete dismissButtonRefs.current[itemIndex];
                  }
                }}
                {...itemAttributes}
                onDismiss={onDismiss}
              >
                {renderItem(item, itemIndex)}
              </GenericToken>
            );
          })}
        </SpaceBetween>
      )}
      {hasHiddenItems && (
        <SelectToggle
          ref={showMoreButtonRef}
          controlId={controlId}
          allHidden={limit === 0}
          expanded={expanded}
          numberOfHiddenOptions={items.length - slicedItems.length}
          i18nStrings={props.i18nStrings}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}

interface GenericTokenProps extends ItemAttributes {
  children: React.ReactNode;
}

const GenericToken = forwardRef(
  ({ disabled, dismiss, onDismiss, children }: GenericTokenProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <div
        className={clsx(styles.token, disabled && styles['token-disabled'])}
        aria-disabled={disabled ? 'true' : undefined}
      >
        {children}
        {dismiss && <DismissButton ref={ref} disabled={disabled} dismissLabel={dismiss.label} onDismiss={onDismiss} />}
      </div>
    );
  }
);
