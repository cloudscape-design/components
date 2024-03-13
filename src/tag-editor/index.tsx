// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events';

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
import { useInternalI18n } from '../i18n/context';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

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
    const baseComponentProps = useBaseComponent('TagEditor', {
      props: { tagLimit, allowedCharacterPattern },
    });
    const i18n = useInternalI18n('tag-editor');

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
      i18n,
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
            i18n,
            i18nStrings,
            allowedCharacterPattern ? new RegExp(allowedCharacterPattern) : undefined
          ).some(error => error),
        });
      },
      [onChange, i18n, i18nStrings, allowedCharacterPattern]
    );

    const onAddButtonClick = () => {
      validateAndFire([...tags, { key: '', value: '', existing: false }]);
      focusEventRef.current = () => {
        keyInputRefs.current[tags.length]?.focus();
      };
    };

    const onRemoveButtonClick = useStableCallback(
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
          const nextKey = keyInputRefs.current[detail.itemIndex + 1];
          if (nextKey) {
            // if next key is present, focus _current_ key which will be replaced by next after state update
            keyInputRefs.current[detail.itemIndex]?.focus();
          } else if (detail.itemIndex > 0) {
            // otherwise focus previous key/value/undo button
            const previousIsExisting = tags[detail.itemIndex - 1].existing;
            if (previousIsExisting) {
              if (tags[detail.itemIndex - 1].markedForRemoval) {
                undoButtonRefs.current[detail.itemIndex - 1]?.focus();
              } else {
                valueInputRefs.current[detail.itemIndex - 1]?.focus();
              }
            } else {
              keyInputRefs.current[detail.itemIndex - 1]?.focus();
            }
          } else {
            // or the 'add' button
            attributeEditorRef.current?.focusAddButton();
          }
        }
      }
    );

    const onKeyChange = useStableCallback((value: string, row: number) => {
      keyDirtyStateRef.current[row] = true;
      validateAndFire([...tags.slice(0, row), { ...tags[row], key: value }, ...tags.slice(row + 1)]);
    });

    const onKeyBlur = useStableCallback((row: number) => {
      keyDirtyStateRef.current[row] = true;
      // Force re-render by providing a new array reference
      validateAndFire([...tags]);
    });

    const onValueChange = useStableCallback((value: string, row: number) => {
      validateAndFire([...tags.slice(0, row), { ...tags[row], value }, ...tags.slice(row + 1)]);
    });

    const onUndoRemoval = useStableCallback((row: number) => {
      validateAndFire([...tags.slice(0, row), { ...tags[row], markedForRemoval: false }, ...tags.slice(row + 1)]);
      focusEventRef.current = () => {
        attributeEditorRef.current?.focusRemoveButton(row);
      };
    });

    const definition = useMemo(
      () => [
        {
          label: i18n('i18nStrings.keyHeader', i18nStrings?.keyHeader),
          control: ({ tag }: InternalTag, row: number) => (
            <TagControl
              row={row}
              value={tag.key}
              readOnly={tag.existing}
              limit={200}
              defaultOptions={[]}
              placeholder={i18n('i18nStrings.keyPlaceholder', i18nStrings?.keyPlaceholder)}
              errorText={i18n('i18nStrings.keysSuggestionError', i18nStrings?.keysSuggestionError)}
              loadingText={i18n('i18nStrings.keysSuggestionLoading', i18nStrings?.keysSuggestionLoading)}
              suggestionText={i18n('i18nStrings.keySuggestion', i18nStrings?.keySuggestion)}
              tooManySuggestionText={i18n('i18nStrings.tooManyKeysSuggestion', i18nStrings?.tooManyKeysSuggestion)}
              enteredTextLabel={i18nStrings?.enteredKeyLabel}
              clearAriaLabel={i18nStrings?.clearAriaLabel}
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
              {i18n('i18nStrings.valueHeader', i18nStrings?.valueHeader)} -{' '}
              <i>{i18n('i18nStrings.optional', i18nStrings?.optional)}</i>
            </>
          ),
          control: ({ tag }: InternalTag, row: number) =>
            tag.markedForRemoval ? (
              <div role="alert">
                <InternalBox margin={{ top: 'xxs' }}>
                  {i18n('i18nStrings.undoPrompt', i18nStrings?.undoPrompt)}{' '}
                  <UndoButton
                    onClick={() => onUndoRemoval(row)}
                    ref={elem => {
                      undoButtonRefs.current[row] = elem;
                    }}
                  >
                    {i18n('i18nStrings.undoButton', i18nStrings?.undoButton)}
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
                placeholder={i18n('i18nStrings.valuePlaceholder', i18nStrings?.valuePlaceholder)}
                errorText={i18n('i18nStrings.valuesSuggestionError', i18nStrings?.valuesSuggestionError)}
                loadingText={i18n('i18nStrings.valuesSuggestionLoading', i18nStrings?.valuesSuggestionLoading)}
                suggestionText={i18n('i18nStrings.valueSuggestion', i18nStrings?.valueSuggestion)}
                tooManySuggestionText={i18n(
                  'i18nStrings.tooManyValuesSuggestion',
                  i18nStrings?.tooManyValuesSuggestion
                )}
                enteredTextLabel={i18nStrings?.enteredValueLabel}
                clearAriaLabel={i18nStrings?.clearAriaLabel}
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
      [i18n, i18nStrings, keysRequest, onKeyChange, onKeyBlur, valuesRequest, onValueChange, onUndoRemoval]
    );

    const forwardedI18nStrings = useMemo<AttributeEditorProps.I18nStrings<InternalTag>>(
      () => ({
        errorIconAriaLabel: i18nStrings?.errorIconAriaLabel,
        itemRemovedAriaLive: i18nStrings?.itemRemovedAriaLive,
        removeButtonAriaLabel: i18n(
          'i18nStrings.removeButtonAriaLabel',
          i18nStrings?.removeButtonAriaLabel && (({ tag }) => i18nStrings.removeButtonAriaLabel!(tag)),
          format =>
            ({ tag }) =>
              format({ tag__key: tag.key })
        ),
      }),
      [i18nStrings, i18n]
    );

    if (loading) {
      return (
        <div className={styles.root} ref={baseComponentProps.__internalRootRef}>
          <InternalStatusIndicator className={styles.loading} type="loading">
            <LiveRegion visible={true}>{i18n('i18nStrings.loading', i18nStrings?.loading)}</LiveRegion>
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
        addButtonText={i18n('i18nStrings.addButton', i18nStrings?.addButton) ?? ''}
        removeButtonText={i18nStrings?.removeButton}
        disableAddButton={remainingTags <= 0}
        empty={i18n('i18nStrings.emptyTags', i18nStrings?.emptyTags)}
        additionalInfo={
          remainingTags < 0 ? (
            <FormFieldError errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
              {i18n('i18nStrings.tagLimitExceeded', i18nStrings?.tagLimitExceeded?.(tagLimit), format =>
                format({ tagLimit })
              ) ?? ''}
            </FormFieldError>
          ) : remainingTags === 0 ? (
            i18n('i18nStrings.tagLimitReached', i18nStrings?.tagLimitReached?.(tagLimit), format =>
              format({ tagLimit })
            ) ?? ''
          ) : (
            i18n('i18nStrings.tagLimit', i18nStrings?.tagLimit?.(remainingTags, tagLimit), format =>
              format({ tagLimitAvailable: `${remainingTags === tagLimit}`, availableTags: remainingTags, tagLimit })
            )
          )
        }
        definition={definition}
        i18nStrings={forwardedI18nStrings}
      />
    );
  }
);

applyDisplayName(TagEditor, 'TagEditor');
export default TagEditor;
