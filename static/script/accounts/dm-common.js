var token = sessionStorage.getItem('token')
var container = document.querySelector('.content-container')
var model_container = document.querySelector('.model-container')
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
let data_list;
var get_data = {};
var list_data = {}
let model_li
get_profile()
let path_details = {'main-accordion':'collapseadmin',}
var messages = document.querySelector('.messages')
document.getElementById('dm-filter').style.display = 'none'
let url = new URLSearchParams(window.location.search)
model_name = url.get('model_name')
// let model_data
console.log(model_name)
let dm_add_button = document.createElement('button');
dm_add_button.setAttribute('id','dm_add_button')
dm_add_button.setAttribute('class','dm_add_button')
dm_add_button.innerHTML = 'Add'
if(model_name){
    document.getElementById('dm-filter').style.display ='block'
dm_add_button.setAttribute('onclick',`show_form('${model_name}')`)
let lowerkeyword;
var form_content = form_data[model_name]
document.getElementById('page_name').innerHTML = `${model_name[0].toUpperCase()}${model_name.substring(1)}`
var get_url = new URL(url=window.location.protocol+'//'+window.location.host+`/api/get?model=${model_name}`) 
    if(model_name !='billofmaterial' && model_name != 'productionflow'){
        model_form_get()
    }else{
        get_product_details()
    }
    if(model_name == 'branch' || model_name == 'department' || model_name == 'subdivision' || model_name == 'user'||model_name=='userrole'){
        path_details['sub-accordion'] = 'collapseuser'
        path_details['parent-div'] = 'Manage User'
    }else if(model_name == 'product' || model_name == 'rawmaterial' || model_name=='productionflow' || model_name == 'parties'||model_name == 'billofmaterial'){
        path_details['sub-accordion'] = 'collapsemdm'
        path_details['parent-div'] = 'Master Data Management'
    }else if(model_name=='country'||model_name=='currency'||model_name=='partytype'||model_name=='productionphase'||model_name=='state'||model_name=='measuredunits'){
        path_details['sub-accordion'] = 'collapseconfig'
        path_details['parent-div'] = 'Configuration'
    }
    document.querySelector(`#${path_details['main-accordion']}`).setAttribute('class','accordion-collapse collapse show')
    document.querySelector(`#${path_details['sub-accordion']}`).setAttribute('class','accordion-collapse collapse show')
   let breadcrumb = `  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">${path_details['parent-div']}</a></li>
    <li class="breadcrumb-item active" aria-current="page">${model_name[0].toUpperCase()}${model_name.substring(1)}</li>
  </ol>`
    document.querySelector('.bread-crum-div').innerHTML = breadcrumb

let sub_accordion = document.querySelector(`#${path_details['sub-accordion']}`)
model_anchor_tag = sub_accordion.querySelector(`#nav_${model_name}`)
model_anchor_tag.setAttribute('class','active-item-nav')
model_li = model_anchor_tag.parentNode
model_li.setAttribute('id','active-li')

}
{/* <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item active" aria-current="page">Library</li>
  </ol>
</nav> */}

function filter_data(element){
    lowerkeyword = element.value.toLowerCase()
if(element.value){
    displayArray = data_list.filter(obj =>  Object.keys(obj).some(key => (String(obj[key.toLowerCase()]).toLowerCase()).includes(lowerkeyword)))
}else{
    displayArray = data_list
}
if(displayArray.length){
    container.innerHTML = create_table(displayArray,model_name,get_data,'common')
}else{
    container.innerHTML =''
}
    console.log('filtered -data',displayArray)
}

function model_form_get(){
    document.getElementById('dm-filter').style.display = 'block'
    let content = ''
    fetch(get_url,
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
            content = ''
            if(data.status == 'success'){
            console.log(data)
            if(data.data.length > 0){
                data_list = data.data
                console.log(get_data,'daa')
             get_data = {}   
                content = create_table(data.data,model_name,get_data,'common')
        }
        console.log(get_data,'ftd')
        container.innerHTML = content
    }else{
        error = ''
        if(typeof(data.data) == Object){
        for (const [key, value] of Object.entries(data.data)) {
            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
        }
    }else{
        error= `<p class='text-danger'> ${data.data} </p>`
    }
       messages.innerHTML = error
    }
        })

}

