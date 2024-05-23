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

      <FormField label="Default user and gen-ai avatars">
        <Avatar type="user" altText="User avatar" />
        <Avatar type="gen-ai" altText="Gen AI avatar" />
        <Avatar type="gen-ai" loading={true} altText="Gen AI avatar loading" />
      </FormField>

      <br />

      <FormField label="Different combinations with tooltip">
        <Avatar type="user" fullName="Timothee Fontaka" altText="User avatar" />
        <Avatar type="user" fullName="Timothee Fontaka" initials="TF" />
        <Avatar type="gen-ai" fullName="Gen AI assistant" />
        <Avatar type="gen-ai" iconName="star-filled" fullName="Existing icon" altText="AI assistant" />
        <Avatar type="gen-ai" iconSvg={customIconSvg} fullName="Custom icon SVG" altText="AI assistant" />
        <Avatar type="gen-ai" iconUrl={img} altText="AI assistant" fullName="Custom icon URL" />
        <Avatar type="gen-ai" loading={true} loadingText="Generating response" />
      </FormField>
    </div>
  );
}
