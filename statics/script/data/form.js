form_data = {
    'branch':{
        'branch_name':{
            'required':true,
            'label':'Branch Name',
            'input':'input',
            'type':'text'
        },
        'cityname':{
            'required':true,
            'label':'City Name',
            'input':'input',
            'type':'text'
        },
        'state':{
            'required':true,
            'label':'State',
            'input':'select',
            'table':'state',
            'name':'state_name',
        },  
        'country':{
            'required':true,
            'label':'Country',
            'input':'select',
            'table':'country',
            'name':'country_name',
        },
        'pincode':{
            'required':true,
            'label':'Pincode',
            'input':'input',
            'type':'number'
        },

        'GST_Number':{
            'required':true,
            'label':'GST Number',
            'input':'input',
            'type':'text'
        },
        'address':{
            'required':true,
            'label':'Address',
            'input':'input',
            'type':'text'
        },
    },
    'department':{
        'name':{
            'required':true,
            'label':'Department Name',
            'input':'input',
            'type':'text'
        },
        'role':{
            'required':true,
            'label':'Role',
            'input':'input',
            'type':'text'
        }
    },
    'subdivision':{
        'name':{
            'required':true,
            'label':'Division Name',
            'input':'input',
            'type':'text'
        },
        'department':{
            'required':true,
            'label':'Department',
            'input':'select',
            'table':'department',
            'name':'name',
        },
    },
    'userrole':{
        'department':{
            'required':false,
            'label':'Department',
            'input':'select',
            'table':'department',
            'name':'name',
        },
        'role':{
            'required':true,
            'label':'Role',
            'input':'input',
            'type':'text'
        },
        'division':{
            'required':false,
            'label':'Division',
            'input':'select',
            'table':'subdivision',
        }
    },
    'user':{
        'name':{
            'required':true,
            'label':'Name',
            'input':'input',
            'type':'text'
        },
        'employee_id':{
            'required':true,
            'label':'Employee ID',
            'input':'input',
            'type':'text'
        },
        'email':{
            'required':true,
            'label':'Email',
            'input':'input',
            'type':'email'
        },
        'phone':{
            'required':true,
            'label':'Phone',
            'input':'input',
            'type':'number'
        },
        'branch':{
            'required':true,
            'label':'Branches',
            'input':'select',
            'table':'branch',
            'name':'branch_name',
        },
        // 'department':{
        //     'required':false,
        //     'label':'department',
        //     'input':'select',
        //     'onchange':'department_change(this)',
        //     'table':'department',
        //     'name':'name',
        // },
        'role':{
            'required':true,
            'label':'Role',
            'input':'select',
            'table':'userrole',
            'name':'role',
        },
        'password':{
            'required':true,
            'label':'Password',
            'input':'input',
            'type':'password'
        }

        // 'department_subdivision':{
        //     'required':true,
        //     'label':'sub division',
        //     'input':'select',
        //     'table':'subdivision',
        //     'name':'name',
        // },

    },
    'product':{
        'product_code':{
            'required':true,
            'label':'product_code',
            'input':'input',
            'type':'text'
        },
        'product_name':{
            'required':true,
            'label':'product_name',
            'input':'input',
            'type':'text'
        },
        'product_type':{
            'required':true,
            'label':'product type',
            'input':'select',
            'options':['finished','semi-finished']
        },
        // 'min_stock':{
        //         'required':true,
        //         'label':'minimum stock',
        //         'input':'input',
        //         'type':'number'
        // },
        'maximum_price':{
            'required':true,
            'label':'maximum price',
            'currency':true,
            'input':'input',
            'type':'number'
        },
        'minimum_price':{
            'required':true,
            'label':'minimum price',
            'currency':true,
            'input':'input',
            'type':'number'
        },
        'currency':{
            'required':true,
            'label':'currency',
            'input':'select',
            'oninput':'currency_change(this)',
            'table':'currency',
            'name':'currency_name',
        },
        'multiple_parts':{
            'required':true,
            'label':'multiple parts',
            'oninput':'get_multipart(this)',
            'input':'input',
            'type':'checkbox'
        },
        // 'parts':{
        //     'required':false,
        //     'label':'Multiple Parts',
        //     'field':'list',
        //     'input':'input',
        //     'disabled':'true',
        //     'type':'text'
        // }

    },
    'rawmaterial':{
        'rm_code':{
            'required':true,
            'label':'RM code',
            'input':'input',
            'type':'text'            
        },
        'rm_name':{
            'required':true,
            'label':'Raw material',
            'input':'input',
            'type':'text'            
        },
        'measured_unit':{
            'required':true,
            'label':'Units',
            'input':'select',
            'table':'measuredunits',
            'name':'unit',
        },
        'min_stock':{
            'required':true,
            'label':'Min stock',
            'input':'input',
            'type':'number'
        },
        'rm_max_price':{
            'required':true,
            'label':'RM Max Price',
            'currency':true,
            'input':'input',
            'type':'number'
        },
        'currency':{
            'required':true,
            'label':'Currency',
            'input':'select',
            'table':'currency',
            'oninput':'currency_change(this)',
            'name':'name',
        },       
         'preferred_supplier':{
            'required':true,
            'label':'supplier',
            'input':'select',
            'table':'parties',
            'list':true,
            'name':'name',
        },
    },
    'parties':{
        'party_type':{
            'required':true,
            'label':'Party Type',
            'input':'select',
            'oninput':'party_type_change(this)',
            'table':'partytype',
            'name':'party_type',
        },
        'party_name':{
            'required':true,
            'label':'Party Name',
            'input':'input',
            'type':'text'            
        },
        'party_contact_no':{
            'required':true,
            'label':'Contact No',
            'mobile_no':true,
            'oninput':'get_contact_no(this)',
            'input':'input',
            'type':'number'
        },
        'party_contact_name':{
            'required':true,
            'label':'Contact Name',
            'input':'input',
            'type':'text'
        },
        'party_email':{
            'required':true,
            'label':'Email',
            'input':'input',
            'type':'email'
        },
        'party_GSTIN':{
            'required':true,
            'label':'GSTIN',
            'input':'text',
            'type':'text'
        },
        'party_country':{
            'required':true,
            'label':'Country',
            'input':'select',
            'table':'country',
            'name':'country_name',
        },
        'party_state':{
            'required':true,
            'label':'state',
            'input':'select',
            'table':'state',
            'name':'state_name',
        },   
        'party_address':{
            'required':true,
            'label':'Address',
            'input':'input',
            'type':'text'            
        },
    
        'party_pincode':{
            'required':true,
            'label':'Pincode',
            'input':'input',
            'type':'number'
        },
   
        'party_products':{
            'required':true,
            'label':'product',
            'field':'json',
            'subfields':{
                'product':{
                    'label':'Products',
                    'input':'select',
                    'table':'product',
                    'name':'product_name',    
                },
            'unit_price':{
            'label':'Unit price',
            'currency':true,
            'input':'input',
            'type':'number'
                }
            }
        
        },
    },
    'partytype':{
        'party_type':{
            'required':true,
            'label':'party type',
            'input':'input',
            'type':'text'
        }
    },
    'productionphase':{
        'phase_name':{
            'required':true,
            'label':'Phases',
            'input':'input',
            'type':'text'
        },
    },
    'country':{
        'country_code':{
            'required':true,
            'label':'Country Code',
            'input':'input',
            'type':'text'
        },
        'country_name':{
            'required':true,
            'label':'Country Name',
            'input':'input',
            'type':'text'
        }
    },
    'state':{
        'state_code':{
            'required':true,
            'label':'State Code',
            'input':'input',
            'type':'text'
        },
        'state_name':{
            'required':true,
            'label':'State Name',
            'input':'input',
            'type':'text'
        }
        // 'GST_code':{
        //     'required':true,
        //     'label':'',
        //     'input':'input',
        //     'type':'text'
        // }
    },
    'billofmaterial':{
        'product_data':{
            'product_type':{
                'required':true,
                'label':'Product type',
                'input':'select',
                'options':['finished','semi-finished']
            },
            'product_code':{
                'required':true,
                'label':'Product Code',
                'input':'select',
                'table':'product',
                'name':'product_name',
            },
            'product_name':{
                'required':true,
                'label':'Product Name',
                'input':'input',
                'type':'text'
            },
        },
        'main_data':{
            'part_name':{
                'required':true,
                'label':'Part Name',
                'input':'select'
            },
            'rm_code':{
                'required':true,
                'label':'SFG/RM Code',
                'oninput':'rm_code_get(this)',
                'input':'select',
            },
            // 'rm_type':{
            //     'required':true,
            //     'label':'SFG/RM Type'
            // }
            'rm_name':{
                'required':true,
                'label':'SFG/RM Name',
                'input':'input',
                'write':false,
                'type':'text'
            },
            'measured_unit':{
                'required':true,
                'label':'Measurement Unit',
                'input':'select',
                'table':'measuredunits',
                'write':false,
                'name':'unit',
            },
            'rm_quantity':{
                'required':true,
                'label':'Quantity Required',
                'input':'input',
                'type':'number'
            },
            'production_phase':{
                'required':true,
                'label':'Production Phase',
                'input':'select',
                'table':'productionphase',
            }
            // 'rm_serial_no':{
            //     'required':true,
            //     'label':'serial number',
            //     'input':'input',
            //     'type':'text'
            // },
            // 'rm_id':{
            //     'required':true,
            //     'label':'rawmaterial',
            //     'input':'select',
            //     'table':'rawmaterials',
            //     'name':'rm_name',   
            // },
    
            // 'measured_unit':{
            //     'required':true,
            //     'label':'measured unit',
            //     'input':'select',
            //     'table':'measuredunits',
            //     'name':'unit',
            // }
        }
    },
    'currency':{
        'currency_code':{
            'required':true,
            'label':'currency code',
            'input':'input',
            'type':'text'
        },
        'currency_name':{
            'required':true,
            'label':'currency name',
            'input':'input',
            'type':'text'
        }
    },
    'measuredunits':{
        'measured_unit_code':{
            'required':true,
            'label':'Measured Unit Code',
            'input':'input',
            'type':'text'
        },
        'measured_unit_name':{
            'required':true,
            'label':'Measured Unit Name',
            'input':'input',
            'type':'text'
        }
    },
    'productionflow':{
        'product_data':{
            'product_type':{
                'required':true,
                'label':'Product type',
                'input':'select',
                'options':['finished','semi-finished']
            },
            'product_code':{
                'required':true,
                'label':'Product Code',
                'input':'select',
                'table':'product',
                'name':'product_name',
            },
            'product_name':{
                'required':true,
                'label':'Product Name',
                'input':'input',
                'type':'text'
            },
        },
        'main_data':{
            'part_name':{
                'required':true,
                'label':'Part Name',
                'input':'select',
                // 'type':'text'
            },
            'phase':{
                'required':true,
                'label':'Production Phase',
                'input':'select',
                'table':'productionphase',
            },
            'quantity_perday':{
                'required':true,
                'label':'Productivity Per Day',
                'input':'input',
                'type':'number'
            },
            'scrap_quantity':{
                'required':true,
                'label':'Scrap',
                'input':'input',
                'type':'text'
            },
            
        }
    }
}