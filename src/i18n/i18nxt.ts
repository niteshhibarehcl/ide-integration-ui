import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { app } from 'electron';
import path from 'path';
import { Mutex } from 'async-mutex';

const resourcesPath = path.join(app.getAppPath(), '/dist/locales');

let initialized = false;

const mutex = new Mutex();

async function initI18next() {
  console.log('Initializing i18next');
  await mutex.runExclusive(async () => {
    if (initialized) {
      return;
    }
    await i18next.use(Backend).init({
      lng: 'en', // Default language
      fallbackLng: 'en',
      backend: {
        loadPath: path.join(resourcesPath, '{{lng}}.json')
      },
      debug: true,
      interpolation: {
        escapeValue: false // Not needed for Electron as it escapes by default
      }
    });
    initialized = true;
    console.log('Initialized i18next');
  });
}

const i18nextInitPromise = initI18next().catch(err => {
  console.error('Error initializing i18next:', err);
});

export { i18nextInitPromise };
export default i18next;