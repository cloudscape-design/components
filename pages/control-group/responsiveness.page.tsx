// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import ControlGroup, { ControlGroupProps } from '~components/control-group';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';

const OPERATORS: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '=~', label: '=~' },
  { value: '!~', label: '!~' },
];

// Suggestions for the label-name and label-value autosuggests. Custom values are still
// allowed via the `enteredTextLabel` "Use ..." item.
const LABEL_NAME_SUGGESTIONS: AutosuggestProps.Option[] = [
  { value: 'service' },
  { value: 'environment' },
  { value: 'region' },
  { value: 'namespace' },
];

const LABEL_VALUE_SUGGESTIONS: AutosuggestProps.Option[] = [
  { value: 'production' },
  { value: 'staging' },
  { value: 'development' },
  { value: 'us-east-1' },
];

const enteredTextLabel = (value: string) => `Use: ${value}`;

// The two icons the dismiss button can use. `remove` is the trash-can icon.
type RemoveIcon = 'close' | 'remove';
const REMOVE_ICONS: RemoveIcon[] = ['close', 'remove'];

// How the dismiss button presents across wrap states: always an icon button, always a
// text button, or responsive (icon in a row, text when the group wraps).
type ButtonMode = 'icon' | 'text' | 'responsive';
const BUTTON_MODES: ButtonMode[] = ['icon', 'text', 'responsive'];

// The field component used for the label name / value controls.
type ControlKind = 'input' | 'autosuggest';
const CONTROL_KINDS: ControlKind[] = ['input', 'autosuggest'];

// Where the dismiss button sits when the group wraps: `inline` stacks it below the
// controls; `side` attaches it at the end, spanning the stacked controls' height.
const ACTIONS_POSITIONS: ControlGroupProps.ActionsPosition[] = ['inline', 'side'];

// When stretching autosuggests, give each one this fixed width. The autosuggest reserves
// extra inline padding for its clear button once a value is entered, which changes its
// intrinsic width and (because the ControlGroup row sizes to content) shifts the whole
// layout as the field goes empty/non-empty. Pinning the width absorbs that fluctuation so
// nothing moves. A `min-inline-size` alone is not enough: the non-empty intrinsic width
// can exceed the minimum, so the field would still grow and shrink around it.
const STRETCH_WIDTH = 180;

// Page options are stored in URL params so they survive reloads and can be shared. The
// button options are per-example (each example has its own key) so changing one example's
// options does not affect the other: the query builder uses `buttonMode`/`actionsPosition`,
// the Input+button example uses `buttonMode2`/`actionsPosition2`.
type PageParams =
  | 'icon'
  | 'buttonMode'
  | 'control'
  | 'stretch'
  | 'actionsPosition'
  | 'buttonMode2'
  | 'actionsPosition2';

const resizableContainerStyle: React.CSSProperties = {
  resize: 'horizontal',
  overflow: 'auto',
  inlineSize: 950,
  minInlineSize: 200,
  maxInlineSize: '100%',
  padding: 16,
  paddingBlockEnd: 150,
  border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
  borderRadius: 8,
};

// Below this container width the builder switches to its wrapped presentation.
const WRAP_THRESHOLD = 640;

// A query builder that wraps based on whether it fits: the builder measures its own
// width and, once it drops below a threshold, switches every clause to the wrapped
// layout (`wrapBehavior="wrap"`) and lays the clauses out vertically. Clauses can be
// added and removed, and each one validates its own name/value combination.
interface ControlledClause {
  id: number;
  name: string;
  operator: SelectProps.Option;
  value: string;
}

const INITIAL_CONTROLLED_CLAUSES: ControlledClause[] = [
  { id: 1, name: 'service', operator: OPERATORS[0], value: 'production' },
];

// True for the regex-match operators, whose value must be a valid regular expression.
function isRegexOperator(operator: SelectProps.Option): boolean {
  return operator.value === '=~' || operator.value === '!~';
}

