token = sessionStorage.getItem('token')
messages = document.querySelector('.messages')
let form_product
var edit=false
let bom_data 
bom_form_data = {
    'rm_serial_no':{'input':"input",'type':'number',"label":"serial no"},
    'rm_type':{'input':'select','options':['semi_finished_goods','rawmaterial'],'onchange':'rm_type_get(this,"bom",null)',"label":"raw material type"},
    'rm_id' :{'input':'select',"label":"raw material",'options':[]},
    'rm_quantity':{'input':"input",'type':'number',"label":"quantity"}
}


function rm_type_get(element,model_name){
    parent = element.parentNode.parentNode
    if(!list_form_items[model_name][parent.id]){
        list_form_items[model_name][parent.id] ={}
    }
    list_form_items[model_name][parent.id]['rm_type'] = element.value

    if(element.value == 'rawmaterial'){
        url = `${drop_down_url}?model=rawmaterial&name=rm_name`
    }else{
        url = `${drop_down_url}?model=product&name=product_name&filter_by=product_type&filter_value=semi_finished`
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token
        },
    }).then(res =>{
        return res.json()
    }).then(data=>{
        console.log('data',data)
         parent.querySelector('#form_rm_id').innerHTML = data.html
    })
}

function BillofMaterialGet(){
    token = sessionStorage.getItem('token')
    fetch(crud_url +`?model=billofmaterial`,
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
            if (data.status =='success' && data.data.length) {
                bom_data = data.data
                keys = Object.keys(data.data[0])
                console.log(keys)
                table = create_table(data.data, 'BillofMaterial');
                var content = `<div class="w-25 d-flex" ><select class="form-control my-3" id="filter_product" onclick=filter(this)>
                <option value=""></option></select></div>`;
                content += table
            }
            document.getElementById('billofmaterialsdata').innerHTML = content
            document.querySelector('#submit_bom').innerHTML = ''
            document.querySelector('#product_div').innerHTML =''      
            common_drop_down_get('product',`filter_product`,'product_name')     
            //  $.ajax({
            //     url: drop_down_url,
            //     data: {
            //         'model': 'product',
            //         'name': 'product_name',
            //     },
            //     success: function (data) {
            //         console.log(data)
            //         $("#filter_product").html(data)
            //       return
            //     }
            // });
        })
}