function create_form(){

    return new Promise((resolve)=>{
        document.querySelector('.dm-add-button-div').innerHTML = ''
        model_container.innerHTML = ''
        let content = ''
        let list_content = ''
        head_div =document.createElement('div')
        head_div.setAttribute('class','form-head')
        head_div.innerHTML = `Add ${model_name}`
        model_container.appendChild(head_div)
        container_messages = document.createElement('div')
        container_messages.setAttribute('class','model-messages')
        let list_data_div= document.createElement('div')
        list_data_div.setAttribute('class','list_data_div')
        list_data_div.setAttribute('id','list_data_div')
        form_div = document.createElement('div')
        form_div.setAttribute('class','dm-form-body')
        // actual_form_div = document.createElement('div')
        // actual_form_div.setAttribute('class','dm-input-form-div')
        // form_div.setAttribute('onchange',`check_allfield('${model_name}')`)
        model_container.appendChild(container_messages)
        model_container.appendChild(form_div)
        extra_fields = document.createElement('div')
       for (let [key, value] of Object.entries(form_content)) {
        
        input_group = document.createElement('div')
        input_group.setAttribute('class','form-group')
        input_group.setAttribute('id',`div_${key}`)
        input_label = document.createElement('label')
        input_label.innerHTML = `${value['label']}`
        input_group.appendChild(input_label)
        if(value['input'] == 'select'){  
            dm_input = document.createElement('select')
            dm_input.setAttribute('class','form-select')
            dm_input.setAttribute('id',`form_${key}`)
    input_group.appendChild(dm_input)
        // if(model_name=='user' && key == 'department_subdivision' || key == 'role'){
        //     dm_input.innerHTML = `<option value=''>select ${key}<option>`
        //     }
        console.log(key,'key')

         if(value['table']){
         common_drop_down_get(value['table'],`form_${key}`)
        }
        else if(value['options']){
            options = `<select value=''>select ${key}</select>`
            value['options'].forEach(element => {
                options += `<option value="${element}">${element}</option>`
            });
            dm_input.innerHTML = options
        }
        }
        else if(value['field'] == 'list'){
            list_data[key] = []
            dm_input = document.createElement('input')
            dm_input.setAttribute('type', 'text')
            dm_input.setAttribute('id',`form_${key}`)
    input_group.appendChild(dm_input)

            dm_input_div = document.createElement('div')
            dm_input_div.setAttribute('id',`${key}_list`)
            dm_input_div.setAttribute('class',`${key}_list`)
            input_group.style.display = 'none'
            // content += `<span>add ${key}</span> <button onclick="add_item('${key}')"><i class="bi bi-plus"></i></button>`
            // list_content += `<div id='${key}_list' class='${key}_list'></div>`
        }
        else if(value['type'] == 'checkbox'){
            dm_para = document.createElement('p')
            dm_para.setAttribute('class','checkbox-div')
            dm_input = document.createElement('input')
            dm_input.setAttribute('type','checkbox')
            dm_input.setAttribute('id',`form_${key}`)
            dm_span = document.createElement('span')
            dm_span.innerHTML = `Add ${key}`
            dm_para.appendChild(dm_input)
            dm_para.appendChild(dm_span)
    input_group.appendChild(dm_para)
    
        }
        else{
            dm_input = document.createElement('input')
            dm_input.setAttribute('type', value['type'])
            dm_input.setAttribute('id',`form_${key}`)
            dm_input.setAttribute('class', 'form-control')
            currency_group = document.createElement('div')
            currency_group.setAttribute('class','input-group')
            if('currency' in value){
                // input_group.setAttribute('class', 'form-group input-group')
                currency_input = document.createElement('select')
                currency_input.setAttribute('class','input-group-prepend')
                currency_input.setAttribute('id','form_currency')
                common_drop_down_get('currency','form_currency','currency_name')
                currency_input.setAttribute('disabled','disabled')
                currency_group.appendChild(currency_input)
            }
            if('mobile_no' in value){
                // input_group.setAttribute('class', 'form-group input-group')
                code_input = document.createElement('select')
                code_input.setAttribute('class','input-group-prepend')
                code_input.setAttribute('id','form_number_code')
                code_input.innerHTML = `<option value='91'>+91</options>`
                // common_drop_down_get('currency','form_currency','currency_name')
                // currency_input.setAttribute('disabled','disabled')
                currency_group.appendChild(code_input)
            }
            currency_group.appendChild(dm_input)
            input_group.appendChild(currency_group)
        }
        if('oninput' in value){
            dm_input.setAttribute('oninput',value['oninput'])
        }else{
            dm_input.setAttribute('oninput',`get_dm_data(this,'${key}')`)
        }
        if(model_name =='rawmaterial' && key== 'preferred_supplier'){
            list_data[key] = []
            input_group.innerHTML = `<label>preferred supplier</label>
            <div class="input-group">`
            input_group.appendChild(dm_input)
                input_group.innerHTML +=`
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" onclick="add_item('${key}')" type="button"><img class="icon" src="/media/assets/table/+.svg" /></button>
                </div>
              </div>`
             
                extra_fields.innerHTML = `<div id='parts_list' class='${key}_list'></div>`
        }
        if('field' in value && value['field'] == 'json'){
            json_input_div = document.createElement('div')
            json_input_div.setAttribute('class','sub_form_input')
            json_show_div = document.createElement('div')
            json_show_div.setAttribute('class','sub_form_show')
            
            if('subfields' in value){
                list_data[key] = {}
                for (let [key_input, value_input] of Object.entries(value['subfields'])) {
                    console.log(key_input, value_input,value['subfields'])
                    let label = document.createElement('label')
                    label.innerHTML = `${value_input['label']}`
                    let sub_input = document.createElement(value_input['input'])
                    sub_input.setAttribute('class','form-control')
                    if(value_input['input'] == 'select'){
                        sub_input.innerHTML = `<option>${key_input}</option>`
                        sub_input.setAttribute('class','form-select')
                        sub_input.setAttribute('id',`subform_${key_input}`)
                    }
                    sub_input.setAttribute('id',`subform_${key_input}`)
                    json_input_div.appendChild(label)
                    json_input_div.appendChild(sub_input)
                }
                json_input_div.innerHTML = json_input_div.innerHTML + `<button onclick=add_party_products(this,'${key}')>Add</button>`
            }
            json_show_div.innerHTML = `<label>products</label><div id='party_list' class='${key}_list'></div>`
            list_data_div.appendChild(json_input_div)
            list_data_div.appendChild(json_show_div)
            continue
        }
        form_div.appendChild(input_group)
    }
        // content += `</div>` + list_content
    // footer
    extra_fields.setAttribute('class','extra-fields')
    form_div.appendChild(extra_fields)
        let action_btn_div = document.createElement('div')
        action_btn_div.setAttribute('class', 'post-btn')
        let cancel_btn = document.createElement('btn')
        cancel_btn.setAttribute('onclick', 'close_form()')
        cancel_btn.setAttribute('class','cancel-btn')
        cancel_btn.innerHTML = 'Cancel'
        let submit_btn = document.createElement('btn')
        submit_btn.setAttribute('onclick', 'submit_data(null)')
        submit_btn.setAttribute('id',`${model_name}Button`)
        submit_btn.setAttribute('class', 'dm-submit-btn')
        submit_btn.innerHTML = `Add`
        form_div.appendChild(list_data_div)
        action_btn_div.appendChild(cancel_btn)
        action_btn_div.appendChild(submit_btn)
        model_container.appendChild(action_btn_div)
        resolve()
            })


}

