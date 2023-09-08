import {
  closeAllOpenedDropdowns,
  compareFunc,
  refreshTableBody,
} from '@helpers/utility';
import { openModal } from '@helpers/modals';
import { createClientForm } from '@helpers/domCreation';
import { getClient } from '@js/api';

export function sortTable(button, clientsData) {
  const param = button.dataset.column;
  const isActive = button.classList.contains('is-sorted');
  if (!isActive)
    document.querySelectorAll('.table__head-btn')?.forEach((btn) => {
      btn.classList.remove('is-sorted');
    });
  let isSorted = button.dataset.sorted;
  switch (isSorted) {
    case 'false':
      button.classList.add('is-sorted');
      button.classList.add('sorted-up');
      isSorted = 'up';
      button.dataset.sorted = isSorted;
      compareFunc(clientsData, param, isSorted);
      break;
    case 'up':
      button.classList.remove('sorted-up');
      button.classList.add('sorted-down');
      isSorted = 'down';
      button.dataset.sorted = isSorted;
      compareFunc(clientsData, param, isSorted);
      break;
    case 'down':
      button.classList.remove('sorted-down');
      button.classList.add('sorted-up');
      isSorted = 'up';
      button.dataset.sorted = isSorted;
      compareFunc(clientsData, param, isSorted);
      break;
  }
  refreshTableBody(clientsData);
}

export function chooseContactType(activeType, list) {
  if (!activeType) {
    throw new Error('Не указан тип контакта');
  }
  if (list.length === 0) {
    throw new Error('Длина списка = 0');
  }
  list.querySelectorAll('.form__input-contact-btn').forEach((button) => {
    button.classList.remove('is-hidden');
    if (button.dataset.contactType === activeType.dataset.contactType) {
      button.classList.add('is-hidden');
    }
  });
  if (list.classList.contains('is-collapsed')) {
    closeAllOpenedDropdowns();
    activeType.classList.add('dropdown-visible');
    list.classList.remove('is-collapsed');
    list.style.bottom = list.offsetHeight * -1 - 1 + 'px';
  } else {
    activeType.classList.remove('dropdown-visible');
    list.classList.add('is-collapsed');
  }
}

function isFieldEmpty(field) {
  let isEmpty = true;
  if (field.value.trim()) {
    isEmpty = false;
  }
  return isEmpty;
}

function validateField(name) {
  let isNameValid = true;
  // noinspection RegExpDuplicateCharacterInClass
  const regExp = /[^a-zA-ZА-яЁё]/g;
  const testResult = regExp.test(name);
  if (testResult) {
    isNameValid = false;
  }
  return isNameValid;
}

function validatePhone(phone) {
  let isValid = true;
  const regExp = /\D+/g;
  const testResult = regExp.test(phone);
  if (testResult) {
    isValid = false;
  }
  return isValid;
}

function validateVk(profile) {
  let isValid = false;
  const regExp = /^vk.com\//g;
  const testResult = regExp.test(profile);
  if (testResult) {
    isValid = true;
  }
  return isValid;
}

function validateFb(profile) {
  let isValid = false;
  const regExp = /^facebook.com\//g;
  const testResult = regExp.test(profile);
  if (testResult) {
    isValid = true;
  }
  return isValid;
}

function validateEmail(email) {
  let isValid = false;
  const regExp = /^\S+@\S+\.(\S+){2,4}$/g;
  const testResult = regExp.test(email);
  if (testResult) {
    isValid = true;
  }
  return isValid;
}

function markFieldWithError(field, errorWrapper, submitBtn, errorText = '') {
  field.parentElement.classList.add('has-error');
  errorWrapper.textContent = errorText;
  submitBtn.disabled = true;
}

export function validateForm(form, errorWrapper, submitBtn) {
  const fields = form.querySelectorAll('[data-validate]');
  fields?.forEach((field) => {
    field.addEventListener('input', function () {
      this.parentElement.classList.remove('has-error');
      errorWrapper.textContent = '';
      submitBtn.disabled = false;
    });
    field.addEventListener('blur', function () {
      const validationType = this.dataset.validateType;
      switch (validationType) {
        case 'name':
          if (!validateField(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Имя" есть недопустимые символы. Имя должно содержать только буквы.'
            );
          }
          break;
        case 'surname':
          if (!validateField(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Фамилия" есть недопустимые символы. Фамилия должна содержать только буквы.'
            );
          }
          break;
        case 'lastName':
          if (!validateField(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Отчество" есть недопустимые символы. Отчество может быть пустым или должно содержать только буквы.'
            );
          }
          break;
        case 'phone':
          if (!validatePhone(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Телефон" есть недопустимые символы. Телефон должен содержать только цифры.'
            );
          }
          break;
        case 'vkontakte':
          if (!validateVk(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Vk" есть недопустимые символы. Профиль VK должен начинаться с "vk.com/".'
            );
          }
          break;
        case 'facebook':
          if (!validateFb(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Facebook" есть недопустимые символы. Профиль Facebook должен начинаться с "facebook.com/".'
            );
          }
          break;
        case 'mail':
          if (!validateEmail(this.value.trim())) {
            markFieldWithError(
              this,
              errorWrapper,
              submitBtn,
              'Ошибка! В поле "Email" есть недопустимые символы. Адрес электронной почты должен содержать один знак "@" и доменную зону (например ".ru").'
            );
          }
          break;
      }
      const isEmpty = isFieldEmpty(this);
      if (isEmpty && field.name !== 'lastName') {
        markFieldWithError(
          this,
          errorWrapper,
          submitBtn,
          'Ошибка! Данное поле должно быть заполнено!'
        );
      }
    });
  });
}

export function getPersonalLink(id) {
  const personalLink = new URL(location);
  personalLink.hash = id;
  navigator.clipboard
    .writeText(personalLink.href)
    // не стал делать push-уведомление, так как не уверен, что будет SSL-сертификат на стенде проверки
    .then(() => alert('Ссылка на клиента скопирована в буфер обмена'));
}

export async function openPersonalData() {
  const id = location.hash.replaceAll('#', '');
  if (id !== '') {
    const response = await getClient(id);
    if (response.id && response.id === id) {
      const form = await createClientForm(id);
      openModal('edit', form, id);
    }
  }
}