function BillofMaterialEdit(id, event) {
    edit=true
    document.querySelector('.messages').innerHTML = ''
    current_bom = null
    bom_data.forEach(element => {
        if(id == element.id){
            current_bom = element
            console.log(current_bom,'bom')
        }
    });

    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    document.getElementById('form_rm_serial_no').value = current_bom.rm_serial_no
    document.getElementById('from_rm_quantity').value = current_bom.rm_quantity

    document.getElementById('form_rm_type').value = current_bom.rm_type
    fetch(drop_down_url + `?model=product`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        document.getElementById('form_product').innerHTML = data.html
        document.getElementById('form_product').value = current_bom.product
    })
    if(current_bom.rm_type == 'semi-finished-product'){
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
        document.getElementById('form_rm_id').innerHTML = data.html
        document.getElementById('form_rm_id').value = current_bom.rm_id
    })

    document.getElementById('BillofMaterialButton').onclick = function () {
        var slno = document.getElementById('form_rm_serial_no').value
        var quantity = document.getElementById('from_rm_quantity').value
        var product = document.getElementById('form_product').value
        var rmid = document.getElementById('form_rm_id').value
        var rm_type = document.getElementById('form_rm_type').value

        fetch(crud_url +`?model=billofmaterial&pk=${id}`,
            {
                method: 'PUT',
                body: JSON.stringify({ "rm_serial_no": slno, 'rm_quantity': quantity,  'product': product, 'rm_id': rmid ,'rm_type':rm_type}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                }
            })
            .then(response => {
                console.log(response)
                return response.json()
            }).then(data => {
                console.log(data)
                if (data.status == 'success') {
                    messages.innerHTML = `<p class='text-success'> bill of material updated</p>`
                    BillofMaterialGet()
                }
                else {
                    console.log(data)
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                    }
                    messages.innerHTML = error
                }
            })
    }
}
function BillofMaterialDelete(id) {
    // $('#deleteModal').modal('show')
    token = sessionStorage.getItem('token')
    document.getElementById("yes").onclick = function () {
        fetch(crud_url +`?model=billofmaterial&pk=${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'token' + ' ' + token,
                }
            })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    BillofMaterialGet()
                    document.getElementById('delete-error').value = `<p class='text-warning'>deleted successfully</p>`
                }
                else {
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }
            })
    }

}
document.getElementById('rawmaterialtable').addEventListener('click', () => {
    document.getElementById('rawmaterialdiv').innerHTML = ''
    BillofMaterialGet();
})
document.getElementById('showform').addEventListener('click', () => {
    document.querySelector('#product_div').innerHTML = `<select id='form_product' onchange=select_product(this)></select>`
    document.querySelector('#submit_bom').innerHTML = `<button onclick=post()>create</button>`
    get_list_form(bom_form_data,'billofmaterialsdata','bom',null)
    fetch(drop_down_url + `?model=product&name=product_name`, {
        method: 'GET',
        headers: {
            'Authorization': 'token' + ' ' + token
        },
    }).then(res =>{
        return res.json()
    }).then(data=>{
        console.log('data',data)
        document.querySelector('#form_product').innerHTML = data.html
    })

//     var form = `<table class="table center w-75 justify-content-center" id="tableform">
//     <thead>
//      <tr>
//        <th scope="col">Serial No</th>
//        <th scope="col">Quantity</th>
//        <th scope="col">Product</th>
//        <th scope="col">Raw Material</th>
//        <th scope="col"><button class="btn btn-secondary" id="addtd"><i class="bi bi-plus"></i></button></th>
//        <th scope="col"> <button type="submit" class="btn btn-primary" id="BillofMaterialButton" onclick="post()">Submit</button></th>
//        <th></th>

//      </tr>
//     </thead>
//     <tbody>
//     <tr id="1">
//      <td><input type="text" class="form-control my-3" id="id_serial_no" placeholder="Enter Serial No"></td>
//      <td> <input type="text" class="form-control my-3" id="id_quantity" placeholder="Enter  Quantity"></td>

//      <td><select class="form-control my-3" id="id_product">
//                <option value=""></option></select></td>
//     <td> <select class="form-control my-3" id="id_rawmaterial">
//                <option value=""></option>
//            </select></td>
//           <td> <button class="btn btn-secondary" id="removetd" onclick=removetd(event)><i class="bi bi-trash"></i></button></td>
//     </tr>
//     </tbody>
// </table>`


// document.getElementById('billofmaterialsdata').innerHTML = form
// dropdown()
// document.getElementById('id_product').innerHTML = sessionStorage.getItem('id_product')
// document.getElementById('id_rawmaterial').innerHTML =sessionStorage.getItem('id_rawmaterial')
    // document.getElementById('addtd').addEventListener('click', () => {
    //     var parenttbl = document.getElementById("tableform");
    //     var allrow = document.querySelectorAll("tr").length
    //     var lasttr = document.querySelectorAll("tr")[allrow - 1];
    //     td = lasttr.getElementsByTagName("td")
    //     var inputid = ['id_serial_no', "id_quantity",  "id_product", "id_rawmaterial"]
    //     for (var i = 0; i < td.length - 1; i++) {
    //         var input = td[i].querySelector(`#${inputid[i]}`)
    //         if (input.value) {
    //           continue
    //         }
    //         else {
    //             document.querySelector('.fill-message').style.visibility="visible"
    //             return
    //         }
    //     }
    //     var x = parenttbl.tBodies[0]; 
    //     var trlen=x.getElementsByTagName('tr').length
    //     var id = x.rows[trlen-1].getAttribute('id')
    //     var node = x.rows[trlen-1].cloneNode(true);
    //     var inputs = node.getElementsByTagName("input");
    //     for (var i = 0; i < inputs.length; i++) {
    //         inputs[i].value = ''
    //     }
    //     node.setAttribute('id',parseInt(id)+1)
    //     console.log(node)
    //     // node.getElementById('id_product').innerHTML=sessionStorage.getItem('id_product')
    //     x.appendChild(node);
       
    // })
    // return
})
function removetd(e) {
    console.log('remove td')
    tr = e.target.parentElement
    console.log(tr);
    if (tr.id === "removetd") {
        if (document.querySelectorAll("tr").length) {
            id=e.target.parentElement.parentElement.parentElement.getAttribute('id')
            e.target.closest("tr").remove();
            // console.log(data)
        }
        else {
            return
        }

    }
}
function post() {
    // var postkeys = ['rm_serial_no', 'rm_quantity','product', 'rm_id']
    // var inputid = ['id_serial_no', "id_quantity",  "id_product", "id_rawmaterial"]
    // var data = new Array
    // table=document.getElementById('tableform')
    // tr=table.getElementsByTagName('tr')
    // for (i=1, l=tr.length; i < l; i++) {
    //     td=tr[i].getElementsByTagName('td')
    //     var json = new Object
    //     for (j=0, m=td.length-1; j < m; j++) {
    //         if(td[j].querySelector(`#${inputid[j]}`).value){
    //             json[postkeys[j]]=td[j].querySelector(`#${inputid[j]}`).value
    //         }
    //         else{
    //             continue
    //         }
            
    //     }
    //     data.push(json)
    // }
    data = list_form_items['bom']
    document.querySelector('.messages').innerHTML = ''
    if(form_product == ''|| form_product == null){
        document.querySelector('.messages').innerHTML = 'select a product'
        return
    }

    // data.forEach(data =>{
        for(let [key,value] of Object.entries(data)){
            value['product'] = form_product
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch(crud_url +`?model=billofmaterial`,
            {
                method: 'POST',
                body: JSON.stringify(value).toLocaleLowerCase(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token' + ' ' + token,
                    'X-CSRFToken': csrftoken
                }

            })
            .then(response => {
                console.log(response)
                return response.json()
            }).then(data => {
                if (data.status == 'success') {
                    BillofMaterialGet()
                    document.querySelector('.messages').innerHTML = `<p class='text-success'> bill of material created </p>`
                }
                else {
                    console.log(data.data)
                    error = ''
                    for (const [key1, value1] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key1} : ${value1[0]} </p>`
                    }
                    document.querySelector('.messages').innerHTML = error
                }

                console.log(data)
            })
    }
    }
function show_bom() {
    messages.innerHTML = ''
    document.getElementById('id_serial_no').value = ''
    document.getElementById('id_quantity').value = ''
    document.getElementById('id_product').value = ''
    document.getElementById('id_rawmaterial').value = ''
}
function dropdown() {
    // $.ajax({
    //     url: drop_down_url,
    //     data: {
    //         'model': 'product',
    //         'name': 'product_name',
    //     },
    //     success: function (data) {
    //         sessionStorage.setItem('id_product', data)
    //     }
    // });

    fetch( `${host}/api/dropdown/?model=product&&name=product_name`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'token '+ token
        }
    }).then(res =>{
        return res.json()
    }).then(data =>{
        // document.getElementById(`${key}`).innerHTML = data.html
        sessionStorage.setItem('id_product', data)
    })

    // common_drop_down_get('product',`id_product`,'product_name') 
    // $.ajax({
    //     url: drop_down_url,
    //     data: {
    //         'model': 'rawmaterials',
    //         'name': 'rm_name',
    //     },
    //     success: function (data) {
    //         console.log(data)
    //         sessionStorage.setItem('id_rawmaterial', data)
    //     }
    // });
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
        // document.getElementById(`${key}`).innerHTML = data.html
        sessionStorage.setItem('id_rawmaterial', data)
    })
}

function filter(sel) {
    var input, filter, table, tr, td, i, txtValue; 
    input = sel.options[sel.selectedIndex].text
    filter = input.toUpperCase();
    table = document.querySelector('table');
    tr = table.getElementsByTagName("tr");

    console.log(input)
    for (i = 0; i < tr.length; i++) {
        alltags = tr[i].getElementsByTagName("td");
        isFound = false;
        for (j = 0; j < alltags.length; j++) {
            td = alltags[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    j = alltags.length;
                    isFound = true;
                }
            }
        }
        console.log(tr[i].className)
        if (!isFound && tr[i].className !== "header") {
            tr[i].style.display = "none";
        }
    }
}

function select_product(element){
    form_product = element.value
}

function rm_type_get_edit(element){
    if(element.value == 'semi-finished-product'){
        rm_list_url = drop_down_url + `/?model=product&&filter_by=product_type&&filter_value=semi_finished`
    }else{
        rm_list_url = drop_down_url + `/?model=rawmaterial&&name=rm_name`
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
        document.getElementById('form_rm_id').innerHTML = data.html
    })
}