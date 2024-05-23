/* 

Calculating Dropdowns

*/
//To add dropdown quantity options for pending items
const pendingSelectElements = document.querySelectorAll('select[id^="available-"]');
pendingSelectElements.forEach(select => {
  const initialQuantity = parseInt(select.options[0].value);

  const options = [];
  for (let multiple = 4; multiple < initialQuantity; multiple += 4) {
    options.push(`<option value="${multiple}">${multiple}</option>`);
  }

  select.innerHTML += options.join('');
});

//To add dropdown quantity options for dispatched items
const dispatchedSelectElements = document.querySelectorAll('select[id^="dispatched-"]');
dispatchedSelectElements.forEach(select => {
  const initialDispatchedQuantity = parseInt(select.options[0].value);

  const options = [];
  for (let multiple = 4; multiple < initialDispatchedQuantity; multiple+= 4) {
      options.push(`<option value="${multiple}">${multiple}</option>`);
  }

  select.innerHTML += options.join('');
});
/* 

Dispatching and Reverting

*/
// Attach event listener for each pending select element
pendingSelectElements.forEach(select => {
    select.addEventListener('change', function(event) {
      const itemId = select.id.split('-')[1];
      const selectedQuantity = parseInt(select.value);
      
      dispatchItem(itemId,selectedQuantity);
    });
});

// Attach event listener for each dispatch select element
dispatchedSelectElements.forEach(select => {
    select.addEventListener('change', function(event) {
      const itemId = select.id.split('-')[1];
      const selectedQuantity = parseInt(select.value);
      
      revertDispatch(itemId,selectedQuantity);
    });
});

//Dispatch Single
const individualSendButtons = document.querySelectorAll('.individual-send-button');
individualSendButtons.forEach(button => {
    button.addEventListener('change', function(event) {
        const itemId = button.id.split('-')[2]; // Extract item ID

        if(button.checked){
          dispatchSingle(itemId);
          button.checked = false;
        }
        
    });
});

//Revert Single
const individualRevertButtons = document.querySelectorAll('.individual-revert-button');
individualRevertButtons.forEach(button => {
    button.addEventListener('change', function(event) {
      const itemId = button.id.split('-')[2]; // Extract item ID
      if(button.checked){
        revertSingle(itemId);
        button.checked = false;
      }
  });
});

//Dispatch All Button
const dispatchAllButtons = document.querySelectorAll('.dispatch-all-button');
dispatchAllButtons.forEach(button => {
  button.addEventListener('change', function(event) {
    const customerId = button.id.split('-')[2];
    const day = button.id.split('-')[3];
    const month = button.id.split('-')[4];
    const year = button.id.split('-')[5];
    const date =`${day}-${month}-${year}`;
    if(button.checked){
      dispatchAll(customerId,date);
      button.checked = false;
    }
  });
});


// Revert All Button
const revertAllButtons = document.querySelectorAll('.revert-all-button');
revertAllButtons.forEach(button => {
  button.addEventListener('change', function(event) {
    const customerId = button.id.split('-')[2];
    const day = button.id.split('-')[3];
    const month = button.id.split('-')[4];
    const year = button.id.split('-')[5];
    const date =`${day}-${month}-${year}`;    
    if (button.checked) {
      revertAll(customerId,date);
      button.checked = false;
    }
  });
});


/* 

Functions for dispatching and reverting

 */
// dispatch item with selected quantity
function dispatchItem(itemId,selectedQuantity){
  fetch('/dispatch_item/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'item_id': itemId,
      'selected': selectedQuantity,
      }),
  })
  .then(response => response.json())
  .then((data) => {
    updateSections(itemId);
  });
}
//dispatch item with full quantity
function dispatchSingle(itemId){
  fetch('/dispatch_single/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
        'item_id': itemId
    }),
  })
  .then(response => response.json())
  .then(data => {
    updateSections(itemId);
  });
}
//dispatch all items, full quantity, for that date and customer
function dispatchAll(customerId,date){
  fetch('/dispatch_all/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'cust_id': customerId,
      'date' : date,
    }),
  })
  .then(response => response.json())
  .then((data) => {
    updateSectionsFull(customerId,date);
  });
}

