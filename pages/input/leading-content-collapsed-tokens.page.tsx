// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import Input, { InputProps } from '~components/input';
import LiveRegion from '~components/live-region';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Token from '~components/token';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
  }>
>;

const VISIBLE_COUNT = 3;
const INITIAL_TOKENS = ['prod', 'staging', 'dev', 'eu-west-1', 'ca-central-1'];

function useTokenInput(initialTokens: string[]) {
  const [inputValue, setInputValue] = useState('');
  const [tokens, setTokens] = useState<string[]>(initialTokens);
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<InputProps.Ref | null>(null);
  const tokenRefs = useRef<Array<HTMLElement | null>>([]);

  const visibleTokens = tokens.slice(0, VISIBLE_COUNT);
  const hiddenTokens = tokens.slice(VISIBLE_COUNT);

  const focusTokenAt = useCallback(
    (index: number) => {
      queueMicrotask(() => {
        if (index >= 0 && index < visibleTokens.length) {
          const wrapper = tokenRefs.current[index];
          const dismissBtn = wrapper?.querySelector<HTMLElement>('button');
          (dismissBtn ?? wrapper)?.focus();
        } else {
          inputRef.current?.focus();
        }
      });
    },
    [visibleTokens.length]
  );

  const removeToken = useCallback(
    (indexInAll: number) => {
      setTokens(prev => {
        const removed = prev[indexInAll];
        const next = prev.filter((_, i) => i !== indexInAll);
        setAnnouncement(`Removed ${removed}. ${next.length} filter${next.length !== 1 ? 's' : ''} applied.`);
        return next;
      });
      const indexInVisible = indexInAll < VISIBLE_COUNT ? indexInAll : -1;
      if (indexInVisible >= 0) {
        focusTokenAt(indexInVisible < visibleTokens.length - 1 ? indexInVisible : indexInVisible - 1);
      } else {
        inputRef.current?.focus();
      }
    },
    [focusTokenAt, visibleTokens.length]
  );

  function handleKeyDown(event: CustomEvent<InputProps.KeyDetail>) {
    if (event.detail.key === 'Enter' && inputValue.trim() !== '') {
      const newToken = inputValue.trim();
      setTokens(prev => {
        const next = [...prev, newToken];
        setAnnouncement(`Added ${newToken}. ${next.length} filter${next.length !== 1 ? 's' : ''} applied.`);
        return next;
      });
      setInputValue('');
    }
    if (event.detail.key === 'Backspace' && inputValue === '' && visibleTokens.length > 0) {
      focusTokenAt(visibleTokens.length - 1);
    }
  }

  function handleTokenKeyDown(event: React.KeyboardEvent, indexInVisible: number) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      removeToken(indexInVisible);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTokenAt(indexInVisible - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTokenAt(indexInVisible + 1);
    }
  }

  return {
    inputValue,
    setInputValue,
    tokens,
    visibleTokens,
    hiddenTokens,
    announcement,
    inputRef,
    tokenRefs,
    removeToken,
    handleKeyDown,
    handleTokenKeyDown,
  };
}

function VisibleTokenList({
  visibleTokens,
  tokenRefs,
  disabled,
  readOnly,
  removeToken,
  handleTokenKeyDown,
  extra,
}: {
  visibleTokens: string[];
  tokenRefs: React.MutableRefObject<Array<HTMLElement | null>>;
  disabled: boolean;
  readOnly: boolean;
  removeToken: (i: number) => void;
  handleTokenKeyDown: (e: React.KeyboardEvent, i: number) => void;
  extra?: React.ReactNode;
}) {
  return (
    <span
      role="list"
      aria-label="Applied filters"
      style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px', alignItems: 'center' }}
    >
      {visibleTokens.map((token, index) => (
        <span
          key={token}
          role="listitem"
          ref={el => {
            tokenRefs.current[index] = el;
          }}
          onKeyDown={e => handleTokenKeyDown(e, index)}
        >
          <Token
            variant="inline"
            label={token}
            dismissLabel={`Remove ${token}`}
            disabled={disabled}
            readOnly={readOnly}
            onDismiss={() => removeToken(index)}
          />
        </span>
      ))}
      {extra && (
        <span role="listitem" style={{ flexShrink: 0 }}>
          {extra}
        </span>
      )}
    </span>
  );
}

function LiveRegionAnnouncer({ announcement }: { announcement: string }) {
  return <LiveRegion hidden={true}>{announcement}</LiveRegion>;
}

type TriggerBuilder = (count: number, disabled: boolean) => React.ReactNode;