// Validate the label name / operator / value COMBINATION, so a freshly added (empty)
// clause is valid and validation only fires once the entered combination is inconsistent:
//   - one of name/value filled but not the other -> error (incomplete pair)
//   - a regex operator (=~, !~) with an invalid regex value -> error
//   - a plain (=, !=) value that contains whitespace -> warning (probably needs quoting)
function validateClause({ name, operator, value }: ControlledClause): { errorText?: string; warningText?: string } {
  const hasName = name.trim() !== '';
  const hasValue = value.trim() !== '';
  if (hasName !== hasValue) {
    return { errorText: 'Enter both a label name and value.' };
  }
  if (hasValue && isRegexOperator(operator)) {
    try {
      new RegExp(value);
    } catch {
      return { errorText: 'Value is not a valid regular expression.' };
    }
    return {};
  }
  if (hasValue && /\s/.test(value)) {
    return { warningText: 'Value contains whitespace.' };
  }
  return {};
}

function ControlledQueryBuilder({
  iconName,
  buttonMode,
  control,
  stretch,
  actionsPosition,
}: {
  iconName: RemoveIcon;
  buttonMode: ButtonMode;
  control: ControlKind;
  stretch: boolean;
  actionsPosition: ControlGroupProps.ActionsPosition;
}) {
  const [clauses, setClauses] = useState<ControlledClause[]>(INITIAL_CONTROLLED_CLAUSES);
  const [nextId, setNextId] = useState(INITIAL_CONTROLLED_CLAUSES.length + 1);

  const actionsSide = actionsPosition === 'side';

  // Measure the builder's own width. Below WRAP_THRESHOLD the clauses stack vertically.
  const [width, measureRef] = useContainerQuery(entry => entry.contentBoxWidth);
  const wrapped = width !== null && width < WRAP_THRESHOLD;
  // The wrap decision is pushed down to every clause so they all stack together.
  const wrapBehavior: ControlGroupProps.WrapBehavior = wrapped ? 'wrap' : 'nowrap';

  const addClause = () => {
    setClauses(prev => [...prev, { id: nextId, name: '', operator: OPERATORS[0], value: '' }]);
    setNextId(id => id + 1);
  };
  const removeClause = (id: number) => setClauses(prev => prev.filter(clause => clause.id !== id));
  const updateClause = (id: number, patch: Partial<ControlledClause>) =>
    setClauses(prev => prev.map(clause => (clause.id === id ? { ...clause, ...patch } : clause)));

  // A single name/value field, rendered as either an Input or an Autosuggest. When
  // stretching autosuggests (and only while the group is a ROW), the field is wrapped at a
  // fixed width so the intrinsic-width jump the autosuggest's clear button causes (in the
  // content-sized ControlGroup row) does not move the layout. Once the group wraps, the
  // controls fill the full stacked width, so the fixed width is dropped. `stretch` only
  // applies to autosuggest.
  //
  // Autosuggests use `expandToViewport` so their dropdown portals out of the control
  // slot's stacking context and renders above the group's inline label (otherwise the
  // label paints over the open dropdown).
  const renderField = (
    label: string,
    fieldValue: string,
    suggestions: AutosuggestProps.Option[],
    onValueChange: (value: string) => void
  ) => {
    if (control === 'input') {
      return (
        <Input ariaLabel={label} value={fieldValue} placeholder={label} onChange={e => onValueChange(e.detail.value)} />
      );
    }
    const autosuggest = (
      <Autosuggest
        ariaLabel={label}
        value={fieldValue}
        placeholder={label}
        options={suggestions}
        enteredTextLabel={enteredTextLabel}
        clearAriaLabel="Clear"
        expandToViewport={true}
        onChange={e => onValueChange(e.detail.value)}
      />
    );
    return stretch && !wrapped ? <div style={{ inlineSize: STRETCH_WIDTH }}>{autosuggest}</div> : autosuggest;
  };

  // The editing controls for a clause.
  const renderClauseControls = (clause: ControlledClause) => (
    <>
      {renderField('Label name', clause.name, LABEL_NAME_SUGGESTIONS, value =>
        updateClause(clause.id, { name: value })
      )}
      <Select
        ariaLabel="Operator"
        selectedOption={clause.operator}
        options={OPERATORS}
        onChange={e => updateClause(clause.id, { operator: e.detail.selectedOption })}
      />
      {renderField('Label value', clause.value, LABEL_VALUE_SUGGESTIONS, value => updateClause(clause.id, { value }))}
    </>
  );

  // The trailing dismiss button. `buttonMode` picks its presentation:
  //   - `icon`: always an icon-only button.
  //   - `text`: always a regular text button, even in side layout.
  //   - `responsive`: an icon button in a row, a text button once the group wraps. In side
  //     layout the button spans the stacked column's height, so responsive stays an icon.
  const renderRemoveButton = (clause: ControlledClause, wrap: boolean) => {
    const asText = buttonMode === 'text' || (buttonMode === 'responsive' && !actionsSide && wrap);
    if (asText) {
      return <Button onClick={() => removeClause(clause.id)}>Remove</Button>;
    }
    return (
      <Button iconName={iconName} variant="icon" ariaLabel="Remove label" onClick={() => removeClause(clause.id)} />
    );
  };

  const clauseGroups = clauses.map(clause => {
    const { errorText, warningText } = validateClause(clause);
    return (
      <ControlGroup
        key={clause.id}
        inlineLabelText="Label"
        wrapBehavior={wrapBehavior}
        actionsPosition={actionsPosition}
        errorText={errorText}
        warningText={warningText}
        actions={({ wrap }: { wrap: boolean }) => renderRemoveButton(clause, wrap)}
      >
        {renderClauseControls(clause)}
      </ControlGroup>
    );
  });

  // The add button shows only the icon in the row layout, and adds its text label when
  // the builder wraps.
  const addButton = wrapped ? (
    <Button iconName="add-plus" onClick={addClause}>
      Add label
    </Button>
  ) : (
    <Button iconName="add-plus" ariaLabel="Add label" onClick={addClause} />
  );

  // Wrapped: render the groups vertically in a flex column. Row: a horizontal
  // SpaceBetween with the add button inline.
  return (
    <div ref={measureRef}>
      {wrapped ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
          {clauseGroups}
          <div>{addButton}</div>
        </div>
      ) : (
        <SpaceBetween size="xs" direction="horizontal" alignItems="end">
          {clauseGroups}
          {addButton}
        </SpaceBetween>
      )}
    </div>
  );
}

