// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, FormField, SpaceBetween } from '~components';
import Input from '~components/input';

import { SimplePage } from '../app/templates';

export default function InputKoreanIMEPage() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleKeyDown = (event: CustomEvent<any>) => {
    if (event.detail.keyCode === 13 && searchText.trim()) {
      setSearchResults(prev => [
        `Search executed: ${searchText}`,
        ...prev.slice(0, 9), // Keep last 10 results
      ]);
    }
  };

  return (
    <SimplePage
      title="Input Korean IME Test"
      subtitle="Type Korean characters and press Enter - should complete character first, not search"
    >
      <SpaceBetween size="m">
        <Box variant="awsui-key-label">
          <strong>Test Instructions:</strong>
          <ol>
            <li>Enable Korean 2-set keyboard</li>
            <li>Type Korean character: ㄱ + ㅏ (forms 가)</li>
            <li>Press Enter → Should complete character, NOT show search result</li>
            <li>Press Enter again → Should show search result with 가</li>
          </ol>
        </Box>

        <FormField
          label="Search Input"
          description="Watch the results below - Enter during composition shouldn't trigger search"
        >
          <Input
            value={searchText}
            onChange={({ detail }) => setSearchText(detail.value)}
            onKeyDown={handleKeyDown}
            ariaLabel="Korean IME test search"
            placeholder="가족, 한글, etc."
            type="search"
          />
        </FormField>

        <Box>
          <strong>Current Input:</strong> {searchText || '(empty)'}
        </Box>

        <Box>
          <strong>Search Results:</strong>
          {searchResults.length === 0 ? (
            <Box margin={{ top: 'xs' }} color="text-status-inactive">
              No searches yet
            </Box>
          ) : (
            <Box margin={{ top: 'xs' }}>
              {searchResults.map((result, index) => (
                <Box
                  key={index}
                  padding={{ bottom: 'xs' }}
                  color={index === 0 ? 'text-status-success' : 'text-body-secondary'}
                >
                  {result}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </SpaceBetween>
    </SimplePage>
  );
}
