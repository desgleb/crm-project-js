import { createTableRow } from '@helpers/domCreation';

export function debounce(func, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function alignTooltips(arr) {
  arr?.forEach((item) => {
    const width = Math.ceil(item.offsetWidth / 10) * 10;
    item.style.left = width * -0.5 + 8 + 'px';
  });
}

function sortById(arr, direction = 'up') {
  if (!arr) return;
  arr.sort((a, b) => {
    const aValue = +a.id;
    const bValue = +b.id;
    if (direction === 'up') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
}

function sortByName(arr, direction = 'up') {
  if (!arr) return;
  arr.sort((a, b) => {
    const aName = `${a.name} ${a.lastName} ${a.surname}`
      .toLowerCase()
      .replaceAll(' ', '');
    const bName = `${b.name} ${b.lastName} ${b.surname}`
      .toLowerCase()
      .replaceAll(' ', '');
    if (direction === 'up') {
      if (aName > bName) {
        return 1;
      } else if (aName < bName) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (aName > bName) {
        return -1;
      } else if (aName < bName) {
        return 1;
      } else {
        return 0;
      }
    }
  });
}

function sortByDate(arr, direction = 'up', param) {
  if (!arr) return;
  arr.sort((a, b) => {
    let aDate;
    let bDate;
    if (param === 'created') {
      aDate = a.createdAt;
      bDate = b.createdAt;
    }
    if (param === 'modified') {
      aDate = a.updatedAt;
      bDate = b.updatedAt;
    }
    if (direction === 'up') {
      if (aDate > bDate) {
        return 1;
      } else if (aDate < bDate) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (aDate > bDate) {
        return -1;
      } else if (aDate < bDate) {
        return 1;
      } else {
        return 0;
      }
    }
  });
}

export function compareFunc(arr, param = 'id', direction = 'up') {
  switch (param) {
    case 'id':
      sortById(arr, direction);
      break;
    case 'name':
      sortByName(arr, direction);
      break;
    default:
      sortByDate(arr, direction, param);
      break;
  }
}

export function refreshTableBody(arr) {
  const table = document.querySelector('.table');
  const tableBody = document.querySelector('.table__body');
  const newTableBody = document.createElement('tbody');
  newTableBody.className = 'table__body';

  arr?.forEach((item) => {
    const newRow = createTableRow(item);
    newTableBody.append(newRow);
  });

  tableBody.remove();
  table.append(newTableBody);
}

export function changeContactType(type, text, current) {
  current.dataset.contactType = type;
  current.childNodes[0].textContent = text;
  current.nextSibling.name = `contact-${type}`;
}

export function closeAllOpenedDropdowns() {
  document.querySelectorAll('.form__input-contact-type')?.forEach((type) => {
    type.classList.remove('dropdown-visible');
    type
      .querySelector('.form__input-contact-list')
      .classList.add('is-collapsed');
  });
}

export function checkContactsQuantity(contactsWrapperEl, qty = 10) {
  let allowAddition = true;
  if (contactsWrapperEl.children.length - 1 >= qty) allowAddition = false;
  return allowAddition;
}

export function getDataFromForm(form) {
  const contactTypesArr = [
    'contact-phone',
    'contact-facebook',
    'contact-vkontakte',
    'contact-mail',
    'contact-other',
  ];
  const data = {};
  const elements = form.elements;
  data.name = elements['name'].value;
  data.surname = elements['surname'].value;
  data.lastName = elements['lastName'].value;
  data.contacts = [];
  contactTypesArr?.forEach((type) => {
    if (elements[type]) {
      if (elements[type].length) {
        elements[type]?.forEach((elem) => {
          const contactObj = {};
          const contactType = elem.name.replace('contact-', '');
          const contactValue = elem.value.trim();
          contactObj.type = contactType;
          contactObj.value = contactValue;
          data.contacts.push(contactObj);
        });
      } else {
        const contactObj = {};
        const contactType = elements[type].name.replace('contact-', '');
        const contactValue = elements[type].value.trim();
        contactObj.type = contactType;
        contactObj.value = contactValue;
        data.contacts.push(contactObj);
      }
    }
  });
  return data;
}
