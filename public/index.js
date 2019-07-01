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
            counter = counter + prod.quantity;
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
    //maps through products to find correct product with matching id
    products.map(product => {
        if(product.id === prodId){
            let inCart = false;
            cartItems.map(prod =>{
                if(prod.id === prodId){
                    inCart = true;
                    prod.quantity = prod.quantity + 1;
                }
            })
            if(!inCart){
                cartItems.push(product);
                product.quantity = 1;
            }
            
        }
    });
    cartItems.map(product =>{

    })
    // //sets items in session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    console.log(cartItems);
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
    cartItems.map(product => {
        let cartButton = document.getElementById(`cartButton${product.id}`);
        cartButton.setAttribute('onClick', `removeCartItem(${product.id});`);
        cartButton.innerHTML = "REMOVE ITEM"
        document.getElementById(`moreInfo${product.id}`).innerHTML = `QTY: ${product.quantity}`; 
    });
}

function removeCartItem(prodId){
    let removeProdIdx = cartItems.map(prod =>{return prod.id}).indexOf(prodId);
    cartItems.splice(removeProdIdx, 1);
    //updates session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    viewCart();
}