import '@scss/main.scss';
import createCrmApp from '@js/render';
import { getData } from '@js/api';
import { openPersonalData } from '@helpers/userInteraction';

document.addEventListener('DOMContentLoaded', () => {
  const BODY = document.body;

  // noinspection JSCheckFunctionSignatures
  new Promise((resolve) => resolve(getData()))
    .then((res) => createCrmApp(res))
    .then((app) => BODY.append(app))
    .then(() => {
      if (location.hash) {
        // noinspection JSIgnoredPromiseFromCall
        openPersonalData();
      }
    });
});
