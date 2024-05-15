
const submitButton = document.getElementById('submit');
const cartItemsList = document.getElementById('cart-items');
const quantityDropdowns = document.querySelectorAll('.cart-info-container .quantity-dropdown');
const productQuantityDropdowns = document.querySelectorAll('.product-list .product-dropdown');

//Place Order Button Listener
const observer = new MutationObserver(() => {
    submitButton.disabled = cartItemsList.children.length === 0;
});
    
observer.observe(cartItemsList, { childList: true }); 
submitButton.disabled = cartItemsList.children.length === 0;

document.getElementById('submit').addEventListener('click', function(e){
    submitOrder();
})

//Place Order Function
function submitOrder() {
    fetch('/check_red_poly/')
      .then(response => response.json())
      .then(data => {
        const hasRedPolyProducts = data;

        fetch('/submit_order/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          body: JSON.stringify({})
        })
        .then((response) => response.json())
        .then((data) => {
            orderId = data.orderId;
            updateOrderedProduct(orderId);
        });

        if (hasRedPolyProducts == 'True') {
            alert('Order Placed. \n Note: Red Poly Products are made to order and cannot be Cancelled.');
        } else{
            alert('Order Placed.');
        }
        
        window.location.reload(true);
      });
}
  
// Select List Listener (Update Item Quantity)
quantityDropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', (event) => {
        const selectedQuantity = event.target.value; 
        const productId = dropdown.id.replace('quantity-dropdown-', ''); 

        console.log('Product ID:',productId);
        console.log('Quantity:', selectedQuantity);

        fetch('/update_item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, 
            },
            body: JSON.stringify({'productId': productId, 'quantity': selectedQuantity,})
        })
        .then(response => response.json())
        .then(data => {
            const grandtotal = data.grandtotal;
            //updateTotal(grandtotal);
            checkForRedPoly();
    });
    });
});

//Add Item via Quantity Dropdown in Product List
productQuantityDropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', (event) => {
        const selectedQuantity = event.target.value; 
        const productId = dropdown.id.replace('product-quantity-dropdown-', ''); 

        console.log('Product ID:',productId);
        console.log('Quantity:', selectedQuantity);

        addItemCustom(productId,selectedQuantity);
        dropdown.value = '4';
    });
});

//Search Bar - Smart Silk
const searchInputSS = document.getElementById('ss-search-bar');
const productListSS = document.getElementById('ss-product-list');
searchInputSS.addEventListener('input', () => {
    const query = searchInputSS.value.trim();
    if (query) {
        fetch(`/search-ss?query=${query}`)
        .then(response => response.json())
        .then(data => {
            updateList(productListSS,data);
        });
    } 
});

//Product List Updater
function updateList(productList,data){
    //console.log(data.products);
    //console.log(productList);
        productList.innerHTML = data.products.map(product => {
            return `
            <li style="display: grid; grid-template-columns: auto auto;">
                        
                ${product.name}

                <div class="product-quantity-selector" style='justify-self: end'>
                    Qty:
                    <select class="product-dropdown" id="product-quantity-dropdown-${product.id}">
                        <option value="">-</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="28">28</option>
                        <option value="32">32</option>
                        <option value="36">36</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="80">80</option>
                    </select>
                </div>
            </li>
            `;
        }).join('');

        //Reattaching Listeners
        const productQuantityDropdowns = document.querySelectorAll('.product-dropdown');
        productQuantityDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const selectedQuantity = event.target.value;
            const productId = dropdown.id.replace('product-quantity-dropdown-', '');

            console.log('Product ID:', productId);
            console.log('Quantity:', selectedQuantity);

            addItemCustom(productId, selectedQuantity);
        });
    });
}

//Add Custom Quantity from Product Lists
function addItemCustom(productId,quantity) {
    const action = "add";
  
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);
    console.log("Action:", action);

    var url = '/add_item_custom/'; 
    
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
        'productId': productId,
        'quantity': quantity,
        })
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        updateCart(data);
        reloadProductList()
        checkForRedPoly();
    })
    
}

//Reload Product List after add a Product
function reloadProductList(){
    fetch(`/search-ss?query=all`)
        .then(response => response.json())
        .then(data => {
            updateList(productListSS,data);
            searchInputSS.value = '';
        });
}



