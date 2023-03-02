let data_list;
let prodcution_data;
let new_production_type;
let token = sessionStorage.getItem('token');
let submit_button = document.getElementById('submit_button');
let messages = document.querySelector('.messages');
let product ;
document.getElementById('id_sales_order').disabled = true
// function get_production_data(element){
//     model_name = element.value
//     if(model_name != '' && model_name in new_production_list){
//         new_production_type = new_production_list[model_name]
//     if(model_name == 'Saler_order'){
//         text_value = 'name'
//     }
//     else if(model_name == 'internal'){
//         text_value = 'product_name' 
//     }
//     option = `<option selected disabled value="">Select ${text_value}</option>`
//     $.ajax({
//         url: 'http://127.0.0.1:8000/api/dropdownjson/',
//         data: {
//             'model': model_name,
//             'name': text_value,
//         },
//         success: function (data) {
//             for(i=0;i<data.list.length;i++){
//                 option += `<option value="${data.list[i].id}">${data.list[i].name}</option>`
//             }
//             $("#production_data").html(option);
//         }
//     });
// }
//     else{
//         $("#production_data").html('<option value="">-------</option>');
//     }
// }
function check_fields(element){
    children = Array.from(element.children)
    flag = true
    children.forEach(element_data => {
        if(element_data.value == ''){
            flag = false
        }
    });

    if(flag){
        submit_button.disabled = false
    }else{
        submit_button.disabled = true
    }
}
function get_dropdown(){
    $.ajax({
        url: drop_down_url,
        data: {
            'model': 'product',
            'name': 'product_name',
        },
        success: function (data) {
            document.getElementById('id_product').innerHTML= data
        }
    });
}
function get_production_data(element){
    if(element.value == 'internal'){
        document.getElementById('id_sales_order').disabled = true
    }
    else{
        document.getElementById('id_sales_order').disabled = false
    }
}
get_dropdown()
function get_bom(element){
    product =element.value
    fetch(crud_url +`?model=billofmaterial&filter_by=product&filter_value=${product}`,{
        method:'GET',
        headers: {
            'Authorization': 'token' + ' ' + token,
        },
    }) .then(response => {
        console.log(response)
        if (response.status == 200) {
            document.querySelector('.messages').value = `<p class='text-warning'>created successfully</p>`
        }
        else {
            document.querySelector('.messages').value = `<p class='text-warning'>error</p>`
        }
    return response.json()

    }).then(data=>{
        console.log(data.data)

      table = ''
        if(data.data.length){    
                table = `<table class ='billofmateral'
        <thead>
        <tr>
        <th>rawmaterial</th><br>
        <th>quanity</th> </tr></thead>
        <tbody>`
            console.log(data.data)
            data.data.forEach((d) => {
                console.log(d)
                table = table +`<tr class="raw"`
                table = table + `</tr>`;
                table = table + '<td class="rawmaterial">' + `${d.rm_id_get.name}` + '</td>';
                table = table + '<td class="quainity">' + `${d.rm_quantity}` + '</td>';
                
        })
         
    }
    else{
        messages.innerHTML = `<p class='text-success'> this produts not have a billofmaterals  </p>`
}
    document.querySelector('.billofmaterial').innerHTML=table;
    })
}
function submit(){
    let quantity = document.getElementById('id_quantity').value;
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var wip = JSON.stringify({'product':product,'quantity':quantity})
    fetch(crud_url +`?model=wip`,
    {
        method:'POST',
        body :wip,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
            'X-CSRFToken': csrftoken
        }
    }).then(response => {
        console.log(response)
        return response.json()
    }).then((data) =>{
            if(data.status=='failure'){
                error = ''
                if(typeof(data.data)==Object){
                for (const [key, value] of Object.entries(data.data)) {
                    
                    error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                }
            }
            else{
                error +=`<p class='text-danger'>${data.data}</p>`
            }
               messages.innerHTML = error
            }
            else{
                    messages.innerHTML = `<p class='text-success'> created </p>`
            }
            })
        
        }