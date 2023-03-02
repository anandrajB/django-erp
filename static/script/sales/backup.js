// function product_change(element,model_name){
//     var parent = element.parentNode.parentNode;
//     if(!list_form_items[model_name][parent.id]){
//         list_form_items[model_name][parent.id] ={}
//     }
//     list_form_items[model_name][parent.id]['id'] = element.value
//     childrens = parent.parentNode.childNodes
//     console.log(childrens)
//     product_list = []
//     for(node=0;node<childrens.length;node+=1){
//         div_id = childrens[node].id
//        div = childrens[node].childNodes[0].querySelector('#form_product')
//        options = '<option disabled value="">Select Product </option>'
//        for(i=0; i<dropdown_data.length; i++){
//         if(sales_order_items[div_id] && sales_order_items[div_id]['id'] == String(dropdown_data[i].id)){
//             options += `<option selected value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
//             product_list.push(sales_order_items[div_id]['id'])
//         }
//            else if(!product_list.includes(String(dropdown_data[i].id))){
//            options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
//            }
//        }
//        console.log(options,'option selected')
     
//        div.innerHTML = options
//         // console.log('asd',div,div_id)
//     }
//     check_fields()
// }
// function submit_return_goods(){
//     if(!post_body['customer_id'] || !post_body['date_delivery_expected']){
//         messages.innerHTML = 'fill all fields'
//         return
//     }
//     post_body["sales_order_items_list"] = Object.values(sales_order_items)
//     // table =  document.querySelector('#purchase_request_form').childNodes
//     // last_div = table[1].childNodes[table.length - 1]
//     // if(last_div.querySelector('#form_product').value == '' || last_div.querySelector('#form_quantity').value == ''){
//     //     messages.innerHTML = '<p class="text-warning">fill all fields</p>'
//     //     return 
//     // }
//     // sales_order_items[last_div.id] = {'id':last_div.querySelector('#form_product').value,'quantity':last_div.querySelector('#form_quantity').value}

// //     for(let [key,value] of Object.entries(sales_order_items)){
// // list.push(value)
// //     } 
// // console.log(list,'d',Object.values(sales_order_items))
//     fetch(host_main +'/api/sales-order',
//     {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': 'token '+token,
//                         'Content-Type':'application/json'
//                     },
//                     body : JSON.stringify(post_body)
//                 }).then((response) => {return response.json()}).then(data =>{
//                     console.log(data,'data')
//                     if(data.status == 'success'){
//                         messages.innerHTML = '<p class="text-success">sales order submitted successfully</p>'
//                     }
//                     else{
//                         error = ''
//                         if(typeof(data.data) == Object){
//                         for (const [key, value] of Object.entries(data.data)) {
//                             error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
//                         }
//                         }
//                         else{
//                             error += `<p class='text-danger'> ${data.data} </p>`
//                         }
//                         // messages.innerHTML = error
//                         messages.innerHTML = error
//                     }
//                 })
// }

// function so_input_change(element,key){
//     post_body[key] = element.value
//     console.log()
//     check_fields()
// }


// function check_fields(){
//     console.log('as')
//     // submit_flag = false
//     // if(sales_order_items.length){
//     //     submit_flag = true
//     //     for(let [key,val] of Object.entries(so_form)){
//     //         if(!key in post_body){
//     //             submit_flag = false
//     //             break
//     //         }else if(post_body[key] == ''){
//     //             submit_flag = false
//     //             break
//     //         }
//     //     }
//     //     for(let [key,val] of Object.entries(form_data)){
//     //         if(!key in sales_order_items[0]){
//     //             submit_flag = false
//     //             break
//     //         }else if(sales_order_items[0][key] == ''){
//     //             submit_flag = false
//     //             break
//     //         }
//     //     }
//     // }
//     // if(submit_flag){
//     //     document.getElementById('pr_submit_button').disabled = false
//     //     console.log(submit_flag)
//     // }else{
//     //     document.getElementById('pr_submit_button').disabled = true
//     // }
// }




// let token = sessionStorage.getItem('token');
let input_count=0;

let content;
let sales_order_items = {}

