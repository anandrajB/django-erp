let product_data;
let product_form_data
let product_details_div = document.createElement('div')
product_details_div.setAttribute('class','product_details')
let bom_form_div =   document.createElement('div')
bom_form_div.setAttribute('class','bom_form')
rm_code_dropdown_html = ''
document.querySelector('.content-container').appendChild(product_details_div)
document.querySelector('.content-container').appendChild(bom_form_div)
pf_edit = false
// form_content;
dropdown_list = {}
form_product = ''
 function get_product_details(){
    pf_edit = false
    product_form_data = form_data[model_name]['product_data']
    document.querySelector('.dm-add-button-div').style.display = 'none'
    product_details_div.innerHTML= ''
   return fetch(`${window.location.protocol+'//'+window.location.host}/api/get`+'?model=product',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        console.log(data,'daa')
        product_data = data.data;
        table = ''
        table += `<table class='table'><thead><tr>`
        for(let [key,value] of Object.entries(product_form_data)){
            table += `<th>${value['label']}</th>`
        }
        table += `</tr></thead><tbody>`
        messages.innerHTML = ''
        if(product_data.length){
            product_data.forEach(element => {
                table += `<tr id=${element.pk} onclick="get_bom('${element.pk}')">`
                for(let [key,value] of Object.entries(product_form_data)){
                    table += `<td>${element[key]}</td>`
                }
                table += `</tr>`
            });
        }
        table += `</tbody></table>`
        product_details_div.innerHTML = table

        })
}

function get_bom(product_id){
    form_product = product_id
    data['product_code'] = product_id
    bom_form_div.innerHTML = ''
    parent_div = document.querySelector('.product_details').childNodes[0].childNodes[1]
    children = parent_div.childNodes
    children.forEach(element=>{
        console.log(element)
        if(element.id != product_id){
            parent_div.removeChild(element)
        }
    })
    if(model_name == 'billofmaterial'){
        url = crud_url +`?model=billofmaterial&filter_by=product_code&filter_value=${product_id}`
    }else{
        url = crud_url +`?model=productivity&filter_by=product&filter_value=${product_id}`
    }
    fetch(url,
    {
        method: 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token,
        },
    })
    .then(response => {
        console.log(response)
        return response.json()
    }).then(data => {
        content = ''
        form_content =form_data[model_name]['main_data']
        table = ''
        table += `<table class='table main-table'><thead><tr>`

        for(let [key,value] of Object.entries(form_content)){
            table += `<th>${value['label']}</th>`
        }
        table+= `<th>Action</th>`
        table += `</tr></thead><tbody>`
        if (data.status =='success' && data.data.length){
            pf_edit = true
            get_data = {}
                data.data.forEach(element =>{
                    get_data[element.pk] = element
                    table += `<tr id='${element.pk}'>`
                    for(let [key,value] of Object.entries(form_content)){
                        if(`${key}_get` in element){
                            key_get = `${key}_get`
                            table+= `<td id='${key}'>${element[key_get]}</td>`
                        }else{
                            table+= `<td id='${key}'>${element[key]}</td>`
                        }
                    }
                    table += `<td> <img src="/media/assets/table/edit.svg" onclick="edit_get_row(this,${element.pk})"><img src="/media/assets/table/delete.svg" onclick="delete_row(this,${element.pk})"></td>`
                    table += `</tr>`
                })
        }
        table += `</tbody></table><button class='new-row-btn' onclick='add_new_row()'><i class="bi bi-plus"></i></button>`
        bom_form_div.innerHTML = table
        // td = document.createElement('td')
        // td.innerHTML = `<span id="action-div">
        // <img src="/media/assets/table/edit.svg" onclick="edit_row()"><img src="/media/assets/table/delete.svg" onclick="delete_row()"></span>`
        // tr.appendChild(td)
    })
}

