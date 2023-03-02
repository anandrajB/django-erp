let page = 'purchase_order'
// let create_btn_text = `Create Purchase Inquiry`
// let po_table_data = {}
let form_data_po = purchase_form_data[page]
let list_form_data_po = PM_list_form_data[page]
let po_form = document.querySelector('#po-form')
let po_list_form = document.querySelector('#po-list-form')
// let new_btn_div = document.querySelector('#new-po-button')
let value_index
let submit_btn = document.createElement('button')
let exit_btn = document.createElement('a')
exit_btn.setAttribute('href','#')
exit_btn.innerHTML = 'exit'
let body_data = {}


async function get_po_form(){
measured_unit_get()
body_data = {}
value_index = 0
po_list_form.innerHTML = ''
document.querySelector('#submit-btn').innerHTML = ''
submit_btn.setAttribute('onclick','submit_po()')
submit_btn.innerHTML = `create purchase order`
form_para = document.createElement('p')
form_para.appendChild(submit_btn)
form_para.appendChild(exit_btn)
document.querySelector('#submit-btn').appendChild(form_para)
get_list_form(list_form_data_po,'po-list-form',page,null)
po_form.innerHTML = ''
for(let [key,value] of Object.entries(form_data_po)){
    let po_label = document.createElement('label')
    po_label.setAttribute('for',`form_${key}`)
    po_label.innerHTML = `${value['label']}`
    po_input = document.createElement(`${value['input']}`)
    po_input.setAttribute('id',`form_${key}`)
    if('oninput' in value){
        po_input.setAttribute('oninput',value['oninput'])
    }else{
        po_input.setAttribute('oninput',`get_input(this,'form_${key}')`)
    }
    if('value' in value && value['value']){
        
        if(typeof(value['value']) == Object && value['value'].length){
            if( value['value'].length>value_index){
            po_input.value = value['value'][value_index]
            }else{
                po_input.value = ''
            }
            value_index += 1
        }else{
            po_input.value = value['value']
        }
        po_input.setAttribute('disabled','disabled')
    } 
    po_form.appendChild(po_label)
    po_form.appendChild(po_input)
    
    if(value['input'] == 'select'){
        po_input.setAttribute('class','form-select')
        if('options' in value){
            options = `select ${key}`
            value['options'].forEach(element => {
                options += `<option value=${element}>${element}</option>`
            });
            po_input.innerHTML = options
        }else if('model' in value && value['model'] && value['model']){

            if(value['model'] == 'party'){
                party_div = document.createElement('div')
                party_div.setAttribute('id','supplier-details')
                party_div.setAttribute('class','w-50')
                po_form.appendChild(party_div)
                await get_party_dropdown('supplier',`form_${key}`,'supplier-details')
            }else{
                await common_drop_down_get(value['model'],`form_${key}`,value['name'],value['filter_by'],value['filter_value'])
            }
        }
        }
    else if(value['input'] == 'input'){
        po_input.setAttribute('class','form-control')
        if('type' in value){
            po_input.setAttribute('type',value['type'])
        }
}else if(value['input'] == 'checkbox'){
    po_input.setAttribute('class','form-radio')
}
    if('min' in value){
        po_input.setAttribute('min',value['min'])
    }
// po_input.innerHTML = 'hi'
}
}

get_po_form()

function get_input(element,key){
    body_data[key] = element.value
    check_fields()
}

function check_fields(){
    check_flag = true
    for(let [key,value] of Object.entries(form_data_pi)){
        if(key in body_data && body_data[key]== '' || body_data[key] == null && value['required'] == true){
            check_flag = false
        }
    }
}

function get_rm(element){
    // console.log('jh',parent)
    parent = element.parentElement.parentElement
    if(!list_form_items[page][parent.id]){
        list_form_items[page][parent.id] ={}
    }
    // list_form_items[page][parent.id][item1] = element.value
   parent.querySelector('#form_measured_unit').innerHTML =measured_unit_data[element.value]['name']
   list_form_items[page][parent.id]['measured_unit'] = measured_unit_data[element.value]['name']
   list_form_items[page][parent.id]['rawmaterial_id'] = element.value
}