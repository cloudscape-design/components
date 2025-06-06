// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import SimpleTableWrapper from '~components/simple-table-wrapper';

export default function SimpleTableScenario() {
  return (
    <>
      <h1>Simple table scenario</h1>
      <div style={{ margin: '30px', maxHeight: '1000px' }}>
        <SimpleTableWrapper
          title={'Simple table'}
          enableFiltering={true}
          columns={[
            {
              id: 'name',
              sortable: true,
            },
            {
              id: 'default',
              sortable: true,
            },
            {
              id: 'adjustable',
              sortable: true,
            },
            {
              id: 'description',
              sortable: true,
            },
          ]}
        >
          {baseHtmlTable}
        </SimpleTableWrapper>
      </div>
    </>
  );
}

const baseHtmlTable = (
  <table id="w102aac14c55c11b7">
    <thead>
      <tr>
        <th id="name">Name</th>
        <th id="default">Default</th>
        <th id="adjustable">Adjustable</th>
        <th id="description">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td tabIndex={-1}>(Data Automation) (Console) Maximum document file size (MB)</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) (Console) Maximum number of pages per document file</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) CreateBlueprint - Max number of blueprints per account</td>
        <td tabIndex={-1}>Each supported Region: 350</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-23CF4444"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) CreateBlueprintVersion - Max number of Blueprint versions per Blueprint</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-21EE8B55"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Description length for fields (Characters)</td>
        <td tabIndex={-1}>Each supported Region: 300</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) InvokeDataAutomationAsync - Audio - Max number of concurrent jobs</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3E961CAB"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) InvokeDataAutomationAsync - Document - Max number of concurrent jobs</td>
        <td tabIndex={-1}>Each supported Region: 25</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9E3C255A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) InvokeDataAutomationAsync - Image - Max number of concurrent jobs</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-BDD176EF"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) InvokeDataAutomationAsync - Max number of open jobs</td>
        <td tabIndex={-1}>Each supported Region: 1,800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) InvokeDataAutomationAsync - Video - Max number of concurrent jobs</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-895C7A6C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Audio Sample Rate (Hz)</td>
        <td tabIndex={-1}>Each supported Region: 48,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Blueprints per Project (Documents)</td>
        <td tabIndex={-1}>Each supported Region: 40</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Blueprints per Project (Images)</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum JSON Blueprint Size (Characters)</td>
        <td tabIndex={-1}>Each supported Region: 100,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Levels of Field Hierarchy</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Number of pages per document</td>
        <td tabIndex={-1}>Each supported Region: 3,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum Resolution</td>
        <td tabIndex={-1}>Each supported Region: 8,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum audio file size (MB)</td>
        <td tabIndex={-1}>Each supported Region: 2,048</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum audio length (Minutes)</td>
        <td tabIndex={-1}>Each supported Region: 240</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum document file size (MB)</td>
        <td tabIndex={-1}>Each supported Region: 500</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum image file size (MB)</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum number of Blueprints per Start Inference request (Documents)</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum number of Blueprints per Start Inference request (Images)</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum number of list fields per Blueprint</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum video file size (MB)</td>
        <td tabIndex={-1}>Each supported Region: 10,240</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Maximum video length (Minutes)</td>
        <td tabIndex={-1}>Each supported Region: 240</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Minimum Audio Sample Rate (Hz)</td>
        <td tabIndex={-1}>Each supported Region: 8,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Data Automation) Minimum audio length (Miliseconds)</td>
        <td tabIndex={-1}>Each supported Region: 500</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Contextual grounding query length in text units</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length, in text units, of the query for contextual grounding</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Contextual grounding response length in text units</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length, in text units, of the response for contextual grounding</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Contextual grounding source length in text units</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 100
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 100
          </p>
          <p>Each of the other supported Regions: 50</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length, in text units, of the grounding source for contextual grounding</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Example phrases per Topic</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of topic examples that can be included per topic</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Guardrails per account</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of guardrails in an account</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) On-demand ApplyGuardrail Content filter policy text units per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 200
          </p>
          <p>Each of the other supported Regions: 25</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-01F3CD81"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of text units that can be processed for Content filter policies per second
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) On-demand ApplyGuardrail Denied topic policy text units per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 50
          </p>
          <p>Each of the other supported Regions: 25</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-124DCF3D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of text units that can be processed for Denied topic policies per second
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          (Guardrails) On-demand ApplyGuardrail Sensitive information filter policy text units per second
        </td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 200
          </p>
          <p>Each of the other supported Regions: 25</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-CFCAAB0E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of text units that can be processed for Sensitive information filter policies per second
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) On-demand ApplyGuardrail Word filter policy text units per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 200
          </p>
          <p>Each of the other supported Regions: 25</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9F4DB459"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of text units that can be processed for Word filter policies per second.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) On-demand ApplyGuardrail contextual grounding policy text units per second</td>
        <td tabIndex={-1}>Each supported Region: 106</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-086556D1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of text units that can be processed for contextual grounding policies per second
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) On-demand ApplyGuardrail requests per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 50
          </p>
          <p>Each of the other supported Regions: 25</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9072D6F0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of ApplyGuardrail API calls allowed per second</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Regex entities in Sensitive Information Filter</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of guardrail filter regexes that can be included in a sensitive information policy
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Regex length in characters</td>
        <td tabIndex={-1}>Each supported Region: 500</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length, in characters, of a guardrail filter regex</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Topics per guardrail</td>
        <td tabIndex={-1}>Each supported Region: 30</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of topics that can be defined across guardrail topic policies</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Versions per guardrail</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of versions that a guardrail can have</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Word length in characters</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length of a word, in characters, in a blocked word list</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Guardrails) Words per word policy</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of words that can be included in a blocked word list</td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          (Knowledge Bases) Concurrent IngestKnowledgeBaseDocuments and DeleteKnowledgeBaseDocuments requests per
          account
        </td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of IngestKnowledgeBaseDocuments and DeleteKnowledgeBaseDocuments requests that can be
          running at the same time in an account.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) DeleteKnowledgeBaseDocuments requests per second</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteKnowledgeBaseDocuments API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) Files to ingest per IngestKnowledgeBaseDocuments job.</td>
        <td tabIndex={-1}>Each supported Region: 25</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of documents that can be ingested per IngestKnowledgeBaseDocuments request.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) GenerateQuery requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GenerateQuery API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) GetKnowledgeBaseDocuments requests per second</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetKnowledgeBaseDocuments API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) IngestKnowledgeBaseDocuments requests per second</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of IngestKnowledgeBaseDocuments API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) IngestKnowledgeBaseDocuments total payload size</td>
        <td tabIndex={-1}>Each supported Region: 6</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size (in MB) of total payload in an IngestKnowledgeBaseDocuments request.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) ListKnowledgeBaseDocuments requests per second</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListKnowledgeBaseDocuments API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) Rerank requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of Rerank API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>(Knowledge Bases) RetrieveAndGenerateStream requests per second</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of RetrieveAndGenerateStream API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>APIs per Agent</td>
        <td tabIndex={-1}>Each supported Region: 11</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-6B2DA87E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of APIs that you can add to an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Action groups per Agent</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5DAAE567"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of action groups that you can add to an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Agent Collaborators per Agent</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-EAFCD549"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of collaborator agents that you can add to an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Agent nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of agent nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Agents per account</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-97D79C54"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of Agents in one account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>AssociateAgentKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 6</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of AssociateAgentKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Associated aliases per Agent</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of aliases that you can associate with an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Associated knowledge bases per Agent</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-13143995"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of knowledge bases that you can associate with an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3.5 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Claude 3.5 Sonnet v2</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Claude 3.5 Sonnet v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.1 405B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.1 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.1 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.2 11B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference Llama 3.2 1B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.2 3B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.2 90B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 3.3 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 4 Maverick</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 4 Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Llama 4 Scout</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Mistral Large 2 (24.07)</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Mistral Large 2 (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size of a single file (in GB) submitted for batch inference for Nova Lite V1.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Nova Micro V1</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size of a single file (in GB) submitted for batch inference for Nova Pro V1.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size (in GB) for Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Titan Multimodal Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference input file size for Titan Text Embeddings V2 (in GB)</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum size of a single file (in GB) submitted for batch inference for Titan Text Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3
          Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3.5
          Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3.5
          Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Claude 3.5 Sonnet v2</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Claude 3.5
          Sonnet v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.1 405B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.1 70B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.1 8B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.2 11B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.2 1B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.2 3B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.2 90B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 3.3 70B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 4 Maverick</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 4
          Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Llama 4 Scout</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Mistral Large 2 (24.07)</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Mistral Large 2
          (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Nova Lite V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Nova Micro V1</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Nova Pro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size (in GB) for Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Titan
          Multimodal Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Batch inference job size for Titan Text Embeddings V2 (in GB)</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum cumulative size of all input files (in GB) included in the batch inference job for Titan Text
          Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Characters in Agent instructions</td>
        <td tabIndex={-1}>Each supported Region: 20,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of characters in the instructions for an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Collector nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of collector nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Concurrent ingestion jobs per account</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ingestion jobs that can be running at the same time in an account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Concurrent ingestion jobs per data source</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of ingestion jobs that can be running at the same time for a data source.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Concurrent ingestion jobs per knowledge base</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of ingestion jobs that can be running at the same time for a knowledge base.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Concurrent model import jobs</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of model import jobs that are concurrently in progress.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Condition nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of condition nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Conditions per condition node</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of conditions per condition node.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateAgent requests per second</td>
        <td tabIndex={-1}>Each supported Region: 6</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateAgent API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateAgentActionGroup requests per second</td>
        <td tabIndex={-1}>Each supported Region: 12</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateAgentActionGroup API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateAgentAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateAgentAlias API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateDataSource requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateDataSource API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateFlow requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateFlow requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateFlowAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateFlowAlias requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateFlowVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateFlowVersion requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreateKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreateKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreatePrompt requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreatePrompt requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>CreatePromptVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of CreatePromptVersion requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-Region InvokeModel requests per minute for Anthropic Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Anthropic Claude
          3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-Region InvokeModel requests per minute for Anthropic Claude 3.5 Sonnet V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 500
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Anthropic Claude 3.5 Sonnet
          V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-Region InvokeModel tokens per minute for Anthropic Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 4,000,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4BF37C17"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-Region InvokeModel tokens per minute for Anthropic Claude 3.5 Sonnet V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 4,000,000
          </p>
          <p>Each of the other supported Regions: 800,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FF8B4E28"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Anthropic Claude 3.5
          Sonnet V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel requests per minute for Anthropic Claude 3 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 400
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 400
          </p>
          <p>Each of the other supported Regions: 800</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Anthropic Claude
          3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel requests per minute for Anthropic Claude 3 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000
          </p>
          <p>Each of the other supported Regions: 200</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Anthropic
          Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel requests per minute for Anthropic Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 500
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 40
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 40
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 40
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-1: 40
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-3: 40
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Anthropic Claude 3.5 Sonnet.
          The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel tokens per minute for Anthropic Claude 3 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 400,000
          </p>
          <p>Each of the other supported Regions: 600,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-DCADBC78"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel tokens per minute for Anthropic Claude 3 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000,000
          </p>
          <p>Each of the other supported Regions: 400,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5DF13F64"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region InvokeModel tokens per minute for Anthropic Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-3: 400,000
          </p>
          <p>Each of the other supported Regions: 800,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-479B647F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Anthropic Claude 3.5
          Sonnet. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Amazon Nova Lite</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000
          </p>
          <p>Each of the other supported Regions: 200</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Amazon
          Nova Lite. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Amazon Nova Micro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 2,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000
          </p>
          <p>Each of the other supported Regions: 200</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Amazon
          Nova Micro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Amazon Nova Premier V1</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Amazon
          Nova Premier V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Amazon Nova Pro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 200
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Amazon
          Nova Pro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Anthropic Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for
          Anthropic Claude 3 Opus. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Anthropic Claude 3.7 Sonnet V1</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 250
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 250
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 250
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 100
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-north-1: 100
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-1: 100
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-3: 100
          </p>
          <p>Each of the other supported Regions: 50</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for
          Anthropic Claude 3.7 Sonnet V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel
          and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Anthropic Claude Opus 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for
          Anthropic Claude Opus 4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Anthropic Claude Sonnet 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for
          Anthropic Claude Sonnet 4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel
          and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for DeepSeek R1 V1</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for DeepSeek
          R1 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1,600</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 3.1 8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1,600</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 3.2 1B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 1,600</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Meta Llama 3.2 3B Instruct.
          The quota considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 3.3 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 4 Maverick V1</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 4 Maverick V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Meta Llama 4 Scout V1</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Meta
          Llama 4 Scout V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Mistral Pixtral Large 25.02 V1</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Mistral
          Pixtral Large 25.02 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Writer AI Palmyra X4 V1</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Writer
          AI Palmyra X4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference requests per minute for Writer AI Palmyra X5 V1</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of cross-region requests that you can submit for model inference in one minute for Writer
          AI Palmyra X5 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Amazon Nova Lite</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 4,000,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-7C42E72A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Amazon
          Nova Lite. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Amazon Nova Micro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 4,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 4,000,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-DC7FF66C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Amazon
          Nova Micro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Amazon Nova Premier V1</td>
        <td tabIndex={-1}>Each supported Region: 800,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AA7FE948"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Amazon
          Nova Premier V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Amazon Nova Pro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 800,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 800,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 800,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C0326783"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Amazon
          Nova Pro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Anthropic Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 800,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-6C86825E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Anthropic
          Claude 3 Opus. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Anthropic Claude 3.7 Sonnet V1</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 1,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 100,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-north-1: 100,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-1: 100,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-west-3: 100,000
          </p>
          <p>Each of the other supported Regions: 50,000</p>
        </td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-6E888CC2"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Anthropic
          Claude 3.7 Sonnet V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Anthropic Claude Opus 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 200,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-29C2B0A3"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Anthropic
          Claude Opus 4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Anthropic Claude Sonnet 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 200,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-59759B4A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Anthropic
          Claude Sonnet 4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for DeepSeek R1 V1</td>
        <td tabIndex={-1}>Each supported Region: 200,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-06B03968"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for DeepSeek
          R1 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9913DEEF"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-92E68994"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9782749C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          3.1 8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-BD9FDA6F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          3.2 1B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0B2687F4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Meta Llama 3.2 3B
          Instruct. The quota considers the combined sum of tokens for InvokeModel, InvokeModelWithResponseStream,
          Converse, and ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0E7AA8B7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          3.3 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 4 Maverick V1</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-DE3FBBF4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          4 Maverick V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Meta Llama 4 Scout V1</td>
        <td tabIndex={-1}>Each supported Region: 600,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-532E6630"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Meta Llama
          4 Scout V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Mistral Pixtral Large 25.02 V1</td>
        <td tabIndex={-1}>Each supported Region: 80,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4B9F76B0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Mistral
          Pixtral Large 25.02 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Writer AI Palmyra X4 V1</td>
        <td tabIndex={-1}>Each supported Region: 150,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FF1F238B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Writer AI
          Palmyra X4 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Cross-region model inference tokens per minute for Writer AI Palmyra X5 V1</td>
        <td tabIndex={-1}>Each supported Region: 150,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-90DFE70F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of cross-region tokens that you can submit for model inference in one minute for Writer AI
          Palmyra X5 V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Custom models per account</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-CB5B847D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of custom models in an account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Data sources per knowledge base</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of data sources per knowledge base.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteAgent requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteAgent API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteAgentActionGroup requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteAgentActionGroup API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteAgentAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteAgentAlias API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteAgentVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteAgentVersion API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteDataSource requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteDataSource API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteFlow requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteFlow requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteFlowAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteFlowAlias requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteFlowVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteFlowVersion requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeleteKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeleteKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DeletePrompt requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DeletePrompt requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>DisassociateAgentKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 4</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of DisassociateAgentKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Enabled action groups per agent</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-14A16430"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of action groups that you can enable in an Agent.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Endpoints per inference profile</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of endpoints in an inference profile. An endpoint is defined by a model and the region that
          the invocation requests to the model are sent to.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Files to add or update per ingestion job</td>
        <td tabIndex={-1}>Each supported Region: 5,000,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of new and updated files that can be ingested per ingestion job.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Files to delete per ingestion job</td>
        <td tabIndex={-1}>Each supported Region: 5,000,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of files that can be deleted per ingestion job.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Flow aliases per flow</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of flow aliases.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Flow executions per account</td>
        <td tabIndex={-1}>Each supported Region: 1,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F1613626"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of flow executions per account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Flow versions per flow</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of flow versions.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Flows per account</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D321719B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of flows per account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetAgent requests per second</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetAgent API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetAgentActionGroup requests per second</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetAgentActionGroup API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetAgentAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetAgentAlias API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetAgentKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetAgentKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetAgentVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetAgentVersion API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetDataSource requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetDataSource API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetFlow requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetFlow requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetFlowAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetFlowAlias requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetFlowVersion requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetFlowVersion requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetIngestionJob requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetIngestionJob API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>GetPrompt requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of GetPrompt requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Imported models per account</td>
        <td tabIndex={-1}>Each supported Region: 3</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-45B04988"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of imported models in an account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Inference profiles per account</td>
        <td tabIndex={-1}>Each supported Region: 1,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-40EC9882"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of inference profiles in an account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Ingestion job file size</td>
        <td tabIndex={-1}>Each supported Region: 50</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size (in MB) of a file in an ingestion job.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Ingestion job size</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size (in GB) of an ingestion job.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Inline code nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of inline code nodes per flow.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Input nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of flow input nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Iterator nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of iterator nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Knowledge base nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of knowledge base nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Knowledge bases per account</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of knowledge bases per account.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Lambda function nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of Lambda function nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Lex nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of Lex nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListAgentActionGroups requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListAgentActionGroups API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListAgentAliases requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListAgentAliases API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListAgentKnowledgeBases requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListAgentKnowledgeBases API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListAgentVersions requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListAgentVersions API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListAgents requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListAgents API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListDataSources requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListDataSources API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListFlowAliases requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListFlowAliases requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListFlowVersions requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListFlowVersions requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListFlows requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListFlows requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListIngestionJobs requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListIngestionJobs API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListKnowledgeBases requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListKnowledgeBases API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ListPrompts requests per second</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ListPrompts requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly input token units for model llama3-2-11b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4B9FCAF2"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-11b-instruct-v1 PTv2 Provisions
          exceeding monthly committed input token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly input token units for model llama3-2-1b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-27A6ECB4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-1b-instruct-v1 PTv2 Provisions exceeding
          monthly committed input token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly input token units for model llama3-2-3b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-12CBE43C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-3b-instruct-v1 PTv2 Provisions exceeding
          monthly committed input token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly input token units for model llama3-2-90b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A3722B41"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-90b-instruct-v1 PTv2 Provisions
          exceeding monthly committed input token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly output token units for model claude-3-5-sonnet-20241022-v2</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9A6D7799"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined claude-3-5-sonnet-20241022-v2 PTv2 Provisions
          exceeding monthly committed output token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly output token units for model llama3-2-11b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B7295400"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-11b-instruct-v1 PTv2 Provisions
          exceeding monthly committed output token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly output token units for model llama3-2-1b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-10205469"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-1b-instruct-v1 PTv2 Provisions
          exceeding monthly committed output token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly output token units for model llama3-2-3b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A9AFC293"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-3b-instruct-v1 PTv2 Provisions
          exceeding monthly committed output token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum hourly output token units for model llama3-2-90b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-66FAAC98"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-90b-instruct-v1 PTv2 Provisions
          exceeding monthly committed output token units.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum input file size for distillation customization jobs</td>
        <td tabIndex={-1}>Each supported Region: 2 Gigabytes</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum input file size for distillation customization jobs.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum line length for distillation customization jobs</td>
        <td tabIndex={-1}>Each supported Region: 16 Kilobytes</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum line length in input file for distillation customization jobs.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly input token units for model claude-3-5-sonnet-20241022-v2</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E80E06C4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined claude-3-5-sonnet-20241022-v2 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly input token units for model llama3-2-11b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0BDC8BBA"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-11b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly input token units for model llama3-2-1b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4BE65036"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-1b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly input token units for model llama3-2-3b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-CA6675AE"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-3b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly input token units for model llama3-2-90b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-03208695"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum input token units (x tokens-per-minute) for combined llama3-2-90b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly output token units for model claude-3-5-sonnet-20241022-v2</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D6FE4366"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined claude-3-5-sonnet-20241022-v2 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly output token units for model llama3-2-11b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4ED5F5E3"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-11b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly output token units for model llama3-2-1b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-094C5DAD"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-1b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly output token units for model llama3-2-3b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-59EF624F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-3b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum monthly output token units for model llama3-2-90b-instruct-v1</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-2DA363B5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          Maximum output token units (x tokens-per-minute) for combined llama3-2-90b-instruct-v1 PTv2 Reservations.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Maximum number of prompts for distillation customization jobs</td>
        <td tabIndex={-1}>Each supported Region: 15,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of prompts required for distillation customization jobs.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Maximum student model fine tuning context length for Amazon Nova Micro V1 distillation customization jobs
        </td>
        <td tabIndex={-1}>Each supported Region: 32,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum student model fine tuning context length for Amazon Nova Micro V1 distillation customization jobs.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Maximum student model fine tuning context length for Amazon Nova V1 distillation customization jobs
        </td>
        <td tabIndex={-1}>Each supported Region: 32,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum student model fine tuning context length for Amazon Nova V1 distillation customization jobs.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Maximum student model fine tuning context length for Anthropic Claude 3 haiku 20240307 V1 distillation
          customization jobs
        </td>
        <td tabIndex={-1}>Each supported Region: 32,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum student model fine tuning context length for Anthropic Claude 3 haiku 20240307 V1 distillation
          customization jobs.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Maximum student model fine tuning context length for Llama 3.1 70B Instruct V1 distillation customization jobs
        </td>
        <td tabIndex={-1}>Each supported Region: 16,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum student model fine tuning context length for Llama 3.1 70B Instruct V1 distillation customization
          jobs.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Maximum student model fine tuning context length for Llama 3.1 8B Instruct V1 distillation customization jobs
        </td>
        <td tabIndex={-1}>Each supported Region: 32,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum student model fine tuning context length for Llama 3.1 8B Instruct V1 distillation customization
          jobs.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of prompts for distillation customization jobs</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The minimum number of prompts required for distillation customization jobs.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3.5 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Claude 3.5 Sonnet v2</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Claude 3.5 Sonnet v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.1 405B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.1 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.1 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.2 11B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job Llama 3.2 1B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.2 3B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.2 90B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 3.3 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 4 Maverick</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 4 Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Llama 4 Scout</td>
        <td tabIndex={-1}>Each supported Region: 50</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Mistral Large 2 (24.07)</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Mistral Large 2 (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Nova Lite V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Nova Micro V1</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Nova Pro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Titan Multimodal Embeddings
          G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Minimum number of records per batch inference job for Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The minimum number of records across all input files in a batch inference job for Titan Text Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model invocation max tokens per day for Amazon Nova Premier V1</td>
        <td tabIndex={-1}>Each supported Region: 576,000,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one day for Amazon Nova Premier V1.
          The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model invocation max tokens per day for Anthropic Claude Opus 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 10,000,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one day for Anthropic Claude Opus 4
          V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model invocation max tokens per day for Anthropic Claude Sonnet 4 V1</td>
        <td tabIndex={-1}>Each supported Region: 10,000,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one day for Anthropic Claude Sonnet 4
          V1. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units no-commitment Provisioned Throughputs across base models</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FE44174A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be distributed across no-commitment Provisioned Throughputs for
          base models
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units no-commitment Provisioned Throughputs across custom models</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-BE77399C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be distributed across no-commitment Provisioned Throughputs for
          custom models
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for AI21 Labs Jurassic-2 Mid</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9342B636"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for AI21 Labs Jurassic-2 Mid.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for AI21 Labs Jurassic-2 Ultra</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3F0ECEDC"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for AI21 Labs Jurassic-2 Ultra.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Nova Canvas</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FD4A6FF9"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Nova Canvas.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Embeddings G1 - Text</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F879F645"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Embeddings G1 -
          Text.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Image Generator G1</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F424A1E3"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Image Generator
          G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Image Generator G2</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-92F8A601"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Image Generator
          G2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Lite V1 4K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A4EBFDE7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Text Lite V1
          4K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-32F732DE"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Multimodal
          Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1074C53D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Text Embeddings
          V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Text G1 - Express 8K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8129BF10"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Text G1 -
          Express 8K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Amazon Titan Text Premier V1 32K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5056051A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Amazon Titan Text Premier V1
          32K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3 Haiku 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-EF415EF6"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3 Haiku
          200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3 Haiku 48K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3BE61D60"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3 Haiku
          48K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3 Sonnet 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1F7657F1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3 Sonnet
          200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3 Sonnet 28K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B3C19043"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3 Sonnet
          28K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Haiku 16K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D3E17A13"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Haiku
          16K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Haiku 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-921A310E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Haiku
          200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Haiku 64K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-43CD2FD9"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Haiku
          64K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet 18K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-259C746F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          18K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-2590C31B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet 51K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-208A3F5C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          51K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet V2 18K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-02710C34"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          V2 18K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet V2 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-24060791"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          V2 200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.5 Sonnet V2 51K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B2718619"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.5 Sonnet
          V2 51K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.7 V1.0 Sonnet 18K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D09F1612"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.7 V1.0
          Sonnet 18K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.7 V1.0 Sonnet 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F4131C39"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.7 V1.0
          Sonnet 200K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude 3.7 V1.0 Sonnet 51K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0B0CDE73"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude 3.7 V1.0
          Sonnet 51K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude Instant V1 100K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4A6D2F15"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude Instant V1
          100K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude V2 100K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C4522D0D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude V2 100K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude V2 18K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-73573F44"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude V2 18K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude V2.1 18K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-7478F443"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude V2.1 18K.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Anthropic Claude V2.1 200K</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A63633C5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Anthropic Claude V2.1 200k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Command</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5E29F315"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Command.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Command Light</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-01F37E14"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Command Light.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Command R</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F2469446"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Command R 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Command R Plus</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C549AE85"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Command R Plus 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Embed English</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-97A8CC77"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Embed English.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Cohere Embed Multilingual</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1870BD3C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Cohere Embed Multilingual.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 2 13B</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-268D592E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 2 13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 2 70B</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-2EBEF050"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 2 70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 2 Chat 13B</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AC6F8476"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 2 Chat 13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 2 Chat 70B</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E953E4AB"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 2 Chat 70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B3049E9B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-16711FC4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-DD7903AD"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.1 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3632DE15"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.1 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1679CB40"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.2 11B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B547321D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.2 1B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-12E68701"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.2 3B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Meta Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-DEE3A9C7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Meta Llama 3.2 90B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Mistral Large 2407</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-697D688A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Mistral Large 2407.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-7A8639EE"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Stability.ai Stable Diffusion XL 0.8</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-240F3183"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Stability.ai Stable
          Diffusion XL 0.8
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for Stability.ai Stable Diffusion XL 1.0</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9149A536"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for Stability.ai Stable
          Diffusion XL 1.0.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units per provisioned model for the 128k context length variant for Amazon Nova Micro
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AC096F71"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 128k context length
          variant for Amazon Nova Micro
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units per provisioned model for the 24k context length variant for Amazon Nova Lite{' '}
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4532261E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 24k context length
          variant for Amazon Nova Lite
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units per provisioned model for the 24k context length variant for Amazon Nova Micro{' '}
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E0B2EE2A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 24k context length
          variant for Amazon Nova Micro
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for the 24k context length variant for Amazon Nova Pro</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9C8C5911"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 24k context length
          variant for Amazon Nova Pro
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units per provisioned model for the 300k context length variant for Amazon Nova Lite
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-127FC9D0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 300k context length
          variant for Amazon Nova Lite
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Model units per provisioned model for the 300k context length variant for Amazon Nova Pro</td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E48B7984"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allotted to a provisioned model for the 300k context length
          variant for Amazon Nova Pro.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units, with commitment, for Provisioned Throughout created for Meta Llama 4 Scout 17B Instruct 10M
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0D70E8DA"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for Meta Llama 4
          Scout 17B Instruct 10M, with commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units, with commitment, for Provisioned Throughout created for Meta Llama 4 Scout 17B Instruct 128K
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D682535A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for Meta Llama 4
          Scout 17B Instruct 128K, with commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units, with commitment, for Provisioned Throughout created for Meta Maverick 4 Scout 17B Instruct 128K
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-7C435546"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for Meta Llama 4
          Maverick 17B Instruct 128K, with commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Model units, with commitment, for Provisioned Throughout created for Meta Maverick 4 Scout 17B Instruct 1M
        </td>
        <td tabIndex={-1}>Each supported Region: 0</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8574D065"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for Meta Llama 4
          Maverick 17B Instruct 1M, with commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          No-commitment model units for Provisioned Throughput created for base model Amazon Nova Canvas V1.0
        </td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for the base model
          Amazon Nova Canvas V1.0, with no commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          No-commitment model units for Provisioned Throughput created for custom model Amazon Nova Canvas V1 0
        </td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of model units that can be allocated to a Provisioned Throughput created for the custom
          model Amazon Nova Canvas V1 0, with no commitment.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of concurrent automatic model evaluation jobs</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of automatic model evaluation jobs that you can specify at one time in this account in the
          current Region.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of concurrent model evaluation jobs that use human workers</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of model evaluation jobs that use human workers you can specify at one time in this account
          in the current Region.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of custom metrics</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of custom metrics that you can specify in a model evaluation job that uses human workers.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of custom prompt datasets in a human-based model evaluation job</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of custom prompt datasets that you can specify in a human-based model evaluation job in
          this account in the current Region.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of custom prompt routers per account</td>
        <td tabIndex={-1}>Each supported Region: 500</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of custom prompt routers that you can create per account per region.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of datasets per job</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of datasets that you can specify in an automated model evaluation job. This includes both
          custom and built-in prompt datasets.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of evaluation jobs</td>
        <td tabIndex={-1}>Each supported Region: 5,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of model evaluation jobs that you can create in this account in the current Region.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of metrics per dataset</td>
        <td tabIndex={-1}>Each supported Region: 3</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of metrics that you can specify per dataset in an automated model evaluation job. This
          includes both custom and built-in metrics.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of models in a model evaluation job that uses human workers</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of models that you can specify in a model evaluation job that uses human workers.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of models in automated model evaluation job</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of models that you can specify in an automated model evaluation job.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Number of prompts in a custom prompt dataset</td>
        <td tabIndex={-1}>Each supported Region: 1,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of prompts a custom prompt dataset can contain.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          On-Demand, latency-optimized model inference requests per minute for Meta Llama 3.1 405B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand, latency-optimized requests that you can submit for model inference in one
          minute for Meta Llama 3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream,
          InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          On-Demand, latency-optimized model inference requests per minute for Meta Llama 3.1 70B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand, latency-optimized requests that you can submit for model inference in one
          minute for Meta Llama 3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream,
          InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          On-Demand, latency-optimized model inference tokens per minute for Meta Llama 3.1 405B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 40,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand, latency-optimized tokens that you can submit for model inference in one
          minute for Meta Llama 3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream,
          InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          On-Demand, latency-optimized model inference tokens per minute for Meta Llama 3.1 70B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 40,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand, latency-optimized tokens that you can submit for model inference in one
          minute for Meta Llama 3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream,
          InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel concurrent requests for Amazon Nova Reel1.0</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of concurrent model inference requests that you can submit for Amazon Nova Reel 1.0. The
          quota considers the combined sum of Converse, ConverseStream, InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel concurrent requests for Amazon Nova Reel1.1</td>
        <td tabIndex={-1}>Each supported Region: 3</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of concurrent model inference requests that you can submit for Amazon Nova Reel 1.1. The
          quota considers the combined sum of Converse, ConverseStream, InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel concurrent requests for Amazon Nova Sonic</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of concurrent requests that you can submit for model inference for Amazon Nova Sonic.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for AI21 Labs Jamba 1.5 Large</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for AI21 Labs Jamba 1.5 Large. The
          quota considers the combined sum of requests for Converse and InvokeModel
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for AI21 Labs Jamba 1.5 Mini</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for AI21 Labs Jamba 1.5 Mini. The
          quota considers the combined sum of requests for Converse and InvokeModel
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for AI21 Labs Jamba Instruct</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for AI21 Labs Jamba Instruct. The
          quota considers the combined sum of requests for Converse and InvokeModel
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for AI21 Labs Jurassic-2 Mid</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for AI21 Labs
          Jurassic-2 Mid
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for AI21 Labs Jurassic-2 Ultra</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for AI21 Labs
          Jurassic-2 Ultra
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Nova Canvas</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of requests that you can submit for model inference in one minute for Amazon Nova Canvas.
          The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Rerank 1.0</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Amazon Rerank 1.0.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Image Generator G1</td>
        <td tabIndex={-1}>Each supported Region: 60</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Amazon Titan Image Generator G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Amazon Titan Multimodal Embeddings
          G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Text Embeddings</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Amazon Titan Text Embeddings
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Amazon Titan Text Embeddings V2
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Text Express</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Amazon Titan
          Text Express
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Text Lite</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Amazon Titan
          Text Lite
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Amazon Titan Text Premier</td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Amazon Titan
          Text Premier
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude 3 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 200
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 200
          </p>
          <p>Each of the other supported Regions: 400</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Anthropic Claude
          3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude 3 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 500
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 500
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Anthropic
          Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 250
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-2: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-south-1: 50
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-2: 50
          </p>
          <p>Each of the other supported Regions: 20</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Anthropic Claude 3.5 Sonnet.
          The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude 3.5 Sonnet V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 250
          </p>
          <p>Each of the other supported Regions: 50</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Anthropic Claude 3.5 Sonnet
          V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude Instant</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000
          </p>
          <p>Each of the other supported Regions: 400</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Anthropic
          Claude Instant
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Anthropic Claude V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 500
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 500
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Anthropic
          Claude V2
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Command</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Cohere Command.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Command Light</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Cohere Command
          Light.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Command R</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Cohere Command
          R 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Command R Plus</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Cohere Command
          R Plus 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Embed English</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Cohere Embed English.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Embed Multilingual</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Cohere Embed Multilingual.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Cohere Rerank 3.5</td>
        <td tabIndex={-1}>Each supported Region: 250</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Cohere Rerank 3.5.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Meta Llama 2 13B</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Meta Llama 2
          13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Meta Llama 2 70B</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Meta Llama 2
          70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Meta Llama 2 Chat 13B</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Meta Llama 2
          Chat 13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Meta Llama 2 Chat 70B</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream requests for Meta Llama 2
          Chat 70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Mistral 7B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Mistral mistral-7b-instruct-v0
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Mistral AI Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute for
          Mistral AI Mistral Small
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Mistral Large</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute for
          Mistral mistral-large-2402-v1
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Mistral Mixtral 8x7b Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Mistral mixtral-8x7b-v0
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Diffusion 3 Large</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Diffusion 3
          Large.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Diffusion 3 Medium</td>
        <td tabIndex={-1}>Each supported Region: 60</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Diffusion 3
          Medium
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Diffusion 3.5 Large</td>
        <td tabIndex={-1}>Each supported Region: 15</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The quota considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream for Stability.ai Stable Diffusion 3.5 Large.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Diffusion XL 0.8</td>
        <td tabIndex={-1}>Each supported Region: 60</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Diffusion XL
          0.8
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Diffusion XL 1.0</td>
        <td tabIndex={-1}>Each supported Region: 60</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Diffusion XL
          1.0
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Image Core</td>
        <td tabIndex={-1}>Each supported Region: 90</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Image Core.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel requests per minute for Stability.ai Stable Image Ultra</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel in one minute for Stability.ai Stable Image Ultra.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for AI21 Labs Jamba 1.5 Large</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for AI21 Labs Jamba 1.5
          Large. The quota considers the combined sum of tokens for Converse and InvokeModel.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for AI21 Labs Jamba 1.5 Mini</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for AI21 Labs Jamba 1.5
          Mini. The quota considers the combined sum of tokens for Converse and InvokeModel.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for AI21 Labs Jamba Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for AI21 Labs Jamba
          Instruct. The quota considers the combined sum of tokens for Converse and InvokeModel
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for AI21 Labs Jurassic-2 Mid</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for AI21 Labs Jurassic-2
          Mid.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for AI21 Labs Jurassic-2 Ultra</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for AI21 Labs Jurassic-2
          Ultra.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Image Generator G1</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Amazon Titan Image
          Generator G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Amazon Titan
          Multimodal Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Text Embeddings</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Amazon Titan Text
          Embeddings.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Amazon Titan Text
          Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Text Express</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Amazon Titan Text Express.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Text Lite</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Amazon Titan Text Lite.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Amazon Titan Text Premier</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Amazon Titan Text Premier.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude 3 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-1: 200,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-1: 200,000
          </p>
          <p>Each of the other supported Regions: 300,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude 3 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-2: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-northeast-2: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-south-1: 400,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-southeast-2: 400,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Anthropic Claude 3.5
          Sonnet. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude 3.5 Sonnet V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 2,000,000
          </p>
          <p>Each of the other supported Regions: 400,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Anthropic Claude 3.5
          Sonnet V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude Instant</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 1,000,000
          </p>
          <p>Each of the other supported Regions: 300,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude Instant.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Anthropic Claude V2</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 500,000
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-2: 500,000
          </p>
          <p>Each of the other supported Regions: 200,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Command</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Cohere Command.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Command Light</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Cohere Command Light.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Command R</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Cohere Command R 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Command R Plus</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Cohere Command R Plus 128k.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Embed English</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Cohere Embed English.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Cohere Embed Multilingual</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel in one minute for Cohere Embed
          Multilingual.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Meta Llama 2 13B</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Meta
          Llama 2 13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Meta Llama 2 70B</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Meta
          Llama 2 70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Meta Llama 2 Chat 13B</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Meta
          Llama 2 Chat 13B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Meta Llama 2 Chat 70B</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Meta
          Llama 2 Chat 70B.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Mistral AI Mistral 7B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Mistral AI Mistral 7B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Mistral AI Mistral Large</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Mistral AI Mistral Large.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Mistral AI Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Mistral AI Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand InvokeModel tokens per minute for Mistral AI Mixtral 8X7BB Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Mistral mixtral-8x7b-instruct-v0.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          On-demand latency-optimized InvokeModel requests per minute for Anthropic Claude 3.5 Haiku
        </td>
        <td tabIndex={-1}>Each supported Region: 100</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call InvokeModel and InvokeModelWithResponseStream in one minute. The
          quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for Anthropic Claude
          3.5 Haiku, if latency optimization is configured.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand latency-optimized InvokeModel tokens per minute for Anthropic Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 500,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can provide through InvokeModel and InvokeModelWithResponseStream in one
          minute. The quota considers the combined sum of InvokeModel and InvokeModelWithResponseStream tokens for
          Anthropic Claude 3.5 Haiku, if latency optimization is configured.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference concurrent requests for Luma Ray V2</td>
        <td tabIndex={-1}>Each supported Region: 1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of concurrent requests that you can submit for model inference for Luma Ray V2. The quota
          considers the combined sum of Converse, ConverseStream, InvokeModel and InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Amazon Nova Lite</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Amazon Nova
          Lite. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Amazon Nova Micro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 1,000
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Amazon Nova
          Micro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Amazon Nova Pro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ca-central-1: 50
          </p>
          <p>Each of the other supported Regions: 100</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Amazon Nova
          Pro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Amazon Titan Image Generator G1 V2</td>
        <td tabIndex={-1}>Each supported Region: 60</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Amazon
          Titan Image Generator G1 V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Anthropic Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 50</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Anthropic
          Claude 3 Opus. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Anthropic Claude 3.5 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-1: 400
          </p>
          <p>Each of the other supported Regions: 1,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Anthropic
          Claude 3.5 Haiku. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3 8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 200</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3.1 8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Meta Llama 3.2 11B Instruct.
          The quota considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3.2 1B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 800</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Meta Llama 3.2 3B Instruct.
          The quota considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Meta Llama 3.2 90B Instruct.
          The quota considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Meta Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand requests that you can submit for model inference in one minute for Meta Llama
          3.3 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference requests per minute for Mistral Large 2407</td>
        <td tabIndex={-1}>Each supported Region: 400</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of times that you can call model inference in one minute for Mistral Large 2407. The quota
          considers the combined sum of requests for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Amazon Nova Lite</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000,000
          </p>
          <p>Each of the other supported Regions: 100,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Amazon Nova
          Lite. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Amazon Nova Micro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 2,000,000
          </p>
          <p>Each of the other supported Regions: 100,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Amazon Nova
          Micro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Amazon Nova Pro</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ca-central-1: 100,000
          </p>
          <p>Each of the other supported Regions: 400,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Amazon Nova
          Pro. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Amazon Titan Image Generator G1 V2</td>
        <td tabIndex={-1}>Each supported Region: 2,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Amazon Titan
          Image Generator G1 V2. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Anthropic Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 400,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Anthropic
          Claude 3 Opus. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Anthropic Claude 3.5 Haiku</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-west-1: 300,000
          </p>
          <p>Each of the other supported Regions: 2,000,000</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Anthropic
          Claude 3.5 Haiku. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama 3
          70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama 3
          8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 400,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama
          3.1 405B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama
          3.1 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama
          3.1 8B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Meta Llama 3.2 11B
          Instruct. The quota considers the combined sum of tokens for InvokeModel, InvokeModelWithResponseStream,
          Converse, and ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama
          3.2 1B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Meta Llama 3.2 3B
          Instruct. The quota considers the combined sum of tokens for InvokeModel, InvokeModelWithResponseStream,
          Converse, and ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Meta Llama 3.2 90B
          Instruct. The quota considers the combined sum of tokens for InvokeModel, InvokeModelWithResponseStream,
          Converse, and ConverseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Meta Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of on-demand tokens that you can submit for model inference in one minute for Meta Llama
          3.3 70B Instruct. The quota considers the combined sum of Converse, ConverseStream, InvokeModel and
          InvokeModelWithResponseStream.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>On-demand model inference tokens per minute for Mistral Large 2407</td>
        <td tabIndex={-1}>Each supported Region: 300,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of tokens that you can submit for model inference in one minute for Mistral Large 2407. The
          quota considers the combined sum of tokens for InvokeModel, InvokeModelWithResponseStream, Converse, and
          ConverseStream
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Output nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of flow output nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Parameters per function</td>
        <td tabIndex={-1}>Each supported Region: 5</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4B4330A0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of parameters that you can have in an action group function.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>PrepareAgent requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of PrepareAgent API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>PrepareFlow requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of PrepareFlow requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Prompt nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-0F2A24D7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of prompt nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Prompts per account</td>
        <td tabIndex={-1}>Each supported Region: 500</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B783C50B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of prompts.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1F644C2A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E8FA49DB"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-16E25672"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-274AA31F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1E2B9998"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3.5 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Claude 3.5 Sonnet v2</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-6EBFEB27"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Claude 3.5 Sonnet v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AA411D03"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.1 405B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8D07E980"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.1 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FA06C205"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.1 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-95CACD43"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.2 11B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FF73AE42"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job Llama 3.2 1B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-982DE2DB"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.2 3B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4821684D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.2 90B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E293C7C7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 3.3 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 4 Maverick</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-6FAB43BE"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 4 Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Llama 4 Scout</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D41E62E4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Mistral Large 2 (24.07)</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-CA80888F"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Mistral Large 2 (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-072E11FC"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-916C9264"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Nova Lite V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Nova Micro V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-57DC56A1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-89197AE6"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Nova Pro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3BD2251E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Titan Multimodal Embeddings
          G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per batch inference job for Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AAC5F6D6"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records across all input files in a batch inference job for Titan Text Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-EBB72C32"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3 Opus</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-642905B5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E93C745B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3.5 Haiku</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C39B6D57"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3.5 Sonnet</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5AB0EE48"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3.5 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Claude 3.5 Sonnet v2</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-897F8151"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Claude 3.5 Sonnet v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.1 405B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8651ED26"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.1 405B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.1 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E038D932"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.1 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.1 8B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-AFE8E0CD"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.1 8B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.2 11B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D30E6B4B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.2 11B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.2 1B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-478319B0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job Llama 3.2 1B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.2 3B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F2E6F90D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.2 3B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.2 90B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-51B0DEE7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.2 90B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 3.3 70B Instruct</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F77743B5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 3.3 70B Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 4 Maverick</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B4B995D8"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 4 Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Llama 4 Scout</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-92E7FE32"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Mistral Large 2 (24.07)</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-BAE2EB93"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Mistral Large 2 (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Mistral Small</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E6489B37"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B8626674"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of records in an input file in a batch inference job for Nova Lite V1.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Nova Micro V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D56DF585"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9B651738"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>The maximum number of records in an input file in a batch inference job for Nova Pro V1.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Titan Multimodal Embeddings G1</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-81E26054"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Titan Multimodal Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Records per input file per batch inference job for Titan Text Embeddings V2</td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-D1151D45"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of records in an input file in a batch inference job for Titan Text Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Retrieve requests per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-south-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ca-central-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 20
          </p>
          <p>Each of the other supported Regions: 5</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of Retrieve API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>RetrieveAndGenerate requests per second</td>
        <td tabIndex={-1}>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            us-east-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ap-south-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            ca-central-1: 20
          </p>
          <p data-region-mapper-last-set="1749118113329" style={{ pointerEvents: 'auto' }}>
            eu-central-1: 20
          </p>
          <p>Each of the other supported Regions: 5</p>
        </td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of RetrieveAndGenerate API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>S3 retrieval nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of S3 retrieval nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>S3 storage nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of S3 storage nodes.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Scheduled customization jobs</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of scheduled customization jobs.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Size of prompt</td>
        <td tabIndex={-1}>Each supported Region: 4</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size (in KB) of an individual prompt in a custom prompt dataset.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>StartIngestionJob requests per second</td>
        <td tabIndex={-1}>Each supported Region: 0.1</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of StartIngestionJob API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3 Haiku
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1570CF9E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3 Opus
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-9A0F509C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3 Opus.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3 Sonnet
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-67BD0D49"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Haiku
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-220B8A25"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Haiku.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Sonnet
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4E7EE0B5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Sonnet.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Sonnet v2
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C2FA9AEC"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Claude 3.5 Sonnet
          v2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.1 405B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A0AAB785"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.1 405B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.1 70B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-62E2A345"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.1 70B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.1 8B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-391478D2"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.1 8B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.2 11B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3CCB3548"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.2 11B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.2 1B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8CC57EDA"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.2 1B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.2 3B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-059C1AAB"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.2 3B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.2 90B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-89923E2C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.2 90B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 3.3 70B Instruct
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FE24F76E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 3.3 70B
          Instruct.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 4 Maverick
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-4E7DDF49"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 4 Maverick.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Llama 4 Scout
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-B1E11F5B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Llama 4 Scout.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Mistral Large 2 (24.07)
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5D367E5C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Mistral Large 2
          (24.07).
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Mistral Small
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-A986092E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Mistral Small.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of in-progress and submitted batch inference jobs using a base model for Nova Lite V1</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E2ED42E6"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Nova Lite V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Nova Micro V1
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-564C017C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Nova Micro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of in-progress and submitted batch inference jobs using a base model for Nova Pro V1</td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-FE130012"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Nova Pro V1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Titan Multimodal Embeddings G1
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-7F2C6F33"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Titan Multimodal
          Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a base model for Titan Text Embeddings V2
        </td>
        <td tabIndex={-1}>Each supported Region: 20</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-1AC1CABC"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a base model for Titan Text
          Embeddings V2.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a custom model for Titan Multimodal Embeddings G1
        </td>
        <td tabIndex={-1}>Each supported Region: 3</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a custom model for Titan Multimodal
          Embeddings G1.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of in-progress and submitted batch inference jobs using a custom model for Titan Text Embeddings V2
        </td>
        <td tabIndex={-1}>Each supported Region: 3</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of in-progress and submitted batch inference jobs using a custom model for Titan Text
          Embeddings V2
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Amazon Nova Lite Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 20,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-031F46A7"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Amazon Nova Lite Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Amazon Nova Micro Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 20,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-EC6A6ABC"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Amazon Nova Micro Fine-tuning
          job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Amazon Nova Pro Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-70FC4C0E"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Amazon Nova Pro Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Claude 3 Haiku v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-679179D2"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Claude 3 Haiku Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Claude 3-5-Haiku v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-ADA98D8D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Claude 3-5-Haiku Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Meta Llama 2 13B v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-68AE6C02"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 2 13B Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Meta Llama 2 70B v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-5A222661"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 2 70B Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.1 70B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-63EC9D04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.1 70B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.1 8B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-34C933D1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.1 8B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.2 11B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-E5FD5C04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.2 11B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.2 1B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-70B8359C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.2 1B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.2 3B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-75A18A04"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.2 3B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Meta Llama 3.2 90B Instruct v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-8076814C"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Meta Llama 3.2 90B Instruct
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Titan Image Generator G1 V1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-73BBA086"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Image Generator Fine-tuning
          job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Titan Image Generator G1 V2 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-F15FCC01"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Image Generator V2
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Titan Multimodal Embeddings G1 v1 Fine-tuning job
        </td>
        <td tabIndex={-1}>Each supported Region: 50,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-BB313AA3"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Multimodal Embeddings
          Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Titan Text G1 - Express v1 Continued Pre-Training job
        </td>
        <td tabIndex={-1}>Each supported Region: 100,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-CDD9DC4A"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Text Express Continued
          Pre-Training job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Titan Text G1 - Express v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-79BA683B"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Text Express Fine-tuning
          job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>
          Sum of training and validation records for a Titan Text G1 - Lite v1 Continued Pre-Training job
        </td>
        <td tabIndex={-1}>Each supported Region: 100,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-91554672"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Text Lite Continued
          Pre-Training job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Titan Text G1 - Lite v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 10,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-3B82104D"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Text Lite Fine-tuning job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Sum of training and validation records for a Titan Text G1 - Premier v1 Fine-tuning job</td>
        <td tabIndex={-1}>Each supported Region: 20,000</td>
        <td tabIndex={-1}>
          <a
            href="https://console.aws.amazon.com/servicequotas/home/services/bedrock/quotas/L-C0CACF50"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Yes</span>
          </a>
        </td>
        <td tabIndex={-1}>
          The maximum combined number of training and validation records allowed for a Titan Text Premier Fine-tuning
          job.
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Task time for workers</td>
        <td tabIndex={-1}>Each supported Region: 30</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum length (in days) of time that a worker can have to complete tasks.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation Runtime: ListTagsForResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation Runtime: ListTagsForResource requests you can make per second
          per account, in the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation Runtime: TagResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation Runtime: TagResource requests you can make per second per
          account, in the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation Runtime: UntagResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation Runtime: UntagResource requests you can make per second per
          account, in the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation: ListTagsForResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation: ListTagsForResource requests you can make per second per
          account, in the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation: TagResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation: TagResource requests you can make per second per account, in
          the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for Bedrock Data Automation: UntagResource</td>
        <td tabIndex={-1}>Each supported Region: 25 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>
          The maximum number of Bedrock Data Automation: UntagResource requests you can make per second per account, in
          the current region
        </td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for CreateBlueprint</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for CreateBlueprintVersion</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for CreateDataAutomationProject</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for DeleteBlueprint</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for DeleteDataAutomationProject</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for GetBlueprint</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for GetDataAutomationProject</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for GetDataAutomationStatus</td>
        <td tabIndex={-1}>Each supported Region: 10 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for InvokeDataAutomationAsync</td>
        <td tabIndex={-1}>Each supported Region: 10 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for ListBlueprints</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for ListDataAutomationProjects</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for UpdateBlueprint</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Throttle rate limit for UpdateDataAutomationProject</td>
        <td tabIndex={-1}>Each supported Region: 5 per second</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>No Description Available</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Total nodes per flow</td>
        <td tabIndex={-1}>Each supported Region: 40</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of nodes in a flow.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateAgent requests per second</td>
        <td tabIndex={-1}>Each supported Region: 4</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateAgent API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateAgentActionGroup requests per second</td>
        <td tabIndex={-1}>Each supported Region: 6</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateAgentActionGroup API requests per second</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateAgentAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateAgentAlias API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateAgentKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 4</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateAgentKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateDataSource requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateDataSource API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateFlow requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateFlow requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateFlowAlias requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateFlowAlias requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdateKnowledgeBase requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdateKnowledgeBase API requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>UpdatePrompt requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of UpdatePrompt requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>User query size</td>
        <td tabIndex={-1}>Each supported Region: 1,000</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum size (in characters) of a user query.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>ValidateFlowDefinition requests per second</td>
        <td tabIndex={-1}>Each supported Region: 2</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of ValidateFlowDefinition requests per second.</td>
      </tr>
      <tr>
        <td tabIndex={-1}>Versions per prompt</td>
        <td tabIndex={-1}>Each supported Region: 10</td>
        <td tabIndex={-1}>No</td>
        <td tabIndex={-1}>The maximum number of versions per prompt.</td>
      </tr>
    </tbody>
  </table>
);
