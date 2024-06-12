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
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useInternalI18n } from '../i18n/context';

const Divider = () => <InternalBox className={styles.divider} padding={{ top: 'l' }} />;

export interface RowProps<T> {
  breakpoint: ColumnLayoutBreakpoint | null;
  item: T;
  definition: ReadonlyArray<AttributeEditorProps.FieldDefinition<T>>;
  i18nStrings: AttributeEditorProps.I18nStrings | undefined;
  index: number;
  removable: boolean;
  removeButtonText?: string;
  removeButtonRefs: Array<ButtonProps.Ref | undefined>;
  onRemoveButtonClick?: NonCancelableEventHandler<AttributeEditorProps.RemoveButtonClickDetail>;
  removeButtonAriaLabel?: (item: T) => string;
}

function render<T>(
  item: T,
  itemIndex: number,
  slot: AttributeEditorProps.FieldRenderable<T> | React.ReactNode | undefined
) {
  if (isSlotFunction(slot)) {
    return slot(item, itemIndex);
  }
  return slot;

  function isSlotFunction(slot: unknown): slot is AttributeEditorProps.FieldRenderable<T> {
    return typeof slot === 'function';
  }
}

const GRID_DEFINITION = [{ colspan: { default: 12, xs: 9 } }];
const REMOVABLE_GRID_DEFINITION = [{ colspan: { default: 12, xs: 9 } }, { colspan: { default: 12, xs: 3 } }];
export const Row = React.memo(
  <T,>({
    breakpoint,
    item,
    definition,
    i18nStrings = {},
    index,
    removable,
    removeButtonText,
    removeButtonRefs,
    onRemoveButtonClick,
    removeButtonAriaLabel,
  }: RowProps<T>) => {
    const i18n = useInternalI18n('attribute-editor');
    const isNarrowViewport = breakpoint === 'default' || breakpoint === 'xxs';
    const isWideViewport = !isNarrowViewport;

    const handleRemoveClick = useCallback(() => {
      fireNonCancelableEvent(onRemoveButtonClick, { itemIndex: index });
    }, [onRemoveButtonClick, index]);

    const firstControlId = useUniqueId('first-control-id-');

    return (
      <InternalBox className={styles.row} margin={{ bottom: 's' }}>
        <div role="group" aria-labelledby={`${firstControlId}-label ${firstControlId}`}>
          <InternalGrid
            __breakpoint={breakpoint}
            gridDefinition={removable ? REMOVABLE_GRID_DEFINITION : GRID_DEFINITION}
          >
            <InternalColumnLayout
              className={styles['row-control']}
              columns={definition.length}
              __breakpoint={breakpoint}
            >
              {definition.map(({ info, label, constraintText, errorText, warningText, control }, defIndex) => (
                <InternalFormField
                  key={defIndex}
                  className={styles.field}
                  label={label}
                  info={info}
                  constraintText={render(item, index, constraintText)}
                  errorText={render(item, index, errorText)}
                  warningText={render(item, index, warningText)}
                  stretch={true}
                  i18nStrings={{
                    errorIconAriaLabel: i18nStrings.errorIconAriaLabel,
                    warningIconAriaLabel: i18nStrings.warningIconAriaLabel,
                  }}
                  __hideLabel={isWideViewport && index > 0}
                  controlId={defIndex === 0 ? firstControlId : undefined}
                >
                  {render(item, index, control)}
                </InternalFormField>
              ))}
            </InternalColumnLayout>
            {removable && (
              <ButtonContainer
                index={index}
                isNarrowViewport={isNarrowViewport}
                hasLabel={definition.some(row => row.label)}
              >
                <InternalButton
                  className={styles['remove-button']}
                  formAction="none"
                  ref={ref => {
                    removeButtonRefs[index] = ref ?? undefined;
                  }}
                  ariaLabel={(removeButtonAriaLabel ?? i18nStrings.removeButtonAriaLabel)?.(item)}
                  onClick={handleRemoveClick}
                >
                  {i18n('removeButtonText', removeButtonText)}
                </InternalButton>
              </ButtonContainer>
            )}
          </InternalGrid>
        </div>
        {isNarrowViewport && <Divider />}
      </InternalBox>
    );
  }
) as <T>(props: RowProps<T>) => JSX.Element;

interface ButtonContainer {
  index: number;
  children: React.ReactNode;
  isNarrowViewport: boolean;
  hasLabel: boolean;
}

const ButtonContainer = ({ index, children, isNarrowViewport, hasLabel }: ButtonContainer) => (
  <div
    className={clsx({
      [styles['button-container-haslabel']]: !isNarrowViewport && index === 0 && hasLabel,
      [styles['button-container-nolabel']]: !isNarrowViewport && index === 0 && !hasLabel,
      [styles['right-align']]: isNarrowViewport,
    })}
  >
    {children}
  </div>
);
