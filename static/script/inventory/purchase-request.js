let bodydata = {}
let measured_unit_data = {}
let purchase_request_form_data = {
    'production_no': {'input':"input","label":"production number",'onchange':'get_input(this,"production_no")'},
    'rm_type':{'input':'select','label':'Product Type / Raw material','options':['rawmaterial','semi-finished-product'],'onchange':'get_rm_type(this)'},
    'rm_name':{'input':'select','label':'Product / Raw material name','options':[],'onchange':'get_rm_name(this)'},
    'measured_unit':{'input':'text','label':'measurement unit'},
    'quantity':{'input':'input','label':'quantity','onchange':'get_input(this,"quantity")'}
}
let token = sessionStorage.getItem('token')

function get_form(){
    bodydata = {}
    measured_unit_get()
    submit_btn = `<button onclick=create_pr() class='btn btn-sm btn-primary'>create</button><a href=#>exit</a>`
    document.querySelector('#submit-btn').innerHTML = submit_btn
    document.querySelector('#pr-form').innerHTML = ''
    form = document.createElement('div')
    for(let [key,value] of Object.entries(purchase_request_form_data)){
        form_p = document.createElement('p')
        form_label = document.createElement('label')
        form_label.innerHTML = `${value['label']}`
        form_p.appendChild(form_label)

        if(value['input']!='text'){
            pr_form_input = document.createElement(value['input'])
            pr_form_input.setAttribute('onchange',value['onchange'])
            pr_form_input.id = `form_${key}`
            if(value['input'] == 'select' && value['options']){
                options = `<option selected disabled value=''>Select ${key}</option>`
                for(i=0;i<value['options'].length;i++){
                    options += `<option value='${value['options'][i]}'>${value['options'][i]}</option>`
                }
                pr_form_input.innerHTML = options
            }
            form_p.appendChild(pr_form_input)
        }
        else{
            form_span = document.createElement('span')
            form_span.id= `form_${key}`
            form_p.appendChild(form_span)
        }
        
        form.appendChild(form_p)
    }
    document.querySelector('#pr-form').appendChild(form)
}

function get_rm_type(element){
    bodydata['rm_type'] = element.value
    if(element.value == 'semi-finished-product'){
        rm_list_url = drop_down_url + `?model=product&&filter_by=product_type&&filter_value=semi_finished`
    }else{
        rm_list_url = drop_down_url + `?model=rawmaterial&&name=rm_name`
    }
    fetch(rm_list_url,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        document.getElementById('form_rm_name').innerHTML = data.html
    })
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
                measured_unit_data[`${element.id}`] = element.measured_unit
            });
        }
    })
}

function get_rm_name(element){
    if(bodydata['rm_type'] == 'rawmaterial'){
        bodydata['measured_unit'] = measured_unit_data[element.value]
        document.querySelector('#form_measured_unit').innerHTML = measured_unit_data[element.value]
    }else{
        bodydata['measured_unit'] = null
        document.querySelector('#form_measured_unit').innerHTML = '-'
    }
    bodydata['rm_id'] = element.value
    // bodydata['rm_name'] = element.text
}
get_form()

function get_input(element,key){
    bodydata[key] = element.value
}


function create_pr(){
    console.log(bodydata,'data')
    document.querySelector('.messages').innerHTML = ''
    for(let [key,value] of Object.entries(bodydata)){
        if(!key in bodydata){
            document.querySelector('.messages').innerHTML = `fill ${key}`
            return
        }
    }
    fetch(host_main + `/api/purchase-request`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        },
        body: JSON.stringify(bodydata)
    }).then(res =>{
        return res.json()
    }).then(data =>{

        if(data.status== 'success'){
            document.querySelector('.messages').innerHTML = 'purchase request created successfully'
            get_form()
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
            document.querySelector('.messages').innerHTML = error
        }
    })
}