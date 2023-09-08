// тут будут функции для создания элементов
import {
  ICON_ADD,
  ICON_ARROW,
  ICON_DELETE,
  ICON_FB,
  ICON_LOAD_TABLE,
  ICON_MAIL,
  ICON_MODIFY,
  ICON_OTHER,
  ICON_PHONE,
  ICON_VK,
} from '@js/icons';
import {
  chooseContactType,
  getPersonalLink,
  sortTable,
} from '@helpers/userInteraction';
import { openModal } from '@helpers/modals';
import { getClient, getData } from '@js/api';
import { changeContactType, checkContactsQuantity } from '@helpers/utility';

export function createContainer() {
  const container = document.createElement('div');
  container.className = 'container';

  return container;
}

export function createButton(
  text = '',
  type = 'primary',
  icon = null,
  iconLeft = true
) {
  const button = document.createElement('button');
  button.type = 'button';
  const buttonText = document.createElement('span');
  buttonText.textContent = text;

  let className;
  if (icon) {
    className = `btn btn-${type}--icon`;
    button.innerHTML = icon;
    iconLeft ? button.append(buttonText) : button.prepend(buttonText);
  } else {
    className = `btn btn-${type}`;
    button.append(buttonText);
  }

  button.className = className;

  return button;
}

export function createHeader() {
  const header = document.createElement('header');

  header.className = 'header';

  return header;
}

export function createHeaderLogo(imgPath = null) {
  const logo = document.createElement('img');

  imgPath ? (logo.src = imgPath) : false;

  logo.className = 'header__logo';

  return logo;
}

export function createMain() {
  const main = document.createElement('main');

  main.className = 'main';

  return main;
}

export function createTextInput(additionalClass = '', placeholder = '') {
  const input = document.createElement('input');

  input.type = 'text';

  input.className = `input ${additionalClass}`;
  placeholder ? (input.placeholder = placeholder) : false;

  return input;
}

function createTableHead(headTitles = []) {
  const thead = document.createElement('thead');
  thead.className = 'table__head';
  const headRow = document.createElement('tr');
  headRow.className = 'table__head-row';
  headTitles?.forEach((item, index, array) => {
    const tableHeadCell = document.createElement('th');
    tableHeadCell.className = 'table__head-cell';
    tableHeadCell.scope = 'col';
    if (item.id) {
      const thButton = createButton(item.name, 'primary', ICON_ARROW, false);
      thButton.classList.add('table__head-btn');
      thButton.classList.add('sorted-up');
      thButton.dataset.sorted = 'false';
      thButton.dataset.column = item.id;
      if (index === 0) {
        thButton.classList.add('is-sorted');
        thButton.dataset.sorted = 'up';
      }
      thButton.addEventListener('click', async function () {
        const clientsData = await getData();
        sortTable(this, clientsData);
      });
      tableHeadCell.append(thButton);
    } else {
      tableHeadCell.textContent = item.name;
    }
    index === array.length - 1 ? (tableHeadCell.colSpan = 2) : false;
    headRow.append(tableHeadCell);
  });
  thead.append(headRow);
  return thead;
}

function createCellId(id) {
  const cell = document.createElement('td');
  cell.textContent = id;
  cell.className = 'table__body-cell table__body-cell-id';
  return cell;
}

function createCellName(name) {
  const cell = document.createElement('td');
  cell.textContent = name;
  cell.className = 'table__body-cell';
  return cell;
}

function createCellDate(date) {
  const cell = document.createElement('td');
  const clientCreatedDate = document.createElement('span');
  const clientCreatedTime = document.createElement('span');
  const createdDateStr = date.slice(0, 10).split('-').reverse().join('.');
  const createdTimeStr = date.slice(11, 16);
  clientCreatedDate.textContent = createdDateStr;
  clientCreatedTime.textContent = createdTimeStr;
  cell.append(clientCreatedDate);
  cell.append(clientCreatedTime);
  cell.className = 'table__body-cell table__body-cell-date';
  return cell;
}

function createTooltip(type, value) {
  const tooltip = document.createElement('div');
  tooltip.className = 'table__body-contact-tooltip';
  if (type === 'phone') {
    const valueEl = document.createElement('span');
    valueEl.className = 'table__body-contact-tooltip-value contact-phone';
    valueEl.textContent = value;
    tooltip.append(value);
  } else {
    const typeEl = document.createElement('span');
    const valueEl = document.createElement('span');
    typeEl.className = 'table__body-contact-tooltip-type';
    valueEl.className = 'table__body-contact-tooltip-value';
    typeEl.textContent = type + ': ';
    valueEl.textContent = value;
    tooltip.append(typeEl);
    tooltip.append(valueEl);
  }
  return tooltip;
}

