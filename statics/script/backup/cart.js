
    
function cart(data,name){
    var name = `<div class="cart`
    data.forEach(element => {
        content = `<div class = cart mx-2 ${element.name}>
        <div>
        <p class = cart-title><i class = onclik${name} name ${element.name}</p>
        <p class = cart-description> <i class = onclik${name} description ${element.description}</p>
        </div>
         <p class = cart-pro>${element.price}</p>`
        
    });
}