//revert dispatch for selected quantity
function revertDispatch(itemId,selectedQuantity){
  fetch('/revert_dispatch/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'item_id': itemId,
      'selected': selectedQuantity,
      }),
  })
  .then(response => response.json())
  .then((data) => {
    updateSections(itemId);
  });
}

//revert full dispatch for item
function revertSingle(itemId){
  fetch('/revert_single/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
        'item_id': itemId
    }),
  })
  .then(response => response.json())
  .then(data => {
    updateSections(itemId);
  });
}

//revert all items, full quantity, for that date and customer
function revertAll(customerId,date){
  fetch('/revert_all/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'cust_id': customerId,
      'date' : date,
    }),
  })
  .then(response => response.json())
  .then((data) => {
    updateSectionsFull(customerId,date);
  });
}


/* 

Updating Sections using InnerHTML

*/

//to update on single or quantity dispatch
function updateSections(itemId) {
  const productDiv = document.getElementById(`ordered-item-${itemId}`);
  fetch('/get_content/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'item_id': itemId,
    }),
  })
  .then(response => response.json())
  .then(data => {
    const items = data.items;
    const products = data.products;

    const newContent = items.map(item => {
      const product = products.find(prod => prod.id === item.product_id);
      return `
      <div class="inline-checkbox-${item.id}" id="ordered-product-${item.id}" style="display: grid; grid-template-columns: 18% 40% 42%;padding:5px;">
      <div style="justify-self: start; padding: 6px 0;padding-left:5px;" data-date="${item.date_ordered}">${product.name}&nbsp;-</div>
                                    
      <div style="display: grid; padding: 4px 0;">
        
        <div style="justify-self: center; padding: 2px 0px;">
          <div style="display: grid; grid-template-columns: auto auto auto;">
            <label for="available-${item.id}" style="display: inline-block; width: 40px;">Qty : </label>
            
            <select id="available-${item.id}" name="available-${item.id}" style="display: inline-block; width: 42px; height: 26px;">
              <option value="${item.pending_quantity}">${item.pending_quantity}</option>
            </select>

            <input type="checkbox" class="individual-send-button" id="individual-send-${item.id}" style="margin-left: 5px;">
          
          </div>
        </div>

      </div>

      <div style="display: grid; padding: 4px 0;">
                  
        <div style="justify-self: center; padding: 2px 0;">
          <div style="display: grid; grid-template-columns: auto auto auto;">
            <label for="dispatched-${item.id}" style="display: inline-block; width: 40px;">Qty : </label>

            <select id="dispatched-${item.id}" name="dispatched-${item.id}" style="display: inline-block; width: 42px; height: 26px;">
              <option value="${item.dispatched_quantity}">${item.dispatched_quantity}</option>
            </select>

            <input type="checkbox" class="individual-revert-button" id="individual-revert-${item.id}" style="margin-left: 5px;">
          
          </div>
        </div>
      </div>
    </div>

      `;
    }).join('');
    productDiv.innerHTML = newContent; 

    //Reattaching Quantity Dropdown Options
    const availableDropdowns = productDiv.querySelectorAll('select[id^="available-"]');
    const dispatchedDropdowns = productDiv.querySelectorAll('select[id^="dispatched-"]');
    
    availableDropdowns.forEach(select => {
      const initialQuantity = parseInt(select.options[0].value);
      const options = [];
      for (let multiple = 4; multiple < initialQuantity; multiple += 4) {
        options.push(`<option value="${multiple}">${multiple}</option>`);
      }
      select.innerHTML += options.join('');
    });
    
    dispatchedDropdowns.forEach(select => {
      const initialQuantity = parseInt(select.options[0].value);
      const options = [];
      for (let multiple = 4; multiple < initialQuantity; multiple += 4) {
        options.push(`<option value="${multiple}">${multiple}</option>`);
      }
      select.innerHTML += options.join('');
    });

    //Reattaching the listeners for quantity dropdowns
    availableDropdowns.forEach(select => {
      select.addEventListener('change', function(event) {
        const itemId = select.id.split('-')[1];
        const selectedQuantity = parseInt(select.value);
        dispatchItem(itemId,selectedQuantity);
      });
    });
    dispatchedDropdowns.forEach(select => {
      select.addEventListener('change', function(event) {
        const itemId = select.id.split('-')[1];
        const selectedQuantity = parseInt(select.value);
        revertDispatch(itemId,selectedQuantity);
      });
    });

    // Reattach event listeners for individual checkboxes
    const individualSendButtons = productDiv.querySelectorAll('.individual-send-button');
    const individualRevertButtons = productDiv.querySelectorAll('.individual-revert-button');
    individualSendButtons.forEach(button => {
        button.addEventListener('change', function(event) {
            const itemId = button.id.split('-')[2]; 
            dispatchSingle(itemId);
        });
    });
    individualRevertButtons.forEach(button => {
        button.addEventListener('change', function(event) {
            const itemId = button.id.split('-')[2];
            revertSingle(itemId);
        });
    });

  }); 
  
}

