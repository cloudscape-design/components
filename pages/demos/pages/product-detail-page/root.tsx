// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table from '@cloudscape-design/components/table';
import TextContent from '@cloudscape-design/components/text-content';

import { isVisualRefresh } from '../../common/apply-mode';
import { CustomAppLayout, GlobalSplitPanelContent, useGlobalSplitPanel } from '../commons/common-components';
import { HeroHeader } from './hero-header';
import badgePartnerAdvanced from './images/aws-partner-badge.png';
import videoThumbnail from './images/video-thumbnail.jpg';
import { OnThisPageNavigation } from './on-this-page';
import { UserFeedback } from './user-feedback';

import '../../styles/product-page.scss';

// Theming stripped out — not needed for exploration purposes

function ProductOverview() {
  return (
    <section className="page-section" aria-label="Product overview">
      <Header variant="h2">
        <span id="product-overview">Product overview</span>
      </Header>
      <SpaceBetween size="m">
        <div>
          <Box variant="p">
            Receive real-time data insights to build process improvements, track key performance indicators, and predict
            future business outcomes. Create a new Cloud Data Solution account to receive a 30 day free trial of all
            Cloud Data Solution services.
          </Box>
          <Box variant="p">
            Gather actionable analytics at scale to improve customer experiences and application development. Plus,
            leverage large data sets to drive business decisions.
          </Box>
        </div>

        <div>
          <Box variant="h3" margin={{ bottom: 'xs' }}>
            Product details
          </Box>
          <Box>
            <dl className="product-details" aria-label="Product details">
              <dt>Sold by</dt>
              <dd>
                <Link href="#" external={true} variant="primary">
                  Cloud Data
                </Link>
              </dd>

              <dt>Product category</dt>
              <dd>Software as a Service</dd>

              <dt>Delivery method</dt>
              <dd>
                QuickLaunch
                <br />
                CloudFormation Template
              </dd>
            </dl>
          </Box>
        </div>

        <Box margin={{ top: 'xs' }}>
          <Container
            media={{
              content: (
                <Link href="#">
                  <img src={videoThumbnail} alt="Video thumbnail" />
                </Link>
              ),
            }}
          >
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="small">6 min</Box>
              <Box variant="h2" tagOverride="h3">
                <Link fontSize="heading-m" href="#">
                  Video Title
                </Link>
              </Box>
            </SpaceBetween>
          </Container>
        </Box>

        <div>
          <Header variant="h3">Highlights</Header>
          <TextContent>
            <ul>
              <li>Real-time analytic alerts to detect anomalies across your products and services.</li>
              <li>
                Prepare data sets to increase visibility into areas of your organization to make business decisions.
              </li>
              <li>Build and manage large data sets to gain deeper insights and track trends.</li>
              <li>Begin a 30 day free trial to get actionable insights today.</li>
            </ul>
          </TextContent>
        </div>

        <div>
          <Header variant="h3">Vendor insights</Header>
          <SpaceBetween size="m">
            <Box variant="p">
              The current version of this product contains a security profile, and has acquired the certifications
              below.
              <br />
              <Link href="#" variant="primary" external={true}>
                View all profiles for this product
              </Link>
            </Box>
            <img src={badgePartnerAdvanced} alt="AWS Partner Advanced badge" width="125" height="125" />
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </section>
  );
}