/* //Search Bar - Hd
const searchInputHD = document.getElementById('hd-search-bar');
const productListHD = document.getElementById('hd-product-list');
searchInputHD.addEventListener('input', () => {
    const query = searchInputHD.value.trim();
    if (query) {
        fetch(`/search-hd?query=${query}`)
        .then(response => response.json())
        .then(data => {
            updateList(productListHD,data);
        });
    } 
}); */


/* //Search Bar - 800 Mtr
const searchInputMTR = document.getElementById('mtr800-search-bar');
const productListMTR = document.getElementById('mtr800-product-list');
searchInputMTR.addEventListener('input', () => {
    const query = searchInputMTR.value.trim();
    if (query) {
        fetch(`/search-mtr?query=${query}`)
        .then(response => response.json())
        .then(data => {
            updateList(productListMTR,data);
        });
    } 
}); */

//Search Bar - Red Poly
/* const searchInputRP = document.getElementById('rp-search-bar');
const productListRP = document.getElementById('rp-product-list');

searchInputRP.addEventListener('input', () => {
    const query = searchInputRP.value.trim();

    if (query) {
        fetch(`/search-rp?query=${query}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.products);

            productListRP.innerHTML = data.products.map(product => {
                return `
                <li style="display: grid; grid-template-columns: auto auto;">
                            
                    ${product.name}

                    <div class="product-quantity-selector" style='justify-self: end'>
                        Qty:
                        <select class="product-dropdown" id="product-quantity-dropdown-${product.id}">
                            <option value="40">40</option>
                            <option value="80">80</option>
                            <option value="120">120</option>
                            <option value="160">160</option>
                        </select>
                    </div>
                </li>
                `;
            }).join('');

            const productQuantityDropdowns = document.querySelectorAll('.product-dropdown');
            productQuantityDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', (event) => {
                const selectedQuantity = event.target.value;
                const productId = dropdown.id.replace('product-quantity-dropdown-', '');

                console.log('Product ID:', productId);
                console.log('Quantity:', selectedQuantity);

                addItemCustom(productId, selectedQuantity);
            });
            });
            
        });
    } 
}); */

//Add Item to Cart 
function addItem(productId, action) {
    console.log('Product:', productId, 'Action:', action);
            
    console.log('User is logged in, sending data...');
    
    var url = '/add_item/'; 
    
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
        'productId': productId,
        'action': action,
        })
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        updateCart(data);
        const items = data.items;
        const products = data.products;
        //grandTotal = calculateGrandTotal(items,products);
        //updateTotal(grandTotal)
        checkForRedPoly();
    })
        
}
 
//Update Cart Section
function updateCart(data){
    console.log(data);
    const productMap = new Map(data.products.map(product => [product.id, product]));

    const newCartItemsHTML = data.items.map(item => {
        const product = productMap.get(item.product_id);
        const itemId = parseInt(item.id);
        let dropdownHtml;
        if (product.category_id === 4) {
            dropdownHtml = 
            `<select class="quantity-dropdown" id="quantity-dropdown-${item.product_id}">
                <option>${item.quantity}</option>
                <option value="40">40</option>
                <option value="80">80</option>
                <option value="120">120</option>
                <option value="160">160</option>
            </select>`;
        } else {
            dropdownHtml = 
            `<select class="quantity-dropdown" id="quantity-dropdown-${item.product_id}">
                <option>${item.quantity}</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="28">28</option>
                <option value="32">32</option>
                <option value="36">36</option>
                <option value="40">40</option>
                <option value="60">60</option>
                <option value="80">80</option>
            </select>`;
        }

        return `
            <li class="cart-items">
                <div style='flex:2'>${product.name}</div>
                <div style='flex:0.1'></div>
                <div style='flex:1'>-</div>

                <div style='flex:1'>${dropdownHtml}</div>
                <div style='flex:0.5'></div>

                <div style='flex:2'>
                    <div class="toggle-button-wrapper" style="transform: translateY(-12px);">
                        <input type="checkbox" class="urgent-switch toggle-switch" data-item-id="${itemId}" >
                    </div>
                </div>
                <div style='flex:0.5'></div>

                <div onclick="addItem('${item.product_id}', 'delete')" class="btn delete-button" style='flex:0.4; height:35px;border-radius:10px;background-color: #ffacb4;border-color: #30070b;'>
                    <img src="/static/images/dustbin.png" style="width: 22px; height: 22px;transform:translateY(-3px);" >
                </div>
                <div style='flex:1'></div>
            </li>

            <hr style='border-bottom: 1px solid #ececec;'>
        `;
    }).join('');

    cartItemsList.innerHTML = newCartItemsHTML;
    
    //Reapplying for quantity dropdowns
    const quantityDropdowns = cartItemsList.querySelectorAll('.quantity-dropdown');
    quantityDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const selectedQuantity = event.target.value; 
            const productId = dropdown.id.replace('quantity-dropdown-', ''); 

            console.log('Product ID:',productId);
            console.log('Quantity:', selectedQuantity);

            fetch('/update_item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken, 
                },
                body: JSON.stringify({'productId': productId, 'quantity': selectedQuantity,})
            })
            .then(response => response.json())
            .then(data => {
                const productId = data.productId;
                const subtotal = data.subtotal;
                const grandtotal = data.grandtotal;

                //updateTotal(grandtotal);
            });          
        }) 
    })

    //Reapplying for urgent toggle
    const urgentToggle = document.querySelectorAll('.urgent-switch');
    urgentToggle.forEach(urgentSwitch => {
        urgentSwitch.addEventListener('change', (event) => {
            const isUrgent = event.target.checked;
            const itemId = parseInt(urgentSwitch.dataset.itemId);
            fetch('/set_urgent/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, 
                },
            body: JSON.stringify({'is_urgent': isUrgent, 'item_id': itemId})
            })
            .then(response => response.json())
        });
    })
}