// let customer_id;
// let date_delivery_expected = {}
let dropdown_html;
let form_data = {
    "product":["select"],
"quantity":["input","number"],
"price":["input","number"],
"gst":["input","text"],
"due_date":["input","date"],
"payment_terms":["input","text"],
"freight_charges":["input","number"],
"date_delivery_expected":["input","date"]
}
let so_form = {
    "customer_id":["select","party"],
    "date_delivery_expected":["input","date"]
}
let post_body = {"customer_id":null,"date_delivery_expected":null}
let dropdown_data;
let table,thead,tbody
let product_list = []
let messages = document.querySelector('#messages')
document.getElementById('pr_submit_button').disabled = false
function get_dropdown(model){
    return new Promise((resolve, reject) =>{
        $.ajax({
            url:window.location.protocol + "//" + window.location.host + '/api/dropdownjson/',
            data: {
                'model': model,
                'name': `${model}_name`,
            },
            success: function (data) {
                console.log(data)
                dropdown_data = data.list
                dropdown_html = data.html
                resolve()
            }
        });
    })
}


async function get_list_form(){
    sales_order_form_div = document.createElement('p')
    await get_dropdown('party')
    sales_order_form_div.innerHTML = `
    <label for="party">Customer</label>
    <select name="party" onchange="so_input_change(this,'customer_id')" 
        id="form_customer_id">${dropdown_html}</select>
        <br>
    <label for="delivery_date">Deleivery Date</label>
    <input type="date" name="delivery_date"
        onchange="so_input_change(this,'date_delivery_expected')" id="form_date_delivery_expected">
` 
document.querySelector('#sales_order_form').appendChild(sales_order_form_div)
    // for(let [key,value] of Object.entries(so_form)){
    //     if(value[0] == 'select'){
    //         so_form_data += `<${value[0]} name="${key}" onchange=so_input_change(this,'${key}') id="form_${key}">`
    //         so_form_data += dropdown_html
    //     }
    //     else{
    //         so_form_data += `<${value[0]} name="${key}" type=${value[1]} onchange=so_input_change(this,'${key}') id="form_${key}">`
    //     }
    //     so_form_data += `</${value}>`
    // }
    // sales_order_form_div.innerHTML = so_form_data
// document.querySelector('#sales_order_form').appendChild(sales_order_form_div)
 table = document.createElement('table');
thead = document.createElement('thead');
headings = `<tr>`
for(let [key,value] of Object.entries(form_data)){
    headings += `<th>${key}</th>`
}
headings += `<th>action</th>`
headings += `</tr>`
thead.innerHTML = headings
tbody = document.createElement('tbody');
table.appendChild(thead);
table.appendChild(tbody)
document.querySelector('#sales_order_form').appendChild(table)
await get_dropdown('product')
 add_new_row(null)
}

