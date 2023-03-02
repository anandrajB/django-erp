let token = sessionStorage.getItem('token');
let input_count=0;
let content;
let purchase_request_items = {}
let form_data ={'raw_material':'select','quantity':'input'}
let dropdown_data;
let table,thead,tbody
let rm_list = []
let messages = document.querySelector('#messages')

// form_div.innerHTML(`  <label for="raw_material"></label>
// <select name="raw_material" onchange=rm_change(this) id="form_raw_material"></select>
// <label for="quantity"></label>
// <input type="number" onchange=quantity_change(this) name="quantity" id="form_quantity">
// <button class="btn btn-secondary" id="add_new" onclick=add_new_row()><i class="bi bi-plus"></i></button>`)


function get_dropdown(){
    return new Promise((resolve, reject) =>{
        $.ajax({
            url:window.location.protocol + "//" + window.location.host + '/api/dropdownjson/',
            data: {
                'model': 'rawmaterials',
                'name': 'rm_name',
            },
            success: function (data) {
                console.log(data)
                dropdown_data = data.list
                resolve()
            }
        });
    })
}


async function get(){
table = document.createElement('table');
thead = document.createElement('thead');
thead.innerHTML = `<tr><th>Raw material</th><th>Quantity</th><th>Action</th></tr>`
tbody = document.createElement('tbody');
table.appendChild(thead);
table.appendChild(tbody)
document.querySelector('#purchase_request_form').appendChild(table)
await get_dropdown()
 add_new_row(null)
}
get()
function add_new_row(element){
    if(element){
        // parent = element.parentNode.parentNode;
        // purchase_request_items[parent.id] = {}
        // purchase_request_items[parent.id]['id'] = document.getElementById('form_raw_material').value 
        parent = element.parentNode.parentNode;
        // action_td = parent.querySelector('#action_row')
        element.innerHTML = `<i class="bi bi-trash"></i>`
        element.setAttribute('onclick',`delete_row(this,${parent.id})`)
        if(parent.querySelector('#form_raw_material').value == '' || parent.querySelector('#form_quantity').value == ''){
            messages.innerHTML = '<p class="text-warning">fill all fields</p>'
            return 
        }
        if(Object.values(purchase_request_items).length==dropdown_data.length){
            messages.innerHTML = '<p class="text-warning">raw materials all are added</p>'
            return 
        }
        document.getElementById('pr_submit_button').disabled = false
    }
    options = '<option disabled selected value="">Select Raw Material </option>'
    console.log(rm_list,'lis')
for(i=0; i<dropdown_data.length; i++){
    if(!rm_list.includes(String(dropdown_data[i].id))){
    options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
    }
}

    input_count +=1
    form_div = document.createElement('tr')
    form_div.setAttribute('id',`${input_count}`)
    for(let [key,value] of Object.entries(form_data)){
        let td = document.createElement('td')
        content = `<${value} name="${key}" onchange=${key}_change(this) id="form_${key}">`
        if(value == 'select'){
            content += options
        }
        content += `</${value}>`
        td.innerHTML = content
        form_div.appendChild(td)
    }
    td = document.createElement('td')
    td.innerHTML = '<button class="btn btn-secondary" id="add_new" onclick=add_new_row(this)><i class="bi bi-plus"></i></button>'
    form_div.appendChild(td)
    tbody.appendChild(form_div)
    // $("#form_raw_material").html(options);
}
function raw_material_change(element){
    rm_list.push(element.value)
    var parent = element.parentNode.parentNode;
    if(!purchase_request_items[parent.id]){
        purchase_request_items[parent.id] ={}
    }
    purchase_request_items[parent.id]['id'] = element.value
    childrens = parent.parentNode.childNodes
    console.log(childrens)
    rm_list = []
    for(node=0;node<childrens.length;node+=1){
        div_id = childrens[node].id
       div = childrens[node].childNodes[0].querySelector('#form_raw_material')
       options = '<option disabled value="">Select Raw Material </option>'
       for(i=0; i<dropdown_data.length; i++){
        if(purchase_request_items[div_id] && purchase_request_items[div_id]['id'] == String(dropdown_data[i].id)){
            options += `<option selected value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
            rm_list.push(purchase_request_items[div_id]['id'])
        }
           else if(!rm_list.includes(String(dropdown_data[i].id))){
           options += `<option value="${dropdown_data[i].id}"> ${dropdown_data[i].name}</option>`
           }
       }
       console.log(options,'option selected')
     
       div.innerHTML = options
        // console.log('asd',div,div_id)
    }
}
function quantity_change(element){
    parent = element.parentNode.parentNode;
    if(!purchase_request_items[parent.id]){
        purchase_request_items[parent.id] ={}
    }
    purchase_request_items[parent.id]['quantity'] = element.value
}

function submit_pr(){
    list = Object.values(purchase_request_items)
    // table =  document.querySelector('#purchase_request_form').childNodes
    // last_div = table[1].childNodes[table.length - 1]
    // if(last_div.querySelector('#form_raw_material').value == '' || last_div.querySelector('#form_quantity').value == ''){
    //     messages.innerHTML = '<p class="text-warning">fill all fields</p>'
    //     return 
    // }
    // purchase_request_items[last_div.id] = {'id':last_div.querySelector('#form_raw_material').value,'quantity':last_div.querySelector('#form_quantity').value}

//     for(let [key,value] of Object.entries(purchase_request_items)){
// list.push(value)
//     } 
console.log(list,'d',Object.values(purchase_request_items))
    // fetch(host_main +'/api/purchase',
    // {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': 'token '+token,
    //                     'Content-Type':'application/json'
    //                 },
    //                 body : JSON.stringify({"raw_material_items" :list})
    //             }).then((response) => {return response.json()}).then(data =>{
    //                 console.log(data,'data')
    //                 if(data.status == 'success'){
    //                     messages.innerHTML = '<p class="text-success">purchase order request submitted successfully</p>'
    //                 }
    //                 else{
    //                     error = ''
    //                     if(typeof(data.data) == Object){
    //                     for (const [key, value] of Object.entries(data.data)) {
    //                         error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
    //                     }
    //                     }
    //                     else{
    //                         error += `<p class='text-danger'> ${data.data} </p>`
    //                     }
    //                     // messages.innerHTML = error
    //                     messages.innerHTML = error
    //                 }
    //             })
}

function delete_row(element,id){
    delete purchase_request_items[id]
    parent = element.parentNode.parentNode;
    parent_tbody = parent.parentNode
    parent_tbody.removeChild(parent)
}