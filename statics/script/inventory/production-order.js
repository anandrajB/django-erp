token = sessionStorage.getItem('token');
existing_po = []
// existing_po_ids = []
production_no = 0;
let production_order_list ={}
date_request = new Date()
let bodydata = {}
let sub_production_flag = false
let master_production_no;
date_request_string = `${date_request.getDate()}/${date_request.getMonth()}/${date_request.getFullYear()}`
production_type_choices = ['internal','for_sales_order']
let product_id;
let parts_list = []
let product_dropdown_list = []
let product_dropdown_html = ''
let bom_datas
let sales_order_no
let product_quantity
let messages = document.querySelector('.messages')
let rm_inventory;
let product_inventory;

let production_order_form_data = {
    'production_no': {'input':"text","label":"production number"},
    'date_request' : {'input':'text','label':'date request'},
    'production_type' : {'input':'select','label':'production type'},
    'master_production_no':{'input':'input','label':'master production number','type':'number',},
    'sales_order_no':{'input':'input','label':'sales order number','type':'number'},
    'product':{'input':'select','label':'product','model':'product'},
    'parts':{'input':'select','label':'parts'},
    'all_parts':{'input':'input','label':'all parts','type':'checkbox'},
    'quantity':{'input':'input','label':'quantity','type':'number'}
}
let bom_form_data = {
    'rm_type' : {'input':'text',"label":'raw material type','value':[]},
    'rm_idname':  {'input':'text','label':'raw material name',"value":[]},
    'measured_unit':{'input':'text','label':'measurement unit','value':[]},
    'quantity':{'input':'text','label':'quantity','value':[]},
    'available_stock':{'input':'text','label':'stock','value':[]},
    'required_action':{'input':'select','label':'required action','options':['sub-production','purchase-request']},
    'action_quantity':{'input':'input','label':'quantity to purchase or produce'}
}

function available_stock(){
    fetch(host_main +`/api/get?model=inventory_rawmaterial`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data.data,'as')
        rm_inventory ={}
        data.data.forEach(element=>{
            rm_inventory[element.rm] = element
        })

    })

    fetch(host_main +`/api/get?model=inventory_product`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data.data,'as')
        product_inventory = {}
        data.data.forEach(element=>{
            product_inventory[element.product] = element
        })

    })
}
available_stock()
async function production_order_form_get(id){
    form = ''
    console.log('sad')
    action_button = `<button class='btn btn-sm btn-primary' onclick="create_production_order('wait_for_rm',${null})">Wait for SFG / Raw material</button>
    <button class='btn btn-sm btn-primary' onclick="create_production_order('release',${null})">Release to Production</button>
    `
    if(id){
       current_production = production_order_list[id]
       if(current_production.status == 'awaiting_raw_material'){
        action_button = `<button class='btn btn-sm btn-primary' onclick="create_production_order('release',${id})">Release to Production</button>`
       }
       else{
        action_button = `<button class='btn btn-sm btn-primary' onclick="create_production_order('wait_for_rm',${id})">Wait for SFG / Raw material</button>
        <button class='btn btn-sm btn-primary' onclick="create_production_order('release',${id})">Release to Production</button>
        `
       }
    }
    document.querySelector('.submit-button').innerHTML = action_button
    for(let [key,value] of Object.entries(production_order_form_data)){
        console.log('sa',key,value)
        form += `<label>${value.label}</label>`
        if(value['input'] == 'select'){
            form += `<select class='form-select' id='form_${key}'></select>`
            if(value['options']){
                form += `<option value=''> Select ${key}</option>`
                for(let i;i<value['options'].length;i++){
                    form += `<option value=${value['options'][i]}>${value['options'][i]}</option>`
                }
            }
        }else if(value['input'] == 'text'){
            form += `  :<p id=form_${key}></p>`
        }
        else{
            form += `<${value['input']} class='form-control' type=${value['type']} id='form_${key}'></${value['input']}>`
        }
    }
    form += `<button class='btn btn-sm btn-primary' onclick="get_bom('bom-details')">Bill of materials</button>`
    form += '<div id="bom-details">'
    document.querySelector('#production-order-form').innerHTML = form
    document.querySelector('#form_all_parts').setAttribute('class','form-check-input')

 await ramdom_production_number()
 document.querySelector('#form_production_no').innerHTML =production_no
 document.querySelector('#form_date_request').innerHTML = date_request_string

 if(sub_production_flag){
    master_production_no = production_order_list[id].master_production_no
    if(!production_type_choices.includes('sub_production')){
        production_type_choices.push('sub_production')
    }
    document.getElementById('form_sales_order_no').disabled =true

 }else{
    master_production_no = production_no
    if(production_type_choices.includes('sub_production')){
        production_type_choices.splice('sub_production',1)
    }
    document.getElementById('form_sales_order_no').disabled = true
 }
 document.querySelector('#form_sales_order_no').setAttribute('onchange','sales_order_change(this)')
 let options = '<option selected disabled value="">Select production type</option>'
 for(let [key,value] of Object.entries(production_type_choices)){
    options += `<option value=${value}>${value}</option>`
 }
 document.querySelector('#form_production_type').innerHTML = options
 document.querySelector('#form_master_production_no').value = master_production_no
 await product_dropdown()
 document.querySelector('#form_product').innerHTML = product_dropdown_html
 document.querySelector('#form_product').setAttribute('onchange','product_change(this)')
 document.querySelector('#form_production_type').setAttribute('onchange','production_type_change(this)')

//  document.querySelector('#')
}



