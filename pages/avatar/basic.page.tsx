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
        <Avatar type="user" ariaLabel="User avatar" i18nStrings={{ avatarAriaRoleDescription: 'Avatar' }} />
        <Avatar type="gen-ai" ariaLabel="Gen AI avatar" />
        <Avatar type="gen-ai" ariaLabel="Gen AI avatar loading" loading={true} />
      </FormField>

      <br />

      <FormField label="Different combinations with tooltip">
        <Avatar type="user" ariaLabel="User avatar" fullName="Timothee Fontaka" data-testid="user-avatar-with-name" />
        <Avatar type="user" ariaLabel="User avatar" fullName="Timothee Fontaka" initials="TF" />
        <Avatar
          type="gen-ai"
          ariaLabel="Gen AI avatar"
          fullName="Gen AI assistant"
          data-testid="gen-ai-avatar-with-name"
        />
        <Avatar type="gen-ai" ariaLabel="Gen AI avatar" iconName="star-filled" fullName="Existing icon" />
        <Avatar type="gen-ai" ariaLabel="Gen AI avatar" iconSvg={customIconSvg} fullName="Custom icon SVG" />
        <Avatar type="gen-ai" ariaLabel="Gen AI avatar" iconUrl={img} fullName="Custom icon URL" />
        <Avatar
          type="gen-ai"
          ariaLabel="Gen AI avatar"
          loading={true}
          loadingText="Generating response"
          data-testid="gen-ai-avatar-with-loadingText"
        />
      </FormField>
    </div>
  );
}
