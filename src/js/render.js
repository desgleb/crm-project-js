import {
  createButton,
  createClientForm,
  createContainer,
  createHeader,
  createHeaderLogo,
  createMain,
  createTableOfClients,
  createTextInput,
} from '@helpers/domCreation';
import imageHeaderLogo from '@img/header-logo.png';
import { alignTooltips, compareFunc, debounce } from '@helpers/utility';
import { search } from '@js/api';
import { ICON_ADD_NEW_CLIENT } from '@js/icons';
import { openModal } from '@helpers/modals';
import { openPersonalData } from '@helpers/userInteraction';

export default function createCrmApp(data) {
  // Сортирую массив по возрастающему ID
  compareFunc(data);

  const APP = document.createElement('div');

  APP.id = 'app';

  const header = createHeader();
  const main = createMain();
  const container = createContainer();
  const title = document.createElement('h1');
  title.className = 'page__title';
  title.textContent = 'Клиенты';

  const headerLogo = createHeaderLogo(imageHeaderLogo);
  const headerSearch = createTextInput('header__search', 'Введите запрос');
  const addNewClientBtn = createButton(
    'Добавить клиента',
    'primary',
    ICON_ADD_NEW_CLIENT
  );
  addNewClientBtn.classList.add('add-new-client');

  new Promise((resolve) => {
    resolve(createTableOfClients(data));
  })
    .then((table) => {
      // noinspection JSCheckFunctionSignatures
      container.append(table);
      container.append(addNewClientBtn);
      return table.querySelectorAll('.table__body-contact-tooltip');
    })
    .then((tooltips) => {
      alignTooltips(tooltips);
    });

  headerSearch?.addEventListener('input', debounce(search, 300));

  addNewClientBtn.addEventListener('click', async () => {
    const newClientForm = await createClientForm();
    openModal('new', newClientForm);
  });

  header.append(headerLogo);
  header.append(headerSearch);
  container.prepend(title);
  main.append(container);
  APP.append(header);
  APP.append(main);

  window.addEventListener('hashchange', () => {
    openPersonalData();
  });

  return APP;
}
