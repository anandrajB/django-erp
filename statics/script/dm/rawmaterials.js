var token = sessionStorage.getItem('token')
messages = document.querySelector('.messages')
// $.ajax({
//     url:window.location.protocol + "//" + window.location.host + '/api/dropdown/',
//     data: {
//         'model': 'party',
//         'name': 'party_name',
//         // 'filter_by':'party_type',
//         // 'filter_value':'supplier'
//     },
//     success: function (data) {
//         console.log(data)
//         $("#id_preferred_supplier_id").html(data.html);
//     }
// });
common_drop_down_get('party',`id_preferred_supplier_id`,'party_name') 
// $.ajax({
//     url:window.location.protocol + "//" + window.location.host + '/api/dropdown/',
//     data: {
//         'model': 'measuredunit',
//         'name': 'unit',
//     },
//     success: function (data) {
//         console.log(data)
//         $("#id_measured_unit").html(data.html);
//     }
// });
common_drop_down_get('measuredunit',`id_measured_unit`,'unit') 
// $.ajax({
//     url:window.location.protocol + "//" + window.location.host + '/api/dropdown/',
//     data: {
//         'model': 'currency',
//         'name': 'name',
//     },
//     success: function (data) {
//         console.log(data)
//         $("#id_currency").html(data.html);
//     }
// });
common_drop_down_get('currency',`id_currency`,'name') 
function show_rm(){
    document.getElementById('id_rm_name').value = ''
    document.getElementById('id_measured_unit').value = ''
    document.getElementById('id_min_stock').value = ''
    document.getElementById('id_rm_max_price').value = ''
    document.getElementById('id_currency').value = ''
    document.getElementById('id_preferred_supplier_id').value = ''
    messages.innerHTML = ''
}

function RawmaterialGet() {
    // var content = '<div class="d-flex flex-row justify-content-center flex-wrap">'
    fetch(crud_url+'?model=rawmaterial',
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
            console.log(data)
            table = ''
            if (data.data.length) {
                table = create_table(data.data, 'Rawmaterials')
            }
            document.getElementById('rawmaterialsdata').innerHTML = table
        })

}
RawmaterialGet()
document.getElementById('RawMaterialButton').onclick = function () {
    messages.innerHTML = ''
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var name = document.getElementById('id_rm_name').value
    var unit = document.getElementById('id_measured_unit').value
    let currency = document.getElementById('id_currency').value
    var stock = document.getElementById('id_min_stock').value
    var retail = document.getElementById('id_rm_max_price').value
    var id = document.getElementById('id_preferred_supplier_id').value
    console.log(name, unit, stock, retail)

    fetch(crud_url+'?model=rawmaterial',
        {
            method: 'POST',
            body: JSON.stringify({ 'rm_name': name, 'measured_unit': unit, 'currency':currency,'min_stock': stock, 'rm_max_price': retail, 'preferred_supplier_id': id }).toLocaleLowerCase(),
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
                RawmaterialGet()
                messages.innerHTML = `<p class='text-success'> raw material created </p>`
            }
            else {
                console.log(data.data)
                error = ''
                for (const [key, value] of Object.entries(data.data)) {
                    error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                }
                // messages.innerHTML = error
                messages.innerHTML = error
            }
        })
}
function RawmaterialsEdit(id, event) {
    console.log('Custmize Rawmaterials')
    Edit(id, event)
    token = sessionStorage.getItem('token')
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var parent = event.target.parentElement.parentElement
    var name = parent.querySelector('#rm_name').innerHTML
    var unit = parent.querySelector('#measured_unit').childNodes[0].id
    var currency = parent.querySelector('#currency').childNodes[0].id
    var stock = parent.querySelector('#min_stock').innerHTML
    var retail = parent.querySelector('#rm_max_price').innerHTML
    var sid = parent.querySelector('#preferred_supplier_id').childNodes[0].id
    document.getElementById('id_rm_name').value = name
    document.getElementById('id_measured_unit').value = unit
    document.getElementById('id_min_stock').value = stock
    document.getElementById('id_rm_max_price').value = retail
    document.getElementById('id_preferred_supplier_id').value = sid
    document.getElementById('id_currency').value = currency
        console.log(name, unit, stock, retail)
        document.getElementById('RawMaterialButton').onclick = function () {
            console.log(name, unit, stock, retail)
            console.log('Edit Selected')
            name = document.getElementById('id_rm_name').value
            unit = document.getElementById('id_measured_unit').value
            stock = document.getElementById('id_min_stock').value
            retail = document.getElementById('id_rm_max_price').value
            sid = document.getElementById('id_preferred_supplier_id').value
    currency = document.getElementById('id_currency').value = currency

            fetch(crud_url+`?model=rawmaterial&pk=${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ 'rm_name': name, 'measured_unit': unit,'currency':currency, 'min_stock': stock, 'rm_max_price': retail, 'preferred_supplier_id': sid }).toLocaleLowerCase(),
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
                        RawmaterialGet()
                        messages.innerHTML = `<p class='text-success'> raw material updated </p>`
                    }
                    else {
                        console.log(data)
                        error = ''
                        for (const [key, value] of Object.entries(data.data)) {
                            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                        }
                        // messages.innerHTML = error
                        messages.innerHTML = error
                    }
                })
        }
        return
    }


function RawmaterialsDelete(id) {
    messages.innerHTML = ''
    // $('#deleteModal').modal('show')
    token = sessionStorage.getItem('token')
    document.getElementById("yes").onclick = function () {
        fetch(crud_url+`?model=rawmaterial&pk=${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'token' + ' ' + token,
                }
            })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    RawmaterialGet()
                }
                else {
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }

            })
    }

}