//Update Grandtotal
/* function updateTotal(grandtotal){

    const grandTotalElement = document.getElementById('total-price');
    grandTotalElement.textContent = '₹' + grandtotal;

} */
    
//Calculate Grandtotal
/* function calculateGrandTotal(items, products) {
    let grandTotal = 0;
    
    for (const item of items) {
        const productId = item.product_id;
        const quantity = item.quantity;
    
        const product = products.find(product => product.id === productId);
    
        if (product) {
        const productPrice = product.price;
        const subtotal = productPrice * quantity;
        grandTotal += subtotal;
        } else {
        console.warn(`Product with ID ${productId} not found in products list.`);
        }
    }
    
    return grandTotal;
} */


//Dynamic List Toggle
const categoryBlock = document.getElementsByClassName('category-block');
const productListsContainer = document.getElementById('category-content');
const productList = productListsContainer.getElementsByClassName('product-list');
function toggleProducts(){
    const productListId = `smart-silk-products`;

    const productListToShow = productListsContainer.querySelector(`#${productListId}`);
    productListToShow.classList.toggle('hidden');
}
/* 
categoryBlock.forEach(block => {
    block.addEventListener('click', () => {

        const category = block.dataset.category;
        const productListId = `smart-silk-products`;

        const productListToShow = document.querySelector(`#${productListId}`);
        productListToShow.classList.toggle('hidden');
    });
}); */

//Urgent Toggle Button
const urgentToggle = document.querySelectorAll('.urgent-switch');
urgentToggle.forEach(urgentSwitch => {
    urgentSwitch.addEventListener('change', (event) => {
        const isUrgent = event.target.checked;
        const itemId = urgentSwitch.dataset.itemId;
        fetch('/set_urgent/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken, 
              },
          body: JSON.stringify({'is_urgent': isUrgent, 'item_id': itemId})
          })
          .then(response => response.json())
          
      });
})

//Red Poly Alert
function checkForRedPoly() {
    const alertSection = document.querySelector('.red-poly-alert');
    alertSection.classList.add('hidden');

    fetch('/check_red_poly/') 
      .then(response => response.json())
      .then(data => {
        const hasRedPolyProducts = data;
        
        if(hasRedPolyProducts == 'True'){
            alertSection.classList.remove('hidden');
        }
      });
  }

//Red Poly Section
function dealerRedPoly(){
    const redPolySection = document.getElementById('red-poly-block');

    fetch('/dealer_red_poly/') 
      .then(response => response.json())
      .then(data => {
        const hasRedPolyAccess = data;
        
        if(hasRedPolyAccess == 'True'){
            redPolySection.classList.remove('hidden');
        }
      });
}

window.onload = checkForRedPoly;
window.onload = dealerRedPoly;


//To update ordered products for a customer after placing an order
function updateOrderedProduct(orderId){
    fetch('/update_ordered_product/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, 
            },
        body: JSON.stringify({'orderId': orderId})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}