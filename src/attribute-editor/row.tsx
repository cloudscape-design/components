// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import InternalBox from '../box/internal';
import styles from './styles.css.js';
import React, { useCallback } from 'react';
import InternalFormField from '../form-field/internal';
import InternalColumnLayout, { ColumnLayoutBreakpoint } from '../column-layout/internal';
import { AttributeEditorProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import InternalGrid from '../grid/internal';
import { InternalButton } from '../button/internal';
import clsx from 'clsx';

const Divider = () => <InternalBox className={styles.divider} padding={{ top: 'l' }} />;

interface AttributeProps {
  info?: React.ReactNode;
  label?: React.ReactNode;
  errorText?: React.ReactNode;
  control?: React.ReactNode;
  constraintText?: React.ReactNode;
  hideLabel?: boolean;
}

const Attribute = ({ control, hideLabel, ...props }: AttributeProps) => (
  <InternalFormField __hideLabel={hideLabel} {...props} className={styles.field} stretch={true}>
    {control}
  </InternalFormField>
);

export interface RowProps<T> {
  breakpoint: ColumnLayoutBreakpoint | null;
  item: T;
  definition: ReadonlyArray<AttributeEditorProps.FieldDefinition<T>>;
  index: number;
  removable: boolean;
  removeButtonText: string;
  removeButtonRefs: Array<ButtonProps.Ref | undefined>;
  onRemoveButtonClick?: NonCancelableEventHandler<AttributeEditorProps.RemoveButtonClickDetail>;
}

const GRID_DEFINITION = [{ colspan: { default: 12, xs: 9 } }];
const REMOVABLE_GRID_DEFINITION = [{ colspan: { default: 12, xs: 9 } }, { colspan: { default: 12, xs: 3 } }];
export const Row = React.memo(
  <T,>({
    breakpoint,
    item,
    definition,
    index,
    removable,
    removeButtonText,
    removeButtonRefs,
    onRemoveButtonClick,
  }: RowProps<T>) => {
    const isNarrowViewport = breakpoint === 'default' || breakpoint === 'xxs';
    const isWideViewport = !isNarrowViewport;

    const handleRemoveClick = useCallback(() => {
      fireNonCancelableEvent(onRemoveButtonClick, { itemIndex: index });
    }, [onRemoveButtonClick, index]);

    const render = (item: T, itemIndex: number, slot: AttributeEditorProps.FieldRenderable<T> | React.ReactNode) =>
      typeof slot === 'function' ? slot(item, itemIndex) : slot;

    return (
      <InternalBox className={styles.row} margin={{ bottom: 's' }}>
        <InternalGrid
          __breakpoint={breakpoint}
          gridDefinition={removable ? REMOVABLE_GRID_DEFINITION : GRID_DEFINITION}
        >
          <InternalColumnLayout className={styles['row-control']} columns={definition.length} __breakpoint={breakpoint}>
            {definition.map(({ info, label, constraintText, errorText, control }, defIndex) => (
              <Attribute
                key={defIndex}
                label={label}
                info={info}
                constraintText={constraintText && render(item, index, constraintText)}
                errorText={errorText && render(item, index, errorText)}
                control={control && render(item, index, control)}
                hideLabel={isWideViewport && index > 0}
              />
            ))}
          </InternalColumnLayout>
          {removable && (
            <ButtonContainer index={index} isNarrowViewport={isNarrowViewport}>
              <InternalButton
                className={styles['remove-button']}
                formAction="none"
                ref={ref => {
                  removeButtonRefs[index] = ref ?? undefined;
                }}
                onClick={handleRemoveClick}
              >
                {removeButtonText}
              </InternalButton>
            </ButtonContainer>
          )}
        </InternalGrid>
        {isNarrowViewport && <Divider />}
      </InternalBox>
    );
  }
);

interface ButtonContainer {
  index: number;
  children: React.ReactNode;
  isNarrowViewport: boolean;
}

const ButtonContainer = ({ index, children, isNarrowViewport }: ButtonContainer) => (
  <div
    className={clsx({
      [styles['button-container']]: !isNarrowViewport && index === 0,
      [styles['right-align']]: isNarrowViewport,
    })}
  >
    {children}
  </div>
);
