import { createButton } from '@helpers/domCreation';
import { ICON_CLOSE, ICON_LOAD } from '@js/icons';
import {
  API_URL,
  createClient,
  deleteClient,
  getData,
  updateClient,
} from '@js/api';
import {
  alignTooltips,
  compareFunc,
  getDataFromForm,
  refreshTableBody,
} from '@helpers/utility';
import { validateForm } from '@helpers/userInteraction';

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-visible');
  setTimeout(() => {
    modal.classList.remove('is-opened');
  }, 150);
  setTimeout(() => {
    modal.remove();
  }, 250);
}

async function submitModal(id, modal, type) {
  if (!modal || !type) throw new Error('Не передан один из аргументов');
  let response = null;
  const errorWrapper = modal.querySelector('.modal__error');
  try {
    if (type === 'delete') {
      response = await deleteClient(id);
    } else if (type === 'new') {
      const form = document.forms['client-form'];
      const clientData = getDataFromForm(form);
      response = await createClient(clientData);
    } else if (type === 'edit') {
      const form = document.forms['client-form'];
      const clientData = getDataFromForm(form);
      response = await updateClient(id, clientData);
    }
    if (response && !response.ok) {
      const jsonRes = await response.json();
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(jsonRes.errors[0].message);
    }
    closeModal(modal);
  } catch (error) {
    errorWrapper.textContent = `Ошибка! ${error.message}.`;
  } finally {
    if (response && response.ok) {
      const newTableData = await getData(API_URL);
      compareFunc(newTableData);
      await refreshTableBody(newTableData);
      const tooltips = document.querySelectorAll(
        '.table__body-contact-tooltip'
      );
      alignTooltips(tooltips);
    }
  }
}

export function openModal(type = 'new', content = null, clientId = '') {
  let modalSubmitText;
  let modalCancelText;
  if (type === 'delete') {
    modalSubmitText = 'Удалить';
    modalCancelText = 'Отмена';
  } else if (type === 'edit') {
    modalSubmitText = 'Сохранить';
    modalCancelText = 'Удалить клиента';
  } else {
    modalSubmitText = 'Сохранить';
    modalCancelText = 'Отмена';
  }

  const modal = document.createElement('div');
  const modalOverlay = document.createElement('div');
  const modalWindow = document.createElement('div');
  const modalHeader = document.createElement('div');
  const modalContent = document.createElement('div');
  const modalFooter = document.createElement('div');
  const modalClose = createButton('', 'primary', ICON_CLOSE);
  const modalSubmit = createButton(modalSubmitText, 'primary', ICON_LOAD);
  const modalCancel = createButton(modalCancelText, 'secondary');
  const modalError = document.createElement('div');
  const modalTitle = document.createElement('h2');

  modal.className = 'modal is-opened';
  modalOverlay.className = 'modal__overlay';
  modalWindow.className = 'modal__window';
  modalHeader.className = 'modal__header';
  modalContent.className = 'modal__content';
  modalFooter.className = 'modal__footer';
  modalClose.classList.add('modal__close-btn');
  modalSubmit.classList.add('btn-primary');
  modalSubmit.classList.add('modal__submit-btn');
  modalCancel.classList.add('modal__cancel-btn');
  modalError.className = 'modal__error';
  modalTitle.className = 'modal__title';

  if (type === 'new') {
    modalTitle.textContent = 'Новый клиент';
    modalTitle.classList.add('modal__title--left');
  } else if (type === 'delete') {
    modalTitle.dataset.clientId = `ID: ${clientId}`;
    modalTitle.textContent = 'Удалить клиента';
  } else {
    modalTitle.dataset.clientId = `ID: ${clientId}`;
    modalTitle.textContent = 'Изменить данные';
    modalTitle.classList.add('modal__title--left');
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal(modal);
  });
  modalClose.addEventListener('click', () => {
    closeModal(modal);
  });
  modalCancel.addEventListener('click', async () => {
    if (type === 'edit') {
      await deleteClient(clientId);
      const newTableData = await getData(API_URL);
      refreshTableBody(newTableData);
    }
    closeModal(modal);
  });
  modalSubmit.addEventListener('click', async () => {
    await submitModal(clientId, modal, type);
  });

  modalHeader.append(modalTitle);
  if (content) {
    validateForm(content, modalError, modalSubmit);
    modalContent.append(content);
  }
  modalFooter.append(modalError);
  modalFooter.append(modalSubmit);
  modalFooter.append(modalCancel);
  modalWindow.append(modalClose);
  modalWindow.append(modalHeader);
  modalWindow.append(modalContent);
  modalWindow.append(modalFooter);
  modalOverlay.append(modalWindow);
  modal.append(modalOverlay);

  document.querySelector('#app').append(modal);

  setTimeout(() => {
    modal.classList.add('is-visible');
  }, 200);
}
