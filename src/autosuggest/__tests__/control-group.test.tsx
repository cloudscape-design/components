// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Autosuggest from '../../../lib/components/autosuggest';
import ControlGroup from '../../../lib/components/internal/components/control-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import { PositionProbe } from '../../internal/components/control-group/__tests__/common';

const noop = () => {};

describe('Autosuggest in control group', () => {
  test('resets the context for custom empty content', () => {
    const { container, getByTestId } = render(
      <ControlGroup>
        <Autosuggest
          value=""
          onChange={noop}
          options={[]}
          enteredTextLabel={value => `Use: ${value}`}
          empty={<PositionProbe />}
        />
      </ControlGroup>
    );
    createWrapper(container).findAutosuggest()!.focus();

    expect(getByTestId('probe')).toHaveTextContent('none');
  });
});
