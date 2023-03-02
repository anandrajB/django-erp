let host_url = window.location.protocol + "//" + window.location.host
let product_url = host_url + '/api/product/'
// let data_list;
let token = sessionStorage.getItem('token')
let product_container = document.querySelector('.product-container')
let product_data = null
let multi_parts_input = `   <label class="form-check-label" for="multi_parts">multiple_parts</label>
<br>
<div class="multiparts-check-container">
    <input type="checkbox" onchange=check_multipart(this) name="" id="multi_parts">
    <span class="check-box-text">Add Multiple Parts</span>
</div>`

let add_part_input = `<div class="input-group mb-3">
<input type="text" class="form-control">
<button class="btn btn-outline-secondary" type="button" id="button-addon2">
<span class='add-img-div'><img class="notify-img" src="/media/assets/header/+.svg" /> </span>
</button>
</div>`

function filter_data(element){
    lowerkeyword = element.value.toLowerCase()
// displayArray= data_list.filter(obj =>Object.keys(obj).some(key => obj[key.toLowerCase()].includes(lowerkeyword)))
if(element.value){
    displayArray = product_data.filter(obj => Object.keys(obj).some(key => String(obj[key.toLowerCase()]).includes(lowerkeyword)))
}else{
    displayArray = product_data
}
if(displayArray.length){
    container.innerHTML = create_table(displayArray,model_name,get_data,'common')
}else{
    container.innerHTML =''
}
    console.log('filtered -data',displayArray)
}


document.querySelector('#multipart-form-div').innerHTML = multi_parts_input

let parts = []
messages =  document.querySelector('.product-messages')
$(document).ready(function(){ 
    if(!token){
   return window.location.href = '/login';
   }})
function product_get(){

    fetch(crud_url+'?model=product',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data)
        product_data = data.data;
        // document.querySelector('#productModal').innerHTML = form_input
        table = ''
        messages.innerHTML = ''
        if(product_data.length){
table = create_table(product_data,'product');
// document.getElementById('productButton').setAttribute('onclick',`add_product(${null})`)
        }
product_container.innerHTML = table;

    })
}
product_get();


fetch( `${host}/api/dropdown/?model=currency`,{
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'token '+ token
    }
}).then(res =>{
    return res.json()
}).then(data =>{
    document.querySelectorAll('#form_currency').innerHTML = data.html
})


// common_drop_down_get('currency',`form_currency`,'name') 
// get_dropdown('currency')

