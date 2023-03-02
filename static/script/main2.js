let measured_unit_data = {}
function get_raw_maetial_type(element,key){
    parent = element.parentElement.parentElement
    if(!list_form_items[page][parent.id]){
        list_form_items[page][parent.id] ={}
    }
    list_form_items[page][parent.id]['rawmaterial_type'] = element.value
    if(element.value != ''){
    if(element.value == 'rawmaterial'){
        label_name = 'rawmaterial_name'
        text_value = 'rm_name'
    common_drop_down_get(element.value,`form_${key}`,text_value) 
    }
    else if(element.value == 'semi-finished-goods'){
        label_name = 'product_name'
        model_name = 'product'
        text_value = 'product_name' 
        filter_by = 'product_type'
        filter_value = 'semi-finished'
    common_drop_down_get(model_name,`form_${key}`,text_value,filter_by,filter_value) 
    }
}
    else{
        document.getElementById(`form_${key}`).innerHTML = '<option value="">-------</option>'
    }

}

function measured_unit_get(){
    fetch(crud_url +`?model=rawmaterial`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        if(data.status=='success'){
            data.data.forEach(element => {
                measured_unit_data[`${element.id}`] = element.measured_unit_get
            });
        }
    })
}

function get_cost(element,item1,item2,cost){
    parent = element.parentNode.parentNode;

if(!list_form_items[page][parent.id]){
    list_form_items[page][parent.id] ={}
}
list_form_items[page][parent.id][item1] = element.value
    current_tr =list_form_items[page][parent.id] 
if(item1 in current_tr  && item2 in current_tr){
    console.log(`form_${cost}`)
    list_form_items[page][parent.id][cost] = parseInt(current_tr[item1])*parseInt(current_tr[item2])
    parent.querySelector(`#form_${cost}`).innerHTML = list_form_items[page][parent.id][cost]
}

}
// 'oninput':'get_cost(this,"quantity","unit_price","cost_of_products")'
