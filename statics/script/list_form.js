let token = sessionStorage.getItem('token');
let form_content = ''
let list_form_items = {}
let list_edit_items = {}
let list_form_data = {}
let list_to_delete = {}
let input_count = 0
let dropdown_html
let dropdown_data
let list_table,list_thead,list_tbody

function get_dropdown(model){
    return new Promise((resolve, reject) =>{
        $.ajax({
            url:window.location.protocol + "//" + window.location.host + '/api/dropdown/',
            data: {
                'model': model,
            },
            success: function (data) {
                console.log(data)
                dropdown_data = data.list
                dropdown_html = data.html
                resolve()
            }
        });
    })
    // common_drop_down_get('branch',`form_ware_house`,'branch_name')
}

async function get_list_form(list_form_data_input,input_id,model_name,edit_details){
    list_table =''
    list_thead = ''
    list_tbody = ''
    list_form_items[model_name] = {}
    list_edit_items[model_name] = edit_details
    list_form_data[model_name] = list_form_data_input
list_table = document.createElement('table');
list_thead = document.createElement('thead');
headings = `<tr>`
for(let [key,value] of Object.entries(list_form_data[model_name])){
   headings += `<th>${value['label']}</th>`
}
headings += `<th>action</th>`
headings += `</tr>`
list_thead.innerHTML = headings
list_tbody = document.createElement('tbody');
list_table.appendChild(list_thead);
list_table.appendChild(list_tbody)
document.querySelector(`#${input_id}`).appendChild(list_table)

if(edit_details != null){
    console.log(edit_details,'edit')
    list_to_delete[model_name] = []
   await fill_edit_data(model_name)
}
// await get_dropdown('product')
add_new_row(null,model_name)
}
async function add_new_row(element,model_name){
   if(element){
      parent = element.parentNode.parentNode;
    for(let [key,value] of Object.entries(list_form_data[model_name])){
        if(parent.querySelector(`#form_${key}`).value == ''){
                        messages.innerHTML = `<p class="text-warning">fill ${key} field</p>`
                        return
                    }
    }
               // action_td = parent.querySelector('#action_row')
               element.innerHTML = `<i class="bi bi-trash"></i>`
               element.setAttribute('onclick',`delete_row(this,${parent.id},'${model_name}')`)
               
   // if(Object.values(sales_order_items).length==dropdown_data.length){
   //     messages.innerHTML = '<p class="text-warning">Products all are added</p>'
   //     return 
   // }

   }

   input_count +=1
   form_div = document.createElement('tr')
   list_form_items[model_name][input_count] = {}
   form_div.setAttribute('id',`${input_count}`)
   for(let [key,value] of Object.entries(list_form_data[model_name])){
       let td = document.createElement('td')
       price_flag = true
       if('price' in value && value['price']){
        currency_input = document.createElement('select')
        currency_input.setAttribute('id',`form_currency`)
        currency_input.setAttribute('oninput',`get_currency(this)`)
        await get_dropdown('currency')
        options = `<option disabled selected value="">Select ${key} </option>`

        for(i=0; i<dropdown_data.length; i++){
        options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
    }
        currency_input.innerHTML = options
        if(!price_flag){
            currency_input.setAttribute('disabled','disabled')
        }
        price_flag = false
    }


       if(value['input'] != 'text'){

        if(value['input'] == 'select'){
            form_input = document.createElement('select')
            form_input.setAttribute('id',`form_${key}`)
               
            if('options' in value){
                options = `<option disabled selected value="">Select option </option>`
                for(i=0; i<value['options'].length; i++){
                    options += `<option value="${value['options'][i]}"> ${value['options'][i]}</option>`
              } 
              form_input.innerHTML = options
            }else if(value['model']){
                // await common_drop_down_get(value['model'],`form_${key}`)
                await get_dropdown(value['model'])
                options = `<option disabled selected value="">Select ${key} </option>`
    
                for(i=0; i<dropdown_data.length; i++){
                // if(!product_list.includes(String(dropdown_data[i].id))){
                options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
                // }  
            }
             form_input.innerHTML = options
        }
           }
           else if(value['input'] == 'input'){
            form_input = document.createElement('input')
            form_input.setAttribute('id',`form_${key}`)
           }
           else if(value['input'] =='checkbox'){
            form_input = document.createElement('checkbox')
            form_input.setAttribute('id',`form_${key}`)
           }

        if('onchange' in value && value['onchange']){
            form_input.setAttribute('onchange',value['onchange'])
           }else if('oninput' in value && value['oninput']){
            form_input.setAttribute('oninput',value['oninput'])
           }else{
            form_input.setAttribute('oninput',`input_change(this,'${key}','${model_name}')`)
           }
       }

      else{
        form_input = document.createElement('span')
        form_input.setAttribute('id',`form_${key}`)
        if('value' in value){
            form_input.innerHTML = value['value']
        }
       }

       td.appendChild(form_input)
       if(value['price']){
        td.appendChild(currency_input)
       }
       form_div.appendChild(td)
   }
   td = document.createElement('td')
   td.innerHTML =  `<button class="btn btn-secondary" id="add_new" onclick=add_new_row(this,'${model_name}')><i class="bi bi-plus"></i></button>`
   form_div.appendChild(td)
   // if(del_button){
       // td = document.createElement('td')
       // td.innerHTML = `<button class="btn btn-secondary" id="delete_row" disabled onclick=delete_row(this,${input_count})><i class="bi bi-trash"></i></button>`
       // form_div.appendChild(td)
   // }
   list_tbody.appendChild(form_div)
   // $("#form_product").html(options);
}

