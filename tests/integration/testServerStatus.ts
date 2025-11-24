import type { Page } from '@playwright/test';

export class TestServerStatus {
  readonly loading;
  readonly settingUpPython;
  readonly startingHanzo Studio;
  readonly finishing;
  readonly error;

  readonly errorDesktopVersion;

  constructor(readonly window: Page) {
    this.loading = window.getByText('Loading...');
    this.settingUpPython = window.getByText('Setting up Python Environment...');
    this.startingHanzo Studio = window.getByText('Starting Hanzo Studio server...');
    // "Finishing" state has been renamed in the new UI
    this.finishing = window.getByText('Loading Human Interface');
    this.error = window.getByText('Unable to start Hanzo Studio Desktop');

    this.errorDesktopVersion = this.error.locator('p.text-lg.text-neutral-400');
  }

  async get() {
    if (await this.loading.isVisible()) return 'loading';
    if (await this.settingUpPython.isVisible()) return 'setting up python';
    if (await this.startingHanzo Studio.isVisible()) return 'starting hanzo-studio';
    if (await this.finishing.isVisible()) return 'finishing';
    if (await this.error.isVisible()) return 'error';

    return 'unknown';
  }
}
