
function get_bom(){
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
        if(data.status == 'success'){
            document.querySelector('#bom-details').innerHTML = ''
            table_content = document.createElement('table')
            thead = document.createElement('thead')
          tbody = document.createElement('tbody')
          bom_form_data['rm_idname']['value'] = []
          bom_form_data['rm_type']['value'] = []
          bom_form_data['available_stock']['value'] = []
          bom_form_data['measured_unit']['value'] = []
          bom_form_data['quantity']['value'] = []
            table_head = '<tr>'
            for(let [key,value] of Object.entries(bom_form_data)){
                table_head += `<th>${value['label']}`
            }
            for(i=0;i<data.data.length;i++){
                product_quantity = document.getElementById('form_quantity').value
                if(!product_quantity || product_quantity==''){
                    product_quantity = 1
                }
            
                bom_form_data['rm_idname']['value'].push(data.data[i].rm_idname)
                bom_form_data['rm_type']['value'].push(data.data[i].rm_type)

                if(data.data[i].rm_type == 'rawmaterial'){
                    
                    if(rm_inventory[data.data[i].rm_id]){
                        bom_form_data['available_stock']['value'].push(rm_inventory[data.data[i].rm_id].rm_stock)
                    }else{
                        bom_form_data['available_stock']['value'].push('')
                    }
                }else{
                    if(product_inventory[data.data[i].rm_id]){
                        bom_form_data['available_stock']['value'].push(product_inventory[data.data[i].rm_id].product_stock)     
                    }else{
                        bom_form_data['available_stock']['value'].push('')
                    }                    
                }
                
                if(data.data[i].measured_unit){
                    bom_form_data['measured_unit']['value'].push(data.data[i].measured_unit)
                }else{
                    bom_form_data['measured_unit']['value'].push('')
                }
                if(data.data[i].rm_quantity){
                bom_form_data['quantity']['value'].push((data.data[i].rm_quantity * product_quantity))
                }
            }
            table_head += `</tr>`
            index = 0
            data.data.forEach(item =>{
            tr = document.createElement('tr')
            tr.setAttribute('id',item.id)
    product_quantity = document.getElementById('form_quantity').value
                for(let [key,value] of Object.entries(bom_form_data)){
                    td = document.createElement('td')
                    if(value['input'] == 'text' && value['value']){
                        console.log('input',value['value'][index])
                        text = document.createElement('p')
                        text.innerHTML = `${value['value'][index]}`
                        td.appendChild(text)
                    }else{
                        if(key=='required_action' || key == 'action_quantity'){
                            if(bom_form_data['available_stock']['value'][index] > bom_form_data['quantity']['value'][index]){
                                input = `<${value['input']} disabled id='form_${key}'>`
                            }
                            else{
                                input = `<${value['input']} id='form_${key}'>`
                            }
                        }else{
                            input = `<${value['input']} id='form_${key}'>`
                        }
                        if(value['input'] =='select' && value['options']){
                            input += `<option value=''> Select ${key}</option>`
                            if(key == 'required_action'){
                                option_list = ['sub-production','purchase-request']
                                if(bom_form_data['rm_type']['value'][index] == 'rawmaterial'){
                                    option_list = ['purchase-request']
                                }
                                for(i=0;i<option_list.length;i++){
                                    input += `<option value=${option_list[i]}>${option_list[i]}</option>`
                                }
                            }else{
                                for(i=0;i<value['options'].length;i++){
                                    input += `<option value=${value['options'][i]}>${value['options'][i]}</option>`
                                }
                            }

                         input += `</${value['input']}>`
                        }
                        td.innerHTML = input
                        }
                    tr.appendChild(td)
                }
                index += 1
                tbody.appendChild(tr)
            })
            if(data.data.length){
            thead.innerHTML = table_head
            }
            table_content.appendChild(thead)
            table_content.appendChild(tbody)
            document.querySelector('#bom-details').appendChild(table_content)
        }
    })
}
let parent_div
let raw_material_data = []
let bom_dict = {}
function create_production_order(status,id){
    messages.innerHTML = ''
    status = status_list[status]
    console.log(status,'sata')
    raw_material_data = []
    bodydata = {}
    bodydata['production_no'] = production_no
    bodydata['production_type'] = document.getElementById('form_production_type').value
    bodydata['master_production_no'] = document.getElementById('form_master_production_no').value
    bodydata['sales_order_no'] = null
    if( bodydata['production_type'] != 'internal'){
        bodydata['sales_order_no'] = document.getElementById('form_sales_order_no').value
    }
    bodydata['product'] = product_id
    bodydata['parts'] = []
    if(document.getElementById('form_parts').value != ''){
        bodydata.push(document.getElementById('form_parts').value)
    }
    bodydata['status'] = status
    if(document.querySelector('#form_all_parts').checked){
        bodydata['parts'] = 'allparts' 
    }
    bom_datas.length(
        parent_div = document.querySelector('#bom-details').childNodes[0].childNodes[1].childNodes,
        bom_datas.forEach(child =>{
            bom_dict[child.id] = child
        }),
        parent_div.forEach(element => {
            current_bom = bom_dict[element.id]
            if(element.querySelector('#form_required_action').disabled){
                return
            }
            else{
                raw_material_data.push({'rm_type':current_bom['rm_type'],'rm_id':current_bom['rm_id'],'required_action':element.querySelector('#form_required_action').value,'quantity_to_produce':element.querySelector('#form_action_quantity').value})
            }
        }),
        bodydata['raw_material_data'] = raw_material_data
    )

    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    method = 'POST'
    result = 'created successfully'
    production_order_url = host_main + `/api/production-order`
    if(id){
        method = 'PUT'
        result = 'updated successfully'
        production_order_url += '?id=' + id
    }
    fetch(production_order_url,
    {
        method: method,
        body: JSON.stringify(bodydata),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': 'token' + ' ' + token,
        },
    })
    .then(response =>{ 
        console.log(response)
        return response.json()
        }).then(data =>{
            console.log(data,'sa')
            if(data.status== 'success'){
                messages.innerHTML = result
            }
             else{
                 console.log(data)
                 error = ''
                 if(typeof(data.data) == Object){
                 for (const [key, value] of Object.entries(data.data)) {
                     error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                 }
                }else{
                    error = `<p class='text-danger'> ${data.data} </p>`
                }
                 messages.innerHTML = error
             }
        })

}

async function production_order_get(){

    await ramdom_production_number()

    cards = '<div class="po_list">'
    cards += `<button onclick='getnew()' class='btn btn-sm btn-primary'>new production order</button>`
    for(let [key,value] of Object.entries(production_order_list)){
        cards += `<div onclick=edit_po(${key}) id=${key}>
        <p>${key}</p>
        <p>${value.status}</p>
        </div>`
    }
    cards += `</div>`
    document.querySelector('.production-order-list').innerHTML = cards
}
function getnew(){
    sub_production_flag = false
    production_order_form_get(null)
}
production_order_get()
function edit_po(id){
    sub_production_flag = true
    production_order_form_get(id)
}
{/* <div class="row">
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</div> */}
