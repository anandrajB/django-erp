
let messages = document.querySelector('#messages')
let submit = document.getElementById('id_submit');
var url_for_dropdown = 'http://127.0.0.1:8000/api/dropdown/';
let form_data_value = {
"Product":{"input":"input","type":"text","label":"Product","onchange":""},
"quantity":{"input":"input","type":"text","label":"Quantity"},
"Unit_Price":{"input":"input","type":"text","label":"Unit price"},
"Quantity Returned":{"input":"input","label":"Quantity Returned"},
"Cost_of_product_returned":{"input":"input","type":"number","label":'Cost of product returned' },
"value_of_Goods":{"input":"text","label":"value_of_Goods"},
    "SGST":{"input":"text","type":"number","label":"SGST"},
    "CGST":{"input":"text","type":"number","label":"CGST",'value':0},
    "IGST":{"input":"text","type":"number","label":"IGST",'value':0},
    "TotalIncluding_gst":{"input":"input","label":"Total Including GST","onchange":"get_value(this,'quantity','unit_price','value_of_Goods')"}}
let country
let state
  

 function sales_order(element){
    userprofile()
    console.log(element.value)
    fetch(crud_url+`?model=sales&pk=${element.value}`,{
        method:'GET',
        'Authorization':'token' + ' ' + token,
    
    }).then(response=>{
        console.log(response)
        return response.json()
    }).then(async(data)=>{
        console.log(data.sales_order_items_get)
        console.log(data.customer_id)
        
       await party(data.customer_id)
        document.getElementById('table').innerHTML=''
        content=`<table class='sales' id='table_content'>`
        content+=`<thead> <tr><th>Product</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Value of Goods</th>
        <th>Cost of product returned</th>
        <th>SGST</th>
        <th>CGST</th>
        <th>IGST</th><br>
        <th>Cost Including GST</th>
        <th>Total value of goods returned including GST</th>
        </tr>
        </thead><tbody>
       `
        console.log(data,'table',data.length)
        sales=data.sales_order_items_get
        console.log(sales)
        sales.forEach(element => {
            content+='<tr>'
            content+= `<td>${element.product_get.name}</td>
            <td>${element.quantity_ordered}</td>
            <td>${element.unit_price}</td>
            <td>${element.total_price}</td>
            <td>${element.unit_price*element.quantity_ordered}</td>`
         var sgst = element.unit_price*element.quantity_ordered*9/100 
         var cgst = element.unit_price*element.quantity_ordered*9/100  
         var igst = element.unit_price*element.quantity_ordered*18/100
         var cost_of_product_deliverd = element.unit_price*element.quantity_ordered
         var cost_include_gst = cost_of_product_deliverd+sgst+cgst+igst
         var total_value_of_goods_returned_including_gst = element.unit_price+element.quantity_ordered+sgst+cgst+igst+cost_of_product_deliverd+cost_include_gst
         console.log(igst)
         if(country.party_country_get.name!='india'){
            content+=`<td>${0}</td>`
            content+=`<td>${0}</td>`
            content+=`<td>${0}</td>`
        }
         else if(country.party_state!=state.user_branch.state){
                content+=`<td>${0}</td>`
                content+=`<td>${0}</td>`
                content+=`<td>${element.unit_price*element.quantity_ordered*18/100}</td>`
            }
         else if( country.party_state==state.user_branch.state){ 
            content+=`<td>${sgst}</td>` 
            content+=`<td>${cgst}</td>`   
            content+=`<td>${0}</td>`
        }  
        content+=`<td>${cost_include_gst}</td>`  
        content+=`<td>${total_value_of_goods_returned_including_gst}</td>`
            console.log(element.id,'df')
            console.log(element.product_get.name)
            console.log(element.quantity_ordered)
            console.log(element.unit_price)
            console.log(country.party_country_get.name)
            console.log(country.party_state)
            console.log(country.party_email)
            console.log(country.party_type_get.name)
            console.log(state.user_branch.state)
          
        })
        document.getElementById('table').innerHTML=content
    })
}
<<<<<<< HEAD


=======
>>>>>>> f7d73cf996666c72520929a35ea122b4deed087b
function party(id){
  return  fetch(`/api/get?model=party&pk=${id}`,{
        method:'GET',
        'Authorization':'token' + ' ' + token,
    }).then(response=>{
        console.log(response)
        return response.json()    
    }).then(data=>{
        document.getElementById('customer_details').innerHTML= ''
        country=data
        console.log(country.party_country_get.name)
        console.log(data.party_country_get.name)
        value= `<table class='table' id='table_content'><tbody>`
        value=`<thead>
        <tr>
        <th scope="col">Name-</th> <td>${data.party_name}</td></tr><br><hr>
       <tr><th scope="col">Address-</th> <td>${data.party_address}</td></tr><br><hr>
       <tr><th scope="col">Country-</th>  <td>${data.party_country_get.name}</td></tr><br><hr>
       <tr><th scope="col">State-</th> <td>${data.party_state}</td></tr><br><hr>
       <tr><th scope="col">Pin code-</th> <td>${data.party_pincode}</td></tr><br><hr>
       <tr><th scope="col">GSTIN-</th> <td>${data.party_GSTIN}</td></tr><br><hr>
       <tr><th scope="col">Contact Person-</th>  <td>${data.party_contact_name}</td></tr><br><hr>
       <tr><th scope="col">Contact Number-</th>   <td>${data.party_contact_no}</td></tr><br><hr>
       <tr><th scope="col">Email-</th>  <td>${data.party_email}</td></tr><br><hr></thead>
        </table>`
        value += `</tbody></table>`
        console.log(value,'table')
        document.getElementById('customer_details').innerHTML = value
        })
      
    }

<<<<<<< HEAD
function userprofile(){
    fetch(`http://127.0.0.1:8000/api/userprofile/`,{
        method:'GET',
        'Authorization': 'token'+ ' ' + token,
    }).then(response=>{
        console.log(response)
        return response.json()    
    }).then(data=>{
        state=data
        console.log(data.user_branch.state)
        document.getElementById('branch').innerHTML;
    })
}
// function submit(){
//     fetch(``)
// }




       
     
       
        
    
=======
>>>>>>> f7d73cf996666c72520929a35ea122b4deed087b