function rm_code_dropdown(){
    html = '<option value="">------</option>'

  return  fetch( `${host}/api/dropdown/?model=rawmaterial&&name=rm_name`,{
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
        dropdown_list['rawmaterial'] = data.list

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
        dropdown_list['product'] = data.list
                    })
            rm_code_dropdown_html = html
    })
}

async function add_new_row(){
    tr = document.createElement('tr')
    for(let [key,value] of Object.entries(form_content)){
        td = document.createElement('td')
        if('write' in value && !value['write']){
            dm_input = document.createElement('span')
            dm_input.setAttribute('id',`form_${key}`)
            td.appendChild(dm_input)
            tr.appendChild(td)
            continue
        }else{
                if(value['input'] == 'select'){  
                    dm_input = document.createElement('select')
                    dm_input.setAttribute('class','form-select')
                    dm_input.setAttribute('id',`form_${key}`)
                    if(key == 'part_name'){
                        await get_part (key,dm_input)
                     }
                   else if(key == 'rm_code'){
                        await rm_code_dropdown()
                        console.log(rm_code_dropdown_html)
                        dm_input.innerHTML = rm_code_dropdown_html
                    }
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
                else{
                    dm_input = document.createElement('input')
                    dm_input.setAttribute('type', value['type'])
                    dm_input.setAttribute('id',`form_${key}`)
                    dm_input.setAttribute('class', 'form-control')
                }
                if('oninput' in value){
                    dm_input.setAttribute('oninput',value['oninput'])
                }else{
                    dm_input.setAttribute('oninput',`get_dm_data(this,'${key}')`)
                }
                td.appendChild(dm_input)
    }
        tr.appendChild(td)
    }
    td = document.createElement('td')
    td.innerHTML = `<span id="action-td">
    <img src="/media/assets/table/tick.svg" class="btn" onclick="edit_row(this,null)"><img src="/media/assets/table/cross.svg" class="btn" onclick="delete_row(this,null)"></span>`
    tr.appendChild(td)
    document.querySelector('.main-table').childNodes[1].appendChild(tr)
}

function rm_code_get(element){
    parent = element.parentNode.parentNode
    text = element.options[element.selectedIndex].text
    data['rm_name'] = text
    data['rm_code'] = element.value
    for(let [key,value] of Object.entries(dropdown_list)){
        value.forEach(item =>{
            if(item.id == element.value){
                data['rm_type'] = key
            }
        })
    }
}

function edit_row(element,id){
    let url;
    url_model = model_name
    let product_id = data['product']
    if(model_name == 'billofmaterial'){
        product_id = data['product_code']
    }
    if(model_name == 'productionflow'){
        url_model = 'productivity'
        data['product'] = data['product_code']
    }
    if(id){
        url = crud_url +`?model=${url_model}&pk=${id}`
       method = 'PUT'
    }else{
         url = crud_url +`?model=${url_model}`
        method = 'POST'
    }
    fetch(url,
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
        }).then(async(data) => {
         console.log(data)
         await get_product_details()
         get_bom(form_product)
         if(model_name != 'productionflow'){
            data = {}
         }
         })

         if(model_name=='productionflow'){
            if(!'part_name' in data){
                data['part_name'] = ''
            }
            fetch(`${host_main}/api/pf`,
                {
                 method: 'POST',
                 body: JSON.stringify({'product_code':form_product,'part_name':data['part_name']}),
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'token' + ' ' + token,
                     'X-CSRFToken': csrftoken
                 }   
             })
             .then(response =>{ 
                 console.log(response)
                 return response.json()
                }).then(async(data) => {
                 console.log(data)
                 data = {}
                 })
         }
}

// function add_pf(){
    