// A minimal group of a single Input fused with a button, to show how a button behaves in
// a ControlGroup across wrap states: it fuses in the row and detaches once the group
// wraps. Where it goes when wrapping follows the page's "Button responsive layout" option
// (`inline` stacks it below, `side` attaches it at the end spanning the controls' height),
// and its presentation follows the "Button variant" option (icon / normal / responsive). In
// side mode a responsive button stays an icon (it spans the stacked column's height), but a
// normal button is still a text button. Resize the container to see it wrap.
function InputWithTextButton({
  buttonMode,
  actionsPosition,
}: {
  buttonMode: ButtonMode;
  actionsPosition: ControlGroupProps.ActionsPosition;
}) {
  const [value, setValue] = useState('');
  const search = () => window.alert(`Search: ${value}`);
  const actionsSide = actionsPosition === 'side';
  return (
    <ControlGroup
      inlineLabelText="Search"
      actionsPosition={actionsPosition}
      actions={({ wrap }: { wrap: boolean }) => {
        const asText = buttonMode === 'text' || (buttonMode === 'responsive' && !actionsSide && wrap);
        return asText ? (
          <Button variant="primary" onClick={search}>
            Search
          </Button>
        ) : (
          <Button variant="icon" iconName="search" ariaLabel="Search" onClick={search} />
        );
      }}
    >
      <Input
        ariaLabel="Search query"
        value={value}
        placeholder="Enter a query"
        onChange={e => setValue(e.detail.value)}
      />
    </ControlGroup>
  );
}

