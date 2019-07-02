function listProducts(products){
    let cartDiv = document.getElementById("cart");
    let productsDiv = document.getElementById("products");
    let newProd = '';
    products.map(product =>{
        newProd += `<div id = 'product'>
                <a onclick = 'moreInfo(${product.id})'><div><img src=${product.imgUrl}></div>
                <div><h4 id ='${product.id}'>${product.name}</h4></a></div>
                <div><h5>${product.description}</h5></div>
                <div>${product.price}</div>
                <div>rating: ${product.rating}</div>
                <div><button onclick = 'moreInfo(${product.id})' id = 'moreInfo'>More Information</button></div>
                <div><button onclick = 'addToCart(${product.id})' id='cartButton${product.id}'>ADD TO CART</button></div>
                <div id = 'moreInfo${product.id}'></div>
            </div>`;
    })
    //checks if items are in session storage
    let sessionCartItems = sessionStorage.getItem("cart");
    //if there are items in session storage assigns the to cart array
    sessionCartItems ? (
        cartItems = JSON.parse(sessionCartItems),
        counter = 0,
        cartItems.map(prod => {
            counter = counter + Number(prod.quantity);
        }),
        cartDiv.innerHTML = counter
        ) : (
        cartItems = []
        );
    if (productsDiv){
        productsDiv.innerHTML = newProd; 
    }
}
listProducts(products);

//function filters using search text box
function searchFunc(){
    let searchText = document.getElementById("searchText").value;
    //shows only products matching search
    let filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchText) || prod.description.toLowerCase().includes(searchText));
    listProducts(filteredProducts)
}

//adds items to cart array using id as parameter
function addToCart(prodId){
    let foundProd = products.find(p => p.id === prodId);
    let foundInCart = cartItems.find(p => p.id === prodId);
    if (!foundInCart){
        cartItems.push(foundProd);
        cartItems.find(p => p.id === prodId).quantity = 1;
    }
    else{
        foundInCart.quantity += 1;
    }
    // //sets items in session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    console.log(cartItems);
    listProducts(products);
}


function moreInfo(prodId){
    let moreInfoDiv = '';
    let viewProd = products.filter(prod =>prod.id === prodId)
    listProducts(viewProd);
    let productDiv = document.getElementById(`moreInfo${prodId}`);
    viewProd[0].reviews.map(review =>
        moreInfoDiv += `<div class = 'review'><div>${review.description}</div>
            <div>${review.rating}</div>
            </div>`
        )
    productDiv.innerHTML = moreInfoDiv;
}

function viewCart(){
    listProducts(cartItems);
    cartDiv = document.getElementById("cart");
    cartItems.map(product => {
        let cartButton = document.getElementById(`cartButton${product.id}`);
        cartButton.setAttribute('onClick', `removeCartItem(${product.id});`);
        cartButton.innerHTML = "REMOVE ITEM"
        moreInfoDiv = document.getElementById(`moreInfo${product.id}`)
        moreInfoDiv.innerHTML = `
            <select id = 'qty${product.id}' onchange='changeQuantity(${product.id}, value)'>
            <option value = '1'>1</option>
            <option value = '2'>2</option>
            <option value = '3'>3</option>
            <option value = '4'>4</option>
            <option value = '5'>5</option>
            <option value = '6'>6</option>
            <option value = '7'>7</option>
            <option value = '8'>8</option>
            <option value = '9'>9</option>
            <option value = '10'>10</option>
            </select>
            `;
        document.getElementById(`qty${product.id}`).value = product.quantity;
        document.getElementById(`qty${product.id}`).options[product.quantity - 1].selected = true;
        console.log(cartItems);
    });
}

function changeQuantity(prodId, qty){
    let product = cartItems.find(p => p.id === prodId);
    product.quantity = Number(qty);
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    viewCart();
}

function removeCartItem(prodId){
    let removeProdIdx = cartItems.map(prod =>{return prod.id}).indexOf(prodId);
    cartItems.splice(removeProdIdx, 1);
    //updates session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    viewCart();
}