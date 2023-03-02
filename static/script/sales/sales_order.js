let sales_orders_container = document.querySelector('.sales-orders')
let sales_orders_list = {}
let sales_edit_list = {}

let customer_id;
let bodydata = {}
let today = new Date();
let sales_order_no
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
document.querySelector('#sales-url').href = `${host_main}/inventory?model_name=sales`
today = yyyy + '-' + mm + '-' + dd ;
let list_form_data_so = {    "product":{'input':"select","label":"product","model":"product",'onchange':`max_and_min_price_set(this,'unit_price','product')`,"onchange_for_edit":`max_and_min_price_set(this,'unit_price','product','edit')`},
"quantity_ordered":{"input":"input","type":"number","label":"quantity","onchange":"get_value(this,'quantity_ordered','unit_price','total_price')",
"onchange_for_edit":"get_value(this,'quantity_ordered','unit_price','total_price','edit')"},
"unit_price":{"input":"input",'label':'unit price',"type":"number","onchange":"get_value(this,'quantity_ordered','unit_price','total_price')","onchange_for_edit":"get_value(this,'quantity_ordered','unit_price','total_price','edit')"},
"total_price":{"input":"text",'label':'value of goods','value':0}
}
let so_form = {
    "customer_id":{'input':'select','model':'party','label':'customer details'},
    "date_delivery_expected":{'input':'input','type':'date','label':'expected date of delivery','min':today},
    "payment_terms":{'input':'input','type':'text','label':'payment terms'},
    'due_date' :{'input':'input','type':'date','label':'due date'},
    'freight_charges_paid_by':{'input':'select','model':null,'options':['self','customer'],'label':'freight charges paid by'}
}

function get_sales_orders(){
    fetch(host_main+'/api/sales-order',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data,'as')
        // content = '<table><thead><tr><th></th><th></th><th></th><th></th><th></th><th></th></tr></thead>'
        sales_thead = '<thead><tr>'
        for(let [key,value] of Object.entries(data.data[0])){
            if(`${key}_get` in data.data[0]){
                continue
            }
            else{
                if(key.endsWith('_get')){
                    sales_thead += `<th>${key.substring(0,key.length-4)}</th>`
                }else{
                    sales_thead += `<th>${key}</th>`
                }
            }
        }

        sales_tbody = '<tbody>'
        count = 0
        data.data.forEach(element => {

            sales_tbody += `<tr id=${element.sales_order_no}>`
            console.log('element',element)
            sales_orders_list[element['sales_order_no']] = element
            sales_edit_list[element['sales_order_no']] = {}
            for(let [key,value] of Object.entries(element)){

                if(`${key}_get` in element){
                    continue
                }
                else{

                    if(key.endsWith('_get')){
                        if(key == 'sales_order_items_get'){
                            sales_tbody += `<td id ='table${key}'>`
                            sales_tbody += `<ul>`
                            for(i=0;i<value.length;i++){
                                if(i==0){
                                    count += 1;
                                    sales_tbody += ` <a class="" data-toggle="collapse" href="#${key}${count}_collapse" role="button" aria-expanded="false" aria-controls="${key}_collapse">
                                    <li id=${value[i].id}>${value[i].product_get.name}</li>
                                    </a> `
                                    sales_tbody += `<div class="collapse" id="${key}${count}_collapse">`
                                    
                                        }
                                        else{
                                            sales_tbody += `  <li id=${value[i].id}>${value[i].product_get.name}</li>`;
                                        }
                                        sales_edit_list[element['sales_order_no']][value[i].id] = {}
                                        for(let [key1,value1] of Object.entries(value[i])){
                                           
                                        if(key1 in list_form_data_so){
                                            // console.log(key1,value1,'value')
                                            sales_edit_list[element['sales_order_no']][value[i].id][key1] = value1
                                        }
                                    }
                            }
                            continue
                        }
                        sales_tbody += `<td id ='table_${key}'>${value.name}</td>`
                    }
                    else{
                        sales_tbody += `<td id='table_${key}'>${value}</td>`
                    }
                   
                }
            }
            sales_tbody += `<td><button onclick=edit_get(${element.sales_order_no}) ><i class="bi bi-pen"></i></button></td>`
            sales_tbody += `</tr>`
        });

        sales_thead += '</tr></thead>'
        sales_tbody += `</tbody>`
        sales_orders_container.innerHTML = `<table class='table'>${sales_thead}${sales_tbody}</table>`
    })
}
get_sales_orders()

