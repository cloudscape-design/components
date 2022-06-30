// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { S3ResourceSelectorProps } from '~components/s3-resource-selector';

/*

Generated using https://next.json-generator.com/

Folders:

[
  {
    'repeat(5)': {
      Key:
      'simulation-{{random("macro", "micro", "nano", "earth")}}-{{date(new Date(Date.now() - 1000 * 60 * 60 *  24 * 364 * 6), new Date()).getFullYear()}}',
      IsFolder: true,
    }
  }
]


Files:

[
  {
    'repeat(100)': {
      Key:
      '{{random("universe", "galaxy", "planet", "black-hole", "collision", "particle", "quarks", "proton", "electron", "neutrino", "wave-function")}}-{{integer(1, 19)}}{{random("ns", "ms", "s", "h")}}.sim',
      LastModified: '{{date(new Date(Date.now() - 1000 * 60 * 60 * 24 * 364), new Date()).toISOString()}}',
      Size: '{{integer(1024 * 1024 * 1024 * 512, 1024 * 1024 * 1024 * 1024 * 100)}}',
      IsFolder: false
    }
  }
]

*/

export const objects: ReadonlyArray<S3ResourceSelectorProps.Object> = [
  {
    Key: 'simulation-nano-2015',
    IsFolder: true,
  },
  {
    Key: 'simulation-earth-2017',
    IsFolder: true,
  },
  {
    Key: 'simulation-nano-2017',
    IsFolder: true,
  },
  {
    Key: 'simulation-macro-2020',
    IsFolder: true,
  },
  {
    Key: 'simulation-nano-2019',
    IsFolder: true,
  },
  {
    Key: 'wave-function-4ns.sim',
    LastModified: '2020-04-18T10:12:59.993Z',
    Size: 49002000196014,
    IsFolder: false,
  },
  {
    Key: 'quarks-3ms.sim',
    LastModified: '2020-12-23T18:33:11.142Z',
    Size: 22448767128860,
    IsFolder: false,
  },
  {
    Key: 'planet-1ns.sim',
    LastModified: '2020-10-15T02:29:25.254Z',
    Size: 41392828372098,
    IsFolder: false,
  },
  {
    Key: 'particle-6h.sim',
    LastModified: '2021-01-15T11:33:52.825Z',
    Size: 63391072460207,
    IsFolder: false,
  },
  {
    Key: 'proton-7ns.sim',
    LastModified: '2020-11-10T05:54:20.780Z',
    Size: 72744590043738,
    IsFolder: false,
  },
  {
    Key: 'black-hole-5ns.sim',
    LastModified: '2020-03-03T05:35:24.962Z',
    Size: 43250008297442,
    IsFolder: false,
  },
  {
    Key: 'galaxy-9ms.sim',
    LastModified: '2020-04-11T03:57:44.737Z',
    Size: 40447421517332,
    IsFolder: false,
  },
  {
    Key: 'collision-9h.sim',
    LastModified: '2020-05-12T10:04:23.410Z',
    Size: 104631905398517,
    IsFolder: false,
  },
  {
    Key: 'electron-9s.sim',
    LastModified: '2021-01-12T08:49:55.518Z',
    Size: 81407947364646,
    IsFolder: false,
  },
  {
    Key: 'black-hole-9ns.sim',
    LastModified: '2020-12-15T14:45:42.602Z',
    Size: 14665468111759,
    IsFolder: false,
  },
  {
    Key: 'electron-2h.sim',
    LastModified: '2020-03-20T09:24:28.980Z',
    Size: 55490786243059,
    IsFolder: false,
  },
  {
    Key: 'universe-6h.sim',
    LastModified: '2021-01-06T02:39:55.441Z',
    Size: 20971477306415,
    IsFolder: false,
  },
  {
    Key: 'neutrino-2ns.sim',
    LastModified: '2020-08-06T23:00:44.342Z',
    Size: 35670680460479,
    IsFolder: false,
  },
  {
    Key: 'particle-2ms.sim',
    LastModified: '2020-06-13T01:55:14.911Z',
    Size: 20836322336606,
    IsFolder: false,
  },
  {
    Key: 'quarks-4ms.sim',
    LastModified: '2020-11-13T00:15:27.313Z',
    Size: 103962865712148,
    IsFolder: false,
  },
  {
    Key: 'electron-3s.sim',
    LastModified: '2020-02-28T17:49:18.282Z',
    Size: 40345626157059,
    IsFolder: false,
  },
  {
    Key: 'electron-6s.sim',
    LastModified: '2020-12-04T10:40:06.600Z',
    Size: 45079012622112,
    IsFolder: false,
  },
  {
    Key: 'particle-4m.sim',
    LastModified: '2020-04-23T02:28:34.948Z',
    Size: 96174234731646,
    IsFolder: false,
  },
  {
    Key: 'collision-8ns.sim',
    LastModified: '2021-01-07T19:52:59.154Z',
    Size: 96443158365963,
    IsFolder: false,
  },
  {
    Key: 'neutrino-1ns.sim',
    LastModified: '2020-06-24T04:41:47.501Z',
    Size: 2661945389487,
    IsFolder: false,
  },
  {
    Key: 'proton-8ms.sim',
    LastModified: '2021-02-16T00:06:01.933Z',
    Size: 60024400020890,
    IsFolder: false,
  },
  {
    Key: 'particle-4ns.sim',
    LastModified: '2020-07-06T20:51:27.709Z',
    Size: 43702364864774,
    IsFolder: false,
  },
  {
    Key: 'quarks-1h.sim',
    LastModified: '2020-07-08T09:22:27.123Z',
    Size: 95016845399004,
    IsFolder: false,
  },
  {
    Key: 'electron-9s.sim',
    LastModified: '2021-01-06T23:07:30.743Z',
    Size: 109391686383189,
    IsFolder: false,
  },
  {
    Key: 'wave-function-1h.sim',
    LastModified: '2020-08-27T08:28:52.553Z',
    Size: 17494103809699,
    IsFolder: false,
  },
  {
    Key: 'galaxy-3h.sim',
    LastModified: '2020-09-04T00:50:16.088Z',
    Size: 108355381419775,
    IsFolder: false,
  },
  {
    Key: 'particle-5s.sim',
    LastModified: '2020-07-16T12:38:55.027Z',
    Size: 102742554404208,
    IsFolder: false,
  },
  {
    Key: 'electron-2ms.sim',
    LastModified: '2020-06-06T08:36:18.655Z',
    Size: 4333597325371,
    IsFolder: false,
  },
  {
    Key: 'planet-9ms.sim',
    LastModified: '2020-07-17T13:48:33.308Z',
    Size: 6449476751250,
    IsFolder: false,
  },
  {
    Key: 'quarks-6s.sim',
    LastModified: '2020-08-24T00:00:48.532Z',
    Size: 56583650600283,
    IsFolder: false,
  },
  {
    Key: 'black-hole-9s.sim',
    LastModified: '2020-08-19T07:22:09.912Z',
    Size: 1514746235188,
    IsFolder: false,
  },
  {
    Key: 'black-hole-2s.sim',
    LastModified: '2020-08-18T18:56:14.506Z',
    Size: 82916486458875,
    IsFolder: false,
  },
  {
    Key: 'quarks-7ms.sim',
    LastModified: '2020-11-05T03:03:52.049Z',
    Size: 17355021360892,
    IsFolder: false,
  },
  {
    Key: 'collision-5s.sim',
    LastModified: '2020-12-24T18:41:51.156Z',
    Size: 69891537012421,
    IsFolder: false,
  },
  {
    Key: 'universe-4h.sim',
    LastModified: '2021-02-10T12:35:09.105Z',
    Size: 43394474091234,
    IsFolder: false,
  },
  {
    Key: 'wave-function-8ms.sim',
    LastModified: '2020-12-16T12:09:51.928Z',
    Size: 100297211969328,
    IsFolder: false,
  },
  {
    Key: 'electron-4h.sim',
    LastModified: '2020-04-26T09:20:52.949Z',
    Size: 95033161687111,
    IsFolder: false,
  },
  {
    Key: 'planet-5s.sim',
    LastModified: '2020-05-12T14:24:16.132Z',
    Size: 34050684289015,
    IsFolder: false,
  },
  {
    Key: 'particle-3ns.sim',
    LastModified: '2020-06-01T03:54:24.259Z',
    Size: 90350386947586,
    IsFolder: false,
  },
  {
    Key: 'collision-5ms.sim',
    LastModified: '2021-01-23T04:38:45.932Z',
    Size: 74149524431815,
    IsFolder: false,
  },
  {
    Key: 'universe-8s.sim',
    LastModified: '2021-02-14T22:33:52.034Z',
    Size: 60391390225223,
    IsFolder: false,
  },
  {
    Key: 'electron-9ms.sim',
    LastModified: '2020-04-05T17:17:32.082Z',
    Size: 55379314083443,
    IsFolder: false,
  },
  {
    Key: 'black-hole-5h.sim',
    LastModified: '2020-06-30T19:10:49.867Z',
    Size: 36824489161259,
    IsFolder: false,
  },
  {
    Key: 'black-hole-9ns.sim',
    LastModified: '2020-04-05T09:47:35.271Z',
    Size: 63444373633457,
    IsFolder: false,
  },
  {
    Key: 'particle-4h.sim',
    LastModified: '2021-01-08T14:30:16.008Z',
    Size: 99543718112308,
    IsFolder: false,
  },
  {
    Key: 'neutrino-2ms.sim',
    LastModified: '2020-12-12T06:04:24.556Z',
    Size: 77660228976982,
    IsFolder: false,
  },
  {
    Key: 'quarks-9s.sim',
    LastModified: '2020-05-31T18:56:32.417Z',
    Size: 103127974639053,
    IsFolder: false,
  },
  {
    Key: 'galaxy-8ms.sim',
    LastModified: '2020-10-27T15:55:31.748Z',
    Size: 29091764334106,
    IsFolder: false,
  },
  {
    Key: 'collision-2ms.sim',
    LastModified: '2020-04-11T07:12:22.524Z',
    Size: 43047043193849,
    IsFolder: false,
  },
  {
    Key: 'universe-9ns.sim',
    LastModified: '2020-08-09T07:52:42.038Z',
    Size: 108405236068124,
    IsFolder: false,
  },
  {
    Key: 'quarks-2ns.sim',
    LastModified: '2020-05-12T13:07:51.598Z',
    Size: 7918975674490,
    IsFolder: false,
  },
  {
    Key: 'planet-4ns.sim',
    LastModified: '2021-01-03T20:28:03.429Z',
    Size: 55754288951660,
    IsFolder: false,
  },
  {
    Key: 'neutrino-2s.sim',
    LastModified: '2020-07-10T17:09:49.227Z',
    Size: 42961427131282,
    IsFolder: false,
  },
  {
    Key: 'planet-5ns.sim',
    LastModified: '2020-06-15T00:35:40.730Z',
    Size: 64985104843410,
    IsFolder: false,
  },
  {
    Key: 'particle-4ns.sim',
    LastModified: '2020-05-08T13:29:35.606Z',
    Size: 71254631545396,
    IsFolder: false,
  },
  {
    Key: 'collision-8h.sim',
    LastModified: '2020-12-17T02:56:37.140Z',
    Size: 96220755054969,
    IsFolder: false,
  },
  {
    Key: 'neutrino-7h.sim',
    LastModified: '2020-09-07T12:03:05.325Z',
    Size: 87238390571255,
    IsFolder: false,
  },
  {
    Key: 'black-hole-6s.sim',
    LastModified: '2020-11-15T15:45:16.932Z',
    Size: 6175631939622,
    IsFolder: false,
  },
  {
    Key: 'neutrino-1ns.sim',
    LastModified: '2021-02-02T11:35:26.723Z',
    Size: 106744529325100,
    IsFolder: false,
  },
  {
    Key: 'collision-4ms.sim',
    LastModified: '2021-02-01T02:05:22.451Z',
    Size: 89576661999078,
    IsFolder: false,
  },
  {
    Key: 'particle-6h.sim',
    LastModified: '2021-01-28T16:43:50.904Z',
    Size: 99054382344982,
    IsFolder: false,
  },
  {
    Key: 'neutrino-5h.sim',
    LastModified: '2020-08-16T12:12:02.366Z',
    Size: 79850609307047,
    IsFolder: false,
  },
  {
    Key: 'universe-1h.sim',
    LastModified: '2020-02-27T18:54:49.233Z',
    Size: 102028027827488,
    IsFolder: false,
  },
  {
    Key: 'black-hole-9h.sim',
    LastModified: '2020-04-05T04:30:10.734Z',
    Size: 18270366454160,
    IsFolder: false,
  },
  {
    Key: 'quarks-4h.sim',
    LastModified: '2020-06-28T11:19:05.048Z',
    Size: 32477873978742,
    IsFolder: false,
  },
  {
    Key: 'particle-7s.sim',
    LastModified: '2020-09-03T00:29:01.953Z',
    Size: 39038124465591,
    IsFolder: false,
  },
  {
    Key: 'proton-9ns.sim',
    LastModified: '2020-11-17T20:00:07.178Z',
    Size: 31597983633521,
    IsFolder: false,
  },
  {
    Key: 'proton-1s.sim',
    LastModified: '2021-02-07T18:30:21.745Z',
    Size: 37801481909418,
    IsFolder: false,
  },
  {
    Key: 'proton-7s.sim',
    LastModified: '2020-10-29T17:36:00.911Z',
    Size: 98055883875190,
    IsFolder: false,
  },
  {
    Key: 'galaxy-7ns.sim',
    LastModified: '2020-10-05T22:32:17.053Z',
    Size: 47137045431373,
    IsFolder: false,
  },
  {
    Key: 'wave-function-7s.sim',
    LastModified: '2020-08-14T16:15:00.124Z',
    Size: 97020535356543,
    IsFolder: false,
  },
  {
    Key: 'particle-7ns.sim',
    LastModified: '2020-09-13T22:16:28.802Z',
    Size: 5890622866094,
    IsFolder: false,
  },
  {
    Key: 'particle-1s.sim',
    LastModified: '2020-12-14T19:20:07.346Z',
    Size: 25893701949214,
    IsFolder: false,
  },
  {
    Key: 'planet-8h.sim',
    LastModified: '2020-11-21T03:27:12.838Z',
    Size: 37553931887217,
    IsFolder: false,
  },
  {
    Key: 'planet-6h.sim',
    LastModified: '2020-04-04T12:12:12.655Z',
    Size: 28228288279821,
    IsFolder: false,
  },
  {
    Key: 'galaxy-2s.sim',
    LastModified: '2021-02-02T03:28:17.890Z',
    Size: 73873951153276,
    IsFolder: false,
  },
  {
    Key: 'collision-2s.sim',
    LastModified: '2020-06-08T13:04:46.271Z',
    Size: 60584279026997,
    IsFolder: false,
  },
  {
    Key: 'particle-8ms.sim',
    LastModified: '2020-07-30T09:12:43.811Z',
    Size: 105740138656151,
    IsFolder: false,
  },
  {
    Key: 'wave-function-1ns.sim',
    LastModified: '2020-12-14T02:43:49.231Z',
    Size: 39332321364244,
    IsFolder: false,
  },
  {
    Key: 'wave-function-9h.sim',
    LastModified: '2020-07-20T23:38:15.970Z',
    Size: 68876781823783,
    IsFolder: false,
  },
  {
    Key: 'collision-6ns.sim',
    LastModified: '2020-12-03T20:08:06.515Z',
    Size: 73477976369892,
    IsFolder: false,
  },
  {
    Key: 'universe-4ms.sim',
    LastModified: '2020-07-02T19:48:34.757Z',
    Size: 86501896787447,
    IsFolder: false,
  },
  {
    Key: 'electron-2ms.sim',
    LastModified: '2020-07-12T05:11:00.911Z',
    Size: 68085587683574,
    IsFolder: false,
  },
  {
    Key: 'galaxy-4s.sim',
    LastModified: '2020-03-17T21:34:24.264Z',
    Size: 18602284942937,
    IsFolder: false,
  },
  {
    Key: 'universe-8h.sim',
    LastModified: '2020-11-19T13:26:53.594Z',
    Size: 90728632349528,
    IsFolder: false,
  },
  {
    Key: 'particle-4ms.sim',
    LastModified: '2020-09-17T04:58:16.203Z',
    Size: 6820994582204,
    IsFolder: false,
  },
  {
    Key: 'black-hole-4ms.sim',
    LastModified: '2020-03-25T03:51:07.518Z',
    Size: 1038332218411,
    IsFolder: false,
  },
  {
    Key: 'wave-function-2ms.sim',
    LastModified: '2020-04-14T14:58:42.829Z',
    Size: 93612358530152,
    IsFolder: false,
  },
  {
    Key: 'black-hole-6h.sim',
    LastModified: '2020-08-11T06:30:25.590Z',
    Size: 50118380866370,
    IsFolder: false,
  },
  {
    Key: 'neutrino-6s.sim',
    LastModified: '2020-10-25T16:55:52.875Z',
    Size: 92363550462946,
    IsFolder: false,
  },
  {
    Key: 'collision-5h.sim',
    LastModified: '2020-06-01T21:58:32.534Z',
    Size: 99546438384600,
    IsFolder: false,
  },
  {
    Key: 'black-hole-9ms.sim',
    LastModified: '2021-01-04T01:51:35.843Z',
    Size: 50463367395420,
    IsFolder: false,
  },
  {
    Key: 'planet-9h.sim',
    LastModified: '2020-11-28T14:24:10.608Z',
    Size: 33227604721515,
    IsFolder: false,
  },
  {
    Key: 'universe-8h.sim',
    LastModified: '2020-11-05T23:25:41.024Z',
    Size: 41052841547546,
    IsFolder: false,
  },
  {
    Key: 'galaxy-5ns.sim',
    LastModified: '2020-08-12T20:56:51.897Z',
    Size: 71531285498895,
    IsFolder: false,
  },
  {
    Key: 'neutrino-8ms.sim',
    LastModified: '2020-06-11T18:07:26.826Z',
    Size: 9868898716663,
    IsFolder: false,
  },
  {
    Key: 'neutrino-4h.sim',
    LastModified: '2020-06-26T20:03:21.629Z',
    Size: 48613296738263,
    IsFolder: false,
  },
  {
    Key: 'galaxy-4s.sim',
    LastModified: '2020-03-14T19:06:58.839Z',
    Size: 83472299173089,
    IsFolder: false,
  },
  {
    Key: 'universe-5h.sim',
    LastModified: '2020-09-24T02:22:12.124Z',
    Size: 59091539661453,
    IsFolder: false,
  },
  {
    Key: 'neutrino-6ns.sim',
    LastModified: '2020-07-13T15:55:00.341Z',
    Size: 2017943872311,
    IsFolder: false,
  },
];
