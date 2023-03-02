// let token = sessionStorage.getItem('token');
// let form_content = ''
// let list_form_items = {}
// let list_form_data = {}
// let input_count = 0
// let dropdown_html
// let dropdown_data
let customer_id;
let bodydata = {}
let today = new Date();
document.querySelector('#sales-url').href = `${host_main}/inventory?model_name=sales`

let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd ;
console.log(today)
let so_form = {
    "customer_id":{'input':'select','model':'party','label':'customer details'},
    "date_delivery_expected":{'input':'input','type':'date','label':'expected date of delivery','min':today},
    "payment_terms":{'input':'input','type':'text','label':'payment terms'},
    'due_date' :{'input':'input','type':'date','label':'due date'},
    'freight_charges_paid_by':{'input':'select','model':null,'options':['self','customer'],'label':'freight charges paid by'}
}
list_form_data_so = {    "product":{'input':"select","label":"product","model":"product",'onchange':`max_and_min_price_set(this,'unit_price','product')`},
"quantity_ordered":{"input":"input","type":"number","label":"quantity","onchange":"get_value(this,'quantity_ordered','unit_price','total_price')"},
"unit_price":{"input":"input",'label':'unit price',"type":"number","onchange":"get_value(this,'quantity_ordered','unit_price','total_price')"},
"total_price":{"input":"text",'label':'value of goods','value':0}
}


function get_form(){
    so_form_data = ''
    for(let [key,value] of Object.entries(so_form)){
            so_form_data += `<label for="form_${key}">${value['label']}</label>`
                if(value['input'] == 'select'){
            so_form_data += `<select name="${key}" class='form-select w-25' onchange=so_input_change(this,'${key}') id="form_${key}">`
            if(!value['model']){
               so_form_data += `<option disabled selected value="">Select option </option>`
             for(i=0; i<value['options'].length; i++){
                so_form_data += `<option value="${value['options'][i]}"> ${value['options'][i]}</option>`
           }       
            }
        }
        else{
            
        if('min' in value){
            so_form_data += `<${value['input']} name="${key}"  class='form-control w-25'  type=${value['type']} min=${value['min']} onchange=so_input_change(this,'${key}') id="form_${key}">`
        }else{
            so_form_data += `<${value['input']} name="${key}"  class='form-control w-25'  type=${value['type']} min=${value['min']} onchange=so_input_change(this,'${key}') id="form_${key}">`
        }
        }
        so_form_data += `</${value['input']}>`
    }
    console.log(so_form_data,'sa')
    document.querySelector('#sales_order_form').innerHTML = so_form_data
    get_party_dropdown('customer','form_customer_id','party_data')
}

get_form()
get_list_form(list_form_data_so,'sales_order_form','sales_order')


function get_value(element,quantity,price,input_id){
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
    if(!list_form_items['sales_order'][parent.id]){
        list_form_items['sales_order'][parent.id] ={}
    }

    if(quantity_value != '' && price_value != ''){
        value = parseInt(quantity_value) * parseInt(price_value)
        console.log(value)
        console.log(parent.querySelector(`#form_${input_id}`),'input')
        parent.querySelector(`#form_${input_id}`).innerHTML = value
        list_form_items['sales_order'][parent.id][input_id] = value
    }
    list_form_items['sales_order'][parent.id][quantity] = quantity_value
    list_form_items['sales_order'][parent.id][price] = price_value
}


function max_and_min_price_set(element,key,model_name){
    parent = element.parentNode.parentNode;
    if(!list_form_items['sales_order'][parent.id]){
        list_form_items['sales_order'][parent.id] ={}
    }
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
    list_form_items['sales_order'][parent.id]['product'] = element.value
}

function so_input_change(element,key){
    parent = element.parentNode.parentNode;
    bodydata[key] = element.value
}

function submit_sales_order(){
    customer_id = document.getElementById('form_customer_id').value
    if(!customer_id){
        messages.innerHTML = 'Please select Customer'
        return
    }
    bodydata['customer_id'] = customer_id
    bodydata['sales_order_items_list'] = list_form_items['sales_order']

    fetch(host_main +'/api/sales-order',
    {
                    method: 'POST',
                    headers: {
                        'Authorization': 'token '+token,
                        'Content-Type':'application/json'
                    },
                    body : JSON.stringify(bodydata)
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