// function pf_post(){
//     form_part = document.getElementById('form_parts').value
// console.log(phases,'post')
// for(i=0;i<phases.length;i++){
//     fetch(crud_url+'?model=productivity',
//     {
//         method: 'POST',
//         body: JSON.stringify({ 'product':form_product,'part_name':form_part,'phase':phases[i].phase_id,
//         'quantity_perday':phases[i].productivity,'scrap_quantity':phases[i].scrap}),
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrftoken,
//             'Authorization': 'token' + ' ' + token,
//         },
//     })
//     .then(response =>{ 
//         console.log(response)
//         return response.json()
//         }).then(data =>{
//             // if(data.status == 'success'){
//             //    messages.innerHTML = `<p class='text-success'> department created </p>`
//             // }
//             if(data.status != 'success'){
//                 console.log(data.data)
//                 error_data = ''
//                 for (const [key, value] of Object.entries(data.data)) {
//                     error_data += `<p class='text-danger'> ${key} : ${value[0]} </p>`
//                 }
//                 // messages.innerHTML = error
//                 document.querySelector('.messages').innerHTML = error_data
//                 error =    true
//             }
//             console.log(data)
//         })
// if(error){
//     break
// }
// }
// if(!error){
//     let form_phase ={};

//     for(i=0;i<phases.length;i++){
//         form_phase[`phase${i+1}`] = phases[i].phase
//     }

// fetch(crud_url+'?model=productionflow',
// {
//     method: 'POST',
//     body: JSON.stringify({ 'product':form_product,'part_name':form_part,'phases': form_phase}),
//     headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrftoken,
//         'Authorization': 'token' + ' ' + token,
//     },
// })
// .then(response =>{ 
//     console.log(response)
//     return response.json()
//     }).then(data =>{
//         if(data.status == 'success'){
//             // getdepartment()
//             messages.innerHTML = `<p class='text-success'> department created </p>`
//         }
//         else{
//             console.log(data.data)
//             error = ''
//             for (const [key, value] of Object.entries(data.data)) {
//                 error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
//             }
//             // messages.innerHTML = error
//             messages.innerHTML = error
//         }

//         console.log(data)
//     })
// }
// }
// function crud_pf(event){
//     console.log(event,'test')

//     existing_pf = {}
//     existing_phases= {}
//     // token = sessionStorage.getItem('token');
//     fetch(crud_url + `?model=productionflow&order_by=product`,
//         {
//             method: 'GET',
//             headers: {
//                 'Authorization': 'token' + ' ' + token,
//             },
//         })
//         .then(response => {
//             console.log(response)
//             return response.json()
//         }).then(data => {
//             // let content = ''
//             // console.log(data,'s')
//             if(data.status == 'success' && data.data.length){
//                 console.log(data,'da')
//             for(i=0;i<data.data.length;i++){
//                 existing_pf[data.data[i].id] = data.data[i]
//                 if(!multipart){
//                     existing_phases['singlepart'] = []
//                 }
//                 else{
//                     existing_phases[data.data[i].part_name] = []
//                 }
//             }
// //             fetch(crud_url + `?model=productivity&filter_by=product&filter_value=${form_product}`,
// //             {
// //                 method: 'GET',
// //                 headers: {
// //                     'Authorization': 'token' + ' ' + token,
// //                 },
// //             })
// //             .then(response => {
// //                 console.log(response)
// //                 return response.json()
// //             }).then(data => {
// //                 let content = ''
// //                 console.log(data,'s') 
// //                 for(i=0; i<data.data.length; i++) {
// //                     // console.log(data.data[i].part_name,existing_phases)
// //                     if(data.data[i].part_name in existing_phases){
// //                     existing_phases[data.data[i].part_name].push(data.data[i])
// //                     }else if(!multipart){
// //                 existing_phases['singlepart'].push(data.data[i])
// //                     }
// //                     // for (const [key, value] of Object.entries(existing_pf)) {
// //                     //     console.log(key,value)
// //                     //     }
// //                 }
// //                 console.log(event,'event')
// //                 // if(event=='delete'){
// // let table = `<table class='table pf-delete-table'><thead><tr><th>Part</th><th>Phases</th><th>Action</th></tr></thead>`
// //     table += `<tbody>`
// //     count = 1
// //     // console.log(existing_pf)
// //     for (const [key, value] of Object.entries(existing_pf)) {
    
