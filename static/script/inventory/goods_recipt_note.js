var url_for_dropdown = 'http://127.0.0.1:8000/api/dropdown/';
var messages = document.querySelector('messages');
var submit = document.getElementById('id_submit');

let form_data = {"From_Warehouse":{"input":"select","type":"text","label":"Warehouse"},
"Product_Type_Raw_material":{"input":"select","type":"text","label":"Product Type / Raw material"},
"Product_Raw material_name":{"input":"select","type":"text","label": "Product / Raw material name"},
"Quantity_transferred":{"input":"select","type":"text","label":"Quantity_transferred"},
"Quantity_Received":{"input":"input","type":"text","label":"Quantity Received "},
"Comments":{"input":"input","type":"text","label":"Comments"}
}
let form_value={"Contractor_Details":{"input":"select","label":"Contractor Details"},
"Product_type":{"input":"select","label":"Product type"},
"Product_Name":{"input":"select","label":"Product Name"},
"Quantity":{"input":"select","label":"Quantity"},
"Quantity_Received":{"input":"text","label":"Quantity Received "},
"Comments":{"input":"text","label":"Comments"}
}
let form_supplier={"Product_Type_Raw_material":{"input":"select","type":"text","label":"Product Type / Raw material"},
"Product_Raw material_name":{"input":"select","type":"text","label": "Product / Raw material name"},
"Measurement_unit":{"input":"select","type":"text","label": "Measurement_unit"},
"Quantity":{"input":"select","label":"Quantity"},
"PO_Unit_Price":{"input":"select","label":"PO Unit Price"},
"Received_Quantity":{"input":"text","label":"Received Quantity"},
"Actual_Unit_Price":{"input":"text","label":"Actual Unit Price"},
"SGST":{"input":"text","type":"number","label":"SGST",'value':0},
"CGST":{"input":"text","type":"number","label":"CGST",'value':0},
"IGST":{"input":"text","type":"number","label":"IGST",'value':0},
"Number_of_Defective_materials":{"input":"text","type":"number","label":"Number_of_Defective_materials"},
"Total_Cost_of_Goods":{"input":"input","type":"number","label":"Total Cost of Goods"},
"Total_Cost_of_Defective_materials":{"input":"input","label":"Total Cost of Defective materials"},
"Due_date":{"input":"date_field","label":"Due date"},
"Freight_Charges_Paid_by":{"input":"select","options":['Self','Customer'],"label":"FreightCharges_Paidby"},
"Freight_Amount":{"input":"text","type":"number","label":"Freight_Amount"}
}

get_list_form(form_data,'internal','table')
get_list_form(form_value,'contractor','value')
get_list_form(form_supplier,'supplier','content')

get_party_dropdown('supplier','transfer_request','tabel_value')

function internal_transfer(element){
    if(element.value=='Internal Transfer'){
        document.getElementById('contractor').style.display='none'
        document.getElementById('supplier').style.display='none'
    }
    // else if((element.value=='Contractor')){
    //     document.getElementById('supplier').style.display='none'
    //     document.getElementById('internal').style.display='none'
    // }
}
function transfer_request(){
    if(element.value=='Internal Transfer'){ 
    fetch(`${url_for_dropdown}?model=transfer_request&filter_by=internal_transfer&filter_value=status=new`,{
        method:'GET',
        'Authrization':'token'+' '+ token,

    }).then(response=>{
        console.log(response)
        return response.json()
    }).then(data=>{
        console.log(data)
        document.getElementById('internal_dropdown').innerHTML

    })

}}