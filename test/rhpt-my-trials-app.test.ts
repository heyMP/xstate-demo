import { html, fixture, expect, fixtureCleanup, aTimeout } from '@open-wc/testing/index-no-side-effects.js';
import '@open-wc/testing/register-chai-plugins.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import { setViewport } from '@web/test-runner-commands';

import type { RhptMyTrialsApp } from '../src/rhpt-my-trials-app.js';
import { globalMachine } from '../src/machines/globalMachine.js';
import { initializerMachine } from '../src/machines/initializerMachine.js';
import '../src/rhpt-my-trials-app.js';
import { trials } from '../src/machines/mocks/trials.js';

describe('RhptMyTrialsApp', () => {
  let element: RhptMyTrialsApp;
  beforeEach(async () => {
    fixtureCleanup();
    await setViewport({ width: 900, height: 800 });
    element = await fixture(`<rhpt-my-trials-app></rhpt-my-trials-app>`);
  });

  it('it correctly initializes', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: () => new Promise(res => null)
        }
      });
    await visualDiff(element, `initializing`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `initializing-mobile`);
  });

  it('it correctly goes to the dashboard', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: initializerMachine.withConfig({
            services: {
              fetchOfferData: () => () => new Promise(res => res(trials)),
            }
          })
        }
      });
    await visualDiff(element, `idle`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `idle-mobile`);
  });

  it('it correctly shows the dashboard all expired', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: initializerMachine.withConfig({
            services: {
              fetchOfferData: () => () => new Promise(res => res(trials.filter(i => i.status === 'expired'))),
            }
          })
        }
      });
    await visualDiff(element, `idle-expired`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `idle-expired-mobile`);
  });

  it('it correctly shows the dashboard all active', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: initializerMachine.withConfig({
            services: {
              fetchOfferData: () => () => new Promise(res => res(trials.filter(i => i.status === 'active'))),
            }
          })
        }
      });
    await visualDiff(element, `idle-active`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `idle-active-mobile`);
  });

  it('it correctly goes to the dashboard - empty', async () => {
    element.globalMachine = globalMachine
      .withConfig({
        services: {
          initializerMachine: initializerMachine.withConfig({
            services: {
              fetchOfferData: () => () => new Promise(res => res([])),
            }
          })
        }
      });
    await visualDiff(element, `idle-empty`);
    await setViewport({ width: 360, height: 800 });
    await visualDiff(element, `idle-active-mobile-mobile`);
  });
});