function createCellContacts(contacts) {
  const cell = document.createElement('td');
  cell.className = 'table__body-cell';
  const contactsList = document.createElement('ul');
  contactsList.className = 'list-reset table__body-row-list';

  contacts?.forEach((contact) => {
    const contactItem = document.createElement('li');
    contactItem.className = 'table__body-row-list-item';
    switch (contact.type) {
      case 'phone':
        contactItem.append(createButton('', 'primary', ICON_PHONE));
        contactItem.append(createTooltip(contact.type, contact.value));
        break;
      case 'mail':
        contactItem.append(createButton('', 'primary', ICON_MAIL));
        contactItem.append(createTooltip(contact.type, contact.value));
        break;
      case 'facebook':
        contactItem.append(createButton('', 'primary', ICON_FB));
        contactItem.append(createTooltip(contact.type, contact.value));
        break;
      case 'vkontakte':
        contactItem.append(createButton('', 'primary', ICON_VK));
        contactItem.append(createTooltip(contact.type, contact.value));
        break;
      default:
        contactItem.append(createButton('', 'primary', ICON_OTHER));
        contactItem.append(createTooltip(contact.type, contact.value));
        break;
    }
    contactsList.append(contactItem);
  });

  cell.append(contactsList);

  return cell;
}

function createLoadSpinner() {
  const spinner = document.createElement('tfoot');
  spinner.className = 'load-spinner';
  const spinnerRow = document.createElement('tr');
  const spinnerCell = document.createElement('td');
  spinnerCell.colSpan = 6;
  const spinnerWrapper = document.createElement('div');
  spinnerWrapper.className = 'load-spinner__wrapper';
  spinnerWrapper.innerHTML = ICON_LOAD_TABLE;

  spinnerCell.append(spinnerWrapper);
  spinnerRow.append(spinnerCell);
  spinner.append(spinnerRow);

  return spinner;
}

function createFormInput(label, required = false, value = '', name = '') {
  if (!label) throw new Error('Введите название поля ввода формы');
  const formInput = document.createElement('div');
  formInput.className = 'form__input';

  const inputField = document.createElement('input');
  inputField.className = 'form__input-field';
  inputField.type = 'text';
  inputField.placeholder = ' ';
  inputField.name = name;
  inputField.dataset.validate = '';
  inputField.dataset.validateType = name;

  const inputLabel = document.createElement('label');
  inputLabel.className = 'form__input-label';
  inputLabel.textContent = label;

  if (required) {
    inputLabel.classList.add('required');
    inputField.required = true;
  }
  value ? (inputField.value = value) : false;

  formInput.append(inputField);
  formInput.append(inputLabel);

  return formInput;
}

function createContactSelect(type = '') {
  const contactType = document.createElement('div');
  contactType.className = 'form__input-contact-type';

  const typeText = document.createElement('span');
  typeText.className = 'form__input-contact-type-text';

  const selectList = document.createElement('ul');
  selectList.className = 'list-reset form__input-contact-list is-collapsed';
  selectList.role = 'menu';

  const options = [
    { name: 'Телефон', type: 'phone' },
    { name: 'Email', type: 'mail' },
    { name: 'Vk', type: 'vkontakte' },
    { name: 'Facebook', type: 'facebook' },
    { name: 'Другое', type: 'other' },
  ];

  options.forEach((option) => {
    const selectItem = document.createElement('li');
    selectItem.className = 'form__input-contact-item';
    const selectButton = document.createElement('button');
    selectButton.className = 'btn form__input-contact-btn';
    selectButton.type = 'button';
    selectButton.textContent = option.name;
    selectButton.role = 'menuitem';
    selectButton.dataset.contactType = option.type;

    selectButton.addEventListener('click', function () {
      changeContactType(
        this.dataset.contactType,
        this.textContent,
        contactType
      );
    });

    selectItem.append(selectButton);
    selectList.append(selectItem);

    if (type === option.type) {
      typeText.textContent = option.name;
      contactType.dataset.contactType = option.type;
    }
  });

  contactType.append(typeText);
  contactType.append(selectList);

  contactType.addEventListener('click', function () {
    chooseContactType(this, selectList);
  });

  return contactType;
}

function createFormContactInput(contact = {}) {
  const contactInput = document.createElement('div');
  contactInput.className = 'form__input-contact';

  const select = createContactSelect(contact.type);

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Введите данные контакта';
  inputField.className = 'form__input-contact-field';
  inputField.name = `contact-${contact.type}`;
  inputField.dataset.validate = '';
  inputField.dataset.validateType = contact.type;
  if (contact.value) inputField.value = contact.value;

  const deleteButton = createButton('', 'secondary', ICON_DELETE);
  deleteButton.classList.add('form__input-contact-delete');

  deleteButton.addEventListener('click', () => {
    contactInput.remove();
    const allContacts = document.querySelector('.form__contacts-wrapper');
    if (checkContactsQuantity(allContacts)) {
      const addButton = allContacts.querySelector('.form__add-contact-button');
      addButton ? addButton.classList.remove('is-hidden') : false;
    }
  });

  const deleteTooltip = document.createElement('div');
  deleteTooltip.className = 'form__input-contact-delete-tooltip';
  deleteTooltip.textContent = 'Удалить контакт';

  deleteButton.append(deleteTooltip);
  contactInput.append(select);
  contactInput.append(inputField);
  contactInput.append(deleteButton);

  return contactInput;
}