function PopoverTokenInput({
  disabled,
  readOnly,
  invalid,
  warning,
  triggerBuilder,
  popoverHeader,
  popoverSize = 'small',
}: {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  warning: boolean;
  triggerBuilder: TriggerBuilder;
  popoverHeader?: string;
  popoverSize?: 'small' | 'medium' | 'large';
}) {
  const {
    inputValue,
    setInputValue,
    tokens,
    visibleTokens,
    hiddenTokens,
    announcement,
    inputRef,
    tokenRefs,
    removeToken,
    handleKeyDown,
    handleTokenKeyDown,
  } = useTokenInput([...INITIAL_TOKENS]);

  const showMoreTrigger =
    hiddenTokens.length > 0 ? (
      <Popover
        renderWithPortal={true}
        dismissButton={false}
        position="bottom"
        size={popoverSize}
        triggerType="custom"
        header={popoverHeader}
        content={
          <SpaceBetween size="xs">
            {hiddenTokens.map((token, i) => (
              <Token
                key={token}
                variant="inline"
                label={token}
                dismissLabel={`Remove ${token}`}
                disabled={disabled}
                readOnly={readOnly}
                onDismiss={() => removeToken(VISIBLE_COUNT + i)}
              />
            ))}
          </SpaceBetween>
        }
      >
        {triggerBuilder(hiddenTokens.length, disabled)}
      </Popover>
    ) : undefined;

  return (
    <div>
      <LiveRegionAnnouncer announcement={announcement} />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={({ detail }) => setInputValue(detail.value)}
        onKeyDown={handleKeyDown}
        ariaLabel={`Filter resources. ${tokens.length} filter${tokens.length !== 1 ? 's' : ''} applied.`}
        placeholder={tokens.length === 0 ? 'Type and press Enter to add a filter' : undefined}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        warning={warning}
        leadingContent={
          visibleTokens.length > 0 ? (
            <VisibleTokenList
              visibleTokens={visibleTokens}
              tokenRefs={tokenRefs}
              disabled={disabled}
              readOnly={readOnly}
              removeToken={removeToken}
              handleTokenKeyDown={handleTokenKeyDown}
              extra={showMoreTrigger}
            />
          ) : undefined
        }
      />
    </div>
  );
}

const triggerExpandIcon: TriggerBuilder = (count, disabled) => (
  <Button variant="inline-link" iconName="expand" disabled={disabled}>
    Show more (+{count})
  </Button>
);

function PortalOverlayExample({
  disabled,
  readOnly,
  invalid,
  warning,
}: {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  warning: boolean;
}) {
  const {
    inputValue,
    setInputValue,
    tokens,
    visibleTokens,
    hiddenTokens,
    announcement,
    inputRef,
    tokenRefs,
    removeToken,
    handleKeyDown,
    handleTokenKeyDown,
  } = useTokenInput([...INITIAL_TOKENS]);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!open || !triggerRef.current) {
      return;
    }
    function reposition() {
      if (!triggerRef.current) {
        return;
      }
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 9999,
        background: 'var(--color-background-dropdown-item-default, #fff)',
        border: '1px solid var(--color-border-dropdown-item-default, #aab7b8)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        padding: '12px',
        minWidth: '200px',
      });
    }
    reposition();
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleClick(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const showMoreTrigger =
    hiddenTokens.length > 0 ? (
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: 'var(--color-text-link-default, #0972d3)',
          fontSize: '14px',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        ⊞ Show more (+{hiddenTokens.length})
      </button>
    ) : undefined;

  const panel =
    open && hiddenTokens.length > 0
      ? ReactDOM.createPortal(
          <div style={panelStyle} role="dialog" aria-label="Hidden filters">
            <Box variant="h5" padding={{ bottom: 'xs' }}>
              Hidden filters ({hiddenTokens.length})
            </Box>
            <SpaceBetween size="xs">
              {hiddenTokens.map((token, i) => (
                <Token
                  key={token}
                  variant="inline"
                  label={token}
                  dismissLabel={`Remove ${token}`}
                  disabled={disabled}
                  readOnly={readOnly}
                  onDismiss={() => {
                    removeToken(VISIBLE_COUNT + i);
                    if (hiddenTokens.length <= 1) {
                      setOpen(false);
                    }
                  }}
                />
              ))}
            </SpaceBetween>
          </div>,
          document.body
        )
      : null;

  return (
    <div>
      <LiveRegionAnnouncer announcement={announcement} />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={({ detail }) => setInputValue(detail.value)}
        onKeyDown={handleKeyDown}
        ariaLabel={`Filter resources. ${tokens.length} filter${tokens.length !== 1 ? 's' : ''} applied.`}
        placeholder={tokens.length === 0 ? 'Type and press Enter to add a filter' : undefined}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        warning={warning}
        leadingContent={
          visibleTokens.length > 0 ? (
            <VisibleTokenList
              visibleTokens={visibleTokens}
              tokenRefs={tokenRefs}
              disabled={disabled}
              readOnly={readOnly}
              removeToken={removeToken}
              handleTokenKeyDown={handleTokenKeyDown}
              extra={showMoreTrigger}
            />
          ) : undefined
        }
      />
      {panel}
    </div>
  );
}