function ramdom_production_number(){
   return fetch(host_main+'/api/production-order',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data.data,'as')
        if(data.data.length){
            production_no = 0
            data.data.forEach(element=>{
                if(element.status == 'awaiting_raw_material' || element.status == 'initiate sub-production'){
                    production_order_list[element.production_no] = element
                }
                
                if(production_no < element.production_no){
                    production_no = element.production_no
                }
            })
        }
        production_no += 1
    })
}

function product_dropdown(){
   return fetch(drop_down_url +`?model=product&name=product_name`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data.data,'as')
        product_dropdown_html = data.html        
    })
}

function production_type_change(element){
    // console.log(element.value ,element.value == 'for_sales_order','sakles')
    if(element.value == 'for_sales_order'){
        document.getElementById('form_sales_order_no').disabled =false
    }else{
        document.getElementById('form_sales_order_no').disabled = true
    }
}

function sales_order_change(element){
    sales_order_no = element.value
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    messages.innerHTML = ''
    fetch(host_main + `/api/sales-order?pk=${sales_order_no}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data.data,'as')
        let options = '<option selected disabled value="">Select production type</option>'
    if(data.data['sales_order_items_get'] && data.data['sales_order_items_get'].length){
        data.data['sales_order_items_get'].forEach(item =>{
        product_dropdown_list.push(item.product_get)
        if(item.product_get){
           options += `<option value=${item.product_get.id}>${item.product_get.name}</option>`
        }
    })
    document.querySelector('#form_product').innerHTML = options
}else if(data.status != 'success'){
    messages.innerHTML = `<p class='text-warning'>give a valid sales order number</p>`
}
    })
}


function product_change(element){
    product_id = element.value
    // /api/pf_dropdown?id=2
    messages.innerHTML = ''
    fetch(crud_url+`?model=product&pk=${element.value}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data,'s')
        if(data.status && data.status != 'success'){
            messages.innerHTML = `<p class='text-warning'>give valid product name</p>`
        }else if(data['multiple_parts']){
            parts_list = data['parts']
            let options = '<option selected disabled value="">Select a part</option>'
            if(data['parts'] && data['parts'].length){
                for(let i = 0; i < parts_list.length; i++){
           options += `<option value=${parts_list[i]}>${parts_list[i]}</option>`
                }
            }
            document.querySelector('#form_parts').innerHTML = options
            document.getElementById('form_parts').disabled = false
            document.getElementById('form_all_parts').disabled = false
        }
        else{
            document.getElementById('form_parts').disabled = true
            document.getElementById('form_all_parts').disabled = true
        }

    })
}
status_list = {'release':'Release to Production','wait_for_rm':'Awaiting SFG/Raw material'}


