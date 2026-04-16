import React, { useState } from 'react';
import { Checkbox, SpaceBetween } from '~components';
import { SimplePage } from '../app/templates';
import './css-style-api.css';

export default function Page() {
  const [purple, setPurple] = useState(false);
  const [red, setRed] = useState(false);
  const [green, setGreen] = useState(true);
  const [indeterminate, setIndeterminate] = useState({ checked: false, indeterminate: true });

  return (
    <SimplePage title="Checkbox CSS Style API">
      <SpaceBetween size="l">
        <div>
          <h2>Custom colored checkboxes</h2>
          <SpaceBetween size="s">
            <Checkbox
              className="my-purple"
              checked={purple}
              onChange={({ detail }) => setPurple(detail.checked)}
            >
              Purple checkbox
            </Checkbox>
            <Checkbox
              className="my-red"
              checked={red}
              onChange={({ detail }) => setRed(detail.checked)}
            >
              Red checkbox
            </Checkbox>
            <Checkbox
              className="my-green"
              checked={green}
              onChange={({ detail }) => setGreen(detail.checked)}
            >
              Green checkbox (pre-checked)
            </Checkbox>
          </SpaceBetween>
        </div>
        <div>
          <h2>Indeterminate state</h2>
          <SpaceBetween size="s">
            <Checkbox
              className="my-purple"
              checked={indeterminate.checked}
              indeterminate={indeterminate.indeterminate}
              onChange={({ detail }) => setIndeterminate({ checked: detail.checked, indeterminate: false })}
            >
              Purple indeterminate
            </Checkbox>
          </SpaceBetween>
        </div>
        <div>
          <h2>Disabled states</h2>
          <SpaceBetween size="s">
            <Checkbox className="my-purple" checked={false} disabled={true}>
              Disabled unchecked
            </Checkbox>
            <Checkbox className="my-red" checked={true} disabled={true}>
              Disabled checked
            </Checkbox>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
