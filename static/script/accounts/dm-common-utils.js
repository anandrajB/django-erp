// function random_password(password){
//     return new Promise(resolve=>{
      
//          resolve()
//     })
//     // return promise
// }
let data = {}
function submit_data(id){
//     for (let [key, value] of Object.entries(form_content)) {
//        // console.log(key,'key',value,'val')
      
//        if('field' in value && value['field'] == 'list'){
//            data[key] = list_data[key]
//        }else if(value['type'] == 'checkbox'){
//            if(document.getElementById(`form_${key}`).checked){
//                data[key] = true
//            }
//            else{
//                data[key] = false
//            }
//        }else{
//            data[key] = document.getElementById(`form_${key}`).value 
//        }
//    }   
// if(id==null && model_name=='user'){
    // var password= ''
    // let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // let passwordLength = 8;
    // for (let i = 0; i < passwordLength; i++) {
    //   let randomNumber = Math.floor(Math.random() * chars.length);
    //   password += chars.substring(randomNumber, randomNumber +1);
    //  }
    // console.log('user',model_name,password)
    // data['password'] = password
// }
console.log('multiple_parts' in data,'check')
if(id == null &&model_name=='product' && 'multiple_parts' in data == false){
    data['multiple_parts'] =false
}
   console.log(data,'dataea')
   let method = 'POST'
   let dm_url = get_url
   let result = 'created'
   if(id){
       dm_url += `&pk=${id}`
       method = 'PUT'
       result = 'updated'
   }
      console.log(id,'id')
   fetch(dm_url,
      {
       method: method,
       body: JSON.stringify(data),
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
           messages.innerHTML = `<p class='text-success'> ${model_name} ${result}</p>`
           model_container.innerHTML = ''
           document.querySelector('.dm-add-button-div').innerHTML = ''
        document.querySelector('.dm-add-button-div').appendChild(dm_add_button)
        document.getElementById('dm-filter').style.display = 'block'
           model_form_get()
        }
        else{
            console.log(data)
            error = ''
            for (const [key, value] of Object.entries(data.data)) {
                error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
            }
            messages.innerHTML = error
           //  document.querySelector('.model-messages').innerHTML = error
        }
   }) 
   console.log(data,'check')
   }
   
   function get_dropdown(key){
       key_name = key
    //    if(key=='role'){
    //        key_name = 'userrole'
    //    }
    //    else if(key.includes('subdivision')){
    //        key_name = 'subdivision'
    //    }
    //    else if(key.includes('country')){
    //        key_name = 'country'
    //    }else if(key == 'party_type'){
    //        key_name = 'partytype'
    //    }
   common_drop_down_get(key_name,`form_${key}`)
   }
   
   
   function check_allfield(model){
       document.getElementById(`${model}Button`).disabled = true
       flag = true
       for (let [key, value] of Object.entries(form_content)) {
           if('field' in value == false){
              element  = document.getElementById(`form_${key}`).value
              if(value['required'] && element == ''){
               flag = false
              }
           }
       }   
       if(flag){
           document.getElementById(`${model}Button`).disabled = false
       }
   }
           // document.getElementById(`${model_name}Button`).disabled = false
   
   function Delete_data(id){
       document.getElementById('yes').onclick=function(){
           fetch(`${get_url}&pk=${id}`,
           {
            method: 'DELETE',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        })
        .then(response =>{ 
            console.log(response)
   
           if(response.status==200){
               model_form_get()
               document.getElementById('dm-filter').style.display = 'block'
               document.getElementById('messages').value = `<p class='text-warning'>deleted successfully</p>`
               }
               else{
                   document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
               }
           })
         }
   }
 
   function currency_change(element){
     data['currency']= element.value
    parent_element = element.parentNode.parentNode
   let elements = parent_element.querySelectorAll('#form_currency')
    elements.forEach(element_div => {
        element_div.value = element.value
    });
   }

   function get_multipart(element){
    if(element.checked){
        data['multiple_parts'] = true
        document.getElementById('div_multiple_parts').innerHTML =`
        <label>Add Multiple Parts</label>
        <div class="input-group">
        <input type="text" class="form-control" id='form_parts'>
        <div class="input-group-append">
        <span class='plus-btn'><button class="btn btn-outline-secondary" onclick="add_item('parts')" type="button"><img class="icon" src="/media/assets/table/+.svg" /></button></span>
        </div>
      </div>`
        document.querySelector('.extra-fields').innerHTML = `<div id='parts_list' class='parts_list'></div>`
        list_data['parts'] = []
    }else{
        document.getElementById('div_multiple_parts').style.display ='block'
    }
   }

   function delete_item(key,index){

    list_data[key].splice(index, 1)
    document.querySelector(`.${key}_list`).innerHTML = ''
    content = ''
    for(let part=0;part<list_data[key].length;part++){
        content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
    }
    data[`${key}`] = list_data[key]
    document.querySelector(`.${key}_list`).innerHTML = content
    data[key] = list_data[key]
   }

   function get_dm_data(element,key){
    data[key] = element.value
   }
   
   function add_party_products(element,key){
    console.log(typeof(list_data[key]))
    parent = element.parentNode
    input_number = 0
    if(Object.keys(list_data[key]).length){
    input_number =Object.keys(list_data[key]).length
    }
    product = document.getElementById('subform_product').options[document.getElementById('subform_product').selectedIndex].text
    price = parent.querySelector('#subform_unit_price').value
 
    // product = parent.querySelector('#subform_product')
    parent.querySelector('#subform_unit_price').value = ''

    if(document.getElementById('subform_product').value=='' || price== ''){
        messages.innerHTML = 'fill the fields'
        return
    }
    document.getElementById('subform_product').value = ''
    list_data[key][input_number] = {'product':product,'unit_price':price}
    document.querySelector(`.${key}_list`).innerHTML = ''
    content = ''
    for(let [input_key,value] of Object.entries(list_data[key])){
        content += `<p>${value.product} INR ${value.unit_price} <button onclick="delete_product_item('${key}',${input_key})"><i class="bi bi-x"></i></button></p>`
    }
    document.querySelector(`.${key}_list`).innerHTML = content
    data[key] = list_data[key]
   }

   function party_type_change(element){
    data['party_type'] = element.value
    // var option= document.getElementById('id_party_type')
    let text= element.options[element.selectedIndex].text
    console.log(text)
    if (String(text).toLowerCase() === "supplier"){
        // document.querySelector("label[for=id_party_products]").innerHTML="Party Rawmaterials"
        html = '<option value="">------</option>'

    fetch( `${host}/api/dropdown/?model=rawmaterial&&name=rm_name`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        for(i=0;i<data.list.length;i++){
                            html += `<option value='${data.list[i].id}'>${data.list[i].name}</option>`
                        }
    })
    fetch( `${host}/api/dropdown/?model=product&&name=product_name&&filter_by=product_type&&filter_value=semi_finished`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        for(i=0;i<data.list.length;i++){
                        html += `<option value='${data.list[i].id}'>${data.list[i].name}</option>`
                    }
    document.getElementById('subform_product').innerHTML = html
    })
    }
        else{
            common_drop_down_get('product',`subform_product`,'product_name') 
        }
   }

function delete_product_item(key,index){
    delete list_data[key][index]
    document.querySelector(`.${key}_list`).innerHTML = ''
    content = ''
    for(let [input_key,value] of Object.entries(list_data[key])){
        content += `<p>${value.product} INR ${value.unit_price} <button onclick="delete_product_item('${key}',${input_key})"><i class="bi bi-x"></i></button></p>`
    }
    data[`${key}`] = list_data[key]
    document.querySelector(`.${key}_list`).innerHTML = content
    data[key] = list_data[key]
}
function get_contact_no(element){
    parent = element.parentNode
    data['party_contact_no'] = `${parent.querySelector('#form_number_code').value}-${element.value}`
}
