
//Toggle Customer Filter Menu List
function toggleDropdown(menuId) {
  var dropdownMenu = document.getElementById(menuId);
  const checker = dropdownMenu.classList.contains('hidden');
  if(checker){
      dropdownMenu.classList.remove('hidden');
  }else{
      dropdownMenu.classList.add('hidden');
  }
  
}

//Default filter values
let checkedCustomerIDs = [];
let dateFilter = null;

//Apply Customer Filter Event Listener
var customerCheckboxes = document.querySelectorAll('.filter-category input[type="checkbox"][id^="customer-filter-"]');
customerCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', filterOrders);
});

//Apply Date Filter Event Listener
const dateFilterInput = document.getElementById('date-filter');
dateFilterInput.addEventListener('change', filterOrders);

// Function to check current filters
function filterOrders() {
  //Check for Customer Filter
  checkedCustomerIDs = [];
  var filterOptions = document.querySelectorAll('.customer-filter-dropdown-menu .filter-category');
  filterOptions.forEach(function(option) {
      var checkbox = option.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        var customerID = checkbox.value;
        checkedCustomerIDs.push(customerID);
      }
  });
  checkEmptyCustomers(filterOptions);

  const selectedDate = dateFilterInput.value;
  if (selectedDate) {
    const [year, month, day] = selectedDate.split('-');
    dateFilter = `${day}-${month}-${year}`;
  } else {
    dateFilter = null;
  }

  if(dateFilter != null){
    applyFilters(checkedCustomerIDs,dateFilter);
  } else if (dateFilter == null){
    applyCustomersOnly(checkedCustomerIDs);
  }
  
}

//Customer filter empty checker
function checkEmptyCustomers(filterOptions){
  if (checkedCustomerIDs.length === 0) {
    filterOptions.forEach(function(option) {
      var checkbox = option.querySelector('input[type="checkbox"]');
      var customerID = checkbox.value;
      checkedCustomerIDs.push(customerID);
    });
  }
}


//Apply Filters
function applyFilters(checkedCustomerIDs,dateFilter){

  topHeaders = document.querySelectorAll('[id^="customer-header-"]');
  topHeaders.forEach(div =>{
    div.classList.add('hidden');
  });
  allDivs = document.querySelectorAll('[id^="customer-section-"]');
  allDivs.forEach(div =>{
    div.classList.add('hidden');
  });

  checkedCustomerIDs.forEach(customerId => {
    const headerId = `customer-header-${customerId}`;
    const headerDiv = document.getElementById(headerId);
    if(headerDiv){
      headerDiv.classList.remove('hidden');
    }

    const divId = `customer-section-${customerId}-${dateFilter}`;
    const filteredDiv = document.getElementById(divId);
    if(filteredDiv){
      filteredDiv.classList.remove('hidden');
    }
  });
}

function applyCustomersOnly(checkedCustomerIDs) {
  topHeaders = document.querySelectorAll('[id^="customer-header-"]');
  topHeaders.forEach(div => {
    div.classList.add('hidden');
  });
  allDivs = document.querySelectorAll('[id^="customer-section-"]');
  allDivs.forEach(div => {
    div.classList.add('hidden');
  });

  checkedCustomerIDs.forEach(customerId => {
    const headerId = `customer-header-${customerId}`;
    const headerDiv = document.getElementById(headerId);
    if (headerDiv) {
      headerDiv.classList.remove('hidden');
    }

    const customerSections = document.querySelectorAll(`[id^="customer-section-${customerId}-"]`);
    customerSections.forEach(div => {
      div.classList.remove('hidden');
    });
  });
}
