// This file contains javascripts that is called in front-end by the pages.

// event is fired on page load, to calculate the age in words
// document.addEventListener('DOMContentLoaded', function () {
// add code here...
// });

// load image to the preview image element
function previewImage(inputElem, previewElem) {
   const file = document.getElementById(inputElem).files;
   // validate file size before preview
   if (fileSizeValidation(inputElem, previewElem) === false) {
      return;
   }
   if (fileTypeValidation(inputElem) === false) {
      return;
   }
   if (file.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
         document.getElementById(previewElem).setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(file[0]);
      this.fileName = event.target.files[0].name;
      console.log('this.fileName', this.fileName);
   }
}

// load image to the preview image element

// File size validation utility
function fileSizeValidation(elemName, elemImg, maxSize = 2) {
   // console.log(elemName, elemImg);
   // maxSize = 2;
   const fi = document.getElementById(elemName);
   // Check if any file is selected.
   if (fi.files.length > 0) {
      for (const i = 0; i <= fi.files.length - 1; i++) {
         const fsize = fi.files.item(i).size;
         const file = Math.round(fsize / 1024);
         // The size of the file.
         // console.log(file);
         if (file >= maxSize * 1024) {
            alert(`File too Big, please select a file less than ${maxSize} mb`);
            fi.value = '';
            document.getElementById(elemImg).setAttribute('src', '');
            return false;
         }
         return true;
      }
   }
}

// File type validation utility
function fileTypeValidation(elemName) {
   const fileInput = document.getElementById(elemName);
   const filePath = fileInput.value;

   // Allowing file type
   const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
   if (!allowedExtensions.exec(filePath)) {
      alert('Invalid file type');
      fileInput.value = '';
      return false;
   }
   return true;
}

// gender required checking
function isGenderOK() {
   const gender = document.getElementById('gender');
   if (gender.selectedIndex <= 0) {
      alert('Please select gender');
      return false;
   }
}

// documents upload validation
function isUploadOk() {
   const picFile = document.getElementById('photo_upload');
   const repFile = document.getElementById('report_upload');
   const decFile = document.getElementById('decl_upload');
   if (picFile.value === null || picFile.value === '' || repFile.value === null || repFile.value === '') {
      alert('Please select your photo and documents for uploading');
      return false;
   }
   // check for valid extensions
   if (ValidateFileExt(document) === false) {
      return false;
   }
}

// function to check only valid files are selected for upload
function ValidateFileExt(oForm) {
   const _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
   const arrInputs = oForm.getElementsByTagName('input');
   for (let i = 0; i < arrInputs.length; i++) {
      const oInput = arrInputs[i];
      if (oInput.type == 'file') {
         const sFileName = oInput.value;
         if (sFileName.length > 0) {
            let blnValid = false;
            for (let j = 0; j < _validFileExtensions.length; j++) {
               const sCurExtension = _validFileExtensions[j];
               if (
                  sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() ==
                  sCurExtension.toLowerCase()
               ) {
                  blnValid = true;
                  break;
               }
            }

            if (!blnValid) {
               alert(`Sorry, ${sFileName} is invalid, allowed extensions are: ${_validFileExtensions.join(', ')}`);
               return false;
            }
         }
      }
   }
   return true;
}

function calculateAge(birthday, objID) {
   const now = new Date('30/Sept/2021');

   const yearNow = now.getYear();
   const monthNow = now.getMonth();
   const dateNow = now.getDate();

   const dob = new Date(birthday);

   const yearDob = dob.getYear();
   const monthDob = dob.getMonth();
   const dateDob = dob.getDate();

   yearAge = yearNow - yearDob;

   if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
   else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
   }

   if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
   else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
         monthAge = 11;
         yearAge--;
      }
   }
   const obj = document.getElementById(objID);
   age = `${yearAge} years ${monthAge} months ${dateAge} days`;
   obj.value = age;
   console.log('NOW:', now, 'DOB:', dob, 'AGE:', age);
}

function getCurrentDate() {
   let today = new Date();
   let dd = today.getDate();
   let mm = today.getMonth() + 1; // January is 0!
   const yyyy = today.getFullYear();
   if (dd < 10) {
      dd = `0${dd}`;
   }
   if (mm < 10) {
      mm = `0${mm}`;
   }
   today = `${yyyy}-${mm}-${dd}`;
   return today;
}

