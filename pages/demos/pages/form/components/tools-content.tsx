// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLink, ExternalLinkGroup } from '../../commons';

/* eslint-disable react/jsx-key */
export default [
  <HelpPanel
    header={<h2>Create distribution</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html',
            text: 'Getting started',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html',
            text: 'How CloudFront delivers content to your users',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html',
            text: 'Working with distributions',
          },
        ]}
      />
    }
  >
    <p>
      When you create an Amazon CloudFront distribution, you tell CloudFront where to find your content by specifying
      your <i>origin servers</i>. An origin stores the original version of your objects (your files). For example, you
      can specify an Amazon S3 bucket, an AWS Elemental MediaStore container, or an AWS Elemental MediaPackage channel.
      You can also specify a <i>custom origin</i>, such as an Amazon EC2 instance or your own HTTP web server.
    </p>
    <p>
      When CloudFront receives requests for your content, it gets the content from the origin and distributes it through
      a worldwide network of data centers called <i>edge locations</i>. CloudFront uses the edge locations that are
      closest to your viewers, so that your content is delivered with the lowest latency and best possible performance.
    </p>
    <p>After you create the distribution, you can add more origins to it.</p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Delivery method</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html',
            text: 'Using Amazon S3 origins, MediaPackage channels, and custom origins for web distributions',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-rtmp.html',
            text: 'Working with RTMP distributions',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesMethod',
            text: 'Values that you specify when you create or update a distribution',
          },
        ]}
      />
    }
  >
    <p>
      To create a distribution, you start by choosing the delivery method. Unless you use Adobe Media Server with RTMP,
      your choice is always <b>Web</b>.{' '}
    </p>
    <p>
      <b>Note</b>
      <br />
      You can't change the delivery method for a distribution after you create it.{' '}
    </p>
    <h3>Web</h3>
    <p>Create a web distribution if you want to do the following:</p>
    <ul>
      <li>Speed up distribution of static and dynamic content, for example, .html, .css, .php, and graphics files.</li>
      <li>Distribute media files using HTTP or HTTPS.</li>
      <li>Add, update, or delete objects, and submit data from web forms.</li>
      <li>Use live streaming to stream an event in real time.</li>
    </ul>
    <h3>RTMP</h3>
    <p>
      Create an RTMP distribution to speed up distribution of your streaming media files using the RTMP protocol of
      Adobe Media Server. An RTMP distribution allows an end user to begin playing a media file before the file has
      finished downloading from a CloudFront edge location.
    </p>
    <p>
      To create an RTMP distribution, you must store the media files in an Amazon S3 bucket. To use CloudFront to serve
      both a media player and the media files, you need two types of distributions: a web distribution for the media
      player, and an RTMP distribution for the media files.
    </p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Root object</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html#DefaultRootObjectHowToDefine',
            text: 'Specifying a default root object',
          },
        ]}
      />
    }
  >
    <p>
      You can configure CloudFront to return a specific object (the default root object) when a user requests the root
      URL for your web distribution instead of requesting an object in your distribution. Specifying a default root
      object lets you avoid exposing the contents of your distribution or returning an error.{' '}
    </p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Alternative domain names (CNAMEs)</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html',
            text: 'Requirements for using alternate domain names (CNAMEs)',
          },
        ]}
      />
    }
  >
    <p>
      If you want to use your own domain names in the URLs for your files instead of the CloudFront domain name, enter
      the domain names in the box. These custom domain names are known as <i>alternative domain names (CNAMEs)</i>. Both
      web and RTMP distributions support CNAMEs.
    </p>
    <p>
      For example, if you add <code>www.example.com</code> as your domain name, you would use the following URL to view{' '}
      <code>/images/image.jpg</code>:
    </p>
    <pre>https://www.example.com/images/image.jpg</pre>
    <h3>Before you begin</h3>
    <p>Before you add a CNAME, make sure that you do the following:</p>
    <ul>
      <li>Register the domain name with Amazon Route 53 or another domain provider.</li>
      <li>
        Add a certificate from an authorized certificate authority (CA) to CloudFront that covers the domain name that
        you plan to use with the distribution, to validate that you are authorized to use the domain.
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Content origin</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOrigin',
            text: 'Origin settings',
          },
        ]}
      />
    }
  >
    <p>
      CloudFront gets your objects (your files) from an origin that you specify, such as an S3 bucket or a web server.
      The files must be publicly readable.
    </p>
    <p>
      The <b>Content origin</b> dropdown list shows the AWS resources associated with the current AWS account. You can
      choose from this list, or you can enter the domain name of a different origin. For example, you can specify the
      following content origins:
    </p>
    <ul>
      <li>
        <b>Amazon S3 bucket</b> – <code>myawsbucket.s3.amazonaws.com</code>
      </li>
      <li>
        <b>Amazon S3 bucket configured as a website</b> –{' '}
        <code>https://bucket-name.s3-website-us-west-2.amazonaws.com</code>
      </li>
      <li>
        <b>MediaStore container</b> – <code>mymediastore.data.mediastore.us-west-1.amazonaws.com</code>
      </li>
      <li>
        <b>MediaPackage endpoint</b> – <code>mymediapackage.mediapackage.us-west-1.amazon.com</code>
      </li>
      <li>
        <b>Amazon EC2 instance</b> – <code>ec2-203-0-113-25.compute-1.amazonaws.com</code>
      </li>
      <li>
        <b>Elastic Load Balancing load balancer</b> –{' '}
        <code>my-load-balancer-1234567890.us-west-2.elb.amazonaws.com</code>
      </li>
      <li>
        <b>Your own web server</b> – <code>https://example.com</code>
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Path to content</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginPath',
            text: 'Origin path',
          },
        ]}
      />
    }
  >
    <p>
      If you want CloudFront to request your content from a directory in your origin, enter the directory path,
      beginning with a slash (/). CloudFront appends the directory path to the origin, for example,{' '}
      <code>cf-origin.example.com/production/images</code>. Don't add a slash (/) at the end of the path.
    </p>
    <p>For example, suppose you've specified the following values for your distribution:</p>
    <ul>
      <li>
        <b>Origin Domain Name</b> – An S3 bucket named <code>myawsbucket</code>
      </li>
      <li>
        <b>Origin Path</b> – <code>/production</code>
      </li>
      <li>
        <b>Alternate Domain Names (CNAMEs)</b> – <code>example.com</code>
      </li>
    </ul>
    <p>
      When an end user enters <code>example.com/index.html</code> in a browser, CloudFront sends a request to Amazon S3
      for <code>myawsbucket/production/index.html</code>.
    </p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Origin ID</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html#concept_origin_groups',
            text: 'Using CloudFront origin groups',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html#concept_origin_groups.creating',
            text: 'Creating an origin group',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCacheBehavior',
            text: 'Cache behavior settings',
          },
        ]}
      />
    }
  >
    <p>
      The <i>origin ID</i> is a string that uniquely distinguishes the origin or origin group in this distribution. If
      you create cache behaviors in addition to the default cache behavior, you use the ID that you specify here to
      identify the origin or origin group that you want CloudFront to route a request to when the request matches the
      path pattern for that cache behavior.
    </p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Custom headers</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/forward-custom-headers.html',
            text: 'Forwarding custom headers to your origin',
          },
        ]}
      />
    }
  >
    <p>
      If you want CloudFront to include a custom header whenever it forwards a request to your origin, specify a header
      name and value. All custom header names and values that you specify will be included in every request to this
      origin. If a header was already supplied in the client request, it is overridden.{' '}
    </p>
    <p>Custom headers have a variety of uses, including the following:</p>
    <ul>
      <li>
        You can identify the requests that are forwarded to your custom origin by CloudFront. This is useful if you want
        to know whether users are bypassing CloudFront or if you're using more than one CDN and you want information
        about which requests are coming from each CDN. (If you're using an Amazon S3 origin and you turn on{' '}
        <ExternalLink href="https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html">
          Amazon S3 server access logging
        </ExternalLink>
        , the logs don't include header information.)
      </li>
      <li>
        If you've configured more than one CloudFront distribution to use the same origin, you can specify different
        custom headers for the origins in each distribution and use the logs for your web server to distinguish between
        the requests that CloudFront forwards for each distribution.
      </li>
      <li>
        If some of your users use viewers that don't support cross-origin resource sharing (CORS), you can configure
        CloudFront to forward the <code>Origin</code> header to your origin. That will cause your origin to return the{' '}
        <code>Access-Control-Allow-Origin</code> header for every request.
      </li>
      <li>
        You can use custom headers together and, optionally, signed URLs or signed cookies, to control access to content
        on a custom origin. If you configure your custom origin to respond to requests only if they include a custom
        header, you can prevent users from bypassing CloudFront and submitting requests directly to your origin.
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Cache behavior settings</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCacheBehavior',
            text: 'Cache behavior settings',
          },
        ]}
      />
    }
  >
    <p>
      A <i>cache behavior </i> lets you configure a variety of CloudFront functionality for a given URL path pattern for
      files on your website. For example, one cache behavior might apply to all .jpg files in the <code>images</code>{' '}
      directory on a web server that you're using as an origin server for CloudFront. The functionality that you can
      configure for each cache behavior includes the following:
    </p>
    <ul>
      <li>
        The protocol policy that you want viewers to use to access your content in CloudFront edge locations:
        <ul>
          <li>
            <b>HTTP and HTTPS </b> – Viewers can use both protocols.
          </li>
          <li>
            <b>Redirect HTTP to HTTPS</b> – Viewers can use both protocols, but HTTP requests are automatically
            redirected to HTTPS requests.
          </li>
          <li>
            <b>Alternate Domain Names (CNAMEs) </b> – Viewers can access your content only if they're using HTTPS.
          </li>
        </ul>
      </li>
      <li>The path pattern.</li>
      <li>
        If you have configured multiple origins for your CloudFront distribution, which origin that you want CloudFront
        to forward your requests to.
      </li>
      <li>Whether to forward query strings to your origin.</li>
      <li>Whether accessing the specified files requires signed URLs.</li>
      <li>Whether to require users to use HTTPS to access those files.</li>
      <li>
        The minimum amount of time (TTL) that those files stay in the CloudFront cache regardless of the value of any{' '}
        <code>Cache-Control</code> headers that your origin adds to the files.
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Tags</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/tagging.html',
            text: 'Tagging Amazon CloudFront Distributions',
          },
        ]}
      />
    }
  >
    <p>
      Tags are words or phrases that you can use to identify and organize your AWS resources. You can add multiple tags
      to each resource, and each tag includes a key and a value that you define. For example, the key might be "domain"
      and the value might be "example.com". You can search and filter your resources based on the tags you add.
    </p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Tag restrictions</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/tagging.html',
            text: 'Tagging Amazon CloudFront Distributions',
          },
        ]}
      />
    }
  >
    <p>The following basic restrictions apply to tags:</p>
    <ul>
      <li>Maximum number of tags per resource – 50</li>
      <li>Maximum key length – 128 Unicode characters</li>
      <li>Maximum value length – 256 Unicode characters</li>
      <li>Valid values for key and value – a-z, A-Z, 0-9, space, and the following characters: _ . : / = + - and @</li>
      <li>Tag keys and values are case sensitive</li>
      <li>
        Don't use <code>aws:</code> as a prefix for keys; it's reserved for AWS use
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Cloudfront functions</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html',
            text: 'Customizing at the edge with CloudFront Functions',
          },
        ]}
      />
    }
  >
    <p>
      With CloudFront Functions in Amazon CloudFront, you can write lightweight functions in JavaScript for high-scale,
      latency-sensitive CDN customizations. Your functions can manipulate the requests and responses that flow through
      CloudFront, perform basic authentication and authorization, generate HTTP responses at the edge, and more. The
      CloudFront Functions runtime environment offers submillisecond startup times, scales immediately to handle
      millions of requests per second, and is highly secure. CloudFront Functions is a native feature of CloudFront,
      which means you can build, test, and deploy your code entirely within CloudFront.
    </p>
  </HelpPanel>,
  <HelpPanel header={<h2>Availability zones</h2>}>
    <p>
      A distinct location within a region that's designed to be isolated from failures in other Availability Zones.
      Availability Zones within a region are connected through low-latency links. An Availability Zone can be
      automatically assigned based on the origin location specified for the distribution.
    </p>
  </HelpPanel>,
];
/* eslint-enable react/jsx-key */
