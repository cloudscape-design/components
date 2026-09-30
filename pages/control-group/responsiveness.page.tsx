// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import ControlGroup, { ControlGroupProps } from '~components/control-group';
import FormField from '~components/form-field';
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

// Page options are stored in URL params so they survive reloads and can be shared.
type PageParams = 'icon' | 'switchWhenWrapping' | 'control' | 'stretch' | 'actionsPosition';

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
  switchWhenWrapping,
  control,
  stretch,
  actionsPosition,
}: {
  iconName: RemoveIcon;
  switchWhenWrapping: boolean;
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

  // The trailing dismiss button. It is always an icon-only button in a row; when the group
  // wraps it either stays an icon button or, if `switchWhenWrapping` is set, becomes a
  // regular (text) button. In side mode it always stays an icon button (it spans the full
  // height of the stacked column beside the controls).
  const renderRemoveButton = (clause: ControlledClause, wrap: boolean) => {
    if (wrap && switchWhenWrapping && !actionsSide) {
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

export default function () {
  const { urlParams, setUrlParams } = useAppContext<PageParams>();

  const iconName: RemoveIcon = REMOVE_ICONS.includes(urlParams.icon as RemoveIcon)
    ? (urlParams.icon as RemoveIcon)
    : 'close';
  const switchWhenWrapping = urlParams.switchWhenWrapping === true;
  const control: ControlKind = CONTROL_KINDS.includes(urlParams.control as ControlKind)
    ? (urlParams.control as ControlKind)
    : 'autosuggest';
  // "Stretch" only applies to autosuggest (it fixes the autosuggest's clear-button width
  // jump); it is ignored for plain inputs.
  const stretch = control === 'autosuggest' && urlParams.stretch === true;
  // Where the dismiss button sits when wrapping: `inline` (stacked below the controls) or
  // `side` (attached at the end, spanning the stacked controls' height).
  const actionsPosition: ControlGroupProps.ActionsPosition = ACTIONS_POSITIONS.includes(
    urlParams.actionsPosition as ControlGroupProps.ActionsPosition
  )
    ? (urlParams.actionsPosition as ControlGroupProps.ActionsPosition)
    : 'inline';
  const actionsSide = actionsPosition === 'side';

  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="A query builder built from ControlGroup clauses. Resize the container (drag the handle) to see the clauses stack their controls once a clause no longer fits its line. Use the options below to control the field type and the trailing dismiss button."
      settings={
        <SpaceBetween size="xxl" direction="horizontal">
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
          <FormField
            label="Dismiss button responsive layout"
            description="When the group wraps: stack the button below the controls, or attach it at the end spanning their height."
          >
            <SpaceBetween size="s">
              <RadioGroup
                value={actionsPosition}
                onChange={({ detail }) => setUrlParams({ actionsPosition: detail.value })}
                items={[
                  { value: 'inline', label: 'Bottom' },
                  { value: 'side', label: 'Side' },
                ]}
              />
              <Checkbox
                checked={switchWhenWrapping}
                disabled={actionsSide}
                onChange={({ detail }) => setUrlParams({ switchWhenWrapping: detail.checked })}
              >
                Change to regular button when wrapping
              </Checkbox>
            </SpaceBetween>
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
      }
    >
      <div style={resizableContainerStyle}>
        <ControlledQueryBuilder
          iconName={iconName}
          switchWhenWrapping={switchWhenWrapping}
          control={control}
          stretch={stretch}
          actionsPosition={actionsPosition}
        />
      </div>
    </SimplePage>
  );
}
