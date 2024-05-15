
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
var customerCheckboxes = document.querySelectorAll('.filter-category input[type="checkbox"][id^="customer-filter-"]');
customerCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', filterOrders);
});
let dateFilter = null;
const dateFilterInput = document.getElementById('date-filter');
const currentDate = new Date().toISOString().split('T')[0];
dateFilterInput.value = currentDate;
dateFilterInput.addEventListener('change', filterOrders);

// Function to check current filters
function filterOrders() {
  updateCustomerFilter();
  updateDateFilter();
}

//Customer filter
function updateCustomerFilter() {
  checkedCustomerIDs = [];
  var filterOptions = document.querySelectorAll('.customer-filter-dropdown-menu .filter-category');

  filterOptions.forEach(function(option) {
      var checkbox = option.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        var customerID = checkbox.value;
        checkedCustomerIDs.push(customerID);
      }
  });
  checkEmpty(filterOptions);
  console.log("Customers Selected :", checkedCustomerIDs);

  const orderContents = document.querySelectorAll('.order-detail-row');
  orderContents.forEach(row => {
      row.classList.add('hidden');
  });
  const orderHeaders = document.querySelectorAll('.order-header-row');
  orderHeaders.forEach(row => {
      row.classList.add('hidden');
  });

  checkedCustomerIDs.forEach(customerID => {
    const customerOrders = document.getElementById(`order-details-for-${customerID}`);
    if (customerOrders) {
      customerOrders.classList.remove('hidden');
    }
    const customerHeader = document.getElementById(`order-header-for-${customerID}`);
    if (customerHeader) {
      customerHeader.classList.remove('hidden');
    }
  });
}

function checkEmpty(filterOptions){
  if (checkedCustomerIDs.length === 0) {
    filterOptions.forEach(function(option) {
      var checkbox = option.querySelector('input[type="checkbox"]');
      var customerID = checkbox.value;
      checkedCustomerIDs.push(customerID);
    });
  }
}


// Add event listener for changes in the date filter input field
function updateDateFilter() {
  const selectedDate = dateFilterInput.value;
  const [year, month, day] = selectedDate.split('-');
  const formattedDate = `${day}-${month}-${year}`;
  console.log('Selected date:', formattedDate);

  fetch('/date_filter/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
        'date': formattedDate,
        'customer_ids': checkedCustomerIDs,
    }),
  })
  .then(response => response.json())
  .then(data => {
    const orderedProductDivs = document.querySelectorAll('[id^="ordered-product-"]');
    orderedProductDivs.forEach(div => {
      if (!div.classList.contains('hidden')) {
        div.classList.add('hidden');
      }
    });

    const products = data.products;
    products.forEach(product => {
      const productDiv = document.getElementById(`ordered-product-${product.id}`);
      if(productDiv){
        productDiv.classList.remove('hidden');
      }
    });
    
  });
};