export async function createClientForm(id = null) {
  const form = document.createElement('form');
  form.className = 'form';
  form.name = 'client-form';

  let clientData = null;
  if (id) {
    clientData = await getClient(id);
  }

  let surnameInput;
  let nameInput;
  let lastNameInput;

  const contactsWrapper = document.createElement('fieldset');
  contactsWrapper.className = 'form__contacts-wrapper';

  const addClient = createButton('Добавить контакт', 'primary', ICON_ADD);
  addClient.classList.add('form__add-contact-button');

  addClient.addEventListener('click', function () {
    const newInput = createFormContactInput({ type: 'phone', value: '' });
    this.before(newInput);

    if (!checkContactsQuantity(contactsWrapper)) {
      this.classList.add('is-hidden');
    }
  });

  contactsWrapper.append(addClient);

  if (clientData) {
    surnameInput = createFormInput(
      'Фамилия',
      true,
      clientData.surname,
      'surname'
    );

    nameInput = createFormInput('Имя', true, clientData.name, 'name');
    lastNameInput = createFormInput(
      'Отчество',
      false,
      clientData.lastName,
      'lastName'
    );

    if (clientData.contacts) {
      clientData.contacts.forEach((contact, i) => {
        if (i < 10) {
          const contactInput = createFormContactInput(contact);
          contactsWrapper.prepend(contactInput);
        }
      });
    }

    if (!checkContactsQuantity(contactsWrapper)) {
      addClient.classList.add('is-hidden');
    }
  } else {
    surnameInput = createFormInput('Фамилия', true, '', 'surname');
    nameInput = createFormInput('Имя', true, '', 'name');
    lastNameInput = createFormInput('Отчество', false, '', 'lastName');
  }

  form.append(contactsWrapper);
  form.prepend(lastNameInput);
  form.prepend(nameInput);
  form.prepend(surnameInput);

  return form;
}

export function createTableRow(client) {
  const tableRow = document.createElement('tr');
  tableRow.className = 'table__body-row';

  const clientId = createCellId(client.id);
  clientId.addEventListener('click', function () {
    getPersonalLink(this.textContent);
  });

  const clientFullName = `${client.name} ${client.lastName} ${client.surname}`;
  const clientName = createCellName(clientFullName);

  const clientCreated = createCellDate(client.createdAt);

  const clientUpdated = createCellDate(client.updatedAt);

  const clientContacts = createCellContacts(client.contacts);

  const clientModify = document.createElement('td');
  const clientDelete = document.createElement('td');

  const modifyButton = createButton('Изменить', 'primary', ICON_MODIFY);
  modifyButton.addEventListener('click', async function () {
    const form = await createClientForm(client.id);
    openModal('edit', form, client.id);
  });
  clientModify.append(modifyButton);

  const deleteModalContent = document.createElement('p');
  deleteModalContent.textContent =
    'Вы действительно хотите удалить данного клиента?';
  deleteModalContent.className = 'modal__content-delete';
  const deleteButton = createButton('Удалить', 'secondary', ICON_DELETE);
  deleteButton.addEventListener('click', function () {
    openModal('delete', deleteModalContent, client.id);
  });
  clientDelete.append(deleteButton);

  tableRow.append(clientId);
  tableRow.append(clientName);
  tableRow.append(clientCreated);
  tableRow.append(clientUpdated);
  tableRow.append(clientContacts);
  tableRow.append(clientModify);
  tableRow.append(clientDelete);

  return tableRow;
}

export function createTableOfClients(data) {
  const columnsNames = [
    { name: 'ID', id: 'id' },
    { name: 'Фамилия Имя Отчество', id: 'name' },
    { name: 'Дата и время создания', id: 'created' },
    { name: 'Последние изменения', id: 'modified' },
    { name: 'Контакты', id: '' },
    { name: 'Действия', id: '' },
  ];
  const tableHead = createTableHead(columnsNames);
  const table = document.createElement('table');
  table.className = 'table';
  const tableBody = document.createElement('tbody');
  tableBody.className = 'table__body';
  const loadSpinner = createLoadSpinner();

  data?.forEach((item) => {
    const newRow = createTableRow(item);
    tableBody.append(newRow);
  });

  table.append(tableHead);
  table.append(tableBody);
  table.append(loadSpinner);

  return table;
}
