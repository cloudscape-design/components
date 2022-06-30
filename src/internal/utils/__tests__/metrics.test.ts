// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Metrics } from '../../metrics';
jest.mock(
  '../../environment',
  () => ({
    THEME: 'default',
    PACKAGE_VERSION: '3.0 (HEAD)',
  }),
  { virtual: true }
);

declare global {
  interface Window {
    AWSC?: any;
  }
}

describe('Client Metrics support', () => {
  const defineClog = () => {
    window.AWSC = {
      Clog: {
        log: () => {},
      },
    };
    jest.spyOn(window.AWSC.Clog, 'log');
  };

  const checkMetric = (metricName: string, detail: string[]) => {
    const detailObject = {
      o: detail[0],
      s: detail[1],
      t: detail[2],
      a: detail[3],
      f: detail[4],
      v: detail[5],
    };
    expect(window.AWSC.Clog.log).toHaveBeenCalledWith(metricName, 1, JSON.stringify(detailObject));
    expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);
  };

  beforeEach(() => {
    delete window.AWSC;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMetric', () => {
    test('does nothing when window.AWSC is undefined', () => {
      Metrics.sendMetric('name', 0); // only proves no exception thrown
    });

    test('does nothing when window.AWSC.Clog is undefined', () => {
      window.AWSC = undefined;
      Metrics.sendMetric('name', 0); // only proves no exception thrown
    });

    test('does nothing when window.AWSC.Clog.log is undefined', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.AWSC = {
        Clog: undefined,
      };
      Metrics.sendMetric('name', 0); // only proves no exception thrown
    });

    describe('within an iframe', () => {
      let consoleSpy: jest.SpyInstance;

      const setupIframe = () => {
        const parentWindow = { ...window };
        Object.defineProperty(window, 'parent', { value: parentWindow });
        Object.defineProperty(parentWindow, 'parent', { value: parentWindow });
      };

      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error');
      });

      afterEach(() => {
        expect(consoleSpy).not.toHaveBeenCalled();
      });

      test('does nothing when AWSC is not defined in the parent iframe', () => {
        setupIframe();
        expect(window.parent.AWSC).toBeUndefined();

        Metrics.sendMetric('name', 0); // only proves no exception thrown
      });

      test('works if parent has AWSC', () => {
        setupIframe();
        Object.defineProperty(window.parent, 'AWSC', {
          value: {
            Clog: {
              log: () => {},
            },
          },
        });
        jest.spyOn(window.parent.AWSC.Clog, 'log');

        Metrics.sendMetric('name', 0, undefined);
        expect(window.parent.AWSC.Clog.log).toHaveBeenCalledWith('name', 0, undefined);
      });
    });

    describe('when window.AWSC.Clog.log is defined', () => {
      let consoleSpy: jest.SpyInstance;
      beforeEach(() => {
        defineClog();
        consoleSpy = jest.spyOn(console, 'error');
      });

      afterEach(() => {
        expect(consoleSpy).not.toHaveBeenCalled();
      });

      test('delegates to window.AWSC.Clog.log when defined', () => {
        Metrics.sendMetric('name', 0, undefined);
        expect(window.AWSC.Clog.log).toHaveBeenCalledWith('name', 0, undefined);
      });

      describe('Metric name validation', () => {
        const tryValidMetric = (metricName: string) => {
          it(`calls AWSC.Clog.log when valid metric name used (${metricName})`, () => {
            Metrics.sendMetric(metricName, 1, 'detail');
            expect(window.AWSC.Clog.log).toHaveBeenCalledWith(metricName, 1, 'detail');
          });
        };

        const tryInvalidMetric = (metricName: string) => {
          it(`logs an error when invalid metric name used (${metricName})`, () => {
            Metrics.sendMetric(metricName, 0, 'detail');
            expect(consoleSpy).toHaveBeenCalledWith(`Invalid metric name: ${metricName}`);
            consoleSpy.mockReset();
          });
        };

        tryValidMetric('1'); // min length 1 char
        tryValidMetric('123456789'); // digits are ok
        tryValidMetric('lowerUPPER'); // lower and uppercase chars ok
        tryValidMetric('dash-dash-dash'); // dashes ok
        tryValidMetric('underscore_underscore'); // 32 chars: max length
        tryValidMetric('123456789_123456789_123456789_12'); // 32 chars: max length

        tryInvalidMetric(''); // too short, empty string not allowed
        tryInvalidMetric('123456789_123456789_123456789_123'); // 33 chars: too long
        tryInvalidMetric('colons:not:allowed'); // invalid characters
        tryInvalidMetric('spaces not allowed'); // invalid characters
      });

      describe('Metric detail validation', () => {
        test('accepts details up to 200 characters', () => {
          const validDetail = new Array(201).join('a');
          Metrics.sendMetric('metricName', 1, validDetail);
          expect(window.AWSC.Clog.log).toHaveBeenCalledWith('metricName', 1, validDetail);
        });

        test('throws an error when detail is too long', () => {
          const invalidDetail = new Array(202).join('a');
          Metrics.sendMetric('metricName', 0, new Array(202).join('a'));
          expect(consoleSpy).toHaveBeenCalledWith(`Detail for metric metricName is too long: ${invalidDetail}`);
          consoleSpy.mockReset();
        });
      });
    });
  });

  describe('sendMetricOnce', () => {
    test('logs a metric name only once', () => {
      defineClog();

      Metrics.sendMetricOnce('my-event', 1);
      expect(window.AWSC.Clog.log).toHaveBeenCalledWith('my-event', 1, undefined);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);

      Metrics.sendMetricOnce('my-event', 2);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);

      Metrics.sendMetricOnce('My-Event', 3);
      expect(window.AWSC.Clog.log).toHaveBeenCalledWith('My-Event', 3, undefined);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendMetricObject', () => {
    beforeEach(defineClog);

    describe('correctly maps input object to metric name', () => {
      test('applies default values for theme (default) and framework (react)', () => {
        Metrics.sendMetricObject(
          {
            source: 'pkg',
            action: 'used',
            version: '5.0',
          },
          1
        );
        checkMetric('awsui_pkg_d50', ['main', 'pkg', 'default', 'used', 'react', '5.0']);
      });

      const versionTestCases = [
        ['', ['', '']],
        ['5', ['', '5']],
        ['5.100000000', ['5100000000', '5.100000000']],
        ['5.7.0', ['57', '5.7.0']],
        ['5.7 dkjhkhsgdjh', ['57', '5.7dkjhkhsgdjh']],
        ['5.7.0 kjfhgjhdshjsjd', ['57', '5.7.0kjfhgjhdshjsjd']],
      ];

      versionTestCases.forEach(testCase => {
        it(`correctly interprets version ${testCase[0]}`, () => {
          Metrics.sendMetricObject(
            {
              source: 'pkg',
              action: 'used',
              version: testCase[0] as string,
            },
            1
          );
          checkMetric(`awsui_pkg_d${testCase[1][0]}`, ['main', 'pkg', 'default', 'used', 'react', testCase[1][1]]);
        });
      });
    });
  });

  describe('sendMetricObjectOnce', () => {
    beforeEach(defineClog);

    test('logs a metric only once if same source and action', () => {
      const metricObj = {
        source: 'pkg',
        action: 'used',
        version: '5.0',
      };

      Metrics.sendMetricObjectOnce(metricObj, 1);
      Metrics.sendMetricObjectOnce(metricObj, 1);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);
    });
    test('logs a metric only once if same source and action but different versions', () => {
      Metrics.sendMetricObjectOnce(
        {
          source: 'pkg1',
          action: 'used',
          version: '5.0',
        },
        1
      );
      Metrics.sendMetricObjectOnce(
        {
          source: 'pkg1',
          action: 'used',
          version: '6.0',
        },
        1
      );
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);
    });
    test('logs a metric multiple times if same source but different actions', () => {
      Metrics.sendMetricObjectOnce(
        {
          source: 'pkg2',
          action: 'used',
          version: '5.0',
        },
        1
      );
      Metrics.sendMetricObjectOnce(
        {
          source: 'pkg2',
          action: 'loaded',
          version: '5.0',
        },
        1
      );
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('initMetrics', () => {
    test('sets framework and does not log a metric', () => {
      defineClog();
      Metrics.initMetrics('DummyFrameWork');

      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(0);

      // check that the framework is correctly set
      Metrics.sendMetricObject(
        {
          source: 'pkg',
          action: 'used',
          version: '5.0',
        },
        1
      );
      checkMetric(`awsui_pkg_d50`, ['main', 'pkg', 'default', 'used', 'DummyFrameWork', '5.0']);
    });
  });

  describe('logComponentUsed', () => {
    test('logs the usage of the given component name', () => {
      defineClog();
      Metrics.logComponentUsed('DummyComponentName');
      checkMetric(`awsui_DummyComponentName_d30`, [
        'main',
        'DummyComponentName',
        'default',
        'used',
        'DummyFrameWork',
        '3.0(HEAD)',
      ]);
    });
  });

  describe('logComponentLoaded', () => {
    test('logs the component loaded metric', () => {
      defineClog();
      Metrics.logComponentLoaded();
      checkMetric(`awsui_components_d30`, ['main', 'components', 'default', 'loaded', 'DummyFrameWork', '3.0(HEAD)']);
    });
  });
});