get()
function add_new_row(element){
    if(element){
                parent = element.parentNode.parentNode;
                // action_td = parent.querySelector('#action_row')
                element.innerHTML = `<i class="bi bi-trash"></i>`
                element.setAttribute('onclick',`delete_row(this,${parent.id})`)
                
    for(let [key,value] of Object.entries(form_data)){
        if(parent.querySelector(`#form_${key}`).value == ''){
                        messages.innerHTML = `<p class="text-warning">fill ${key} field</p>`
                        return
                    }
    }

    if(Object.values(sales_order_items).length==dropdown_data.length){
        messages.innerHTML = '<p class="text-warning">Products all are added</p>'
        return 
    }
    }

    options = '<option disabled selected value="">Select Product </option>'
    console.log(product_list,'lis')
for(i=0; i<dropdown_data.length; i++){
    if(!product_list.includes(String(dropdown_data[i].id))){
    options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
    }
}
    input_count +=1
    form_div = document.createElement('tr')
    form_div.setAttribute('id',`${input_count}`)
    for(let [key,value] of Object.entries(form_data)){
        let td = document.createElement('td')
       
        if(value[0] == 'select'){
            content = `<${value[0]} name="${key}" onchange=${key}_change(this) id="form_${key}">`
            content += options
        }
        else{
            content = `<${value[0]} name="${key}" type=${value[1]} onchange=input_change(this,'${key}') id="form_${key}">`
        }
        content += `</${value}>`
        td.innerHTML = content
        form_div.appendChild(td)
    }
    td = document.createElement('td')
    td.innerHTML = '<button class="btn btn-secondary" id="add_new" onclick=add_new_row(this)><i class="bi bi-plus"></i></button>'
    form_div.appendChild(td)
    // if(del_button){
        // td = document.createElement('td')
        // td.innerHTML = `<button class="btn btn-secondary" id="delete_row" disabled onclick=delete_row(this,${input_count})><i class="bi bi-trash"></i></button>`
        // form_div.appendChild(td)
    // }
    tbody.appendChild(form_div)
    // $("#form_product").html(options);
}
function product_change(element){
    product_list.push(element.value)
    var parent = element.parentNode.parentNode;
    if(!sales_order_items[parent.id]){
        sales_order_items[parent.id] ={}
    }
    sales_order_items[parent.id]['id'] = element.value
    childrens = parent.parentNode.childNodes
    console.log(childrens)
    product_list = []
    for(node=0;node<childrens.length;node+=1){
        div_id = childrens[node].id
       div = childrens[node].childNodes[0].querySelector('#form_product')
       options = '<option disabled value="">Select Product </option>'
       for(i=0; i<dropdown_data.length; i++){
        if(sales_order_items[div_id] && sales_order_items[div_id]['id'] == String(dropdown_data[i].id)){
            options += `<option selected value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
            product_list.push(sales_order_items[div_id]['id'])
        }
           else if(!product_list.includes(String(dropdown_data[i].id))){
           options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
           }
       }
       console.log(options,'option selected')
     
       div.innerHTML = options
        // console.log('asd',div,div_id)
    }
    check_fields()
}
function input_change(element,key){
    parent = element.parentNode.parentNode;
    if(!sales_order_items[parent.id]){
        sales_order_items[parent.id] ={}
    }
    sales_order_items[parent.id][key] = element.value
    check_fields()
}

function submit_return_goods(){
    if(!post_body['customer_id'] || !post_body['date_delivery_expected']){
        messages.innerHTML = 'fill all fields'
        return
    }
    post_body["sales_order_items_list"] = Object.values(sales_order_items)
    // table =  document.querySelector('#purchase_request_form').childNodes
    // last_div = table[1].childNodes[table.length - 1]
    // if(last_div.querySelector('#form_product').value == '' || last_div.querySelector('#form_quantity').value == ''){
    //     messages.innerHTML = '<p class="text-warning">fill all fields</p>'
    //     return 
    // }
    // sales_order_items[last_div.id] = {'id':last_div.querySelector('#form_product').value,'quantity':last_div.querySelector('#form_quantity').value}

//     for(let [key,value] of Object.entries(sales_order_items)){
// list.push(value)
//     } 
// console.log(list,'d',Object.values(sales_order_items))
    fetch(host_main +'/api/sales-order',
    {
                    method: 'POST',
                    headers: {
                        'Authorization': 'token '+token,
                        'Content-Type':'application/json'
                    },
                    body : JSON.stringify(post_body)
                }).then((response) => {return response.json()}).then(data =>{
                    console.log(data,'data')
                    if(data.status == 'success'){
                        messages.innerHTML = '<p class="text-success">sales order submitted successfully</p>'
                    }
                    else{
                        error = ''
                        if(typeof(data.data) == Object){
                        for (const [key, value] of Object.entries(data.data)) {
                            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                        }
                        }
                        else{
                            error += `<p class='text-danger'> ${data.data} </p>`
                        }
                        // messages.innerHTML = error
                        messages.innerHTML = error
                    }
                })
}

function so_input_change(element,key){
    post_body[key] = element.value
    console.log()
    check_fields()
}

function delete_row(element,id){
    delete sales_order_items[id]
    parent = element.parentNode.parentNode;
    parent_tbody = parent.parentNode
    parent_tbody.removeChild(parent)
    check_fields()
}

function check_fields(){
    console.log('as')
    // submit_flag = false
    // if(sales_order_items.length){
    //     submit_flag = true
    //     for(let [key,val] of Object.entries(so_form)){
    //         if(!key in post_body){
    //             submit_flag = false
    //             break
    //         }else if(post_body[key] == ''){
    //             submit_flag = false
    //             break
    //         }
    //     }
    //     for(let [key,val] of Object.entries(form_data)){
    //         if(!key in sales_order_items[0]){
    //             submit_flag = false
    //             break
    //         }else if(sales_order_items[0][key] == ''){
    //             submit_flag = false
    //             break
    //         }
    //     }
    // }
    // if(submit_flag){
    //     document.getElementById('pr_submit_button').disabled = false
    //     console.log(submit_flag)
    // }else{
    //     document.getElementById('pr_submit_button').disabled = true
    // }
}