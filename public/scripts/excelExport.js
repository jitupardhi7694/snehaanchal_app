// Select the export button by ID
var exportBtn = document.getElementById('export');

// Add an event listener to the export button
exportBtn.addEventListener('click', function () {
   // Select the table by ID
   var table = document.getElementById('table');

   // Get the table data
   var tableData = [];

   // Get the header row data
   var headerRowData = [];
   var headerRow = table.rows[0];
   for (var j = 0, col; (col = headerRow.cells[j]); j++) {
      headerRowData.push(col.innerText);
   }
   tableData.push(headerRowData);

   // Loop through each row in the table
   for (var i = 1, row; (row = table.rows[i]); i++) {
      // Create an empty row data array
      var rowData = [];

      // Loop through each cell in the row
      for (var j = 0, col; (col = row.cells[j]); j++) {
         // Add the cell value to the row data array
         rowData.push(col.innerText);
      }

      // Add the row data to the table data array
      tableData.push(rowData);
   }

   // Create a new workbook
   var workbook = XLSX.utils.book_new();

   // Create a new worksheet
   var worksheet = XLSX.utils.aoa_to_sheet(tableData);

   // Add the worksheet to the workbook
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

   // Save the workbook as an Excel file
   XLSX.writeFile(workbook, 'snehaanchal_ExcelData.xlsx');
});
