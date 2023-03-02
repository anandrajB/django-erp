let pm_today = new Date()
pm_today = `${pm_today.getFullYear()}-${String(pm_today.getMonth()+1).padStart(2, '0')}-${pm_today.getDate()}`
purchase_form_data = {
    'purchase_inquiry':{
        'purchase_request_no':{
            'input':'input',
            'label':'purchase request no',
            'required' :false,
            'type':'number'
        },
        "supplier_details":{
            'required':true,
            'input':'select',
            'model':'party',
            'label':'supplier details'
        },
        "expected_date_of_receipt":{
            'input':'input',
            'type':'date',
            'label':'expected date of delivery',
            'min':pm_today,
            'required':true
        },
        "payment_terms":{
            'input':'input',
            'type':'text',
            'label':'payment terms',
            'required':false
        },
        'due_date' :{
            'input':'input',
            'type':'date',
            'label':'due date',
            'required':true
        },
        'freight_charges_paid_by':{
            'input':'select',
            'model':null,
            'options':['self','customer'],
            'label':'freight charges paid by',
            'required':true
        },
        
    },
    'purchase_order': {
        // 'purchase_request_no':{
        //     'input':'select',
        //     'label':'purchase inquiry no',
        //     'model':'purchase_inquiry',
        //     'name':'purchase_inquiry_no',
        //     'required' :false,
        // },
        "supplier_details":{
            'required':true,
            'input':'select',
            'model':'party',
            'label':'supplier details'
        },
        "expected_date_of_receipt":{
            'input':'input',
            'type':'date',
            'label':'expected date of delivery',
            'min':pm_today,
            'required':true
        },
        "payment_terms":{
            'input':'input',
            'type':'text',
            'label':'payment terms',
            'required':false
        },
        'due_date' :{
            'input':'input',
            'type':'date',
            'label':'due date',
            'required':true
        },
        'freight_charges_paid_by':{
            'input':'select',
            'model':null,
            'options':['self','customer'],
            'label':'freight charges paid by',
            'required':true
        },
        
    }
}

PM_list_form_data ={
    'purchase_inquiry' :{
        'rawmaterial_type':{
            'input':'select',
            'label':'product/raw material type',
            'model':null,
            'options':['semi-finished-goods','rawmaterial'],
            'oninput':'get_raw_maetial_type(this,"rawmaterial_id")'
        },
        "rawmaterial_id":{
            'input':"select",
            "label":"rawmaterial name",
            'options':[],
            'oninput':`get_rm(this)`
        },
        'measured_unit':{
            'input':'text',
            'label':'measurement unit',
            'value':''
        }   ,
             "quantity":{
                "input":"input",
                "type":"number",
                "label":"quantity",
                'oninput':'get_cost(this,"quantity","unit_price","cost_of_products")'
             },
        "unit_price":
        {"input":"input",
        'label':'unit price',
        "type":"number",
        'oninput':'get_cost(this,"unit_price","quantity","cost_of_products")'
            },
        "cost_of_products":{
            "input":"text",
            'label':'cost of product',
            'value':0
        }
    },
    'purchase_order': {
        'rawmaterial_type':{
            'input':'select',
            'label':'product/raw material type',
            'model':null,
            'options':['semi-finished-goods','rawmaterial'],
            'oninput':'get_raw_maetial_type(this,"rawmaterial_id")'
        },
        "rawmaterial_id":{
            'input':"select",
            "label":"rawmaterial name",
            'options':[],
            'oninput':`get_rm(this)`
        },
        'measured_unit':{
            'input':'text',
            'label':'measurement unit',
            'value':''
        }   ,
             "quantity":{
                "input":"input",
                "type":"number",
                "label":"quantity",
                'oninput':'get_cost(this,"quantity","unit_price","cost_of_products")'
             },
        "unit_price":
        {"input":"input",
        'label':'unit price',
        "type":"number",
        'oninput':'get_cost(this,"unit_price","quantity","cost_of_products")'
            },
        "cost_of_products":{
            "input":"text",
            'label':'cost of product',
            'value':0
        }
    }
}