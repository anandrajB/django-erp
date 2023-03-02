var csrf_token = document.querySelector('.csrf').innerHTML
let common_drop_down_url
console.log('csrf_token: ' + csrf_token);
host = window.location.protocol + "//" + window.location.host;
let host_main = window.location.protocol + "//" + window.location.host;
let drop_down_url = host_main + '/api/dropdown'
let crud_url = host_main + '/api/get'
// let new form_url = host_main + '/api/form';
let form_url = new URL(host_main + '/api/form');
let count = 1
let party_details_count = 0
let card_name={'country':'country_name','partytype':'party_type'}
// delete modal
// document.querySelector('.delete-modal').innerHTML = ``

// function get_input_type(model){
//     form_url.searchParams.append('model', model);
//     fetch(form_url,
//         {
//             method: 'GET',
//             headers: {
//                 'Authorization': 'token' + ' ' + sessionStorage.getItem('token'),
//             },
//         })
//         .then(response =>{ 
//             console.log(response)
//             return response.json()
//            }).then(data => {
//             console.log(data)
//             if(data.form){
//             let content = create_form(data.form,model)
//             return content
//             }
//             // let c= create_form(data[0],'branch')
//             // console.log(c,'lofs')

//         })

// }

// function get_data(model){

// }

function get_dropdown_data(url,model,text,input){
    return fetch(`${url}?model=${model}&name=${text}`,{ 
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        }).then(response =>{
            return response.json()
        }).then(data =>{
            input = data
        })
}

function create_table(data,name,get_data,edit) {
    if(!data || data.length == 0){
        return ''
            }
    var table = `<table class='${name}_table createtable table-responsive-xl  text-nowrap' id=${name}>`;
    table += `<thead>`
    table += `<tr class="dm-table-header">`;

    headings = data[0]
    for (const [key, value] of Object.entries(headings)) {
        
        if(key=='pk'){
            // table += `<th scope="col">Sl.no</th>`;
            continue
        }
        else if(key=='id'){
            // table += `<th scope="col">Sl.no</th>`;
            continue
        }
       else if( key.includes("_get")){
          var  h = key
            h = h.replace('_get','')
         h= h.replace(/_/g, " ");
        table += `<th scope="col">${(h.charAt(0).toUpperCase())+h.slice(1,h.length)}</th>`;
        continue
        }
        if(`${key}_get` in data[0]){
            continue
        }
        var h= key.replace(/_/g, " ");
        table += `<th scope="col">${(h.charAt(0).toUpperCase())+h.slice(1,h.length)}</th>`;
      }
      table += `<th id='action-div-head'>Action</th>`;
    //   table += `<th>Delete</th>`;
    table += `</tr></thead><tbody>`;
    data.forEach((d, index) => {
        console.log(d.pk)

        table += `<tr id=${d.pk}>`;
        // table += `<td scope="col"> ${d.pk}</td>`;
        if(get_data){
        get_data[d.pk] = d
        }

        
        for (let [key, value] of Object.entries(d)) {
            if(key=='pk'){
                continue;
            }
         else if(key=='id'){
                // table += `<th scope="col">Sl.no</th>`;
                continue
            }
            if(`${key}_get` in d){
                continue
            }
            if(value==null || Array.isArray(value) && value.length == 0||value == ''){
                value = '-'
                console.log('check',key)
            }
            if(key == 'password'){
                value = '********'
            }
            // if value is an array or json object
            if(typeof value === 'object' && value!= null){
                
                console.log(value.length)
                // if value is an array
                if(Array.isArray(value) && value.length){
                    table += `<td id=${key}><ul id=${value}>`;
                    for (i=0;i<value.length;i++){
                        if(i==0){
                            table += ` <a class="" data-toggle="collapse" href="#${key}${count}_collapse" role="button" aria-expanded="false" aria-controls="${key}_collapse">
                            <li>${value[i]}</li>
                            </a> `
                            table += `<div class="collapse" id="${key}${count}_collapse">`
                            count += 1;
                                }
        
                                else{
                                    table += `<li>${value[i]}</li>`;
                                }
                    }

                    table += `
                    </div></ul></td>`;
                    continue
                }
                // if value is a json object
    
                else if(!Array.isArray(value)){
                    console.log(JSON.stringify(value))
                    if ('id' in value){
                        k = key.replace('_get','')
                        keys=Object.keys(value)
                        table += `<td id=${k}><span id=${value[keys[0]]}>${String(value[keys[1]]).toUpperCase()}</span></td>`
                        // table += `<td id=${k}><span id=${value['id']}>${String(value['name']).toUpperCase()}</span></td>`
                        continue
                    }

                    table += `<td id=${key}><span id=${JSON.stringify(value)}>`;
                    for (let [key2, value2] of Object.entries(value)) {
                        table += `<li>${String(value2).toUpperCase()}</li>`;
                    }
                    table += `</span></td>`
                continue

                }
            }
            if(value == '-' && key.endsWith('_get')){
                console.log('as')
                k = key.replace('_get','')
            table += `<td id=${k}>${String(value).toUpperCase()}</td>`;
            continue
            }
            table += `<td id=${key}>${String(value).toUpperCase()}</td>`;
          }
          if(edit=='common'){
          table += `<td > <span id="action-div"><img src="/media/assets/table/edit.svg" data-toggle="modal" data-target=#${name}Modal onclick=edit_get('${d.pk}',"${name}") />`;
          }
        //   else if(name=='product'){
        //     // table += `<td><i class="bi bi-pen" data-toggle="modal" data-target=#${name}Modal onclick=${name}Edit(${d.id},event) ></i></td>`
        //   }
          else{
            table += `<td> <img src="/media/assets/table/edit.svg" data-toggle="modal" data-target=#${name}Modal onclick=${name}Edit('${d.pk}',event) />`
          }
          table += `<img src="/media/assets/table/delete.svg" data-toggle="modal" data-target='#deleteModal'  onclick=Delete_data('${d.pk}') /></span></td>`;
    })
    table += `<tbody></table>`;
    console.log('create_table');
    return table;
}