export default function () {
  const { urlParams, setUrlParams } = useAppContext<PageParams>();

  const iconName: RemoveIcon = REMOVE_ICONS.includes(urlParams.icon as RemoveIcon)
    ? (urlParams.icon as RemoveIcon)
    : 'close';
  const control: ControlKind = CONTROL_KINDS.includes(urlParams.control as ControlKind)
    ? (urlParams.control as ControlKind)
    : 'autosuggest';
  // "Stretch" only applies to autosuggest (it fixes the autosuggest's clear-button width
  // jump); it is ignored for plain inputs.
  const stretch = control === 'autosuggest' && urlParams.stretch === true;

  // Resolve the button options from their (per-example) URL params, falling back to
  // defaults for unset/invalid values.
  const parseButtonMode = (value: unknown): ButtonMode =>
    BUTTON_MODES.includes(value as ButtonMode) ? (value as ButtonMode) : 'responsive';
  const parseActionsPosition = (value: unknown): ControlGroupProps.ActionsPosition =>
    ACTIONS_POSITIONS.includes(value as ControlGroupProps.ActionsPosition)
      ? (value as ControlGroupProps.ActionsPosition)
      : 'inline';

  // Query builder's button options.
  const buttonMode = parseButtonMode(urlParams.buttonMode);
  const actionsPosition = parseActionsPosition(urlParams.actionsPosition);
  // Input+button example's button options (separate keys so the two examples are independent).
  const buttonMode2 = parseButtonMode(urlParams.buttonMode2);
  const actionsPosition2 = parseActionsPosition(urlParams.actionsPosition2);

  // The two button options, rendered per example. Each example passes its own current
  // values and the URL-param keys to write to, so changing one example's options does not
  // affect the other. `buttonMode` = button presentation; `actionsPosition` = where the
  // trailing button goes when the group wraps.
  const renderButtonOptions = (
    currentButtonMode: ButtonMode,
    currentActionsPosition: ControlGroupProps.ActionsPosition,
    buttonModeParam: PageParams,
    actionsPositionParam: PageParams
  ) => (
    <SpaceBetween size="xxl" direction="horizontal">
      <FormField label="Button responsive layout" description="Where the button sits when the component wraps">
        <RadioGroup
          value={currentActionsPosition}
          onChange={({ detail }) => setUrlParams({ [actionsPositionParam]: detail.value })}
          items={[
            { value: 'inline', label: 'Bottom' },
            { value: 'side', label: 'Side' },
          ]}
        />
      </FormField>
      <FormField label="Button variant">
        <RadioGroup
          value={currentButtonMode}
          onChange={({ detail }) => setUrlParams({ [buttonModeParam]: detail.value })}
          items={[
            { value: 'icon', label: 'icon' },
            { value: 'text', label: 'normal' },
            // Responsive relies on wrap -> text, which side layout never does (the button
            // stays an icon spanning the column), so it is disabled there.
            {
              value: 'responsive',
              label: 'Responsive',
              description: 'icon in a row, normal when wrapping.',
              disabled: currentActionsPosition === 'side',
            },
          ]}
        />
      </FormField>
    </SpaceBetween>
  );

  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="A query builder built from ControlGroup clauses. Resize the container (drag the handle) to see the clauses stack their controls once a clause no longer fits its line. Use the options below to control the field type and the trailing dismiss button."
    >
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h2"
              description="ControlGroup clauses that stack their controls once a clause no longer fits."
            >
              Query builder
            </Header>
          }
        >
          <SpaceBetween size="xs">
            <SpaceBetween size="xxl" direction="horizontal">
              {renderButtonOptions(buttonMode, actionsPosition, 'buttonMode', 'actionsPosition')}
              {/* These two options only shape the query builder: its field type and dismiss icon. */}
              <FormField label="Field control">
                <RadioGroup
                  value={control}
                  onChange={({ detail }) => setUrlParams({ control: detail.value })}
                  items={[
                    { value: 'autosuggest', label: 'Autosuggest' },
                    { value: 'input', label: 'Input' },
                  ]}
                />
              </FormField>
              <FormField label="Dismiss button icon">
                <RadioGroup
                  value={iconName}
                  onChange={({ detail }) => setUrlParams({ icon: detail.value })}
                  items={[
                    { value: 'close', label: 'close' },
                    { value: 'remove', label: 'trash' },
                  ]}
                />
              </FormField>
              {control === 'autosuggest' && (
                <FormField label="Autosuggest width">
                  <Checkbox
                    checked={stretch}
                    onChange={({ detail }) => setUrlParams({ stretch: detail.checked })}
                    description="This prevents layout shifts while entering content"
                  >
                    Pin autosuggests to a fixed width
                  </Checkbox>
                </FormField>
              )}
            </SpaceBetween>
            <div style={resizableContainerStyle}>
              <ControlledQueryBuilder
                iconName={iconName}
                buttonMode={buttonMode}
                control={control}
                stretch={stretch}
                actionsPosition={actionsPosition}
              />
            </div>
          </SpaceBetween>
        </Container>

        <Container
          header={
            <Header variant="h2" description="A single Input fused with a button that detaches when the group wraps.">
              Input with button
            </Header>
          }
        >
          <SpaceBetween size="xs">
            {renderButtonOptions(buttonMode2, actionsPosition2, 'buttonMode2', 'actionsPosition2')}
            <div style={resizableContainerStyle}>
              <InputWithTextButton buttonMode={buttonMode2} actionsPosition={actionsPosition2} />
            </div>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </SimplePage>
  );
}
