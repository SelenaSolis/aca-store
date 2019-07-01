
let cartItems = [];
//checks if items are in session storage
let sessionCartItems = sessionStorage.getItem("cart");
//if there are items in session storage assigns the to cart array
if(sessionCartItems){
    cartItems = JSON.parse(sessionCartItems);
}

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
                <div><button onclick = 'addToCart(${product.id})'>ADD TO CART</button></div>
                <div id = 'moreInfo${product.id}'></div>
            </div>`;
    })

    if (productsDiv){
        productsDiv.innerHTML = newProd; 
    }
    //counts items in cart session storage
    cartDiv.innerHTML = JSON.parse(sessionStorage.getItem("cart")).length;
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
    //maps through products to find correct product with matching id
    products.map(product => {
        if(product.id === prodId){
            cartItems.push(product);
        }
    })
    //sets items in session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    listProducts(products);
}


function moreInfo(prodId){
    let moreInfoDiv = '';
    let viewProd = products.filter(prod =>
        prod.id === prodId
    )
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
}


