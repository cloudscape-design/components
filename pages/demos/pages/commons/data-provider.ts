// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export default class DataProvider {
  async getData<T>(name: string) {
    const response = await fetch(`./resources/${name}.json`);
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }
    return (await response.json()) as T[];
  }
  async getDataWithDates<T extends { date: string | number | Date }>(name: string) {
    const data = await this.getData<T>(name);
    return data.map((it: T) => ({ ...it, date: new Date(it.date) }));
  }
}
