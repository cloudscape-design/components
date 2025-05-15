// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
interface TestEvent {
  name: string;
  detail: any;
}

export class TestAPI {
  public events: TestEvent[] = [];

  track(name: string, detail: any): void {
    this.events.push({ name, detail });
  }

  getEventsByName(name: string): TestEvent[] {
    return this.events.filter(event => event.name === name).map(({ detail }) => detail);
  }

  getLastEvent(): TestEvent | undefined {
    if (this.events.length === 0) {
      return undefined;
    }

    return this.events[this.events.length - 1].detail;
  }

  getEvents(): TestEvent[] {
    return this.events;
  }

  clear(): void {
    this.events.length = 0;
  }
}