function Pricing() {
  return (
    <section className="page-section" aria-label="Pricing">
      <Header variant="h2">
        <span id="pricing">Pricing</span>
      </Header>
      <SpaceBetween size="m">
        <div>
          <Box variant="p">
            Use this tool to estimate the software and infrastructure costs based your configuration choices. Your usage
            and costs might be different from this estimate. The costs will be reflected on your monthly billing
            reports.{' '}
            <Link href="#" variant="primary">
              Contact us
            </Link>{' '}
            to request contract pricing for this product.
          </Box>
        </div>

        <Table
          wrapLines={true}
          header={<Header variant="h3">Cloud Data Solution</Header>}
          columnDefinitions={[
            { header: 'Units', cell: item => item.units },
            { header: 'Description', cell: item => item.description },
            { header: '12 months', cell: item => item['12months'] },
            { header: '24 months', cell: item => item['24months'] },
            { header: '36 months', cell: item => item['36months'] },
          ]}
          items={[
            {
              units: 'Elite package',
              description: '50 users, each user can backup up to 20 devices',
              '12months': '$1,200',
              '24months': '$2,400',
              '36months': '$3,600',
            },
            {
              units: 'Premium package',
              description: '30 users, each user can backup up to 10 devices',
              '12months': '$840',
              '24months': '$1,680',
              '36months': '$2,520',
            },
            {
              units: 'Basic package',
              description: '10 users, each user can backup up to 2 devices',
              '12months': '$840',
              '24months': '$1,680',
              '36months': '$2,520',
            },
          ]}
        />
      </SpaceBetween>
    </section>
  );
}

function Details() {
  return (
    <section className="page-section" aria-label="Details">
      <Box variant="h2" padding={{ bottom: 'm' }}>
        <span id="details">Details</span>
      </Box>
      <SpaceBetween size="m">
        <div>
          <Header variant="h3">Delivery method</Header>
          <Box variant="p">
            <strong>Software as a Service (SaaS)</strong> is a delivery model for software applications whereby the
            vendor hosts and operates the application over the Internet. Customers pay for using the software without
            owning the underlying infrastructure. With SaaS Contracts, customers will pay for usage through their bill.{' '}
            <Link
              href="#"
              external={true}
              variant="primary"
              ariaLabel="Learn more about Software as a Service (opens in new tab)"
            >
              Learn more
            </Link>
          </Box>
        </div>

        <div>
          <Header variant="h3">Terms and conditions</Header>
          <Box variant="p">
            By subscribing to this product you agree to terms and conditions outlined in the product{' '}
            <Link href="#" variant="primary" external={true}>
              End User License Agreement (EULA)
            </Link>
            .
          </Box>
        </div>
      </SpaceBetween>
    </section>
  );
}

function ProductCard({
  title,
  vendor,
  logo,
  category,
  description,
  isNew = false,
}: {
  title: string;
  vendor: string;
  logo: string;
  category: string;
  description: string;
  isNew?: boolean;
}) {
  return (
    <li className="product-cards-list-item" aria-label={title}>
      <Container>
        <img src={logo} alt={`${title} logo`} width="50" height="50" />
        <SpaceBetween direction="vertical" size="s">
          <SpaceBetween direction="vertical" size="xxs">
            <Box variant="h3">
              <Link fontSize="inherit">{title}</Link>
            </Box>
            <Box variant="small">By {vendor}</Box>
            <Box color="text-body-secondary">{category}</Box>
            {isNew && <Badge color="green">New</Badge>}
          </SpaceBetween>
          <Box variant="p">{description}</Box>
          <Button ariaLabel={`Shop now for ${title}`}>Shop now</Button>
        </SpaceBetween>
      </Container>
    </li>
  );
}

function MoreFromVendor() {
  return (
    <section className="page-section" aria-label="More from this vendor">
      <Box variant="h2" margin={{ bottom: 'm' }}>
        More from this vendor
      </Box>
      <ul className="product-cards-list">
        <ProductCard
          title="Cloud Data Operating System"
          vendor="Cloud Data"
          logo="./resources/image-placeholder.png"
          category="Professional services"
          description="An operating system that is tailored for the cloud. This offering includes a free, full featured 30-day trial."
          isNew={true}
        />
        <ProductCard
          title="Cloud Data Deep Security"
          vendor="Cloud Data"
          logo="./resources/image-placeholder.png"
          category="AMI | v20.0.833"
          description="Security built for all your cloud services. Apply rules and policies to your services and make this as strict as necessary."
        />
      </ul>
    </section>
  );
}