function Edit(id, event,model) {
    parent = event.target.parentElement.parentElement
    var cid = parent.id
    var  tableFields = parent.children;
    console.log(tableFields)
    console.log(parent)
    messages.innerHTML=''
    var data = new Object
    for (item in tableFields) {
        console.log(String(tableFields[item].innerHTML),tableFields[item])
        if (String(tableFields[item].innerHTML).includes('<ul')) {
            var div = document.createElement('div');
            div.innerHTML = tableFields[item].innerHTML.trim();
            id = div.getElementsByTagName('ul')
            element=div.getElementsByTagName('ul')[0].getAttribute('id')
            var myArray = element.split(",");
            data[tableFields[item].id] = myArray
            console.log(tableFields[item])
            continue
        }
        if (tableFields[item].innerHTML) {
            console.log(tableFields[item].innerText)
            data[tableFields[item].id] = tableFields[item].innerHTML
        }
        else {
            data[tableFields[item].id] = ''
        }
    }
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (!key || key == 'undefined') {
                continue
            }
            if (typeof (data[key]) == 'object') {
                console.log('ul')
                arr = data[key]
                var div = document.getElementById(key)
                content = ''
                data[key].forEach(d => {
                    console.log(d)
                    content += `<p class='m-2'>${d}<i class="bi bi-trash" onclick=RemovePart('${d}')></i></p>`
                })
                div.innerHTML = content
                continue
            }
            if (data[key].includes('<span')){
                var htmlObject = document.createElement('div');
                htmlObject.innerHTML=data[key]
                var dropdown=htmlObject.querySelector('span').getAttribute('id')
                console.log(tableFields[item].innerText,dropdown)
                document.getElementById(`form_${key}`).value = dropdown
                continue
            }
        }
        if(data[key] == '-'){
        document.getElementById(`form_${key}`).value = ''   
        }else{
        document.getElementById(`form_${key}`).value = data[key]
        }
        
    }
    console.log(data)
    document.getElementById(`${model}Button`).setAttribute('onclick',`submit_data(${id})`)
    document.getElementById(`${model}Button`).disabled = false

    return 
}

  
function create_card(data,model,get_data){
 let content='<div class="d-flex flex-row justify-content-center flex-wrap">'
        data.forEach(element => {
            console.log(element)
            get_data[element.id] = element
            content += `<div class="card mx-2 my-5 " id=${element.id}>
            <div>
            <p class=" float-end mx-3 "><i class="bi bi-pen" data-toggle="modal" data-target=#${model}Modal onclick=edit_get(${element.id},'${model}') ></i></p>
            <p class=" float-end "><i class="bi bi-trash" data-toggle="modal" data-target='#deleteModal' onclick=Delete_data(${element.id}) ></i></p>
            </div>
                <p class="mx-5" id="${model}_name">${element[card_name[model]]}</p>
            </div>`
        })
        content += `</div>`
        return content
}

function get_party_dropdown(type,input_id,div_id){
    console.log(div_id)
 return fetch(`${drop_down_url}/?model=party&name=party_name&filter_by=party_type&filter_value=${type}`,{
        method: 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token,
        }
    }).then(response =>{
        return response.json()
    }).then(data =>{
        console.log(data,'data')
        document.getElementById(input_id).innerHTML = data.html
        document.getElementById(input_id).setAttribute('onchange',`get_party_data(this,'${div_id}')`)
    })
}

function get_party_data(element,div_id){
    console.log(document.querySelector(`#${div_id}`),'sa')

    if(element.value != ''){
        fetch(`${crud_url}?model=party&pk=${element.value}`,{
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        }).then(response =>{
            return response.json()
        }).then(data =>{
            console.log(data,'data')
            let content = ''
            party_details_count += 1
            content += `<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#partydatacollapse" aria-expanded="true" aria-controls="collapseOne">
            Party data
          </button>`

             content += `<table id="partydatacollapse" class='table collapse hide'><tbody>`
            actual_data = {'name':data['party_name'],'address':data['party_address'],'country':data['party_country'],'state':data['party_state'],
            'pincode':data['party_pincode'],'GSTIN':data['party_GSTIN'],'contact person':data['party_contact_name'],'contact number':data['party_contact_no'],'email':data['party_email']}
            for(let [key,value] of Object.entries(actual_data)){
                content +=  `<tr><td>${key}</td><td>${value}</td></tr>`
            }
            content += `</tbody></table>`
            console.log(content,'asd')
            document.querySelector(`#${div_id}`).innerHTML = content
        })
    }else{
        document.querySelector(`#${div_id}`).innerHTML = ''
        
    }
}

function common_drop_down_get(model,key,name,filter_by,filter_value){
    common_drop_down_url = `${host}/api/dropdown/?model=${model}`
    if(name && name!=''){
        common_drop_down_url += `&&name=${name}`
    }
    if(filter_by && filter_value){
        common_drop_down_url += `&&filter_by=${filter_by}&&filter_value=${filter_value}`
    }

   return fetch(common_drop_down_url,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
       elements =  document.querySelectorAll(`#${key}`)
       elements.forEach(element =>{
        element.innerHTML = data.html
       })
    })
}