//To update on dispatchAll and revertAll
function updateSectionsFull(custId, date){
  const orderDiv = document.getElementById(`customer-section-${custId}-${date}`);

  fetch('/get_customer_order_content/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'cust_id': custId,
      'date': date,
    }),
  })
  .then(response => response.json())
  .then(data => {
    const items = data.items;
    const products = data.products;

    const newContent = items.map(item => {
      const product = products.find(prod => prod.id === item.product_id);
      return `
      
        <div class="updating-section" id="ordered-item-${item.id}">
                        
          <div class="inline-checkbox-${item.id}" id="ordered-product-${item.id}" style="display: grid; grid-template-columns: 18% 40% 42%;padding:5px;">
            <div style="justify-self: start; padding: 6px 0;padding-left:5px;" data-date="${item.date_ordered}">${product.name}&nbsp;-</div>
                                          
            <div style="display: grid; padding: 4px 0;">
              
              <div style="justify-self: center; padding: 2px 0px;">
                <div style="display: grid; grid-template-columns: auto auto auto;">
                  <label for="available-${item.id}" style="display: inline-block; width: 40px;">Qty : </label>
                  
                  <select id="available-${item.id}" name="available-${item.id}" style="display: inline-block; width: 42px; height: 26px;">
                    <option value="${item.pending_quantity}">${item.pending_quantity}</option>
                  </select>

                  <input type="checkbox" class="individual-send-button" id="individual-send-${item.id}" style="margin-left: 5px;">
                
                </div>
              </div>

            </div>

            <div style="display: grid; padding: 4px 0;">
                        
              <div style="justify-self: center; padding: 2px 0;">
                <div style="display: grid; grid-template-columns: auto auto auto;">
                  <label for="dispatched-${item.id}" style="display: inline-block; width: 40px;">Qty : </label>

                  <select id="dispatched-${item.id}" name="dispatched-${item.id}" style="display: inline-block; width: 42px; height: 26px;">
                    <option value="${item.dispatched_quantity}">${item.dispatched_quantity}</option>
                  </select>

                  <input type="checkbox" class="individual-revert-button" id="individual-revert-${item.id}" style="margin-left: 5px;">
                
                </div>
              </div>
            </div>
          </div>
        
        </div>
      `;
    }).join('');
    orderDiv.querySelector('.section-content').innerHTML = newContent;

    //Reattaching Quantity Dropdown Options
    const availableDropdowns = orderDiv.querySelectorAll('select[id^="available-"]');
    const dispatchedDropdowns = orderDiv.querySelectorAll('select[id^="dispatched-"]');
    availableDropdowns.forEach(select => {
      const initialQuantity = parseInt(select.options[0].value);
      const options = [];
      for (let multiple = 4; multiple < initialQuantity; multiple += 4) {
        options.push(`<option value="${multiple}">${multiple}</option>`);
      }
      select.innerHTML += options.join('');
    });
    dispatchedDropdowns.forEach(select => {
      const initialQuantity = parseInt(select.options[0].value);
      const options = [];
      for (let multiple = 4; multiple < initialQuantity; multiple += 4) {
        options.push(`<option value="${multiple}">${multiple}</option>`);
      }
      select.innerHTML += options.join('');
    });

    //Reattaching the listeners for quantity dropdowns
    availableDropdowns.forEach(select => {
      select.addEventListener('change', function(event) {
        const itemId = select.id.split('-')[1];
        const selectedQuantity = parseInt(select.value);
        dispatchItem(itemId,selectedQuantity);
      });
    });
    dispatchedDropdowns.forEach(select => {
      select.addEventListener('change', function(event) {
        const itemId = select.id.split('-')[1];
        const selectedQuantity = parseInt(select.value);
        revertDispatch(itemId,selectedQuantity);
      });
    });

    // Reattach event listeners for individual checkboxes
    const individualSendButtons = orderDiv.querySelectorAll('.individual-send-button');
    const individualRevertButtons = orderDiv.querySelectorAll('.individual-revert-button');
    individualSendButtons.forEach(button => {
        button.addEventListener('change', function(event) {
            const itemId = button.id.split('-')[2]; 
            dispatchSingle(itemId);
        });
    });
    individualRevertButtons.forEach(button => {
        button.addEventListener('change', function(event) {
            const itemId = button.id.split('-')[2];
            revertSingle(itemId);
        });
    });

  });
}






























