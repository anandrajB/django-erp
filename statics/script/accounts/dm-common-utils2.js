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

function department_change(element){
    return promise = new Promise(async(resolve)=>{
         console.log("party_type_change",element)
         let department_id = element.value;
     
        await common_drop_down_get('subdivision',`form_department_subdivision`,'name',filter_by='department',filter_value=department_id)
        await common_drop_down_get('userrole',`form_role`,'role',filter_by='department',filter_value=department_id)
             resolve()
     })
    
 }
 
 async function edit_get(id,model){
     console.log(id,'as')
     document.getElementById('dm-filter').style.display = 'none'
     document.querySelector('.dm-add-button-div').innerHTML = ''
     // document.querySelector('.dm-add-button-div').appendChild(dm_add_button)
     container.innerHTML = ''
    await create_form()
     current_data = get_data[id]
     data = get_data[id]
 
    for (let [key, value] of Object.entries(form_content)) {

        if(value['input'] == 'select' && 'table' in value){
            await common_drop_down_get(value['table'],`form_${key}`)
        }
        else if('currency' in value){
           await common_drop_down_get('currency','form_currency','currency_name')
        }
        if(key == 'password'){
            document.querySelector(`#form_${key}`).setAttribute('disabled', 'disabled')
        }
     if(current_data[key] == null){
         continue
     }
     if(key == 'party_contact_no'){
         contact_no = current_data[key].split('-')
         document.getElementById(`form_${key}`).value = contact_no[1]
         document.getElementById(`form_number_code`).value = contact_no[0]
         continue
     }
     if('list' in value && value['list']){
         list_data[key] = current_data[key]
         content = ''
         for(let part=0;part<list_data[key].length;part++){
             content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
         }
 
         document.querySelector(`.${key}_list`).innerHTML = content
     }
  if(value['type'] == 'checkbox'){
     if(current_data[key]){
         document.getElementById(`form_${key}`).checked = true
     }
 }
 else{
     if(typeof(current_data[key]) == Object){
         list_data[key] = current_data[key]
         document.querySelector(`.${key}_list`).innerHTML = ''
         if(key == 'party_products'){
             content = ''
             for(let [input_key,value] of Object.entries(list_data[key])){
                 content += `<p>${value.product} INR ${value.unit_price} <button onclick="delete_product_item('${key}',${input_key})"><i class="bi bi-x"></i></button></p>`
             }
         }else{
             content = ''
             for(let part=0;part<list_data[key].length;part++){
                 content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
             }
         }
         document.querySelector(`.${key}_list`).innerHTML = content
     }
 else{
     document.getElementById(`form_${key}`).value = current_data[key]
 }
 
     if(key=='department' && current_data[key] && current_data[key] != ''){
       await department_change(document.getElementById(`form_${key}`))
     }
 }
 }
 if('currency' in current_data){
     let elements = document.querySelectorAll('#form_currency')
     elements.forEach(element_div => {
         console.log(element_div)
         element_div.value = current_data['currency']
     });
 }
 if('parts' in current_data && current_data['parts'] && current_data['parts'].length){
     list_data['parts'] = current_data['parts']
     if(current_data['parts'].length){
         data['multiple_parts'] = true
         document.getElementById('div_multiple_parts').innerHTML =`
         <label>Add Multiple Parts</label>
         <div class="input-group">
         <input type="text" class="form-control" id='form_parts'>
         <div class="input-group-append">
           <button class="btn btn-outline-secondary" onclick="add_item('parts')" type="button"><i class="bi bi-plus"></i></button>
         </div>
       </div>`
         document.querySelector('.extra-fields').innerHTML = `<div id='parts_list' class='parts_list'></div>`
         document.querySelector('.parts_list').innerHTML = ''
         content = ''
         for(let part=0;part<list_data['parts'].length;part++){
             content += `<p>${list_data['parts'][part]} <button onclick="delete_item('part_name',${part})"><i class="bi bi-x"></i></button></p>`
         }
         document.querySelector('.parts_list').innerHTML = content
     }
 }
 
 
 document.getElementById(`${model}Button`).setAttribute('onclick',`submit_data(${id})`)
 document.getElementById(`${model}Button`).innerHTML = `Update`
 }
 
 async function show_form(){
     console.log('as',`${model_name}Button`)
    await create_form()
     container.innerHTML= ''
     // model_container.innerHTML = form
     document.getElementById('dm-filter').style.display = 'none'
     document.getElementById(`${model_name}Button`).disabled = true
     document.getElementById(`${model_name}Button`).setAttribute('onclick','submit_data(null)')
     document.getElementById(`${model_name}Button`).innerHTML = `Add`
 }
 
 function add_item(key){
     element = document.getElementById(`form_${key}`)
     if(element.options){
        element_value = element.options[element.selectedIndex].text
     }
     else{
        element_value = element.value
     }
     console.log(element)
     if(!element.value){
         document.querySelector('.model-messages').innerHTML =`fill ${key} field`
     }
     else if(list_data[key].includes(element.value)){
         document.querySelector('.model-messages').innerHTML =`this ${element.value} altready added`
     }else{
         list_data[key].push(element_value)
         document.querySelector(`.${key}_list`).innerHTML = ''
         content = ''
         for(let part=0;part<list_data[key].length;part++){
             content += `<p>${list_data[key][part]} <button onclick="delete_item('${key}',${part})"><i class="bi bi-x"></i></button></p>`
         }
 
         document.querySelector(`.${key}_list`).innerHTML = content
     }
     data[key] = list_data[key]
     element.value = ''
     data[`${key}`] = list_data[key]
 }
 
 function get_part (key,element) {
    console.log('haia')
    // GetProductionflow(null)
   return fetch( `${host}/api/pf_dropdown?id=${form_product}&&filter=yes`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ sessionStorage.getItem('token')
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
            console.log(data,'sa')
            // data = ` <option value="">select Part</option>` + data
            // part_have_pf = data.exists
            multipart = data.multipart
            if(!multipart){
               element.setAttribute('disabled', 'disabled')
            }else{
                element.innerHTML = data.data  
            }
            // document.getElementById('form_parts').innerHTML = data.data
    })
}