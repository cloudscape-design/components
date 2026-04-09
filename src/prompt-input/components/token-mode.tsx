// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import Dropdown from '../../dropdown/internal';
import DropdownFooter from '../../internal/components/dropdown-footer';
import { DropdownStatusResult } from '../../internal/components/dropdown-status';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { PromptInputProps } from '../interfaces';
import MenuDropdown from './menu-dropdown';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/** Props for the token-mode contentEditable input and its associated menu dropdown. */
interface TokenModeProps {
  /** Ref to the contentEditable div */
  editableElementRef: React.RefObject<HTMLDivElement>;
  /** Ref to the active trigger element, used to anchor the dropdown */
  triggerWrapperRef: React.MutableRefObject<HTMLElement | null>;

  controlId?: string;
  menuListId: string;
  menuFooterControlId: string;
  highlightedMenuOptionId?: string;

  /** When set, renders a hidden input for native form submission */
  name?: string;
  /** Plain text representation of the current tokens */
  plainTextValue: string;
  menuIsOpen: boolean;
  /** True once the trigger element is mounted and ready for dropdown positioning */
  triggerWrapperReady: boolean;
  shouldRenderMenuDropdown: boolean;

  activeMenu: PromptInputProps.MenuDefinition | null;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  menuFilterText: string;
  menuItemsState: MenuItemsState | null;
  menuItemsHandlers: MenuItemsHandlers | null;
  menuDropdownStatus: DropdownStatusResult | null;

  handleInput: () => void;
  handleLoadMore: () => void;

  /** Spread onto the contentEditable div — includes aria attrs, className, and event handlers */
  editableElementAttributes: React.HTMLAttributes<HTMLDivElement> & {
    'data-placeholder'?: string;
  };

  i18nStrings?: PromptInputProps['i18nStrings'];

  maxMenuHeight?: number;
}

const MENU_MIN_WIDTH = 300;

export default function TokenMode({
  editableElementRef,
  triggerWrapperRef,
  controlId,
  menuListId,
  menuFooterControlId,
  highlightedMenuOptionId,
  name,
  plainTextValue,
  menuIsOpen,
  triggerWrapperReady,
  shouldRenderMenuDropdown,
  activeMenu,
  activeTriggerToken,
  menuFilterText,
  menuItemsState,
  menuItemsHandlers,
  menuDropdownStatus,
  maxMenuHeight,
  handleInput,
  handleLoadMore,
  editableElementAttributes,
}: TokenModeProps) {
  return (
    <>
      {/* Hidden input enables native form submission with the plain text value when a name is provided */}
      {name && <input type="hidden" name={name} value={plainTextValue} />}
      <div className={styles['editable-wrapper']}>
        <div
          id={controlId}
          ref={editableElementRef}
          role="textbox"
          aria-multiline="true"
          aria-haspopup="listbox"
          aria-expanded={menuIsOpen && shouldRenderMenuDropdown}
          contentEditable={
            !editableElementAttributes['aria-disabled'] && !editableElementAttributes['aria-readonly']
              ? 'true'
              : 'false'
          }
          // React warns when children of a contentEditable element are managed by React.
          // We suppress this because we intentionally manage the DOM directly via token-renderer
          // to avoid React's reconciliation conflicting with browser-native editing behavior.
          suppressContentEditableWarning={true}
          aria-controls={menuIsOpen ? menuListId : undefined}
          // aria-owns needed for Safari+VoiceOver to announce activedescendant content
          aria-owns={menuIsOpen ? menuListId : undefined}
          aria-activedescendant={highlightedMenuOptionId}
          onInput={handleInput}
          {...editableElementAttributes}
          className={clsx(
            editableElementAttributes.className,
            testutilStyles['content-editable'],
            styles['editable-element']
          )}
        />
        <Dropdown
          minWidth={MENU_MIN_WIDTH}
          maxHeight={maxMenuHeight}
          expandToViewport={true}
          open={
            !!(
              shouldRenderMenuDropdown &&
              triggerWrapperReady &&
              menuIsOpen &&
              menuItemsState &&
              (menuItemsState.items.length > 0 || menuDropdownStatus?.content)
            )
          }
          trigger={null}
          triggerRef={triggerWrapperRef}
          triggerId={activeTriggerToken?.id}
          contentKey={
            triggerWrapperReady
              ? `trigger-${activeTriggerToken?.id}-${activeTriggerToken?.triggerChar}-${menuItemsState ? menuItemsState.items.length > 0 : false}`
              : undefined
          }
          /* istanbul ignore next -- integ test: src/prompt-input/__integ__/prompt-input-token-mode.test.ts > "clicking a menu option inserts reference and retains focus" */
          onMouseDown={event => {
            // Prevent default to stop the dropdown from stealing focus from the contentEditable.
            // Without this, clicking a menu option would blur the input before the selection handler fires.
            event.preventDefault();
          }}
          footer={
            menuDropdownStatus?.isSticky && menuDropdownStatus.content ? (
              <DropdownFooter
                id={menuFooterControlId}
                content={menuDropdownStatus.content}
                hasItems={menuItemsState ? menuItemsState.items.length >= 1 : false}
              />
            ) : null
          }
          content={
            <>
              {shouldRenderMenuDropdown && menuItemsState && menuItemsHandlers && activeMenu && (
                <MenuDropdown
                  menu={activeMenu}
                  statusType={activeMenu.statusType ?? 'finished'}
                  menuItemsState={menuItemsState}
                  menuItemsHandlers={menuItemsHandlers}
                  highlightedOptionId={highlightedMenuOptionId}
                  highlightText={menuFilterText}
                  listId={menuListId}
                  controlId={controlId ?? ''}
                  handleLoadMore={handleLoadMore}
                  hasDropdownStatus={menuDropdownStatus?.content !== null}
                  listBottom={
                    !menuDropdownStatus?.isSticky && menuDropdownStatus?.content ? (
                      <DropdownFooter content={menuDropdownStatus.content} id={menuFooterControlId} />
                    ) : null
                  }
                  ariaDescribedby={menuDropdownStatus?.content ? menuFooterControlId : undefined}
                />
              )}
            </>
          }
        />
      </div>
    </>
  );
}
