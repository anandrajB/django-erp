var url_for_dropdown = 'http://127.0.0.1:8000/api/dropdown/';
console.log('url')
let product_id;
let bom_datas;
page = 'parties'
let data_with_currency = ['value_of_Goods','SGST','CGST','IGST','TotalIncluding_gst']
var messages = document.querySelector('.messages');
let submit = document.getElementById('id_submit');
let currency,currency_name
let list_data_output = {}
let from_table = ['rm_type','rm_id','rm_quantity']
// token = sessionStorage.getItem('token')
let form_data_IR = {
    "rm_type":{"input":"select","options":['Finished Goods','Semi-finished Goods','Raw materials/Accessories'],"type":"text","label":"product_type/raw_material",'price':false,
    "onchange":"product_dropdown(this,'rm_type','parties')",'price':false,},
    "rm_id":{"input":"select","type":"text",'price':false,"label":"Raw material name",'options':[]},
    "rm_quantity":{"input":"input","type":"number","label":"rm_quantity",'price':false,"onchange":"get_value(this,'rm_quantity','unit_price','value_of_Goods')"},
    "unit_price":{"input":"input","type":"number","label":"unit_price",'price':true,"onchange":"get_value(this,'rm_quantity','unit_price','value_of_Goods')"},
    "value_of_Goods":{"input":"text","label":"value_of_Goods",'price':false},
    "SGST":{"input":"text","type":"number","label":"SGST",'value':0,'price':false,},
    "CGST":{"input":"text","type":"number","label":"CGST",'value':0,'price':false,},
    "IGST":{"input":"text","type":"number","label":"IGST",'value':0,'price':false,},
    "TotalIncluding_gst":{"input":"text","label":"Total Including GST",'price':false,"onchange":"get_value(this,'rm_quantity','unit_price','value_of_Goods')"}   
}

// currency_dropdown = []
let currency_dropdown
async function get_currency_dropdown(){
  await get_dropdown('currency')
  currency_dropdown =  dropdown_html 
}
get_currency_dropdown()

 function get_bom(element){
  product_id = element.value
  fetch(crud_url+`?model=billofmaterial&filter_by=product&filter_value=${product_id}`,{
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
      bom_datas = data.data
      bom_datas_dict = {}
     let inventory_table = document.createElement('table');
    let inventory_thead = document.createElement('thead');
    headings = `<tr>`
  for(let [key,value] of Object.entries(form_data_IR)){
     headings += `<th>${value['label']}</th>`
    }
headings += `</tr>`
inventory_thead.innerHTML = headings
inventory_tbody = document.createElement('tbody');
inventory_table.appendChild(inventory_thead);

form_output_count = 0
      bom_datas.forEach(async(element) => {
        list_data_output[form_output_count] = {}
        bom_datas_dict[form_output_count] = element
        tr = document.createElement('tr')
    list_data_output[form_output_count]['currency_name'] = ''
    list_data_output[form_output_count]['TotalIncluding_gst'] = 0
        tr.setAttribute('id',form_output_count)
        for(let [key,value] of Object.entries(form_data_IR)){
          console.log(key)
          td = document.createElement('td')
          if(from_table.includes(key)){
            if(key == 'rm_id'){
              list_data_output[form_output_count][key] = element['rm_id']
              td.innerHTML = `<span>${element['rm_idname']}</span>`
            }else{
              list_data_output[form_output_count][key] = element[key]
              td.innerHTML = `<span>${element[key]}</span>`
            }


          }
          else if(key == 'SGST' || key == 'CGST' || key == 'IGST'){
            console.log('da')
            list_data_output[form_output_count][key] = 0
            td.innerHTML = `<span>0</span>`
          }else if(key == 'unit_price'){
            content = `<input type='number' oninput='get_list_price(this)'>
            <select id='form_currency' oninput='get_currency_it(this)'>
            `
            content += currency_dropdown
            // content += options
            content += `</select>`
            td.innerHTML = content
          }else{
            td.innerHTML = `<span id='form_${key}'></span>`
          }
          // 
          tr.appendChild(td)
        }

        inventory_tbody.appendChild(tr)
        form_output_count += 1
      });

      inventory_table.appendChild(inventory_tbody)
      document.querySelector('#party_type').innerHTML = ''
      document.querySelector('#party_type').appendChild(inventory_table)
  })
}


document.getElementById('id_options').style.display='none'
// document.getElementById('party_type').style.display= 'none'
function inventory_type(element){
    console.log(element)
    if((element.value) == 'internal transfer'){
      document.getElementById('id_options').style.display='none'
      // document.getElementById('party_type').style.display= 'block'
      get_list_form(form_data_IR,'party_type','parties')
    fetch(`${url_for_dropdown}?model=branch&name=branch_name`,{
      method:'GET',
      headers:{
        'Authorization':'token' +' ' + token,
    }
    }).then(response=>{
      return response.json();

    }).then(data=>{
      document.getElementById('id_branch').innerHTML=data.html;

    })
}

else{
    get_party_dropdown('contractor','id_branch','party_data')
    document.getElementById('id_options').style.display='block'
    document.querySelector('#party_type').innerHTML = ''
    }
    
}

// function parties(){
//   document.getElementById('party_type').style.display='block'
// }
get_party_dropdown('transporter','Transporter_details','transfer')


