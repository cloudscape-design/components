// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BreadcrumbsController } from '../controllers/breadcrumbs';

interface TestProps {
  id: string;
}

describe('BreadcrumbsController public consumer API', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('onBreadcrumbsChange replays the latest value synchronously on subscribe', () => {
    const controller = new BreadcrumbsController<TestProps>();
    controller.registerBreadcrumbs({ id: 'a' }, () => {});

    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    expect(consumer).toHaveBeenCalledTimes(1);
    expect(consumer).toHaveBeenCalledWith({ id: 'a' });
  });

  test('onBreadcrumbsChange replays null when no breadcrumbs are registered', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    expect(consumer).toHaveBeenCalledWith(null);
  });

  test('hasExternalConsumer reflects the subscription lifecycle', () => {
    const controller = new BreadcrumbsController<TestProps>();
    expect(controller.hasExternalConsumer()).toBe(false);

    const unsubscribe = controller.onBreadcrumbsChange(() => {});
    expect(controller.hasExternalConsumer()).toBe(true);

    unsubscribe();
    expect(controller.hasExternalConsumer()).toBe(false);
  });

  test('producers yield while an external consumer is registered', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const onRegistered = jest.fn();
    controller.registerBreadcrumbs({ id: 'a' }, onRegistered);
    jest.runOnlyPendingTimers();
    expect(onRegistered).toHaveBeenLastCalledWith(false);

    controller.onBreadcrumbsChange(() => {});
    jest.runOnlyPendingTimers();
    expect(onRegistered).toHaveBeenLastCalledWith(true);
  });

  test('App Layout yields (null) while an external consumer owns rendering, then resumes', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const appLayout = jest.fn();
    controller.registerAppLayout(appLayout);
    controller.registerBreadcrumbs({ id: 'a' }, () => {});
    jest.runOnlyPendingTimers();
    expect(appLayout).toHaveBeenLastCalledWith({ id: 'a' });

    const unsubscribe = controller.onBreadcrumbsChange(() => {});
    jest.runOnlyPendingTimers();
    expect(appLayout).toHaveBeenLastCalledWith(null);

    unsubscribe();
    jest.runOnlyPendingTimers();
    expect(appLayout).toHaveBeenLastCalledWith({ id: 'a' });
  });

  test('external consumers receive updates as breadcrumbs change', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    const registration = controller.registerBreadcrumbs({ id: 'a' }, () => {});
    jest.runOnlyPendingTimers();
    expect(consumer).toHaveBeenLastCalledWith({ id: 'a' });

    registration.update({ id: 'b' });
    jest.runOnlyPendingTimers();
    expect(consumer).toHaveBeenLastCalledWith({ id: 'b' });
  });
});

// Behaviour the global-nav-breadcrumbs-multi-layout and -multi-instance demo pages exercise:
// several App Layouts publishing on one channel, and several chrome surfaces consuming it.
describe('BreadcrumbsController with multiple producers', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('the most recently registered producer wins', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    controller.registerBreadcrumbs({ id: 'alpha' }, () => {});
    controller.registerBreadcrumbs({ id: 'beta' }, () => {});
    jest.runOnlyPendingTimers();

    expect(consumer).toHaveBeenLastCalledWith({ id: 'beta' });
  });

  test('unmounting the newest producer falls back to the previous one', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    controller.registerBreadcrumbs({ id: 'alpha' }, () => {});
    const beta = controller.registerBreadcrumbs({ id: 'beta' }, () => {});
    jest.runOnlyPendingTimers();

    beta.cleanup();
    jest.runOnlyPendingTimers();
    expect(consumer).toHaveBeenLastCalledWith({ id: 'alpha' });
  });

  test('an update on a non-latest producer does not steal ownership', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const consumer = jest.fn();
    controller.onBreadcrumbsChange(consumer);

    const alpha = controller.registerBreadcrumbs({ id: 'alpha' }, () => {});
    controller.registerBreadcrumbs({ id: 'beta' }, () => {});
    jest.runOnlyPendingTimers();

    alpha.update({ id: 'alpha-updated' });
    jest.runOnlyPendingTimers();
    expect(consumer).toHaveBeenLastCalledWith({ id: 'beta' });
  });

  test('every producer yields while an external consumer is registered', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const onAlphaRegistered = jest.fn();
    const onBetaRegistered = jest.fn();
    controller.registerBreadcrumbs({ id: 'alpha' }, onAlphaRegistered);
    controller.registerBreadcrumbs({ id: 'beta' }, onBetaRegistered);
    jest.runOnlyPendingTimers();
    expect(onAlphaRegistered).toHaveBeenLastCalledWith(false);
    expect(onBetaRegistered).toHaveBeenLastCalledWith(false);

    const unsubscribe = controller.onBreadcrumbsChange(() => {});
    jest.runOnlyPendingTimers();
    expect(onAlphaRegistered).toHaveBeenLastCalledWith(true);
    expect(onBetaRegistered).toHaveBeenLastCalledWith(true);

    unsubscribe();
    jest.runOnlyPendingTimers();
    expect(onAlphaRegistered).toHaveBeenLastCalledWith(false);
    expect(onBetaRegistered).toHaveBeenLastCalledWith(false);
  });
});

describe('BreadcrumbsController with multiple external consumers', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('all consumers receive the same value', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const first = jest.fn();
    const second = jest.fn();
    controller.onBreadcrumbsChange(first);
    controller.onBreadcrumbsChange(second);

    controller.registerBreadcrumbs({ id: 'a' }, () => {});
    jest.runOnlyPendingTimers();

    expect(first).toHaveBeenLastCalledWith({ id: 'a' });
    expect(second).toHaveBeenLastCalledWith({ id: 'a' });
  });

  test('a late subscriber gets the current value replayed', () => {
    const controller = new BreadcrumbsController<TestProps>();
    controller.onBreadcrumbsChange(() => {});
    controller.registerBreadcrumbs({ id: 'a' }, () => {});
    jest.runOnlyPendingTimers();

    const late = jest.fn();
    controller.onBreadcrumbsChange(late);
    expect(late).toHaveBeenCalledWith({ id: 'a' });
  });

  test('App Layout resumes only after the last external consumer unsubscribes', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const appLayout = jest.fn();
    controller.registerAppLayout(appLayout);
    controller.registerBreadcrumbs({ id: 'a' }, () => {});

    const unsubscribeFirst = controller.onBreadcrumbsChange(() => {});
    const unsubscribeSecond = controller.onBreadcrumbsChange(() => {});
    jest.runOnlyPendingTimers();
    expect(appLayout).toHaveBeenLastCalledWith(null);

    unsubscribeFirst();
    jest.runOnlyPendingTimers();
    expect(controller.hasExternalConsumer()).toBe(true);
    expect(appLayout).toHaveBeenLastCalledWith(null);

    unsubscribeSecond();
    jest.runOnlyPendingTimers();
    expect(appLayout).toHaveBeenLastCalledWith({ id: 'a' });
  });

  test('unsubscribing one consumer does not stop the others', () => {
    const controller = new BreadcrumbsController<TestProps>();
    const staying = jest.fn();
    const leaving = jest.fn();
    controller.onBreadcrumbsChange(staying);
    const unsubscribe = controller.onBreadcrumbsChange(leaving);
    unsubscribe();

    controller.registerBreadcrumbs({ id: 'a' }, () => {});
    jest.runOnlyPendingTimers();

    expect(staying).toHaveBeenLastCalledWith({ id: 'a' });
    expect(leaving).not.toHaveBeenCalledWith({ id: 'a' });
  });
});
