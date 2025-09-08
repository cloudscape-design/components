// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Flashbar from '~components/flashbar';
import SpaceBetween from '~components/space-between';

export default function InlineCodeExample() {
  return (
    <Box padding={{ left: 'xl', right: 'xl', top: 'xxl', bottom: 'xl' }}>
      <SpaceBetween size="l">
        <div>
          <h2>Example usage</h2>
          <p>
            When writing documentation, you can use inline code elements to highlight variables like{' '}
            <Box variant="awsui-inline-code">const myVariable = 42;</Box> or function names like{' '}
            <Box variant="awsui-inline-code">calculateTotal()</Box>.
          </p>
        </div>

        <div>
          <h2>Alert component with inline code</h2>
          <Alert type="info" header="Configuration Required">
            To configure your application, set the <Box variant="awsui-inline-code">API_ENDPOINT</Box> environment
            variable to your API URL. For example:{' '}
            <Box variant="awsui-inline-code">export API_ENDPOINT=&quot;https://api.example.com&quot;</Box>
          </Alert>

          <Alert type="warning" header="Deprecated Function">
            The function <Box variant="awsui-inline-code">getUserData()</Box> is deprecated. Please use{' '}
            <Box variant="awsui-inline-code">fetchUserProfile()</Box> instead.
          </Alert>
        </div>

        <div>
          <h2>Flashbar component with inline code</h2>
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Deployment successful',
                content: (
                  <>
                    Your application has been deployed successfully. The new version{' '}
                    <Box variant="awsui-inline-code">v2.1.0</Box> is now live at{' '}
                    <Box variant="awsui-inline-code">arn:service23G2::123:distribution/23E1</Box>.
                  </>
                ),
                dismissible: true,
                id: 'success-message',
              },
              {
                type: 'error',
                header: 'Build failed',
                content: (
                  <>
                    The build process failed with exit code <Box variant="awsui-inline-code">1</Box>. Check the{' '}
                    <Box variant="awsui-inline-code">package.json</Box> file for missing dependencies or run{' '}
                    <Box variant="awsui-inline-code">npm install</Box> to resolve issues.
                  </>
                ),
                dismissible: true,
                id: 'error-message',
              },
            ]}
          />
        </div>
      </SpaceBetween>
    </Box>
  );
}
