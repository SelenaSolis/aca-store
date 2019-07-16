let products = [];
let loggedIn;

function alertFunc(){
    alert("are you still there?")
}

function clearStorage(){
    localStorage.clear();
}

if(loggedIn != 'undefined'){
    loggedIn = true;
}

function loggedInView(){
    let user = JSON.parse(localStorage.getItem('user'));
    let welcomeDiv = document.getElementById('welcome');
    let signUpDiv = document.getElementById('signUp');
    let name = user.email.split('@')[0];
    name = name.toUpperCase()
    welcomeDiv.innerHTML = `Hello, ${name}`
    signUpDiv.style.display = 'none';
}

const asyncLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getItem(key);
    }
};

function getUserFetch(email){
    fetch("https://acastore.herokuapp.com/users")
        .then(response => response.json())
        .then(data => user = data.find(user => user.email == email))
        .then(user => {
            asyncLocalStorage.setItem("user", JSON.stringify(user))
            .then(function(){
                return asyncLocalStorage.getItem('user');
            })
        })
}

function getProductsFetch(){
    fetch("https://acastore.herokuapp.com/products")
    .then(response => response.json())
    .then(data => products = data)
    .then(products => listProducts(products))
}

window.onload = function(){
    timeOutFunction();
    getProductsFetch()
    if(localStorage.getItem('user') && loggedIn == true){
        loggedInView(); 
    }
}

function listProducts(products){
    timeOutFunction();
    let productsDiv = document.getElementById("products");
    let cartDiv = document.getElementById("cart");
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
    productsDiv.innerHTML = newProd + '<div id="subtotal"></div>'

    if(localStorage.getItem("user") != null){
        userStorage = JSON.parse(localStorage.getItem("user"))
        if(userStorage.cartId != null){
            getCartFetch(userStorage.cartId)
            let cartStorage = JSON.parse(localStorage.getItem("cart"));
            let itemsCounter = 0;
            cartStorage.products.map(p => itemsCounter = itemsCounter + Number(p.quantity));
            cartDiv.innerHTML = itemsCounter
        }
    }
    else{
        cartDiv.innerHTML = 0;
    }
}

function filterCategory(cat){
    //if all is selected, displays all products
    if (cat === 'all'){
        listProducts(products);
        return products;
    }
    //filters products depending on category selected
    else{
        let filteredProducts = products.filter(prod => 
            prod.category === cat);
        listProducts(filteredProducts);
        return filteredProducts;
    }
}

function searchFunc(){
    let category = document.getElementById('categories').value;
    
    //assigns search text to variable
    let searchText = document.getElementById("searchText").value;
    searchText.toLowerCase();
    //shows only products matching search
    let filteredProducts = filterCategory(category).filter(prod => 
        prod.name.toLowerCase().includes(searchText) || prod.description.toLowerCase().includes(searchText));
    //lists only filtered products
    listProducts(filteredProducts)
}

function timeOutFunction(){
    var hours = 1; // Reset when storage is more than 24hours
    var minutes = 1;
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
        localStorage.setItem('setupTime', now)
    }
    else {
        if(now-setupTime > minutes*60*1000) {
            localStorage.clear()
            alert("your session timed out");
        }
        if(now-setupTime < minutes*60*1000){
            localStorage.setItem('setupTime', now)
        }
    }   
}

function logIn(){
    let txtEmail = document.getElementById("email");
    let txtPassword = document.getElementById("password");

    timeOutFunction();

    fetch("https://acastore.herokuapp.com/users")
        .then(response => response.json())
        .then(data => user = data.find(user => user.email === txtEmail.value))
        .then(user => {
            if(user.password == txtPassword.value){
                asyncLocalStorage.setItem("user", JSON.stringify(user))
                    .then(function(){
                        loggedInView();
                    })
                if(user.cartId){
                    getCartFetch(user.cartId)
                }
            }
            else{
                alert("try again");
            }
        })
    if(localStorage.getItem('user')){
        return loggedIn = true;
    }
}

class User {
    constructor(email, password, cartId) {
      this.email = email;
      this.password = password;
      this.cartId = cartId;
    }
}

function signUp(){
    let txtPassword = document.getElementById("password");
    let txtEmail = document.getElementById("email");
    
    fetch("https://acastore.herokuapp.com/users")
        .then(response => response.json())
        .then(data => user = data.find(user => user.email == txtEmail.value))
        .then(user => {
            if(user){
                alert("that email address already has an account")
            }
            else{
                let newUser = new User(txtEmail.value, txtPassword.value, null);
                fetch("https://acastore.herokuapp.com/users", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newUser)
                    })
                    .then(response => response.json())
                    .then(data => {
                        asyncLocalStorage.setItem("user", JSON.stringify(data))
                            .then(function(){
                                loggedInView();
                                listProducts(products);
                            })
                    })
                return loggedIn = true;
            }
        })
}

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

function hideReviews(prodId){
    let reviewDiv = document.getElementById(`hiddenReviews ${prodId}`);
    let newRev = `<br>`;
    reviewDiv.innerHTML = newRev;
}

class ItemOrder{
    constructor(quantity, prodId) {
        this.quantity = quantity;
        this.prodId = prodId;
      }
}

class Order{
    constructor(userId, items) {
        this.userId = userId;
        this.items = items;
      }
}

function submitFunc(){
    let cartStorage = JSON.parse(localStorage.getItem('cart'));
    let cartProducts = cartStorage.products
    let items = [];
    items.push(cartProducts.map(p => {
        new ItemOrder(p.quantity, p.id)
    }))
    alert(items);
    let order = new Order(cartStorage.userId, items);

    fetch("https://acastore.herokuapp.com/orders", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(order)
        })
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