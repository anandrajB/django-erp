// let token = sessionStorage.getItem('token')
let page = 'purchase_inquiry'
let create_btn_text = `Create Purchase Inquiry`
let pi_table_data = {}
let form_data_pi = purchase_form_data[page]
let list_form_data_pi = PM_list_form_data[page]
let pi_form = document.querySelector('#pi-form')
let pi_list_form = document.querySelector('#pi-list-form')
let new_btn_div = document.querySelector('#new-pi-button')
let value_index
let submit_btn = document.createElement('button')
let exit_btn = document.createElement('a')
exit_btn.setAttribute('href','#')
exit_btn.innerHTML = 'exit'
let body_data = {}

get_pi()

function get_pi(){ 
    new_create_btn = document.createElement('button')
    new_create_btn.setAttribute('class','btn btn-sm btn-primary')
    new_create_btn.setAttribute('onclick','get_pi_form()')
    new_create_btn.innerHTML = create_btn_text
    new_btn_div.appendChild(new_create_btn)
    get_pi_data()    
}

function get_pi_data(){
    body_data = {}
    fetch(host_main+'/api/purchase-inquiry',{
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
        let content='<div class="d-flex flex-row justify-content-center flex-wrap">'
        data.data.forEach(element => {
            console.log(element)
            pi_table_data[element.id] = element
            content += `<div class="card mx-2 my-5 " id=${element.id}>
            <div>
            <p class=" float-end mx-3 "><i class="bi bi-pen"  onclick=get_pi_form(${element.id}) ></i></p>
            </div>
                <p class="mx-5">${element.pk}</p>
            </div>`
        })
        content += `</div>`
    })
}
async function get_pi_form(id){
    measured_unit_get()
    body_data = {}
    value_index = 0
    pi_list_form.innerHTML = ''
    if(id){
    let current_pi_data = pi_table_data[id]
    document.querySelector('.pi-list-form').innerHTML = show_items_data(current_pi_data['purchase_request_items_list'],list_form_data_pi)
    }else{
        submit_btn.setAttribute('onclick','submit_pi()')
        submit_btn.innerHTML = `create purchase request`
        form_para = document.createElement('p')
        form_para.appendChild(submit_btn)
        form_para.appendChild(exit_btn)
        document.querySelector('#submit-btn').appendChild(form_para)
        get_list_form(list_form_data_pi,'pi-list-form','purchase_inquiry',null)
    }
    pi_form.innerHTML = ''
    document.querySelector('#submit-btn').innerHTML = ''
    for(let [key,value] of Object.entries(form_data_pi)){
        let pi_label = document.createElement('label')
        pi_label.setAttribute('for',`form_${key}`)
        pi_label.innerHTML = `${value['label']}`
        
        pi_input = document.createElement(`${value['input']}`)
        pi_input.setAttribute('id',`form_${key}`)
        if('oninput' in value){
            pi_input.setAttribute('oninput',value['oninput'])
        }else{
            pi_input.setAttribute('oninput',`get_input(this,'form_${key}')`)
        }
        if('value' in value && value['value']){
            
            if(typeof(value['value']) == Object && value['value'].length){
                if( value['value'].length>value_index){
                pi_input.value = value['value'][value_index]
                }else{
                    pi_input.value = ''
                }
                value_index += 1
            }else{
                pi_input.value = value['value']
            }
            pi_input.setAttribute('disabled','disabled')
        } 
        pi_form.appendChild(pi_label)
        pi_form.appendChild(pi_input)
        
        if(value['input'] == 'select'){
            pi_input.setAttribute('class','form-select')
            if('options' in value){
                options = `select ${key}`
                value['options'].forEach(element => {
                    options += `<option value=${element}>${element}</option>`
                });
                pi_input.innerHTML = options
            }else if('model' in value && value['model'] && value['model']){

                if(value['model'] == 'party'){
                    party_div = document.createElement('div')
                    party_div.setAttribute('id','supplier-details')
                    party_div.setAttribute('class','w-50')
                    pi_form.appendChild(party_div)
                    await get_party_dropdown('supplier',`form_${key}`,'supplier-details')
                }else{
                    await common_drop_down_get(value['model'],`form_${key}`,value['name'],value['filter_by'],value['filter_value'])
                }
            }
            }
        else if(value['input'] == 'input'){
            pi_input.setAttribute('class','form-control')
            if('type' in value){
                pi_input.setAttribute('type',value['type'])
            }
    }else if(value['input'] == 'checkbox'){
        pi_input.setAttribute('class','form-radio')
    }
    if(id){
        pi_input.value = current_pi_data[key]
        pi_input.setAttribute('disabled','disabled')
    }else{
        if('min' in value){
            pi_input.setAttribute('min',value['min'])
        }
    }
    // pi_input.innerHTML = 'hi'
    }
}

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

function show_items_data(data,form_inputs){
    show_items_table = document.createElement('table')
    show_items_head = document.createElement('thead')
    show_items_body = document.createElement('tbody')
    tr = document.createElement('tr')
    for(let [key,value] of Object.entries(form_inputs)){
        td = document.createElement('td')
        td.innerHTML = `${value['label']}`
        tr.appendChild(td)
    }
    show_items_head.appendChild(tr)
    show_items_table.appendChild(tbody)
    data.forEach(element =>{
        tr = document.createElement('tr')
        for(let [key,value] of Object.entries(form_inputs)){
            td = document.createElement('td')
            if(value['input'] == 'text'){
                input = document.createElement('span')
                input.innerHTML = element[key]
            }else{
                input = document.createElement(value['input'])
                input.value = element[key]
                input.setAttribute('disabled','disabled')
            }
            tr.appendChild(td)
        }
        show_items_body.appendChild(tr)
    })
    show_items_table.appendChild(show_items_head)
    show_items_table.appendChild(show_items_body)
    return show_items_table
}