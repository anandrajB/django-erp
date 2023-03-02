let model_name;
let data_list = {}
let inventory_type_list = {'rawmaterial':'inventory_rawmaterial','product':'inventory_product'}
let inventory_type;
let inventory_data;
let inventory_url;
let data_from_db;
let update = false
let ware_house;
let token = sessionStorage.getItem('token');
let submit_button = document.getElementById('submit_button');
let messages = document.querySelector('.messages');
let branch_dropdown_data
document.getElementById('inventory-url').setAttribute('href',`${host}/inventory`)
function get_production_data(element){
    model_name = element.value
    // $("#inventory_data").value = ''
    document.getElementById('inventory_data').disabled = false
    if(model_name != '' && model_name in inventory_type_list){
        inventory_type = inventory_type_list[model_name]

    if(model_name == 'rawmaterial'){
        label_name = 'rawmaterial_name'
        text_value = 'rm_name'
    }
    else if(model_name == 'product'){
        label_name = 'product_name'
        text_value = 'product_name' 
    }
    option = `<option selected disabled value="">Select ${label_name}</option>`
    common_drop_down_get(model_name,`inventory_data`,text_value) 
}
    else{
        document.getElementById('inventory_data').innerHTML = '<option value="">-------</option>'
    }
}
async function get_dropdown(){
    branch_dropdown_data = ''
    await get_dropdown_data(drop_down_url,'branch','branch_name',branch_dropdown_data)
    console.log(branch_dropdown_data,'data')
}
get_dropdown()

// $.ajax({
//     url: 'http://127.0.0.1:8000/api/dropdown/',
//     data: {
//         'model': 'branch',
//         'name': 'branch_name',
//     },
//     success: function (data) {
//         option = `<option selected disabled value="">Select Warehouse</option>`
//         for(i=0;i<data.list.length;i++){
//             option += `<option value="${data.list[i].id}">${data.list[i].name}</option>`
//         }
//         $("#form_ware_house").html(option);
//     }
// });
common_drop_down_get('branch',`form_ware_house`,'branch_name') 


async function get_details(element){
    parent = element.parentNode
    console.log(element.parentNode)

    ware_house = parent.querySelector('#form_ware_house').value
    inventory_data = parent.querySelector('#inventory_data').value
    stock = parent.querySelector('#form_stock').value
    console.log(inventory_data,ware_house,'in','ware')
    if(ware_house != '' && inventory_data !=''){
      await get_data();
      console.log('update')
    }
}

function get_data(){
    if(model_name == 'rawmaterials'){
        inventory_url = crud_url+`?model=${inventory_type}&filter_by=rm,warehouse_name&filter_value=${inventory_data},${ware_house}`
    }else if(model_name == 'product'){
        inventory_url = crud_url+`?model=${inventory_type}&filter_by=product,warehouse_name&filter_value=${inventory_data},${ware_house}`
    }
    console.log(inventory_url,'url')
    promise = new Promise(resolve =>     
        fetch(inventory_url,
        {
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
           }).then(data => {
            console.log(data,'dta')
            if(data.status =='success'){
                data_from_db = data.data
                if(data_from_db.length){
                    update = true
                    submit_button.setAttribute('onclick',`submit_data(${data_from_db[0]['id']})`)
                    submit_button.textContent = 'Update'
            submit_button.disabled = false
                if(model_name == 'product'){
                document.getElementById('form_stock').value = data_from_db[0]['product_stock']
                }
                else{
                    document.getElementById('form_stock').value= data_from_db[0]['rm_stock']
                }
            }else{
                update = false
                document.getElementById('form_stock').value = ''
                submit_button.setAttribute('onclick',`submit_data(${null})`)
                console.log('check')
                submit_button.textContent = 'Create'
            }
            }
            resolve()
           }));
    return promise
}

function check_fields(element){
    children = Array.from(element.children)
    flag = true
    children.forEach(element_data => {
        if(element_data.value == ''){
            flag = false
        }
    });

    if(flag){
        submit_button.disabled = false
    }else{
        submit_button.disabled = true
    }
}

function submit_data(id){
    let stock = document.getElementById('form_stock').value
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    body_data = {}
    if(model_name == 'product'){
        body_data['product'] = inventory_data
        body_data['product_stock'] = stock
    }else{
        body_data['rm'] = inventory_data
        body_data['rm_stock'] = stock
    }
    body_data['warehouse_name'] = ware_house

    if(id){
        fetch(crud_url+`?model=${inventory_type}&pk=${id}`,
        {
         method: 'PUT',
         body: JSON.stringify(body_data),
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
             messages.innerHTML = `<p class='text-success'>Inventory updated </p>`
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
    else{
        fetch(crud_url+`?model=${inventory_type}`,
        {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
            }).then(data =>{
                if(data.status == 'success'){
                    document.querySelector('.messages').innerHTML = `<p class='text-success'>Inventory Created </p>`
                }
                else{
                    console.log(data.data)
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                    }
                    // messages.innerHTML = error
                    document.querySelector('.messages').innerHTML = error
                }
    
                console.log(data)
            })
     }
    
}