async function edit_get(id){
    // current_data = {}
    sales_order_no = id
    data_in_items = ['payment_terms','due_date','freight_charges_paid_by']
   current_data = sales_edit_list[id]
   current_data_to_fill = sales_orders_list[id]
   document.querySelector('#so_form').innerHTML = ''
   console.log(current_data,'current')
   get_list_form(list_form_data_so,'so_form','sales_order',current_data)
   so_form_data = ''
   for(let [key,value] of Object.entries(so_form)){

    if(key in current_data_to_fill){
        console.log(key,current_data_to_fill[key],'fill')
        edit_detail = current_data_to_fill[key]
    }else if(data_in_items.includes(key)){
        console.log(key, current_data_to_fill['sales_order_items_get'][0],'rwe')
        edit_detail = current_data_to_fill['sales_order_items_get'][0][key]
    }else{
        continue
    }
    bodydata[key] = edit_detail
           so_form_data += `<label for="form_${key}">${value['label']}</label>`
               if(value['input'] == 'select'){
                // console.log(edit_detail,key,'ddddda')
                // select_input = document.createElement('select')
                // select_input.setAttribute('name',`${key}`)
           so_form_data += `<select name="${key}" class='form-select w-25' onchange=so_input_change(this,'${key}') id="form_${key}">`
           if(!value['model']){
              so_form_data += `<option disabled selected value="">Select option </option>`
            for(i=0; i<value['options'].length; i++){
                if(value['options'][i] == edit_detail){
                    so_form_data += `<option selected value="${value['options'][i]}"> ${value['options'][i]}</option>`
                    continue
                }
               so_form_data += `<option value="${value['options'][i]}"> ${value['options'][i]}</option>`
          }       
           }
       }
       else{
           
       if('min' in value){
           so_form_data += `<${value['input']} name="${key}"  class='form-control w-25'  type=${value['type']} min=${value['min']} value=${edit_detail} onchange=so_input_change(this,'${key}') id="form_${key}">`
       }else{
           so_form_data += `<${value['input']} name="${key}"  class='form-control w-25'  type=${value['type']} min=${value['min']} value=${edit_detail} onchange=so_input_change(this,'${key}') id="form_${key}">`
       }
       }
       so_form_data += `</${value['input']}>`
   }
//    console.log(so_form_data,'sa')
   document.querySelector('#sales_order_form').innerHTML = so_form_data
    await get_party_dropdown('customer','form_customer_id','party_data')
    document.querySelector('#form_customer_id').value = current_data_to_fill['customer_id']
  document.querySelector('#sales-button').innerHTML = ` <input type="submit" onclick="update_sales_order()" id="pr_submit_button" value="update">
<input type="submit" onclick="delete_sales_order()" data-toggle=modal data-target='#deleteModal' value="delete"></input>`
}

function get_value(element,quantity,price,input_id,edit){
    parent = element.parentNode.parentNode;
    console.log(parent,'parent')
    // console.log(element.getAttribute('min'),'min')
    min_value = element.getAttribute('min')
    max_value = element.getAttribute('max')
    quantity_value = parent.querySelector(`#form_${quantity}`).value
    price_value = parent.querySelector(`#form_${price}`).value
    if(element.id.includes(price) && min_value && max_value){
        if(parseInt(price_value)>max_value || parseInt(price_value) < min_value){
            messages.innerHTML = `please give a unit price in given price range greater than ${min_value} and less than ${max_value}`
            return
        }else{
            messages.innerHTML = ''
        }
    }


    value = null
    if(quantity_value != '' && price_value != ''){
        value = parseInt(quantity_value) * parseInt(price_value)
        console.log(value)
        console.log(parent.querySelector(`#form_${input_id}`),'input')
        parent.querySelector(`#form_${input_id}`).innerHTML = value
        // list_form_items['sales_order'][parent.id][input_id] = value
        // 
    }

    if(edit){
        if(!list_edit_items['sales_order'][parent.id]){
            list_edit_items['sales_order'][parent.id] ={}
        }
        list_edit_items['sales_order'][parent.id][quantity] = quantity_value
        list_edit_items['sales_order'][parent.id][price] = price_value
        list_edit_items['sales_order'][parent.id][input_id] = value
    }
    else{
        if(!list_form_items['sales_order'][parent.id]){
            list_form_items['sales_order'][parent.id] ={}
        }
        list_form_items['sales_order'][parent.id][quantity] = quantity_value
        list_form_items['sales_order'][parent.id][price] = price_value
        list_form_items['sales_order'][parent.id][input_id] = value
    }
}


