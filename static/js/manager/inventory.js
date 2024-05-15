//Dynamic List Toggle
const categoryBlocks = document.querySelectorAll('.category-block');
const productListsContainer = document.getElementById('category-content');
const productLists = productListsContainer.querySelectorAll('.product-list');

productLists.forEach(list => list.classList.add('hidden'));
categoryBlocks.forEach(block => {
    block.addEventListener('click', () => {
        productLists.forEach(list => list.classList.add('hidden'));

        const category = block.dataset.category;
        const productListId = `${category}-products`;

        const productListToShow = productListsContainer.querySelector(`#${productListId}`);
        productListToShow.classList.remove('hidden');
    });
});


//Search Bar - Hd
const searchInputHD = document.getElementById('hd-search-bar');
const productListHD = document.getElementById('hd-product-list');

searchInputHD.addEventListener('input', () => {
    const query = searchInputHD.value.trim();

    if (query) {
        fetch(`/search-hd?query=${query}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.products);

            productListHD.innerHTML = data.products.map(product => {
                return `
                <li style="display: grid; grid-template-columns: 20% 40% auto;">
                            
                    ${product.name}
                            
                            
                    <div class="product-quantity-selector" style='justify-self: center'>
                        Available Inventory : ${product.inventory}
                    </div>

                    <div style='justify-self: end'>
                        <div style="display: grid; grid-template-columns: auto auto;" >
                            <div style="justify-self: start">
                                <button class="btn btn-outline-dark" id="submit" style="width:60px;justify-self:left;transform:translateX(-35px);"
                                 onclick="addInventory(${product.id},${product.inventory})">Add</button>                                    
                            </div>

                            <div class="product-quantity-selector" style='justify-self: end'>
                                
                                <select class="product-dropdown" style="transform: translateX(-15px); height: 36px; width: 45px;" id="product-quantity-dropdown-${product.id}">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                </select>
                            </div>
                        </div>   
                    </div>
                </li>
                `;
            }).join('');
        });
    } 
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
            console.log(data.products);

            productListSS.innerHTML = data.products.map(product => {
                return `
                <li style="display: grid; grid-template-columns: 20% 40% auto;">
                            
                    ${product.name}
                            
                            
                    <div class="product-quantity-selector" style='justify-self: center'>
                        Available Inventory : ${product.inventory}
                    </div>

                    <div style='justify-self: end'>
                        <div style="display: grid; grid-template-columns: auto auto;" >
                            <div style="justify-self: start">
                                <button class="btn btn-outline-dark" id="submit" style="width:60px;justify-self:left;transform:translateX(-35px);"
                                 onclick="addInventory(${product.id},${product.inventory})">Add</button>                                    
                            </div>

                            <div class="product-quantity-selector" style='justify-self: end'>
                                
                                <select class="product-dropdown" style="transform: translateX(-15px); height: 36px; width: 45px;" id="product-quantity-dropdown-${product.id}">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                </select>
                            </div>
                        </div>   
                    </div>
                </li>
                `;
            }).join('');
        });
    } 
});

//Search Bar - 800 Mtr
const searchInputMTR = document.getElementById('mtr800-search-bar');
const productListMTR = document.getElementById('mtr800-product-list');

searchInputMTR.addEventListener('input', () => {
    const query = searchInputMTR.value.trim();

    if (query) {
        fetch(`/search-mtr?query=${query}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.products);

            productListMTR.innerHTML = data.products.map(product => {
                return `
                <li style="display: grid; grid-template-columns: 20% 40% auto;">
                            
                    ${product.name}
                            
                            
                    <div class="product-quantity-selector" style='justify-self: center'>
                        Available Inventory : ${product.inventory}
                    </div>

                    <div style='justify-self: end'>
                        <div style="display: grid; grid-template-columns: auto auto;" >
                            <div style="justify-self: start">
                                <button class="btn btn-outline-dark" id="submit" style="width:60px;justify-self:left;transform:translateX(-35px);"
                                 onclick="addInventory(${product.id},${product.inventory})">Add</button>                                    
                            </div>

                            <div class="product-quantity-selector" style='justify-self: end'>
                                
                                <select class="product-dropdown" style="transform: translateX(-15px); height: 36px; width: 45px;" id="product-quantity-dropdown-${product.id}">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                </select>
                            </div>
                        </div>   
                    </div>
                </li>
                `;
            }).join('');
        });
    } 
});

//Search Bar - Red Poly
const searchInputRP = document.getElementById('rp-search-bar');
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
                <li style="display: grid; grid-template-columns: 20% 40% auto;">
                            
                    ${product.name}
                            
                            
                    <div class="product-quantity-selector" style='justify-self: center'>
                        Available Inventory : ${product.inventory}
                    </div>

                    <div style='justify-self: end'>
                        <div style="display: grid; grid-template-columns: auto auto;" >
                            <div style="justify-self: start">
                                <button class="btn btn-outline-dark" id="submit" style="width:60px;justify-self:left;transform:translateX(-35px);"
                                 onclick="addInventory(${product.id},${product.inventory})">Add</button>                                    
                            </div>

                            <div class="product-quantity-selector" style='justify-self: end'>
                                
                                <select class="product-dropdown" style="transform: translateX(-15px); height: 36px; width: 45px;" id="product-quantity-dropdown-${product.id}">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </div>   
                    </div>
                </li>
                `;
            }).join('');
        });
    } 
});


//Add Inventory
function addInventory(productId,currentInventory){
    const quantityDropdown = document.querySelector(`#product-quantity-dropdown-${productId}`);
    const selectedQuantity = parseInt(quantityDropdown.value);

    console.log(productId);
    const newInventory = selectedQuantity + parseInt(currentInventory)
    
    console.log(newInventory);

    fetch('/add_inventory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          'id': productId,
          'inventory': newInventory,
          }),
      })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        })

    
}