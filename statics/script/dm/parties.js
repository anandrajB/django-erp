var arr = new Array()
console.log(arr)
var edit = false
let submit_btn = document.querySelector('#Partiesbtn')
let party_data = {}
let token = sessionStorage.getItem('token')
var messages = document.querySelector('.messages')
var url_for_change = 'http://127.0.0.1:8000/api/dropdown/';
common_drop_down_get('partytype',`id_party_type`,'party_type') 
common_drop_down_get('country',`id_party_country`,'country_name') 
function party_type_change() {
    var option= document.getElementById('id_party_type')
    var text= option.options[option.selectedIndex].text
    console.log(text)
    if (String(text).toLowerCase() === "supplier"){
        document.querySelector("label[for=id_party_products]").innerHTML="Party Rawmaterials"
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
    document.getElementById('id_party_products').innerHTML = html

    })
    }
        
        else{
            document.querySelector("label[for=id_party_products]").innerHTML="Party Products"
        
            common_drop_down_get('product',`id_party_products`,'product_name') 
        }

}

function addparty(){  
     let  product_type = document.getElementById('id_party_type')
    let text = product_type.options[product.selectedIndex].text;
    // console.log(typeof(product))
    console.log(text)
    if(text=='supplier'){
        document.querySelector("label[for=party_products]").innerHTML="party Rawmaterials"
        common_drop_down_get('rawmaterials',`id_party_product`,'rm_name') 
    }
    else{
        document.querySelector("label[for='party_products']").innerHTML="party products"
        common_drop_down_get('product',`id_party_product`,'product_name') 
    }
    }

function AddPart(value) {
    let option= document.getElementById('id_party_products')
    let text= option.options[option.selectedIndex].text
    if(!arr.includes(text)){
        document.getElementById('party_product_error').innerHTML = ''
    arr.push(text)
    }
    else{
        document.getElementById('party_product_error').innerHTML = `<p class="text-warning">${text} altready exists</p>`
        return
    }
    console.log(arr)
    var content = ''
    arr.forEach((d) => {
        content += `<p class='m-2'>${d}<i class="bi bi-trash" onclick=RemovePart('${d}')></i></p>`
    })
    document.getElementById('party_products').innerHTML = content
}
function RemovePart(value) {
    let newarr = arr = arr.filter(function (e) { return e !== value })
    let content = ''
    console.log(newarr, arr)
    newarr.forEach((d) => {
        content += `<p class='m-2'>${d}<i class="bi bi-trash" onclick=RemovePart('${d}')></i></p>`
    })
    document.getElementById('party_products').innerHTML = content
}
function getParty() {

    fetch(crud_url+'?model=party',
        {
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        })
        .then(response => {
            console.log(response)
            return response.json()
        }).then(data => {
            console.log(data,'sa')
            table = ''
            party_data = {}
            if (data.status == 'success' && data.data.length) {
                table = create_table(data.data, 'parties',party_data);
            }
            document.getElementById('partiesdata').innerHTML = table;
            document.getElementById('party_product_error').innerHTML = ''
        })
}
getParty();

function create_party(id){
    party_url = crud_url+'?model=party'
    method = 'POST'
    result = 'created'
    if(id){
        party_url = crud_url+`?model=party&&pk=${id}`
        method = 'PUT'
        result = 'updated'
    }

    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let name = document.getElementById('id_party_name').value
    let ad = document.getElementById('id_party_address').value
    let state = document.getElementById('id_party_state').value
    let gst = document.getElementById('id_party_GSTIN').value
    let cname = document.getElementById('id_party_contact_name').value
    let contact = document.getElementById('id_party_contact_no').value
    let email = document.getElementById('id_party_email').value
    let country = document.getElementById('id_party_country').value
    let partytype = document.getElementById('id_party_type').value
    let partypin = document.getElementById('id_party_pincode').value
    let bodydata = JSON.stringify({
        'party_name': name, 'party_address': ad, 'party_state': state, 'party_GSTIN': gst, 'party_contact_name': cname,
        'party_contact_no': contact, 'party_email': email, 'party_country': country, 'party_type': partytype, 'party_products': arr, 'party_pincode': partypin
    }).toLocaleLowerCase()

    fetch(party_url,
        {
         method: method,
         body:bodydata,
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
             messages.innerHTML = `<p class='text-success'> party ${result}</p>`
             getParty()
          }
          else{
              console.log(data)
              error = ''
              for (const [key, value] of Object.entries(data.data)) {
                  error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
              }
              messages.innerHTML = error
          }
     }) 
    //  console.log(data,'check')
}

function get_add_party(){
    submit_btn.setAttribute('onclick',`create_party()`)
    submit_btn.innerHTML = 'create'
    arr = []
    document.getElementById('party_products').innerHTML = ''
    document.getElementById(`id_party_name`).value= ''
    document.getElementById(`id_party_address`).value = ''
    document.getElementById(`id_party_state`).value = ''
    document.getElementById(`id_party_GSTIN`).value= ''
    document.getElementById(`id_party_contact_no`).value = ''
     document.getElementById(`id_party_email`).value =''
      document.getElementById(`id_party_country`).value = ''
      document.getElementById(`id_party_contact_name`).value=''
      document.getElementById(`id_party_type`).value =''
    
}

function partiesEdit(id, event) {
    current_data = party_data[id]    
    arr = current_data.party_products
    content = ''
    arr.forEach(d => {
        content += `<p class='m-2'>${d}<i class="bi bi-trash" onclick=RemovePart('${d}')></i></p>`
    })
    submit_btn.setAttribute('onclick',`create_party(${id})`)
    submit_btn.innerHTML = 'update'
    document.getElementById('party_products').innerHTML = content
    document.getElementById(`id_party_name`).value= current_data['party_name']
    document.getElementById(`id_party_address`).value = current_data['party_address']
    document.getElementById(`id_party_state`).value = current_data['party_state']
    document.getElementById(`id_party_GSTIN`).value= current_data['party_GSTIN']
    document.getElementById(`id_party_contact_no`).value = current_data['party_contact_no']
     document.getElementById(`id_party_email`).value = current_data['party_email']
      document.getElementById(`id_party_country`).value = current_data['party_country']
      document.getElementById(`id_party_contact_name`).value= current_data['party_contact_name']
      document.getElementById(`id_party_type`).value = current_data['party_type']
    
      party_type_change()
      //   document.getElementById(`id_party_products`).innerHTML = 
      document.getElementById(`id_party_pincode`).value = current_data['party_pincode']

    
    }     
    function partiesDelete(id){
        document.getElementById("yes").onclick=function(){
          fetch( crud_url+`?model=party&pk=${id}`,
          {
           method: 'DELETE',
           headers: {
               'Authorization': 'token' + ' ' + token,
           }
       }).then(response => {
           console.log(response)

       if(response.status==200){
        getParty()
        }
        else{
            document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
        }
       })
        }
       
  }

  