// bootstrap validation function
// VALIDATION
(function () {
   'use strict';
   // Fetch all the forms we want to apply custom Bootstrap validation styles to
   var forms = document.querySelectorAll('.needs-validation');

   // Loop over them and prevent submission
   Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
         'submit',
         function (event) {
            if (!form.checkValidity()) {
               event.preventDefault();
               event.stopPropagation();
            }
            form.classList.add('was-validated');
         },
         false
      );
   });
})();

const patientTypeSelect = document.getElementById('patient_type_id');
const regIdInput = document.getElementById('reg_id');

patientTypeSelect.addEventListener('change', () => {
   const selectedTypeCode = patientTypeSelect.options[patientTypeSelect.selectedIndex].text;
   const timestamp = Date.now();
   const regId = `${selectedTypeCode}/${timestamp}`;
   regIdInput.value = regId;
});

// edit master row data

// get selected row
function editReligionRow(button) {
   let row = button.parentNode.parentNode;
   const id = row.dataset.id;
   let cells = row.getElementsByTagName('td');

   //assign table cell values to form inputs
   document.getElementById('id').value = cells[0].innerHTML;
   document.getElementById('religionName').value = cells[1].innerHTML.trim();

   // Set the checkbox value based on user's active/inactive status
   const is_Active = cells[2].getElementsByTagName('input')[0].checked;
   const checkbox = document.getElementById('is_Active');
   checkbox.checked = is_Active;
   checkbox.value = is_Active ? '1' : '0';

   // Show/hide the checkbox label based on user's active/inactive status
   const checkboxLabel = document.querySelector('.form-check-label');
   checkboxLabel.innerHTML = is_Active ? 'Active ?' : 'Active ?';
}

// get selected row
function editUserRolesRow(button) {
   let row = button.parentNode.parentNode;
   const id = row.dataset.id;
   let cells = row.getElementsByTagName('td');
   //assign table cell values to form inputs
   document.getElementById('id').value = cells[0].innerHTML;
   document.getElementById('role_name').value = cells[1].innerHTML.trim();

   // Set the checkbox value based on user's active/inactive status
   const is_Active = cells[2].getElementsByTagName('input')[0].checked;
   const checkbox = document.getElementById('is_Active');
   checkbox.checked = is_Active;
   checkbox.value = is_Active ? '1' : '0';

   // Show/hide the checkbox label based on user's active/inactive status
   const checkboxLabel = document.querySelector('.form-check-label');
   checkboxLabel.innerHTML = is_Active ? 'Active ?' : 'Active ?';
}

// get selected row
function editLanguageRow(button) {
   let row = button.parentNode.parentNode;
   const id = row.dataset.id;
   let cells = row.getElementsByTagName('td');

   //assign table cell values to form inputs
   document.getElementById('id').value = cells[0].innerHTML;
   document.getElementById('language').value = cells[1].innerHTML.trim();

   // Set the checkbox value based on user's active/inactive status
   const is_Active = cells[2].getElementsByTagName('input')[0].checked;
   const checkbox = document.getElementById('is_Active');
   checkbox.checked = is_Active;
   checkbox.value = is_Active ? '1' : '0';

   // Show/hide the checkbox label based on user's active/inactive status
   const checkboxLabel = document.querySelector('.form-check-label');
   checkboxLabel.innerHTML = is_Active ? 'Active' : 'Active ?';
}

// get selected row
function editPatientTypeRow(button) {
   let row = button.parentNode.parentNode;
   const id = row.dataset.id;
   let cells = row.getElementsByTagName('td');
   //assign table cell values to form inputs
   document.getElementById('id').value = cells[0].innerHTML;
   document.getElementById('type_code').value = cells[1].innerHTML.trim();

   // Set the checkbox value based on user's active/inactive status
   const is_Active = cells[2].getElementsByTagName('input')[0].checked;
   const checkbox = document.getElementById('is_Active');
   checkbox.checked = is_Active;
   checkbox.value = is_Active ? '1' : '0';

   // Show/hide the checkbox label based on user's active/inactive status
   const checkboxLabel = document.querySelector('.form-check-label');
   checkboxLabel.innerHTML = is_Active ? 'Active ?' : 'Active ?';
}

// print form

const printButton = document.getElementById('print-button');
printButton.addEventListener('click', function () {
   window.print();
});
