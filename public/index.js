var myProducts = products;
let productsDiv = document.getElementById("products");
let newProdName = "";


myProducts.map(product =>{
    newProdName += `<div><div><img src=${product.imgUrl}></div><div><h3>${product.name}</h3></div><div>${product.description}</div></div>`;
})
productsDiv.innerHTML = newProdName;


function searchFunc(){
    newProdName = ""
    let searchText = document.getElementById("searchText").value;
    myProducts.map(product =>{
        let name = product.name.toLowerCase();
        let desc = product.description;
        if(name.includes(searchText) || desc.includes(searchText)){
            newProdName += `<div><div><img src=${product.imgUrl}></div><div><h3>${product.name}</h3></div><div>${product.description}</div></div>`;
        }
    })
    productsDiv.innerHTML = newProdName;
}