function max_and_min_price_set(element,key,model_name,edit){
    parent = element.parentNode.parentNode;

    // console.log(this.value)
    if(element.value != ''){
        fetch(`${crud_url}?model=${model_name}&pk=${element.value}`,{
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        }).then(response =>{
            return response.json()
        }).then(data =>{
            console.log(data,'data')
            // document.querySelector('.party_data').innerHTML = content
            min_price = data.minimum_price
            max_price = data.maximum_price
            if(min_price && max_price){
                parent.querySelector(`#form_${key}`).setAttribute('min', min_price)
                parent.querySelector(`#form_${key}`).setAttribute('max', max_price)

            }
        })
    }else{
        // parent.querySelector(`#${key}`).innerHTML = ''
        console.log('as')
        parent.querySelector(`#form_${key}`).setAttribute('min', 0)
        parent.querySelector(`#form_${key}`).setAttribute('max', null)
    }
if(edit){
    if(!list_edit_items['sales_order'][parent.id]){
        list_edit_items['sales_order'][parent.id] ={}
    }
    list_edit_items['sales_order'][parent.id]['product'] = element.value
    }
else{
    if(!list_form_items['sales_order'][parent.id]){
        list_form_items['sales_order'][parent.id] ={}
    }
    list_form_items['sales_order'][parent.id]['product'] = element.value
}
}

function so_input_change(element,key){
    parent = element.parentNode.parentNode;
    bodydata[key] = element.value
}

function update_sales_order(){
    customer_id = document.getElementById('form_customer_id').value
    if(!customer_id){
        messages.innerHTML = 'Please select Customer'
        return
    }
    bodydata['customer_id'] = customer_id
    bodydata['sales_order_items_list'] = list_form_items['sales_order']
    bodydata['sales_order_items_edit'] = list_edit_items['sales_order']
    bodydata['sales_order_items_delete'] = list_to_delete['sales_order']
    fetch(host_main +`/api/sales-order?id=${sales_order_no}`,
    {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'token '+token,
                        'Content-Type':'application/json'
                    },
                    body : JSON.stringify(bodydata)
                }).then((response) => {return response.json()}).then(data =>{
                    console.log(data,'data')
                    if(data.status == 'success'){
                        messages.innerHTML = '<p class="text-success">sales order updated successfully</p>'
                        document.querySelector('#sales_order_form').innerHTML = ''
                        document.querySelector('#so_form').innerHTML = ''
                        document.querySelector('#sales-button').innerHTML = ''
                        get_sales_orders()
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

function delete_sales_order(){
    
    document.getElementById("yes").onclick=function(){
        fetch(host_main +`/api/sales-order?id=${sales_order_no}`,
        {
         method: 'DELETE',
         headers: {
             'Authorization': 'token' + ' ' + token,
         }
     })
     .then(response =>{ 
         console.log(response)

           return response.json()
        }).then(data =>{
            if(data.status == 'success'){
                document.querySelector('#sales_order_form').innerHTML = ''
                document.querySelector('#so_form').innerHTML = ''
                document.querySelector('#sales-button').innerHTML = ''
                document.querySelector('#error-messages').innerHTML = data.data
                get_sales_orders()
                }
                else{
                    document.querySelector('.error-messages').innerHTML = data.data
                }
        })
      }
}
