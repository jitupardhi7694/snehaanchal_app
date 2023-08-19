/* eslint-disable camelcase */
// This file contains javascripts that is called in front-end by the pages.

// function enable/disable submit button when terms and conditions is checked
// eslint-disable-next-line no-unused-vars
function TermsCheck() {
   const chkbox = document.getElementById('chkForm');
   const btnSubmit = document.getElementById('btnSubmit');
   if (chkbox.checked) {
      btnSubmit.disabled = false;
   } else {
      btnSubmit.disabled = true;
   }
}

// eslint-disable-next-line no-unused-vars
function scroll2Header() {
   // console.log('hash changed');
   // eslint-disable-next-line no-restricted-globals
   scrollBy(0, -150);
}

// this will run on page load after 5seconds to remover alerts shown on page load
window.addEventListener('load', () => {
   window.setTimeout(hideAlerts, 5000);
});

function hideAlerts() {
   console.log('hideAlerts called');
   const alerts = document.getElementsByClassName('alert');
   [...alerts].forEach((alert) => {
      alert.classList.add('animate__animated', 'animate__fadeOutUp', 'animate__delay-4s');
      alert.addEventListener('animationend', () => {
         alert.remove();
      });
   });
}

// check address to fill
function fillAddress() {
   const filladdress = document.getElementById('filladdress');
   const l_address = document.getElementById('local_address');
   const l_city = document.getElementById('local_city');
   const l_land = document.getElementById('local_landmark');
   const l_ph1 = document.getElementById('local_phone1');
   const l_ph2 = document.getElementById('local_phone2');

   if (filladdress.checked) {
      const l_address_value = l_address.value;
      const l_city_value = l_city.value;
      const l_land_value = l_land.value;
      const l_ph1_value = l_ph1.value;
      const l_ph2_value = l_ph2.value;

      document.getElementById('permanent_address').value = l_address_value;
      document.getElementById('permanent_city').value = l_city_value;
      document.getElementById('permanent_landmark').value = l_land_value;
      document.getElementById('permanent_phone1').value = l_ph1_value;
      document.getElementById('permanent_phone2').value = l_ph2_value;
   } else {
      document.getElementById('permanent_address').value = '';
      document.getElementById('permanent_city').value = '';
      document.getElementById('permanent_landmark').value = '';
      document.getElementById('permanent_phone1').value = '';
      document.getElementById('permanent_phone2').value = '';
   }
}

const searchBox = document.querySelector('#search');
searchBox.addEventListener('input', searchTable);

const resetButton = document.querySelector('button[type="reset"]');
resetButton.addEventListener('click', resetTable);

function searchTable() {
   const input = this.value.toLowerCase();
   const rows = document.querySelectorAll('#regrowdata');
   let found = false;
   rows.forEach((row) => {
      const columns = row.querySelectorAll('td');
      let rowFound = false;
      columns.forEach((col) => {
         const text = col.textContent.toLowerCase();
         if (text.indexOf(input) !== -1) {
            rowFound = true;
         }
      });
      if (rowFound) {
         row.style.display = '';
         found = true;
      } else {
         row.style.display = 'none';
      }
   });
   const noRecordFoundRow = document.querySelector('#noRecordFoundRow');
   if (found) {
      if (noRecordFoundRow) {
         noRecordFoundRow.style.display = 'none';
      }
   } else if (noRecordFoundRow) {
      noRecordFoundRow.style.display = '';
   } else {
      const tbody = document.querySelector('tbody');
      const newRow = tbody.insertRow();
      newRow.id = 'noRecordFoundRow';
      const cell = newRow.insertCell();
      cell.colSpan = '20';
      cell.classList.add('text-center');
      cell.textContent = 'No Record Found';
   }
}

function resetTable() {
   const rows = document.querySelectorAll('#regrowdata');
   rows.forEach((row) => (row.style.display = ''));
   searchBox.value = '';
   searchBox.placeholder = 'Search';

   // Check if any search results are currently being displayed
   const foundRows = document.querySelectorAll('#regrowdata:not([style*="display: none"])');
   const noRecordFoundRow = document.querySelector('#noRecordFoundRow');

   // If no search results are found, display the "No Record Found" text
   if (foundRows.length === 0) {
      if (noRecordFoundRow) {
         noRecordFoundRow.style.display = '';
      } else {
         const tbody = document.querySelector('tbody');
         const newRow = tbody.insertRow();
         newRow.id = 'noRecordFoundRow';
         const cell = newRow.insertCell();
         cell.colSpan = '17';
         cell.classList.add('text-center');
         cell.textContent = 'No Record Found';
      }
   } else if (noRecordFoundRow) {
      noRecordFoundRow.style.display = 'none';
   }
}