/* 

//To toggle the Mitigate Section
function toggleSection(orderId){
  const inventoryDiv = document.getElementById(`mitigate-inventory-${orderId}`);
  
  const isExpanded = inventoryDiv.classList.contains('hidden');
    if (isExpanded) {
      inventoryDiv.classList.remove('hidden');
      inventoryDiv.style.flex = '3.5'; 
    } else {
      inventoryDiv.classList.add('hidden');
      inventoryDiv.style.flex = '0';
    }

}


//To update Mitigate Span
function updateMitigate(mitigate,orderId){
  if(mitigate == 0){
    toggleSection(orderId);
  }else if(mitigate >0){
    mitigateSpans.forEach(span => { 
      span.textContent = `To Adjust : ${mitigate} Boxes`;
    });
  }
}


//To update Product Lists
function updateProductLists(mitigate){

  productListDivs.forEach(productListDiv => {
    fetch(`/product_data`)
    .then(response => response.json())
    .then(data => {
      productListDiv.innerHTML = '';
      const products = data.products; 
  
      const newContent = products.map(product => {
        let categoryName;
        if (product.category_id === 1) {
            categoryName = 'HD';
        } else if (product.category_id === 2) {
            categoryName = 'Smart Silk';
        } else if (product.category_id === 3) {
            categoryName = '800 Mtr';
        } else if (product.category_id === 4) {
            categoryName = 'Red Poly';
        } else {
            categoryName = 'Other';  
        }
  
        const availableInventory = parseInt(product.inventory);
        const options = [];
        for (let multiple = 1; multiple < availableInventory; multiple++) { 
          options.push(`<option value="${multiple}">${multiple}</option>`);
        }
  
        return `
          <div style="justify-self:start;padding: 4px 0px;" id="product-${product.id}" class="product" data-inventory="${product.inventory}">
            ${product.name} - ${categoryName}
          </div>
          
          <div style="justify-self:end;padding: 4px 4px;" class="quantity-select">
            <select id="quantity-${product.id}" class="quantity-dropdown">
              <option value="${product.inventory}">${product.inventory}</option>
              ${options.join('')}
            </select>
          </div>
          `;
        }).join(''); 
      productListDiv.innerHTML = newContent; 

      //To reattach event listeners
      if(mitigate>0){
        const productDropdowns = productListDiv.querySelectorAll('.quantity-dropdown');
        productDropdowns.forEach(dropdown => {
          dropdown.addEventListener('change', (event) => {
            const productId = event.target.id.split('-')[1];
            const selectedValue = event.target.value;
            const selectedDropdown = event.target;
            const closestSearchBar = selectedDropdown.closest('.product-lists').querySelector('.product-list-search-bar input');
            const orderId = closestSearchBar.id.split('-')[2];
            mitigateScenario(mitigate,productId,selectedValue,orderId);
          });
        });
      }
    });
  });   
}


//Function for handling the mitigated quantity in inventory
function mitigateScenario(mitigate,productId,selectedValue,orderId) {
  fetch('/mitigate_inventory/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      'mitigate': mitigate,
      'productId': productId,
      'selected': selectedValue
      }),
  })
  .then(response => response.json())
  .then((data) => {
    const mitigate = data.mitigate;
    updateMitigate(mitigate,orderId);
    updateProductLists(mitigate);
  });  
}

//Search Bar functionality
const searchBars = document.querySelectorAll('.product-list-search-bar input');
function searchBarNeeds(mitigate){
  searchBars.forEach(searchBar => {
    searchBar.addEventListener('input', () => {
      const query = searchBar.value.trim();
      if (query) {
        fetch(`/search_bar?query=${query}`)
        .then(response => response.json())
        .then(data => {
            //Need to create the same innerHTML and then listeners
            productListDivs.forEach(productListDiv => {
              productListDiv.innerHTML = '';
              const products = data.products; 
              const newContent = products.map(product => {
                let categoryName;
                if (product.category_id === 1) {
                    categoryName = 'HD';
                } else if (product.category_id === 2) {
                    categoryName = 'Smart Silk';
                } else if (product.category_id === 3) {
                    categoryName = '800 Mtr';
                } else if (product.category_id === 4) {
                    categoryName = 'Red Poly';
                } else {
                    categoryName = 'Other';  
                }
          
                const availableInventory = parseInt(product.inventory);
                const options = [];
                for (let multiple = 1; multiple < availableInventory; multiple++) { 
                  options.push(`<option value="${multiple}">${multiple}</option>`);
                }
          
                return `
                  <div style="justify-self:start;padding: 4px 0px;" id="product-${product.id}" class="product" data-inventory="${product.inventory}">
                    ${product.name} - ${categoryName}
                  </div>
                  
                  <div style="justify-self:end;padding: 4px 4px;" class="quantity-select">
                    <select id="quantity-${product.id}" class="quantity-dropdown">
                      <option value="${product.inventory}">${product.inventory}</option>
                      ${options.join('')}
                    </select>
                  </div>
                  `;
                }).join(''); 
              productListDiv.innerHTML = newContent; 
        
              //To reattach event listeners - need mitigate
              if(mitigate>0){
                const productDropdowns = productListDiv.querySelectorAll('.quantity-dropdown');
                productDropdowns.forEach(dropdown => {
                  dropdown.addEventListener('change', (event) => {
                    const productId = event.target.id.split('-')[1];
                    const selectedValue = event.target.value;
                    const selectedDropdown = event.target;
                    const closestSearchBar = selectedDropdown.closest('.product-lists').querySelector('.product-list-search-bar input');
                    const orderId = closestSearchBar.id.split('-')[2];
  
                    mitigateScenario(mitigate,productId,selectedValue,orderId);
                  });
                });
              }
            });  
          });
        } 
      });
    });
}

//For order cancellations
function approveCancellation(orderId) {
  console.log("Order Id:", orderId, "cancellation approved.");
  const cancellationDiv = document.getElementById(`order-cancellation-${orderId}`);
  console.log(cancellationDiv);
  fetch('/approve_cancellation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken, 
    },
    body: JSON.stringify({
      'orderId': orderId,
    })
  })
  .then((response) => {
    return response.json(); 
  }) 
  .then((data) => {   
        cancellationDiv.innerHTML = `
          <hr style='border-bottom: 1px solid black;'>
          <div style="display: grid; grid-template-columns: 85% 15%;">
            <p>Cancellation Approved.</p>
            <div class="approved-cancellation">
              <button class="revert-approval-button" onclick="revertApproval(${orderId})"
                  style="
                  justify-self:center; 
                  font-weight:400; 
                  text-align:center; 
                  vertical-align:middle;    
                  border: 1px solid transparent;
                  font-size: 1rem;
                  line-height: 1.5;
                  background-color: #ffc107;
                  border-radius: 0.25rem;
                  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;"
                  data-id="${orderId}">
                      <img src="/static/images/revert.svg" style="width: 19px; height: 19px;" >
              </button>
            </div>
          </div>
        `;
  });
}

function denyCancellation(orderId){
  console.log("Order Id:",orderId,"cancellation denied.");
  const cancellationDiv = document.getElementById(`order-cancellation-${orderId}`);
  console.log(cancellationDiv);
  fetch('/deny_cancellation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken, 
    },
    body: JSON.stringify({
      'orderId': orderId,
    })
  })
  .then((response) => {
    return response.json(); 
  }) 
  .then((data) => {
    cancellationDiv.innerHTML = `
      <hr style='border-bottom: 1px solid black;'>
      <div style="display: grid; grid-template-columns: 85% 15%;">
        <p>Cancellation Denied. </p>
        <div class="denied-cancellation">
          <button class="revert-denial-button" onclick="revertDenial(${orderId})"
              style="
              justify-self:center; 
              font-weight:400; 
              text-align:center; 
              vertical-align:middle;    
              border: 1px solid transparent;
              font-size: 1rem;
              line-height: 1.5;
              background-color: #ffc107;
              border-radius: 0.25rem;
              transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;"
              data-id="${orderId}">
                  <img src="/static/images/revert.svg" style="width: 19px; height: 19px;" >
          </button>
        </div>
      </div>
    `;
  });
}

//For reverting approval and denial
function revertApproval(orderId){
  console.log("Order Id:",orderId,"approval reverted.");
  const cancellationDiv = document.getElementById(`order-cancellation-${orderId}`);
  console.log(cancellationDiv);
  fetch('/revert_approval/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken, 
    },
    body: JSON.stringify({
      'orderId': orderId,
    })
  })
  .then((response) => {
    return response.json(); 
  }) 
  .then((data) => {
    cancellationDiv.innerHTML = `
      <hr style='border-bottom: 1px solid black;'>
      <p> Cancellation Requested. </p>
      <div class="cancellation-request" style="display: grid; grid-template-columns: auto auto;">
          <button class="btn-success approve-cancellation" style="justify-self:center;height:32px;width:min-content; align-self:center;"  
          data-id="${orderId}" onclick="approveCancellation(${orderId})">Approve</button>
          <button class="btn-danger deny-cancellation" style="justify-self:start;height:32px;width:max-content; align-self:center;" 
          data-id="${orderId}" onclick="denyCancellation(${orderId})">Deny</button>
      </div>  
    `;
  });
}

function revertDenial(orderId){
  console.log("Order Id:",orderId,"denial reverted.");
  const cancellationDiv = document.getElementById(`order-cancellation-${orderId}`);
  console.log(cancellationDiv);
  fetch('/revert_denial/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken, 
    },
    body: JSON.stringify({
      'orderId': orderId,
    })
  })
  .then((response) => {
    return response.json(); 
  }) 
  .then((data) => {
    cancellationDiv.innerHTML = `
      <hr style='border-bottom: 1px solid black;'>
      <p> Cancellation Requested. </p>
      <div class="cancellation-request" style="display: grid; grid-template-columns: auto auto;">
          <button class="btn-success approve-cancellation" style="justify-self:center;height:32px;width:min-content; align-self:center;"  
          data-id="${orderId}" onclick="approveCancellation(${orderId})">Approve</button>
          <button class="btn-danger deny-cancellation" style="justify-self:start;height:32px;width:max-content; align-self:center;" 
          data-id="${orderId}" onclick="denyCancellation(${orderId})">Deny</button>
      </div>  
    `;
  });
}

 */