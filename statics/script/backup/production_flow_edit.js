let existing_pf = {};
let existing_phases = {}
let edit_phases;
let current_pf_id

function GetProductionflow(event){
    existing_pf = {}
    existing_phases= {}
    // token = sessionStorage.getItem('token');
    fetch(crud_url + `?model=productionflow&filter_by=product&filter_value=${form_product}`,
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
            if(data.status == 'success' && data.data.length){
            for(i=0;i<data.data.length;i++){
                existing_pf[data.data[i].id] = data.data[i]
                if(!multipart){
                    existing_phases['singlepart'] = []
                }
                else{
                    existing_phases[data.data[i].part_name] = []
            
                }
            }
            fetch(crud_url + `?model=productivity&filter_by=product&filter_value=${form_product}`,
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
                let content = ''
                console.log(data,'s') 
                for(i=0; i<data.data.length; i++) {
                    if(data.data[i].part_name in existing_phases){
                    existing_phases[data.data[i].part_name].push(data.data[i])
                    }else if(!multipart){
                existing_phases['singlepart'].push(data.data[i])
                    }
                }
                console.log(event,'event')
let table = `<table class='table pf-delete-table'><thead><tr><th>Part</th><th>Phases</th><th>Action</th></tr></thead>`
    table += `<tbody>`
    count = 1
    for (const [key, value] of Object.entries(existing_pf)) {
    
    flag = false
    table += `<tr id=${key}>`
    table += `<td>${value.part_name}</td>`
    table += `<td><ul>`
    for (const [phasekey, phasevalue] of Object.entries(value.phases)) {
        table += ''
        if(!flag){
            table += ` <a class="" data-toggle="collapse" href="#${phasekey}${count}_collapse" role="button" aria-expanded="false" aria-controls="${key}_collapse">
            <li>${phasevalue.phase_name}</li>
            </a> `
            table += `<div class="collapse" id="${phasekey}${count}_collapse">`
            count += 1;
            flag = true
                }

                else{
                    table += `<li>${phasevalue.phase_name}</li>`;
                }
    }
    table += `
    </div></ul></td>`;
    if(event=='delete'){
    table += `<td><button onclick=delete_pf(${key})  data-toggle="modal" data-target='#deleteModal' ><i class="bi bi-trash"></i></button></td>`
    } else if(event=='edit'){
    table += `<td><button onclick=edit_pf(${key}) ><i class="bi bi-pen"></i></button></td>`        
                }
    table += `</tr>`;
    }
    table += `</tbody></table>`
    if(event=='delete' || event=='edit'){
    document.querySelector('.pf-container').innerHTML = table;
    }
               
                console.log(existing_pf,'sd',existing_phases,'phases')
            })
            console.log(existing_pf)
            }

        })
}
function edit_get_pf(){
    if(!form_product){
        messages.innerHTML = 'select product'
        return
    }
    messages.innerHTML = ''
GetProductionflow('edit')
document.getElementById('part_div').style.display = 'none';
document.querySelector('.pf-container').innerHTML = ''
document.querySelector('.pf-form').innerHTML = ''
}

function delete_get_pf(){
    if(!form_product){
        messages.innerHTML = 'select product'
        return
    }
    messages.innerHTML = ''
 GetProductionflow('delete');
document.querySelector('.pf-form').innerHTML = ''
submit_button.style.display = 'none';

}


function delete_pf(id){

      let part_name = existing_pf[id].part_name
    let  phase_list_for_delete =  existing_phases[part_name]

    document.getElementById("yes").onclick = async function () {
        fetch(crud_url + `?model=productionflow&pk=${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'token' + ' ' + token,
                }
            })
            .then(response => {
                if(response.status==200){
                    console.log('Delete productionflow')

                    }
                    else{
                        document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                    }

    for(let i=0;i<phase_list_for_delete.length;i++){
        fetch(crud_url + `?model=productivity&pk=${phase_list_for_delete[i].id}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        })
        .then(response => {
            if(response.status==200){
                console.log('Delete productionflow')
                }
                else{
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }
                console.log(i,phase_list_for_delete.length)
                if(phase_list_for_delete[phase_list_for_delete.length - 1] == phase_list_for_delete[i]){
                    console.log('delete')
                   GetProductionflow('delete')
                }
            })

    }

})
    }         
}

function edit_pf(id){

 postgetpf(id,'edit')
 form_part = existing_pf[id].part_name
 current_pf_id = id
}

function submit_edit(){
    form_phase = {}
    start = 1
    for(i=0;i<phases_to_edit.length;i++){
        form_phase[`phase${start}`] = phases_to_edit[i].phase_get.name
        console.log('edit',start,form_phase,phases_to_edit[i])
        start +=1
    }
    for(i=0;i<phases.length;i++){
        form_phase[`phase${start}`] = phases[i].phase
        start += 1
        console.log('add',start,form_phase)
    }

// return
    for(i=0;i<delete_productivity.length;i++){
        fetch(crud_url + `?model=productivity&pk=${delete_productivity[i]}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': 'token' + ' ' + token,
            }
        })
        .then(response => {
            if(response.status==200){
                console.log('Delete productionflow')
                // GetProductionflow()
                }
                else{
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }
            })

    }
    for(i=0; i<phases_to_edit.length;i++){
        body = {'phase':phases_to_edit[i].phase,
        'quantity_perday':phases_to_edit[i].quantity_perday,'scrap_quantity':phases_to_edit[i].scrap_quantity,
        'part_name':form_part,'product':form_product}.toLocaleLowerCase(),
        fetch(crud_url + `?model=productivity&pk=${phases_to_edit[i].id}`,
        {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
                'X-CSRFToken': csrftoken
            }
        })
        .then(response => {
            console.log(response,'response')
            })
    }
    for(i=0;i<phases.length;i++){
        fetch(crud_url+'?model=productivity',
        {
            method: 'POST',
            body: JSON.stringify({ 'product':form_product,'part_name':form_part,'phase':phases[i].phase_id,
            'quantity_perday':phases[i].productivity,'scrap_quantity':phases[i].scrap}).toLocaleLowerCase(),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
            }).then(data =>{
                if(data.status != 'success'){
                    console.log(data.data)
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                    }
                    document.querySelector('.messages').innerHTML = error
                    error =    true
                }
                console.log(data)
            })
    if(error){
        break
    }
    }


fetch(crud_url+`?model=productionflow&pk=${current_pf_id}`,
{
    method: 'PUT',
    body: JSON.stringify({ 'product':form_product,'part_name':form_part,'phases': form_phase}).toLocaleLowerCase(),
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': 'token' + ' ' + token,
    },
})
.then(response =>{ 
    console.log(response)
    return response.json()
    }).then(data =>{
        if(data.status == 'success'){
            // getdepartment()

            messages.innerHTML = `<p class='text-success'>production flow updated successfully </p>`
            edit_get_pf()
        }
        else{
            console.log(data.data)
            error = ''
            for (const [key, value] of Object.entries(data.data)) {
                error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
            }
            // messages.innerHTML = error
            messages.innerHTML = error
        }

        console.log(data)
    })

}