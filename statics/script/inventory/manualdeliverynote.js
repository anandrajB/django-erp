var messages = document.querySelector('.message')
var host_url = window.location.protocol+'//'+window.location.host
var salesorder_url = host_url+'api/sales-order/'
let csrftoken = document.getElementById('[name=csrfmiddlewaretoken]').value;
function submit(){
    fetch(crud_url +`?model=sales_order`,{
        method:'GET',
        headers:{
            'Authorization':'token'+'/' + token,

        },
    }).then(response=>{
        console.log(response)

    }).then(data =>{
        table =''

    })
}




function salesorder(){
var sales_order = document.getElementById('id_salesdorder').value
var product = document.getElementById("form_product").value
var quantity = document.getElementById('form_quantity').value
var price = document.getElementById('form_price').value
var gst = document.getElementById('form_gst').value
var freight_charges = document.getElementById('form_freight_charges').value
var sales_order = JSON.stringify({'sales_order':sales_order,
'product':product,'quantity':quantity,'price':price,'gst':gst,
    'frieight_charges':freight_charges})
console.log(sales_order,product,quantity,
    price,gst,freight_charges)
    fetch(crud_url+`?model=sale_order&pk=${id}`,
    {
        method:'POST',
        body:sales_order,
        headers:{
        'Content-Type': 'application/json',
        'X-CSRFToken':   csrftoken,
        'Authorization': 'token' +' '+ token
       }
      }).then(response=>{
        console.log(response);
       if(response.status === 200){
          messages.innerHTML =`<p class='text-sucess'>created</p>`
          }
        return response.json()

    }).then((data)=>{
       if(data.status=='failure'){
        error=''
        for(conts[KeyboardEvent,value]of Object.entries(data.data)){
            error+=`<$ class='text-danger'>${key}:${value[0]}</p>`
        }
        messages.innerHTML=error
        }
    })
}