function product_dropdown(element,key,model_name){
  parent = element.parentNode.parentNode;
  console.log(element.value)
  // console.log(parent)
   if(!list_form_items[model_name][parent.id]){
       list_form_items[model_name][parent.id] ={}
   }
   list_form_items[model_name][parent.id][key] = element.value
  if((element.value)=='finished_goods'){
   
    dropdown_product_url= `${url_for_dropdown}?model=product&filter_by=product_type&filter_value=finished`
  }
    else if((element.value)=='Semi-finished Goods'){
     dropdown_product_url = `${url_for_dropdown}?model=product&filter_by=product_type&filter_value=semi_finished`
    }
    else{
      dropdown_product_url = `${url_for_dropdown}?model=rawmaterial&name=rm_name`
    }
    fetch(dropdown_product_url,{
      method:'GET',
      'Authorization': 'token' + ' ' + token,
    }).then(response => {
      console.log(response)
    return response.json()
    }).then(data=>{
      console.log(key,'key')
      parent.querySelector(`#form_rm_id`).innerHTML=data.html;
    })
  }
  function get_value(element,quantity,price,input_id){
    parent = element.parentNode.parentNode;
    currency = parent.querySelector('#form_currency').value
    currency_name = (parent.querySelector('#form_currency')).options[(parent.querySelector('#form_currency')).selectedIndex].text
    console.log(parent,'parent')
    min_value = element.getAttribute('min')
    max_value = element.getAttribute('max')
    console.log(min_value,max_value)
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
    if(!list_form_items['parties'][parent.id]){
        list_form_items['parties'][parent.id] ={}
    }

    if(quantity_value != '' && price_value != ''){
        value = parseInt(quantity_value) * parseInt(price_value)
        console.log(value)
        console.log(parent.querySelector(`#form_${input_id}`),'input')
        parent.querySelector(`#form_${input_id}`).innerHTML = `${value} ${currency_name}`
        parent.querySelector('#form_TotalIncluding_gst').innerHTML =  `${value} ${currency_name}`
        list_form_items['parties'][parent.id][input_id] = value
        list_form_items['parties'][parent.id]['form_TotalIncluding_gst'] = value
        list_form_items['parties'][parent.id]['currency'] = currency
        console.log(value)
    }
    list_form_items['parties'][parent.id][quantity] = quantity_value
    list_form_items['parties'][parent.id][price] = price_value
}
  
function submiton(){
  var jobwork_details = document.getElementById('transfer_type').value;
  // var request_type = document.getElementById('transfer_type').value;
  var from_party = document.getElementById('transfer_type').value;
  var to_party = document.getElementById('id_branch').value;

  if(jobwork_details =='jobwork'){
    var request_details = list_data_output
  }else{
  var request_details = list_form_items['parties']
  }
  console.log(jobwork_details)
  console.log(request_details,'the value')
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  fetch('http://127.0.0.1:8000/api/transfer_submit',{
    body:JSON.stringify({'status':'new','jobwork_details':jobwork_details,'from_party':from_party,'to_party':to_party,
  'request_details':request_details}),
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
      'Authorization':'token'+ '/'+token
    },
  }).then(response=>{
    console.log(response)
  })
}
function product_get(){
  var product_type = document.getElementById('Product_type')
  var product_name = document.getElementById('Product_name')
  var quantity = document.getElementById('quanity')
  fetch('/api/get?model=billofmaterial&name=quantity',{
     method:'GET',
    'Authorization': 'token ' + ' ' + token,

  }).then(response=>{
    console.log(response)
    return response.json()
  })
    .then(data=>{
      // console.log(key,'key')
      document.querySelector('#quantity').innerHTML=data.html;
    })
  }

function product_dropdowns(element,key){
    
    if((element.value)=='Finished Goods'){
     
      dropdown_product_url= `${url_for_dropdown}?model=product&filter_by=product_type&filter_value=finished`
    }
      else if((element.value)=='Semi-finished Goods'){
       dropdown_product_url = `${url_for_dropdown}?model=product&filter_by=product_type&filter_value=semi_finished`
      }
      else{
        dropdown_product_url = `${url_for_dropdown}?model=rawmaterial&name=rm_name`
      }
      fetch(dropdown_product_url,{
        method:'GET',
        'Authorization': 'token' + ' ' + token,
      }).then(response => {
        console.log(response)
      return response.json()
      }).then(data=>{
        console.log(key,'key')
        document.querySelector('#Product_name').innerHTML=data.html;
      })
}   


function get_list_price(element){
  parent = element.parentNode.parentNode
  list_data_output[parent.id]['unit_prioce'] = element.value
  list_data_output[parent.id]['TotalIncluding_gst'] = parseInt(bom_datas_dict[parent.id]['rm_quantity']) * parseInt(element.value)
  parent.querySelector('#form_TotalIncluding_gst').innerHTML = list_data_output[parent.id]['TotalIncluding_gst']
  if(list_data_output[parent.id]['currency_name']){
    parent.querySelector('#form_TotalIncluding_gst').innerHTML = `${list_data_output[parent.id]['TotalIncluding_gst']} ${list_data_output[parent.id]['currency_name']}`
  }
}

function get_currency_it(element){
  parent = element.parentNode.parentNode
  list_data_output[parent.id]['currency'] = element.value
  if(list_data_output[parent.id]['currency']){
  list_data_output[parent.id]['currency_name'] =  element.options[element.selectedIndex].text
  }
if(list_data_output[parent.id]['currency_name']){
  parent.querySelector('#form_TotalIncluding_gst').innerHTML = `${list_data_output[parent.id]['TotalIncluding_gst']} ${list_data_output[parent.id]['currency_name']}`
}

}