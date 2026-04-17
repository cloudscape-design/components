// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Pagination from '~components/pagination';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import './css-style-api.css';

export default function Page() {
  const [currentPage, setCurrentPage] = useState(3);

  return (
    <SimplePage title="CSS Style API — Pagination">
      <SpaceBetween size="l">
        <div>
          <p>Default</p>
          <Pagination
            currentPageIndex={currentPage}
            pagesCount={10}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
          />
        </div>
        <div>
          <p>Custom styled</p>
          <Pagination
            className="custom-pagination"
            currentPageIndex={currentPage}
            pagesCount={10}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
          />
        </div>
        <div>
          <p>Open end</p>
          <Pagination
            className="custom-pagination"
            currentPageIndex={currentPage}
            pagesCount={10}
            openEnd={true}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
