// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';

const options = new Array(200)
  .join('.')
  .split('.')
  .map((_value, index) => ({ id: `${index}`, label: `option ${index}` }));
const enteredTextLabel = (value: string) => `Use: ${value}`;

class TestScenario extends React.Component<
  Pick<AutosuggestProps, 'empty' | 'errorText' | 'loadingText' | 'statusType' | 'options'>
> {
  state = { value: '' };
  handleChange: AutosuggestProps['onChange'] = e => this.setState({ value: e.detail.value });
  render() {
    const { empty, statusType, options, loadingText, errorText } = this.props;
    return (
      <Autosuggest
        value={this.state.value}
        onChange={this.handleChange}
        empty={empty}
        statusType={statusType}
        loadingText={loadingText}
        errorText={errorText}
        options={options || []}
        ariaLabel="Some input"
        enteredTextLabel={enteredTextLabel}
      />
    );
  }
}

export default function () {
  return (
    <>
      <h1>Autosuggest regions scenarios</h1>
      <ScreenshotArea style={{ height: '500px' }}>
        <SpaceBetween direction="horizontal" size="m">
          <TestScenario empty="No resources found" />
          <TestScenario statusType="error" errorText="Some error" />
          <TestScenario statusType="loading" loadingText="Loading" />
          <TestScenario options={options} />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