function Support() {
  return (
    <section className="page-section" aria-label="Support">
      <Box variant="h2" padding={{ bottom: 'm' }}>
        <span id="support">Support</span>
      </Box>

      <SpaceBetween size="m">
        <div>
          <Header variant="h3">Cloud Data Solution</Header>
          <Box variant="p">
            Your purchase also includes 24x7 support from Cloud Data. You can log a support ticket for any issues
            directly from your Cloud One console. If you experience any issues or have questions, please contact our
            Cloud Security experts by email at{' '}
            <Link href="#" variant="primary">
              mock@example.com
            </Link>
            .
          </Box>
        </div>
        <div>
          <Header variant="h3">Infrastructure</Header>
          <Box variant="p">
            Cloud Support is a one-on-one, fast-response support channel that is staffed 24x7x365 with experienced and
            technical support engineers. The service helps customers of all sizes and technical abilities to
            successfully utilize the products and features provided by Cloud Data.
          </Box>
          <Link href="#" external={true} variant="primary" ariaLabel="Learn more about Cloud Support">
            Learn more
          </Link>
        </div>
        <div>
          <Header variant="h3">Refund policy</Header>
          <Box variant="p">The service does not currently support refunds, but you can cancel at any time.</Box>
        </div>
      </SpaceBetween>
    </section>
  );
}

function RelatedProducts() {
  return (
    <section className="page-section" aria-label="Related products and services">
      <Box variant="h2" margin={{ bottom: 'm' }}>
        <span id="related-products">Related products and services</span>
      </Box>
      <ul className="product-cards-list">
        <ProductCard
          title="Cloud Data Dashboard"
          vendor="Cloud Data"
          logo="./resources/image-placeholder.png"
          category="Amazon SageMaker | v2.0.2"
          description="Have an overview of all your important KPIs, alarms, and other metrics at a quick glance. This dashboard experience let's you make decisions quickly."
          isNew={true}
        />
        <ProductCard
          title="Cloud Data Endpoint Protection"
          vendor="Cloud Data"
          logo="./resources/image-placeholder.png"
          category="SaaS"
          description="Distributing your data is just as important as keeping it secure. Our data protection offering includes all types of industry standard mechanisms."
        />
      </ul>
    </section>
  );
}

export function App() {
  //const showFlashbar = !disclaimerDismissed && disclaimerItem;
  const headerVariant = isVisualRefresh ? 'high-contrast' : 'divider';
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();

  return (
    <CustomAppLayout
      disableContentPaddings={true}
      navigationHide={true}
      toolsHide={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { href: '/', text: 'Marketplace' },
            { href: '#/product', text: 'Cloud Data Solution' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={onSplitPanelToggle}
      splitPanelSize={splitPanelSize}
      onSplitPanelResize={onSplitPanelResize}
      splitPanelPreferences={splitPanelPreferences}
      splitPanel={
        <SplitPanel header="Design exploration">
          <GlobalSplitPanelContent />
        </SplitPanel>
      }
      content={
        <ContentLayout
          headerVariant={headerVariant}
          header={<HeroHeader />}
          defaultPadding={true}
          maxContentWidth={1040}
          disableOverlap={true}
        >
          <div className="product-page-content-grid">
            <div className="on-this-page--mobile">
              <OnThisPageNavigation variant="mobile" />
            </div>

            <aside aria-label="Side bar" className="product-page-aside">
              <div className="product-page-aside-sticky">
                <SpaceBetween size="xl">
                  <div className="on-this-page--side">
                    <OnThisPageNavigation variant="side" />
                  </div>
                  <hr />
                  <UserFeedback />
                </SpaceBetween>
              </div>
            </aside>

            <main className="product-page-content">
              <ProductOverview />
              <Pricing />
              <Details />
              <MoreFromVendor />
              <Support />
              <RelatedProducts />
            </main>

            <aside className="product-page-mobile" aria-label="Side bar">
              <UserFeedback />
            </aside>
          </div>
        </ContentLayout>
      }
    />
  );
}