const triggerPlusNMore: TriggerBuilder = (count, disabled) => (
  <Button variant="inline-link" disabled={disabled}>
    +{count} more
  </Button>
);

const triggerBadge: TriggerBuilder = (count, disabled) => (
  <span
    title={`${count} more filters`}
    style={{ cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center' }}
  >
    <Badge color="blue">{String(count)}</Badge>
  </span>
);

const triggerIconOnly: TriggerBuilder = (count, disabled) => (
  <Button variant="icon" iconName="caret-down-filled" disabled={disabled} ariaLabel={`Show ${count} more filters`} />
);

const triggerPill: TriggerBuilder = (count, disabled) => (
  <span
    aria-label={`${count} more filters`}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '1px 8px',
      border: '1px solid var(--color-border-control-default, #aab7b8)',
      borderRadius: '20px',
      fontSize: '12px',
      color: disabled ? 'var(--color-text-disabled, #9ba7b6)' : 'var(--color-text-body-default, #0f1b2d)',
      background: 'var(--color-background-control-default, #fff)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
    }}
  >
    +{count}
  </span>
);

const triggerEllipsis: TriggerBuilder = (count, disabled) => (
  <Button variant="inline-icon" iconName="ellipsis" disabled={disabled} ariaLabel={`Show ${count} more filters`} />
);

export default function LeadingContentCollapsedTokensPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  const sharedProps = { disabled, readOnly, invalid, warning };
  const sharedFieldProps = {
    errorText: invalid ? 'Validation error.' : undefined,
    warningText: warning && !invalid ? 'Validation warning.' : undefined,
  };

  return (
    <SimplePage
      title="Input — leadingContent collapsed tokens"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Toggle checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            Disabled
          </Toggle>
          <Toggle checked={readOnly} onChange={({ detail }) => setUrlParams({ readOnly: detail.checked })}>
            Read-only
          </Toggle>
          <Toggle checked={invalid} onChange={({ detail }) => setUrlParams({ invalid: detail.checked })}>
            Invalid
          </Toggle>
          <Toggle checked={warning} onChange={({ detail }) => setUrlParams({ warning: detail.checked })}>
            Warning
          </Toggle>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="xl">
        {/* ── Overlay mechanism variants ────────────────────────────── */}
        <SpaceBetween size="l">
          <Box variant="h3">Overlay mechanism</Box>

          <FormField
            label='Popover — "Show more (+N)" with icon'
            description="Uses Cloudscape Popover with renderWithPortal. Escapes the slot's overflow clip. Has a header listing hidden count."
            {...sharedFieldProps}
          >
            <PopoverTokenInput
              {...sharedProps}
              triggerBuilder={triggerExpandIcon}
              popoverHeader="Hidden filters"
              popoverSize="medium"
            />
          </FormField>

          <FormField
            label="Custom portal overlay (raw div via ReactDOM.createPortal)"
            description="No Cloudscape overlay component. Positions a div portal via getBoundingClientRect. Closes on outside click."
            {...sharedFieldProps}
          >
            <PortalOverlayExample {...sharedProps} />
          </FormField>

          <FormField
            label='Popover minimal (no header, size="small")'
            description='"+N more" link. Popover with no header or close button — compact, closest to a native select overflow.'
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerPlusNMore} />
          </FormField>
        </SpaceBetween>

        {/* ── Trigger visual variants (all use Popover+renderWithPortal) ── */}
        <SpaceBetween size="l">
          <Box variant="h3">Trigger visual variants</Box>

          <FormField
            label='A — Text link: "Show more (+N)" with expand icon'
            description="Explicit label + icon. Most discoverable but takes the most horizontal space."
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerExpandIcon} />
          </FormField>

          <FormField
            label='B — Text link: "+N more" (no icon)'
            description="Compact text-only link. Still descriptive but saves space."
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerPlusNMore} />
          </FormField>

          <FormField
            label="C — Badge (count only)"
            description="Numeric badge. Very compact. Relies on colour + number alone to convey overflow — least descriptive."
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerBadge} />
          </FormField>

          <FormField
            label="D — Icon only (caret-down)"
            description="Icon button with aria-label. Zero horizontal label cost. Familiar from Select."
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerIconOnly} />
          </FormField>

          <FormField
            label="E — Pill token lookalike (+N)"
            description='Styled to look like a Token — reads as "there are N more tokens here". Visually cohesive with the token row.'
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerPill} />
          </FormField>

          <FormField
            label="F — Ellipsis icon"
            description="Three-dot overflow icon. Universal overflow convention. Most minimal."
            {...sharedFieldProps}
          >
            <PopoverTokenInput {...sharedProps} triggerBuilder={triggerEllipsis} />
          </FormField>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