function close_form(){
    document.querySelector('.dm-add-button-div').innerHTML = ''
    document.querySelector('.dm-add-button-div').appendChild(dm_add_button)
    document.getElementById('dm-filter').style.display = 'block'
    model_container.innerHTML = ''
    container.innerHTML =  create_table(data_list,model_name,get_data,'common')
}
function get_profile(){
  return  fetch(`${window.location.protocol+'//'+window.location.host}/api/profile/`,{
        method : 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token,
        },
    }).then(response =>{
                return response.json()
    }).then(data =>{
    if('status' in data && data.status == 'success'){
                    profile_details = data.data
    if(profile_details.role){
            document.getElementById('profile-role').innerHTML = profile_details.role_get.charAt(0).toUpperCase() + profile_details.role_get.slice(1);
        }
        document.getElementById('profile-name').innerHTML = profile_details.name.charAt(0).toUpperCase() + profile_details.name.slice(1);
        document.querySelector('.dm-add-button-div').innerHTML = ''
        document.querySelector('.dm-add-button-div').appendChild(dm_add_button)
    }
    })
}
// function party_type_change(element){
//     console.log("party_type_change",element)
//     let  product = document.getElementById('form_party_type')
//     let text = product.options[product.selectedIndex].text;
//     let host_url = window.location.protocol + '//' + window.location.host
//     let url_for_change= host_url+'/api/dropdown';
//     console.log(typeof(product))
//     console.log(text)
//     if(text=='supplier'){
//         document.querySelector("label[for=party_products]").innerHTML="party Rawmaterials"
//         $.ajax({
//             url: url_for_change,
//             data: {
//                 'model': 'rawmaterials',
//                 'name': 'rm_name',
//             },
//             success: function (data) {
//                 console.log(data)
//                 $("#form_party_product").html(data);
//             }
//         });

//     }
//     else{
//         document.querySelector("label[for='party_products']").innerHTML="party products"
//         $.ajax({
//             url: url_for_change,
//             data: {
//                 'model': 'product',
//                 'name': 'product_name',
//             },
//             success: function (data) {
//                 console.log(data)
//                 $("#form_party_product").html(data);
//             }
//         });
//     }
      
// }

// function department_change(element){
//    return promise = new Promise(async(resolve)=>{
//         console.log("party_type_change",element)
//         let department_id = element.value;
    
