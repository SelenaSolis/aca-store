
//lists products
function listProducts(products){
    let cartDiv = document.getElementById("cart");
    let productsDiv = document.getElementById("products");
    let newProd = '';
    //maps through products and creates a div for each product
    products.map(product =>{
        newProd += `<div id = 'product'>
                <a onclick = 'moreInfo(${product.id})'><div><img src=${product.imgUrl}></div>
                <div><h4 id ='${product.id}'>${product.name}</h4></a></div>
                <div id='hiddenReviews ${product.id}' class='hiddenReviews'><br></div>
                <div><h5>${product.description}</h5></div>
                <div>${product.price}</div>
                <div id='rating ${product.id}' onmouseover='displayReviews(${product.id})' onmouseout = 'hideReviews(${product.id})'>
                    rating: ${product.rating}
                </div>
                <div><button onclick = 'addToCart(${product.id})' class='cartButton' id='cartButton${product.id}'>Add To Cart</button></div>
                <div><button onclick = 'moreInfo(${product.id})' id = 'moreInfo'>More Information</button></div>
                <div id = 'moreInfo${product.id}'></div>
            </div>`;
    })
    //checks if there are items in session storage
    let sessionCartItems = sessionStorage.getItem("cart");
    //if there are items in session storage, assigns the to cart array
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
        productsDiv.innerHTML = newProd + '<div id="subtotal"></div>';
    }
    
}
//calls function to list all products
listProducts(products);

//function filters using search text box
function searchFunc(){
    //assigns search text to variable
    let searchText = document.getElementById("searchText").value;
    searchText.toLowerCase();
    //shows only products matching search
    let filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchText) || prod.description.toLowerCase().includes(searchText));
    //lists only filtered products
    listProducts(filteredProducts)
}

//adds items to cart array using id as parameter
function addToCart(prodId){
    //finds the requested product in the products array and assigns to variable
    let foundProd = products.find(p => p.id === prodId);
    //finds product object in cart
    let foundInCart = cartItems.find(p => p.id === prodId);
    //if items is in not in cart push to cart array
    if (!foundInCart){
        cartItems.push(foundProd);
        cartItems.find(p => p.id === prodId).quantity = 1;
    }
    // if item is in cart, adjust quantity
    else{
        foundInCart.quantity += 1;
    }
    // //sets items in session storage
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    //lists all products
    listProducts(products);
}

//function to display more information on a product
function moreInfo(prodId){
    //assigns empty string  
    let moreInfoDiv = '';
    //filters array to only the product requested
    let viewProd = products.filter(prod =>prod.id === prodId)
    listProducts(viewProd);
    //allows access to the moreInfo div to display all reviews and ratings
    let productDiv = document.getElementById(`moreInfo${prodId}`);
    viewProd[0].reviews.map(review =>
        moreInfoDiv += `<div class = 'review'><div>${review.description}</div>
            <div>${review.rating}</div>
            </div>`
        )
    productDiv.innerHTML = moreInfoDiv;
}

//function displays cart items and quantities
function viewCart(){
    listProducts(cartItems);
    //variable declaration for total cost
    let subtotal = 0;
    //variable declaration for total item count
    let itemCounter = 0;
    //maps through items in cart
    cartItems.map(product => {
        //changes functionality of the cart button to remove from cart
        let cartButton = document.getElementById(`cartButton${product.id}`);
        cartButton.setAttribute('onClick', `removeCartItem(${product.id});`);
        cartButton.innerHTML = "REMOVE ITEM"
        //more info div to contain drop down for quantity of a particular item
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
        //sets default selected value in drop down menu to the current quantity
        document.getElementById(`qty${product.id}`).options[product.quantity - 1].selected = true;
        //variable stores the price as a float
        let priceFloat = Number(product.price.slice(1, product.price.length));
        //updates total item count variable
        itemCounter += Number(product.quantity);
        //updates subtotal variable
        subtotal += priceFloat * Number(product.quantity);
    });
    //make sure subtotal is displayed in correct $ format
    subtotal = subtotal.toFixed(2);
    //changes style of subtotal div to display current total
    let subtotalDiv = document.getElementById('subtotal');
    subtotalDiv.style.border = '1px solid black';
    subtotalDiv.style.height = '100px'
    subtotalDiv.style.width = '250px'
    subtotalDiv.innerHTML = `subtotal (${itemCounter} items): <font color='darkRed'><b>$${subtotal}</b></font>
        <div><button id='checkoutButton' onclick='checkoutForm()'>checkout</button><div>
        `;
}

//function called when quantity is changed via the drop down menu
function changeQuantity(prodId, qty){
    let product = cartItems.find(p => p.id === prodId);
    product.quantity = Number(qty);
    //updates session storage if items are added
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    viewCart();
}

//function called in cart view
//function removes item from cart
function removeCartItem(prodId){
    let removeProdIdx = cartItems.map(prod =>{return prod.id}).indexOf(prodId);
    cartItems.splice(removeProdIdx, 1);
    //updates session storage if item is removed
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    viewCart();
}

//function called when category is changed via dropdown menu on homepage
function filterCategory(cat){
    //if all is selected, displays all products
    if (cat === 'all'){
        listProducts(products);
    }
    //filters products depending on category selected
    else{
        let filteredProducts = products.filter(prod => 
            prod.category === cat);
        listProducts(filteredProducts);
    }
}

//function called on mouse over of ratings div
//dislays first 3 reviews for each product
function displayReviews(prodId){
    product = products.find(p => p.id === prodId);
    let reviewDiv = document.getElementById(`hiddenReviews ${prodId}`);
    let newRev = '';
    for(i=0; i<3; i++){
        if(product.reviews[i]){
            newRev += `<div class = 'review'><div>${product.reviews[i].description}</div>
            <div>${product.reviews[i].rating}</div>
            </div>`
        }
    }
    reviewDiv.innerHTML = newRev;
}

//functon called on mouse out of ratings div
//hides reviews
function hideReviews(prodId){
    let reviewDiv = document.getElementById(`hiddenReviews ${prodId}`);
    let newRev = `<br>`;
    reviewDiv.innerHTML = newRev;
}

//function called on submit of checkout information
//displays alert that purchase was successful
function submitFunc(){
    alert("We have received your order!");
}

//function called when customer clicks checkout button
//displays form for data entry
function checkoutForm(){
    let productsDiv = document.getElementById("products");
    let form = `<form >
            First name:<br>
            <input type="text" name="firstname">
            <br>
            Last name:<br>
            <input type="text" name="lastname">
            <br>
            Email:<br>
            <input type="text" name="email">
            <br>
            <input type="submit" value="Place Order" onclick='submitFunc()'>
        </form> `
    productsDiv.innerHTML = form;
}