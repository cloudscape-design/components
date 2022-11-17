// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';

import { InputProps } from '../input/interfaces';
import { AutosuggestProps } from '../autosuggest/interfaces';
import { AttributeEditorProps } from '../attribute-editor/interfaces';
import InternalAttributeEditor from '../attribute-editor/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import InternalBox from '../box/internal';
import { FormFieldError } from '../form-field/internal';

import { TagControl, UndoButton } from './internal';
import { TagEditorProps } from './interfaces';
import { validate, ValidationError } from './validation';
import { findIndex, useMemoizedArray } from './utils';

import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import LiveRegion from '../internal/components/live-region';

export { TagEditorProps };

interface InternalTag {
  tag: TagEditorProps.Tag;
  error?: ValidationError;
}

const isItemRemovable = ({ tag }: InternalTag) => !tag.markedForRemoval;

const TagEditor = React.forwardRef(
  (
    {
      tags = [],
      i18nStrings,
      loading = false,
      tagLimit = 50,
      allowedCharacterPattern,
      keysRequest,
      valuesRequest,
      onChange,
      ...restProps
    }: TagEditorProps,
    ref: React.Ref<TagEditorProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('TagEditor');

    const remainingTags = tagLimit - tags.filter(tag => !tag.markedForRemoval).length;

    const attributeEditorRef = useRef<AttributeEditorProps.Ref>(null);
    const keyInputRefs = useRef<(InputProps.Ref | undefined | null)[]>([]);
    const valueInputRefs = useRef<(InputProps.Ref | undefined | null)[]>([]);
    const undoButtonRefs = useRef<(HTMLAnchorElement | undefined | null)[]>([]);

    const initialKeyOptionsRef = useRef<AutosuggestProps.Options>([]);
    const keyDirtyStateRef = useRef<boolean[]>([]);
    const focusEventRef = useRef<() => void>();

    useLayoutEffect(() => {
      focusEventRef.current?.apply(undefined);
      focusEventRef.current = undefined;
    });

    const errors = validate(
      tags,
      keyDirtyStateRef.current,
      i18nStrings,
      allowedCharacterPattern ? new RegExp(allowedCharacterPattern) : undefined
    );

    const internalTags = useMemoizedArray(
      tags.map((tag, i) => ({ tag, error: errors[i] })),
      (prev, next) => {
        return prev.tag === next.tag && prev.error?.key === next.error?.key && prev.error?.value === next.error?.value;
      }
    );

    useImperativeHandle(
      ref,
      () => ({
        focus() {
          const errorIndex = findIndex(internalTags, ({ error }) => error?.key || error?.value);
          if (errorIndex !== -1) {
            const refArray = internalTags[errorIndex].error?.key ? keyInputRefs : valueInputRefs;
            refArray.current[errorIndex]?.focus();
          }
        },
      }),
      [internalTags]
    );

    const validateAndFire = useCallback(
      (newTags: ReadonlyArray<TagEditorProps.Tag>) => {
        fireNonCancelableEvent(onChange, {
          tags: newTags,
          valid: !validate(
            newTags,
            keyDirtyStateRef.current,
            i18nStrings,
            allowedCharacterPattern ? new RegExp(allowedCharacterPattern) : undefined
          ).some(error => error),
        });
      },
      [onChange, i18nStrings, allowedCharacterPattern]
    );

    const onAddButtonClick = () => {
      validateAndFire([...tags, { key: '', value: '', existing: false }]);
      focusEventRef.current = () => {
        keyInputRefs.current[tags.length]?.focus();
      };
    };

    const onRemoveButtonClick = useStableEventHandler(
      ({ detail }: NonCancelableCustomEvent<AttributeEditorProps.RemoveButtonClickDetail>) => {
        const existing = tags[detail.itemIndex].existing;
        validateAndFire([
          ...tags.slice(0, detail.itemIndex),
          ...(existing ? [{ ...tags[detail.itemIndex], markedForRemoval: true }] : []),
          ...tags.slice(detail.itemIndex + 1),
        ]);
        if (existing) {
          focusEventRef.current = () => {
            undoButtonRefs.current[detail.itemIndex]?.focus();
          };
        } else {
          keyDirtyStateRef.current.splice(detail.itemIndex, 1);
          keyInputRefs.current[detail.itemIndex]?.focus();
        }
      }
    );

    const onKeyChange = useStableEventHandler((value: string, row: number) => {
      keyDirtyStateRef.current[row] = true;
      validateAndFire([...tags.slice(0, row), { ...tags[row], key: value }, ...tags.slice(row + 1)]);
    });

    const onKeyBlur = useStableEventHandler((row: number) => {
      keyDirtyStateRef.current[row] = true;
      // Force re-render by providing a new array reference
      validateAndFire([...tags]);
    });

    const onValueChange = useStableEventHandler((value: string, row: number) => {
      validateAndFire([...tags.slice(0, row), { ...tags[row], value }, ...tags.slice(row + 1)]);
    });

    const onUndoRemoval = useStableEventHandler((row: number) => {
      validateAndFire([...tags.slice(0, row), { ...tags[row], markedForRemoval: false }, ...tags.slice(row + 1)]);
      focusEventRef.current = () => {
        attributeEditorRef.current?.focusRemoveButton(row);
      };
    });

    const definition = useMemo(
      () => [
        {
          label: i18nStrings.keyHeader,
          control: ({ tag }: InternalTag, row: number) => (
            <TagControl
              row={row}
              value={tag.key}
              readOnly={tag.existing}
              limit={200}
              defaultOptions={[]}
              placeholder={i18nStrings.keyPlaceholder}
              errorText={i18nStrings.keysSuggestionError}
              loadingText={i18nStrings.keysSuggestionLoading}
              suggestionText={i18nStrings.keySuggestion}
              tooManySuggestionText={i18nStrings.tooManyKeysSuggestion}
              enteredTextLabel={i18nStrings.enteredKeyLabel}
              onRequest={keysRequest}
              onChange={onKeyChange}
              onBlur={onKeyBlur}
              initialOptionsRef={initialKeyOptionsRef}
              ref={ref => {
                keyInputRefs.current[row] = ref;
              }}
            />
          ),
          errorText: ({ error }: InternalTag) => error?.key,
        },
        {
          label: (
            <>
              {i18nStrings.valueHeader} - <i>{i18nStrings.optional}</i>
            </>
          ),
          control: ({ tag }: InternalTag, row: number) =>
            tag.markedForRemoval ? (
              <div role="alert">
                <InternalBox margin={{ top: 'xxs' }}>
                  {i18nStrings.undoPrompt}{' '}
                  <UndoButton
                    onClick={() => onUndoRemoval(row)}
                    ref={elem => {
                      undoButtonRefs.current[row] = elem;
                    }}
                  >
                    {i18nStrings.undoButton}
                  </UndoButton>
                </InternalBox>
              </div>
            ) : (
              <TagControl
                row={row}
                value={tag.value}
                readOnly={false}
                limit={200}
                defaultOptions={tag.valueSuggestionOptions ?? []}
                placeholder={i18nStrings.valuePlaceholder}
                errorText={i18nStrings.valuesSuggestionError}
                loadingText={i18nStrings.valuesSuggestionLoading}
                suggestionText={i18nStrings.valueSuggestion}
                tooManySuggestionText={i18nStrings.tooManyValuesSuggestion}
                enteredTextLabel={i18nStrings.enteredValueLabel}
                filteringKey={tag.key}
                onRequest={valuesRequest && (value => valuesRequest(tag.key, value))}
                onChange={onValueChange}
                ref={ref => {
                  valueInputRefs.current[row] = ref;
                }}
              />
            ),
          errorText: ({ error }: InternalTag) => error?.value,
        },
      ],
      [i18nStrings, keysRequest, onKeyChange, onKeyBlur, valuesRequest, onValueChange, onUndoRemoval]
    );

    if (loading) {
      return (
        <div className={styles.root} ref={baseComponentProps.__internalRootRef}>
          <InternalStatusIndicator className={styles.loading} type="loading">
            <LiveRegion visible={true}>{i18nStrings.loading}</LiveRegion>
          </InternalStatusIndicator>
        </div>
      );
    }

    const baseProps = getBaseProps(restProps);
    return (
      <InternalAttributeEditor<InternalTag>
        {...baseProps}
        {...baseComponentProps}
        ref={attributeEditorRef}
        className={clsx(styles.root, baseProps.className)}
        items={internalTags}
        isItemRemovable={isItemRemovable}
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
        addButtonText={i18nStrings.addButton}
        removeButtonText={i18nStrings.removeButton}
        disableAddButton={remainingTags <= 0}
        empty={i18nStrings.emptyTags}
        additionalInfo={
          <div aria-live="polite">
            {remainingTags < 0 ? (
              <FormFieldError errorIconAriaLabel={i18nStrings.errorIconAriaLabel}>
                {i18nStrings.tagLimitExceeded(tagLimit) ?? ''}
              </FormFieldError>
            ) : remainingTags === 0 ? (
              i18nStrings.tagLimitReached(tagLimit) ?? ''
            ) : (
              i18nStrings.tagLimit(remainingTags, tagLimit)
            )}
          </div>
        }
        definition={definition}
        i18nStrings={i18nStrings}
      />
    );
  }
);

applyDisplayName(TagEditor, 'TagEditor');
export default TagEditor;
