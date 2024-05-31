// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Avatar from '~components/avatar';
import FormField from '~components/form-field';
import img from '../icon/custom-icon.png';

const customIconSvg = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m8 9 3 3-3 3m5 0h3M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
    />
  </svg>
);

export default function AvatarsPage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Avatar demo</h1>

      <FormField label="Default and gen-ai avatars without tooltip">
        <Avatar color="default" ariaLabel="User avatar" />
        <Avatar color="default" ariaLabel="User avatar loading" loading={true} />
        <Avatar color="gen-ai" iconName="gen-ai" ariaLabel="Gen AI avatar" />
        <Avatar color="gen-ai" iconName="gen-ai" ariaLabel="Gen AI avatar loading" loading={true} />
      </FormField>

      <br />

      <FormField label="Different avatar combinations with tooltip">
        <Avatar color="default" ariaLabel="User avatar Timothee Fontaka" tooltipText="Timothee Fontaka" />
        <Avatar
          color="default"
          ariaLabel="User avatar Timothee Fontaka TF"
          tooltipText="Timothee Fontaka"
          initials="TF"
        />
        <Avatar
          color="default"
          ariaLabel="User avatar with star icon Timothee Fontaka"
          iconName="star-filled"
          tooltipText="Timothee Fontaka"
        />
        <Avatar
          color="default"
          ariaLabel="User avatar with custom icon SVG"
          iconSvg={customIconSvg}
          tooltipText="Custom icon SVG"
        />
        <Avatar
          color="default"
          ariaLabel="User avatar with custom icon URL"
          iconUrl={img}
          tooltipText="Custom icon URL"
        />
        <Avatar color="default" ariaLabel="User avatar typing" loading={true} tooltipText="Typing" />

        <Avatar color="gen-ai" iconName="gen-ai" ariaLabel="Avatar Gen AI assistant" tooltipText="Gen AI assistant" />
        <Avatar color="gen-ai" ariaLabel="Gen AI avatar AI" tooltipText="AI assistant" initials="AI" />
        <Avatar
          color="gen-ai"
          ariaLabel="Gen AI avatar with existing icon"
          iconName="star-filled"
          tooltipText="Existing icon"
        />
        <Avatar
          color="gen-ai"
          ariaLabel="Gen AI avatar with custom icon SVG"
          iconSvg={customIconSvg}
          tooltipText="Custom icon SVG"
        />
        <Avatar
          color="gen-ai"
          ariaLabel="Gen AI avatar with custom icon URL"
          iconUrl={img}
          tooltipText="Custom icon URL"
        />
        <Avatar
          color="gen-ai"
          iconName="gen-ai"
          ariaLabel="Gen AI avatar generating response"
          loading={true}
          tooltipText="Generating response"
        />
      </FormField>
    </div>
  );
}