//        await common_drop_down_get('subdivision',`form_department_subdivision`,'name',filter_by='department',filter_value=department_id)
//        await common_drop_down_get('userrole',`form_role`,'role',filter_by='department',filter_value=department_id)
//             resolve()
//     })
   
// }


// async function edit_get(id,model){
//     console.log(id,'as')
//     document.getElementById('dm-filter').style.display = 'none'
//     document.querySelector('.dm-add-button-div').innerHTML = ''
//     // document.querySelector('.dm-add-button-div').appendChild(dm_add_button)
//     container.innerHTML = ''
//  await create_form()
//     current_data = get_data[id]
//     data = get_data[id]

//    for (let [key, value] of Object.entries(form_content)) {
//     if(current_data[key] == null){
//         continue
//     }
//     if(key == 'party_contact_no'){
//         contact_no = current_data[key].split('-')
//         document.getElementById(`form_${key}`).value = contact_no[1]
//         document.getElementById(`form_number_code`).value = contact_no[0]
//         continue
//     }
//     if('list' in value && value['list']){
//         list_data[key] = current_data[key]
//         content = ''
//         for(let part=0;part<list_data[key].length;part++){
//             content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
//         }

//         document.querySelector(`.${key}_list`).innerHTML = content
//     }
//  if(value['type'] == 'checkbox'){
//     if(current_data[key]){
//         document.getElementById(`form_${key}`).checked = true
//     }
// }
// else{
//     if(typeof(current_data[key]) == Object){
//         list_data[key] = current_data[key]
//         document.querySelector(`.${key}_list`).innerHTML = ''
//         if(key == 'party_products'){
//             content = ''
//             for(let [input_key,value] of Object.entries(list_data[key])){
//                 content += `<p>${value.product} INR ${value.unit_price} <button onclick="delete_product_item('${key}',${input_key})"><i class="bi bi-x"></i></button></p>`
//             }
//         }else{
//             content = ''
//             for(let part=0;part<list_data[key].length;part++){
//                 content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
//             }
//         }
//         document.querySelector(`.${key}_list`).innerHTML = content
//     }
// else{
//     document.getElementById(`form_${key}`).value = current_data[key]
// }

//     if(key=='department' && current_data[key] && current_data[key] != ''){
//       await department_change(document.getElementById(`form_${key}`))
//     }


// }
// }
// if('currency' in current_data){
//     let elements = document.querySelectorAll('#form_currency')
//     elements.forEach(element_div => {
//         console.log(element_div)
//         element_div.value = current_data['currency']
//     });
// }
// if('parts' in current_data && current_data['parts'] && current_data['parts'].length){
//     list_data['parts'] = current_data['parts']
//     if(current_data['parts'].length){
//         data['multiple_parts'] = true
//         document.getElementById('div_multiple_parts').innerHTML =`
//         <label>Add Multiple Parts</label>
//         <div class="input-group">
//         <input type="text" class="form-control" id='form_parts'>
//         <div class="input-group-append">
//           <button class="btn btn-outline-secondary" onclick="add_item('parts')" type="button"><i class="bi bi-plus"></i></button>
//         </div>
//       </div>`
//         document.querySelector('.extra-fields').innerHTML = `<div id='parts_list' class='parts_list'></div>`
//         document.querySelector('.parts_list').innerHTML = ''
//         content = ''
//         for(let part=0;part<list_data['parts'].length;part++){
//             content += `<p>${list_data['parts'][part]} <button onclick="delete_item('part_name',${part})"><i class="bi bi-x"></i></button></p>`
//         }
//         document.querySelector('.parts_list').innerHTML = content
//     }
// }


// document.getElementById(`${model}Button`).setAttribute('onclick',`submit_data(${id})`)
// }

// async function show_form(){
//     console.log('as',`${model_name}Button`)
//    await create_form()
//     container.innerHTML= ''
//     // model_container.innerHTML = form
//     document.getElementById('dm-filter').style.display = 'none'
//     document.getElementById(`${model_name}Button`).disabled = true
//     document.getElementById(`${model_name}Button`).setAttribute('onclick','submit_data(null)')
// }

// function add_item(key){
//     element = document.getElementById(`form_${key}`)
//     element_value = element.options[element.selectedIndex].text
//     console.log(element)
//     if(!element.value){
//         document.querySelector('.model-messages').innerHTML =`fill ${key} field`
//     }
//     else if(list_data[key].includes(element.value)){
//         document.querySelector('.model-messages').innerHTML =`this ${element.value} altready added`
//     }else{
//         list_data[key].push(element_value)
//         document.querySelector(`.${key}_list`).innerHTML = ''
//         content = ''
//         for(let part=0;part<list_data[key].length;part++){
//             content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
//         }

//         document.querySelector(`.${key}_list`).innerHTML = content
//     }
//     data[key] = list_data[key]
//     element.value = ''
//     data[`${key}`] = list_data[key]
// }