async function fill_edit_data(model_name){
  edit_details = list_edit_items[model_name]
  console.log(edit_details,'ed')
  sales_form_data = list_form_data[model_name]
//   content = ''

  for(let [index,element] of Object.entries(edit_details)){
    form_div = document.createElement('tr')
    form_div.setAttribute('id',`${index}`)
    for(let [key,value] of Object.entries(sales_form_data)){
        content = ''
        let td = document.createElement('td')
        if(value['input'] == 'select'){
            if('onchange_for_edit' in value){
                content += `<select name="${key}" type=${value[1]} onchange=${value['onchange_for_edit']} id="form_${key}">`
            }else{
            content += `<select name="${key}" onchange=input_change(this,'${key}','${model_name}','edit') id="form_${key}">`
            }
            
         if('options' in value){
             options = `<option disabled selected value="">Select option </option>`
             for(i=0; i<value['options'].length; i++){
                if(key in edit_details[index] && edit_details[index][key] == value['options'][i]){
                    options += `<option selected value="${value['options'][i]}"> ${value['options'][i]}</option>`
                       }
                    // if(!product_list.includes(String(dropdown_data[i].id))){
                       else{
                 options += `<option value="${value['options'][i]}"> ${value['options'][i]}</option>`
                       }
                }  
           content += options
         }else if(value['model']){
             await get_dropdown(value['model'])
             options = `<option disabled value="">Select ${key} </option>`
 
             for(i=0; i<dropdown_data.length; i++){
                if(key in edit_details[index] && edit_details[index][key] == dropdown_data[i].id){
             options += `<option selected value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
                }
             // if(!product_list.includes(String(dropdown_data[i].id))){
                else{
             options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
                }
             // }  
         }
         content += options
     }
            content += `</${value['input']}>`
        }
        else if(value['input'] == 'input'){
            if('onchange' in value){
                content += `<${value['input']} name="${key}" type=${value['type']} onchange=${value['onchange_for_edit']} value=${edit_details[index][key]} id="form_${key}">`
            }else{
                content += `<${value['input']} name="${key}" type=${value['type']} onchange=input_change(this,'${key}','${model_name}','edit') value=${edit_details[index][key]} id="form_${key}">`
            }
            content += `</${value['input']}>`     
        }
 
       else if(value['input'] == 'text'){
         content += `<span id=form_${key}>`
         content += `${edit_details[index][key]}`
         content += '</span>'
        }
        // console.log(content,'as')
        td.innerHTML = content

        form_div.appendChild(td)
    }
    td = document.createElement('td')
    td.innerHTML = `<button class="btn btn-secondary" id="add_new" onclick=delete_row(this,${index},'${model_name}','edit')><i class="bi bi-trash"></i></button>`
    form_div.appendChild(td)
    list_tbody.appendChild(form_div)
    console.log(form_div,'div')
  }   
}


function input_change(element,key,model_name,edit){
   parent = element.parentNode.parentNode;
   console.log(parent)
   if(edit){
    if(!list_edit_items[model_name][parent.id]){
        list_edit_items[model_name][parent.id] ={}
    }
    list_edit_items[model_name][parent.id] = element.value
   }else{
    if(!list_form_items[model_name][parent.id]){
        list_form_items[model_name][parent.id] ={}
    }
    list_form_items[model_name][parent.id][key] = element.value
   }

   // check_fields()
}
function delete_row(element,id,model_name,edit){
    if(edit){
        list_to_delete[model_name].push(id)
        delete list_edit_items[model_name][id]
    }
    else{
        delete list_form_items[model_name][id]
    }
   parent = element.parentNode.parentNode;
   parent_tbody = parent.parentNode

   parent_tbody.removeChild(parent)
//    check_fields()
}

function get_currency(element,edit){
    parent = element.parentNode.parentNode;
   console.log(parent)
   if(edit){
    if(!list_edit_items[page][parent.id]){
        list_edit_items[page][parent.id] ={}
    }
    list_edit_items[page][parent.id] = element.value
   }else{
    if(!list_form_items[page][parent.id]){
        list_form_items[page][parent.id] ={}
    }
    list_form_items[page][parent.id]['currency'] = element.value
    currency= element.value
    if(currency){
    currency_name = element.options[element.selectedIndex].text
    }
   }
   data_with_currency.forEach(element =>{
    console.log('key',parent.querySelector(`#form_${element}`))
    if(list_form_items[page][parent.id][element]){
        parent.querySelector(`#form_${element}`).innerHTML = `${list_form_items[page][parent.id][element]} ${currency_name}`
    }
   })
}