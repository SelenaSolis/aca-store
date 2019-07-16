function getCartFetch(cartId){
    fetch(`https://acastore.herokuapp.com/carts/${cartId}`)
        .then(response => response.json())
        .then(data => {
            asyncLocalStorage.setItem("cart", JSON.stringify(data))
            .then(function(){
                return asyncLocalStorage.getItem('cart');
            })
        })
}

function addToCart(prodId){
    timeOutFunction();

    class CartItem{
        constructor(id, price, quantity, imgUrl, name, description) {
            this.id = id;
            this.price = price;
            this.quantity = quantity;
            this.imgUrl = imgUrl;
            this.name = name;
            this.description = description;
          }
    }

    let userStorage = JSON.parse(localStorage.getItem('user'))
    let foundProd = products.find(p => p.id === prodId);
    
    if(!userStorage.cartId){
        let cart = [];
        let foundProd = products.find(p => p.id === prodId);
        let product = new CartItem(foundProd.id, foundProd.price, 1, foundProd.imgUrl, foundProd.name, foundProd.description)
        cart.push(product);

        fetch("https://acastore.herokuapp.com/carts",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId: userStorage.id, products: cart})
        })
        .then(response => response.json())
        .then(data => {
            asyncLocalStorage.setItem("cart", JSON.stringify(data))
            .then(function(){
                return asyncLocalStorage.getItem("cart");
            })
            fetch(`https://acastore.herokuapp.com/users/${userStorage.id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: userStorage.email, password: userStorage.password, cartId: data.id})
            })
            .then(response => response.json())
            .then(data =>{
                    asyncLocalStorage.setItem("user", JSON.stringify(data))
                        .then(function(){
                            listProducts(products);
                        })
                })
        })      
    }
    else{
        let cartStorage = JSON.parse(localStorage.getItem('cart'))
        let cartProducts = cartStorage.products;
        let foundInCart = cartProducts.find(p => p.id === prodId);
        if (!foundInCart){
            let cartItem = new CartItem(foundProd.id, foundProd.price, 1, foundProd.imgUrl, foundProd.name, foundProd.description)
            cartProducts.push(cartItem);
        }
        else{
            let quantity = Number(foundInCart.quantity);
            foundInCart.quantity = quantity + 1;
        }
        fetch(`https://acastore.herokuapp.com/carts/${cartStorage.id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ userId: userStorage.id, products: cartProducts})
            })
            .then(response =>response.json())
            .then(data => {
                asyncLocalStorage.setItem("cart", JSON.stringify(data))
                    .then(function(){
                        listProducts(products);
                    })
            })
    }
}

function viewCart(){
    let cartStorage = localStorage.getItem("cart");
    if(cartStorage){
        cartStorage = JSON.parse(cartStorage)
        cartProducts = cartStorage.products;
    }
    else{
        cartProducts = [];
    }
    listProducts(cartProducts);
    //variable declaration for total cost
    let subtotal = 0;
    //variable declaration for total item count
    let itemCounter = 0;
    //maps through items in cart
    cartProducts.map(product => {
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

function changeQuantity(prodId, qty){
    let cartStorage = JSON.parse(localStorage.getItem("cart"));
    let cartItems = cartStorage.products
    let product = cartItems.find(p => p.id === prodId);
    product.quantity = Number(qty);
    fetch(`https://acastore.herokuapp.com/carts/${cartStorage.id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: cartStorage.userId, products: cartItems})
        })
        .then(response => response.json())
        .then(data => {
            asyncLocalStorage.setItem("cart", JSON.stringify(data))
                .then(function(){
                    viewCart();
                })
        }) 
}

function removeCartItem(prodId){
    let cartStorage = JSON.parse(localStorage.getItem("cart"));
    let cartProducts = cartStorage.products
    let productIdx = cartProducts.map(p => p.id).indexOf(prodId);
    cartProducts.splice(productIdx, 1);
    fetch(`https://acastore.herokuapp.com/carts/${cartStorage.id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: cartStorage.userId, products: cartProducts})
        })
        .then(response => response.json())
        .then(data => {
            asyncLocalStorage.setItem("cart", JSON.stringify(data))
                .then(function(){
                    viewCart();
                })
        })
}
