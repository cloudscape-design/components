// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Dropdown from '../../internal/components/dropdown';
import DropdownFooter from '../../internal/components/dropdown-footer';
import { MenuItemsHandlers, MenuItemsState } from '../core/menu-state';
import { PromptInputProps } from '../interfaces';
import MenuDropdown from './menu-dropdown';

import styles from '../styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

interface TokenModeProps {
  // Refs
  editableElementRef: React.RefObject<HTMLDivElement>;
  triggerWrapperRef: React.MutableRefObject<HTMLElement | null>;

  // IDs
  controlId?: string;
  menuListId: string;
  menuFooterControlId: string;
  highlightedMenuOptionId?: string;

  // State
  name?: string;
  getPlainTextValue: () => string;
  menuIsOpen: boolean;
  triggerWrapperReady: boolean;
  shouldRenderMenuDropdown: boolean;

  // Menu data
  activeMenu: PromptInputProps.MenuDefinition | null;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  menuFilterText: string;
  menuItemsState: MenuItemsState | null;
  menuItemsHandlers: MenuItemsHandlers | null;
  menuDropdownStatus: any;

  // Handlers
  handleInput: () => void;
  handleLoadMore: () => void;

  // Attributes
  editableElementAttributes: React.HTMLAttributes<HTMLDivElement> & {
    'data-placeholder'?: string;
  };

  // i18n
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
  getPlainTextValue,
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
      {name && <input key="hidden-input" type="hidden" name={name} value={getPlainTextValue()} />}
      <div className={styles['editable-wrapper']}>
        <div
          key="editable-element"
          id={controlId}
          ref={editableElementRef}
          role="textbox"
          aria-multiline="true"
          contentEditable={
            (!editableElementAttributes['aria-disabled'] && !editableElementAttributes['aria-readonly']
              ? 'true'
              : 'false') as any
          }
          suppressContentEditableWarning={true}
          className={testutilStyles['content-editable']}
          aria-controls={menuIsOpen ? menuListId : undefined}
          aria-activedescendant={highlightedMenuOptionId}
          aria-expanded={menuIsOpen}
          onInput={handleInput}
          {...editableElementAttributes}
        />
        <Dropdown
          key={`menu-dropdown-${activeTriggerToken?.id}`}
          minWidth={MENU_MIN_WIDTH}
          maxHeight={maxMenuHeight}
          expandToViewport={true}
          open={
            !!(
              shouldRenderMenuDropdown &&
              triggerWrapperReady &&
              menuIsOpen &&
              menuItemsState &&
              menuItemsState.items.length > 0
            )
          }
          trigger={null}
          triggerRef={triggerWrapperRef}
          contentKey={
            triggerWrapperReady
              ? `trigger-${activeTriggerToken?.id}-${activeTriggerToken?.triggerChar}-${menuFilterText}`
              : undefined
          }
          onMouseDown={event => {
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
                  statusType={(activeMenu.statusType ?? 'finished') as 'finished' | 'pending' | 'error' | 'loading'}
                  menuItemsState={menuItemsState}
                  menuItemsHandlers={menuItemsHandlers}
                  highlightedOptionId={highlightedMenuOptionId}
                  highlightText={menuFilterText}
                  listId={menuListId}
                  controlId={controlId ?? ''}
                  handleLoadMore={handleLoadMore}
                  hasDropdownStatus={menuDropdownStatus?.content !== null}
                  listBottom={
                    !menuDropdownStatus?.isSticky ? (
                      <DropdownFooter content={menuDropdownStatus?.content ?? null} id={menuFooterControlId} />
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