// get_dropdown(key)
function productEdit(index,event){
    messages.innerHTML = '';
   
    // document.getElementById('productButton').setAttribute('onclick',`add_product(${index})`)
    console.log(event.target.parentElement.parentElement)
    var parent = event.target.parentElement.parentElement
    var name=parent.querySelector('#product_name').innerHTML
    var type = parent.querySelector('#product_type').innerHTML
    console.log(type,'type')
    var min_stock = parent.querySelector('#min_stock').innerHTML
    var min_price = parent.querySelector('#minimum_price').innerHTML
    var max_price = parent.querySelector('#maximum_price').innerHTML
    var multi_part = parent.querySelector('#multiple_parts').innerHTML
    var currency = parent.querySelector('#currency').childNodes[0].id
    console.log(parent.querySelector('#parts').innerHTML,'con',multi_part,'pa')
    if(parent.querySelector('#parts').innerHTML != '-'){
    parts = (parent.querySelector('#parts').childNodes[0].id).split(',')
    
    }else{
        parts=[]
    }
    console.log(typeof parts)  
    document.getElementById('products_name').value=name
    document.getElementById('products_type').value = String(type).toLowerCase()
    document.getElementById('min_price').value = min_price
    document.getElementById('max_price').value = max_price
    document.getElementById('minimum_stock').value = min_stock
    document.getElementById('form_currency').value = currency
    console.log(String(multi_part).toLocaleLowerCase())
    if(String(multi_part).toLocaleLowerCase() == 'true'){
    document.getElementById('multi_parts').checked = true
    document.getElementById('add_part-div').style.display = 'block'
    let parts_content = ''
    for(i=0;i<parts.length;i++){
        console.log(parts[i])
        parts_content += `<p>${parts[i]} <button onclick=remove_part(${i})><i class="bi bi-trash"></i></button></p>`
    }
    parts_content += ''
    console.log(parts_content)
    document.querySelector('.parts-list').innerHTML = parts_content
    // document.getElementById('productButton').disabled = false
}else{
    document.getElementById('multi_parts').checked = false
    document.querySelector('.parts-list').innerHTML = ''
    document.getElementById('add_part-div').style.display = 'none'

}

    // submit_button.setAttribute('onclick',`create_dept(${id})`)
}
function add_product_show(){
    messages.innerHTML = ''
    document.getElementById('products_name').value= ''
    document.getElementById('products_type').value = ''
    document.getElementById('min_price').value = ''
    document.getElementById('max_price').value = ''
    document.getElementById('minimum_stock').value = ''
    document.getElementById('form_currency').value = ''
    parts = []
    document.getElementById('multi_parts').checked = false
    document.getElementById('add_part-div').style.display = 'none'
    // document.getElementById('productButton').disabled = true
    document.querySelector('.parts-list').innerHTML = ''
    // document.getElementById('productButton').setAttribute('onclick',`add_product(${null})`)
}
function add_product(id){
    let product_name = document.getElementById('products_name').value;
    let product_type = document.getElementById('products_type').value;
    let max_price = document.getElementById('max_price').value;
    let min_price = document.getElementById('min_price').value;
    let stock = document.getElementById('minimum_stock').value;
    let multi_parts = document.getElementById('multi_parts').checked;
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let currency = document.getElementById('form_currency').value;
    token = sessionStorage.getItem('token');
    console.log(product_name,product_type,max_price,min_price,stock,multi_parts)
    post1 = JSON.stringify({ 'product_name': product_name, 'product_type': product_type,'currency':currency, 'min_stock': stock, 'maximum_price': max_price, 'minimum_price': min_price, 'multiple_parts': multi_parts,'parts':parts})
    console.log(post1)
    if(id==null){
            fetch(crud_url+'?model=product',
                {
                    method: 'POST',
                    body: post1.toLocaleLowerCase(),
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                        'Authorization': 'token' + ' ' + token,
                    },
                })
                .then(response =>{ 
                    console.log(response)
                  
                    if(response.status ==201 ){
                       
                        product_get()
                        messages.innerHTML = `<p class='text-success'> product created </p>`
                    }
                    else{
                        error = ''
                        for (const [key, value] of Object.entries(data.data)) {
                            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                        }
                       messages.innerHTML = error
                    }
                    })
    }else{
        fetch(crud_url+'?model=product'+`&pk=${id}`,
       {
        method: 'PUT',
        body: post1.toLocaleLowerCase(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
            'X-CSRFToken': csrftoken
        }
       
    })
    .then(response =>{ 
        console.log(response)
        return response.json()
       }).then(data => {
        console.log(data)
        if(data.status == 'success'){
            product_get()
            messages.innerHTML = `<p class='text-success'>Product updated </p>`
        }
        else{
            console.log(data.data)
            error = ''
            for (const [key, value] of Object.entries(data.data)) {
                error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
            }
            // messages.innerHTML = error
            messages.innerHTML = error
        }

    })
    }
}



function add_parts(element){
    console.log(element.parentElement.children[0])
    let part = (element.parentElement.children[0]).value
    if(part != ''){
        parts.push(part);
        console.log(parts);
        element.parentElement.children[0].value = ''
    }
    let parts_content = ''
    for(i=0;i<parts.length;i++){
        parts_content += `<p>${parts[i]} <button onclick=remove_part(${i})><i class="bi bi-trash"></i></button></p>`
    }
    parts_content += ''
    console.log(parts_content)
    document.querySelector('.parts-list').innerHTML = parts_content
}

function remove_part(index){
    parts.splice(index,1)
    let parts_content = ''
    for(i=0;i<parts.length;i++){
        parts_content += `<p>${parts[i]} <button onclick=remove_part(${i})><i class="bi bi-trash"></i></button></p>`
    }
    parts_content += ''
    console.log(parts_content)
    document.querySelector('.parts-list').innerHTML = parts_content
}

function check_multipart(element){
    console.log(element,element.checked)

    if(element.checked == true){
        document.querySelector('#multipart-form-div').innerHTML = add_part_input
    }else{
        document.querySelector('#multipart-form-div').innerHTML = multi_parts_input
        document.getElementById('add_part-div').style.display = 'none'
    }
}
function check_allfilled(element,len){
    // console.log(element)
    flag = true
    for(i=1;i<=len;i++){
        // console.log(element.children[i].type)
        if(element.children[i].value == ''){
            flag = false
        }
    }
    if(flag){
        // document.getElementById('productButton').disabled = false
    }else{
        // document.getElementById('productButton').disabled = true
    }
}

function productDelete(id){
    // $('#deleteModal').modal('show')
      document.getElementById("yes").onclick=function(){
        fetch(crud_url+'?model=product'+`&pk=${id}`,
        {
         method: 'DELETE',
         headers: {
             'Authorization': 'token' + ' ' + token,
         }
     })
     .then(response =>{ 
         console.log(response)
         if(response.status==200){
            product_get()
            }
            else{
                document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
            }
        })
      }
     
}