// }
// delete row from table
async function delete_row(element,id){
    let product_id = data['product']
    let parent_element = element.parentNode.parentNode

    if(model_name == 'billofmaterial'){
        product_id = data['product_code']
    }
    if(id=='refresh'){
       await get_product_details()
        get_bom(form_product)
        return
    }
    url_model = model_name
    if(model_name == 'productionflow'){
        url_model = 'productivity'
    }
    if(id){
        part_name = parent_element.querySelector('#part_name').innerHTML
        fetch(crud_url+`?model=${url_model}`+`&pk=${id}`,
        {
         method: 'DELETE',
         headers: {
             'Authorization': 'token' + ' ' + token,
         }
     })
     .then(async(response) =>{ 
         console.log(response)
         if(response.status==200){
            await get_product_details()
            if(model_name != 'productionflow'){
                data = {}
            }

            }
            get_bom(form_product)
            if(model_name=='productionflow'){
                if(!'part_name' in data){
                    data['part_name'] = ''
                }
                fetch(`${host_main}/api/pf`,
                    {
                     method: 'POST',
                     body: JSON.stringify({'product_code':form_product,'part_name':part_name}),
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': 'token' + ' ' + token,
                         'X-CSRFToken': csrftoken
                     }   
                 })
                 .then(response =>{ 
                     console.log(response)
                     return response.json()
                    }).then(async(data) => {
                     console.log(data)
                     data = {}
                     })
             }


        })
      
    }else{
        parent = element.parentNode.parentNode.parentNode.parentNode
        parent.removeChild(element.parentNode.parentNode.parentNode)
        data = {}
    }
}

async function edit_get_row(element,id){
    parent = element.parentNode.parentNode
    currend_data = get_data[id]
    data = currend_data
    for(let [key,value] of Object.entries(form_content)){

        if('write' in value && !value['write']){
            dm_input = document.createElement('span')
            dm_input.setAttribute('id',`form_${key}`)
            if(parent.querySelector(`#${key}`)){
                parent.querySelector(`#${key}`).innerHTML = ''
            parent.querySelector(`#${key}`).appendChild(dm_input)
            }
            continue
        }else{
                if(value['input'] == 'select'){  
                    dm_input = document.createElement('select')
                    dm_input.setAttribute('class','form-select')
                    dm_input.setAttribute('id',`form_${key}`)
                    if(parent.querySelector(`#${key}`)){
                        parent.querySelector(`#${key}`).innerHTML = ''
                    parent.querySelector(`#${key}`).appendChild(dm_input)
                    }
                    if(key == 'rm_code'){
                        await rm_code_dropdown()
                        console.log(rm_code_dropdown_html)
                        dm_input.innerHTML = rm_code_dropdown_html
                    }
             if(value['table']){
                      await common_drop_down_get(value['table'],`form_${key}`)
                }
                else if(value['options']){
                    options = `<select value=''>select ${key}</select>`
                    value['options'].forEach(element => {
                        options += `<option value="${element}">${element}</option>`
                    });
                    dm_input.innerHTML = options
                }
                }
                else{
                    dm_input = document.createElement('input')
                    dm_input.setAttribute('type', value['type'])
                    dm_input.setAttribute('id',`form_${key}`)
                    dm_input.setAttribute('class', 'form-control')
                    if(parent.querySelector(`#${key}`)){
                        parent.querySelector(`#${key}`).innerHTML = ''
                    parent.querySelector(`#${key}`).appendChild(dm_input)
                    }
                }
                if('oninput' in value){
                    dm_input.setAttribute('oninput',value['oninput'])
                }else{
                    dm_input.setAttribute('oninput',`get_dm_data(this,'${key}')`)
                }
                dm_input.value = currend_data[key]      
                console.log(dm_input.value,'value',key,currend_data,currend_data[key])
    }

    }
    element.parentNode.innerHTML = `<span id="action-td">
    <img src="/media/assets/table/tick.svg" class="btn" onclick="edit_row(this,${id})"><img src="/media/assets/table/cross.svg" class="btn" onclick="delete_row(this,'refresh')"></span>`
    // parent.removeChild(element.parentNode)

}
