function listProducts(products){
    let productsDiv = document.getElementById("products");
    let newProdName = "";
    products.map(product =>{
        newProdName += `<div><div><img src=${product.imgUrl}></div><div><h3>${product.name}</h3></div><div>${product.description}</div></div>`;
    })
    productsDiv.innerHTML = newProdName;
}
listProducts(products);


function searchFunc(){
    let searchText = document.getElementById("searchText").value;
    let filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(searchText) || prod.description.toLowerCase().includes(searchText));
    listProducts(filteredProducts)
}