// //     flag = false
// //     // console.log(key,value)
// //     table += `<tr id=${key}>`
// //     table += `<td>${value.part_name}</td>`
// //     table += `<td><ul>`
// //     for (const [phasekey, phasevalue] of Object.entries(value.phases)) {
// //         // console.log(phasekey, phasevalue)
// //         table += ''
// //         if(!flag){
// //             table += ` <a class="" data-toggle="collapse" href="#${phasekey}${count}_collapse" role="button" aria-expanded="false" aria-controls="${key}_collapse">
// //             <li>${phasevalue.phase_name}</li>
// //             </a> `
// //             table += `<div class="collapse" id="${phasekey}${count}_collapse">`
// //             count += 1;
// //             flag = true
// //                 }

// //                 else{
// //                     table += `<li>${phasevalue.phase_name}</li>`;
// //                 }
// //     }
// //     table += `
// //     </div></ul></td>`;
// //     if(event=='delete'){
// //     table += `<td><button onclick=delete_pf(${key})  data-toggle="modal" data-target='#deleteModal' ><i class="bi bi-trash"></i></button></td>`
// //     } else if(event=='edit'){
// //     table += `<td><button onclick=edit_pf(${key}) ><i class="bi bi-pen"></i></button></td>`        
// //                 }
// //     table += `</tr>`;
// //     // continue
// //     }
// //     table += `</tbody></table>`
// //     if(event=='delete' || event=='edit'){
// //     document.querySelector('.pf-container').innerHTML = table;
// //     }
// //                 // }
               
// //                 console.log(existing_pf,'sd',existing_phases,'phases')
// //             })
// //             console.log(existing_pf)
// //             }
//         }
//         })
// }

