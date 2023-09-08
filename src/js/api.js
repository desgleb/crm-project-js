import { refreshTableBody } from '@helpers/utility';

export const API_URL = 'http://localhost:3000/api/clients';

function showTableSpinner() {
  const spinner = document.querySelector('.load-spinner');
  const tableData = document.querySelector('.table__body');
  if (spinner) {
    spinner.classList.add('is-loading');
    tableData?.classList.add('is-hidden');
  }
}

function hideTableSpinner() {
  const spinner = document.querySelector('.load-spinner');
  const tableData = document.querySelector('.table__body');
  if (spinner) {
    spinner.classList.remove('is-loading');
    tableData?.classList.remove('is-hidden');
  }
}

export async function getData() {
  showTableSpinner();
  const response = await fetch(API_URL);
  hideTableSpinner();
  return await response.json();
}

export async function search(e) {
  showTableSpinner();
  const searchURL = `${API_URL}?search=`;
  const formattedValue = e.target.value.trim();
  const searchResponse = await fetch(`${searchURL}${formattedValue}`);
  const searchData = await searchResponse.json();
  hideTableSpinner();
  refreshTableBody(searchData);
}

export async function getClient(id) {
  const getURL = `${API_URL}/${id}`;
  const response = await fetch(getURL);
  return await response.json();
}

export async function deleteClient(id) {
  const deleteURL = `${API_URL}/${id}`;
  return await fetch(deleteURL, {
    method: 'DELETE',
  });
}

export async function updateClient(id = '', data = {}) {
  const patchURL = `${API_URL}/${id}`;
  const jsonData = JSON.stringify(data);
  return await fetch(patchURL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });
}

export async function createClient(data) {
  const createURL = API_URL;
  const jsonData = JSON.stringify(data);
  return await fetch(createURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });
}