pf_url = window.location.protocol+'//'+window.location.host+'/api/pf'
let pf_get_data;
let current_productivity;
document.querySelector('.pf-container').innerHTML = ''
function pf_post(){
    form_part = document.getElementById('form_parts').value
console.log(phases,'post')
fetch(pf_url,
{
    method: 'POST',
    body: JSON.stringify({ 'product':form_product,'part_name':form_part,'productivity_to_add': phases}),
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
            messages.innerHTML = `<p class='text-success'> production flow created </p>`
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
function crud_pf(event){
    console.log(event,'test')

    // existing_pf
    existing_phases = null;
    // token = sessionStorage.getItem('token');
    // existing_pf = {}
    // existing_phases= {}
    // token = sessionStorage.getItem('token');
    fetch(crud_url + `?model=productionflow`,
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
         console.log('data',data)
         let table = `<table class='table pf-delete-table'><thead><tr><th>Product</th><th>Part</th><th>Phases</th><th>Action</th></tr></thead>`
             table += `<tbody>`
             flag = false
             count = 1
             // console.log(existing_pf)
             pf_get_data = data.data
             console.log(pf_get_data,'hgf')
             pf_get_data.forEach(element => {
                // console.log(element,'e')
                  table += `<tr id=${element.id}>`
                  table += `<td>${element.product_get.name}</td>`
             table += `<td>${element.part_name}</td>`
             table += `<td><ul>`
             for (const [phasekey, phasevalue] of Object.entries(element.phases)) {
                 // console.log(phasekey, phasevalue)
                 table += ''
                 if(!flag){
                     table += ` <a class="" data-toggle="collapse" data-target="#${phasekey}${count}_collapse" role="button" aria-expanded="false" aria-controls="${element.id}_collapse">
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
             table += `<td><button onclick=delete_pf(${element.id})  data-toggle="modal" data-target='#deleteModal' ><i class="bi bi-trash"></i></button></td>`
             } else if(event=='edit'){
             table += `<td><button onclick=edit_pf(${element.id}) ><i class="bi bi-pen"></i></button></td>`        
                         }
             table += `</tr>`;
         //     // continue
            //  }
             table += `</tbody></table>`
             if(event=='delete' || event=='edit'){
             document.querySelector('.pf-container').innerHTML = table;
             // console.log(key,value)           
         }
            })}
            
            else{
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                    }
                   messages.innerHTML = error
            }
            // console.log(table,'ta')

})


}

function edit_pf(id){
    pf_get_data.forEach((element)=>{
        if(element.id == id){
        form_product = element.product
        form_part = element.part_name
        }
    })
    fetch(pf_url,
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
        console.log('datA',data)
        data.data.forEach(element=>{
            if(form_product==element.product){
                current_productivity = element.productivity[form_part]
            }
        })
        existing_phases = current_productivity
        phases_to_edit = current_productivity
        postgetpf('edit')

    })
}

function submit_edit(){
    fetch(pf_url,
        {
            method: 'PUT',
            body: JSON.stringify({ 'product':form_product,'part_name':form_part,'productivity_to_add': phases,'productivity_to_update':phases_to_edit,'productivity_to_delete':delete_productivity}),
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
                    messages.innerHTML = `<p class='text-success'> production flow created </p>`
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
            }
//             fetch(crud_url + `?model=productivity&filter_by=product&filter_value=${form_product}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': 'token' + ' ' + token,
//                 },
//             })
//             .then(response => {
//                 console.log(response)
//                 return response.json()
//             }).then(data => {
//                 let content = ''
//                 console.log(data,'s') 
//                 for(i=0; i<data.data.length; i++) {
//                     // console.log(data.data[i].part_name,existing_phases)
//                     if(data.data[i].part_name in existing_phases){
//                     existing_phases[data.data[i].part_name].push(data.data[i])
//                     }else if(!multipart){
//                 existing_phases['singlepart'].push(data.data[i])
//                     }
//                     // for (const [key, value] of Object.entries(existing_pf)) {
//                     //     console.log(key,value)
//                     //     }
//                 }
//                 console.log(event,'event')
//                 // if(event=='delete'){
// let table = `<table class='table pf-delete-table'><thead><tr><th>Part</th><th>Phases</th><th>Action</th></tr></thead>`
//     table += `<tbody>`
//     count = 1
//     // console.log(existing_pf)
//     for (const [key, value] of Object.entries(existing_pf)) {
    
//     flag = false
//     // console.log(key,value)
//     table += `<tr id=${key}>`
//     table += `<td>${value.part_name}</td>`
//     table += `<td><ul>`
//     for (const [phasekey, phasevalue] of Object.entries(value.phases)) {
//         // console.log(phasekey, phasevalue)
//         table += ''
//         if(!flag){
//             table += ` <a class="" data-toggle="collapse" href="#${phasekey}${count}_collapse" role="button" aria-expanded="false" aria-controls="${key}_collapse">
//             <li>${phasevalue.phase_name}</li>
//             </a> `
//             table += `<div class="collapse" id="${phasekey}${count}_collapse">`
//             count += 1;
//             flag = true
//                 }

//                 else{
//                     table += `<li>${phasevalue.phase_name}</li>`;
//                 }
//     }
//     table += `
//     </div></ul></td>`;
//     if(event=='delete'){
//     table += `<td><button onclick=delete_pf(${key})  data-toggle="modal" data-target='#deleteModal' ><i class="bi bi-trash"></i></button></td>`
//     } else if(event=='edit'){
//     table += `<td><button onclick=edit_pf(${key}) ><i class="bi bi-pen"></i></button></td>`        
//                 }
//     table += `</tr>`;
//     // continue
//     }
//     table += `</tbody></table>`
//     if(event=='delete' || event=='edit'){
//     document.querySelector('.pf-container').innerHTML = table;
//     }
//                 // }
               
//                 console.log(existing_pf,'sd',existing_phases,'phases')
//             })
//             console.log(existing_pf)
//             }
        }
        })
}

