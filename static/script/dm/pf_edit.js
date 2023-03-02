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
document.getElementById('part_div').style.display = 'none'
document.getElementById('product_div').style.display = 'none';

    document.querySelector('.pf-form').innerHTML  =''
    // existing_pf

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
                  table += `<tr  id=${element.id}>`
                  table += `<td class='product' id=${element.product_get.id}>${element.product_get.name}</td>`       
             table += `<td id='partname'>${element.part_name}</td>`
             table += `<td><ul>`
             for (const [phasekey, phasevalue] of Object.entries(element.phases)) {
                 console.log(phasekey, phasevalue,'ceh')
                 table += ''
                 if(!flag){
                     table += ` <a class="" data-toggle="collapse" data-target="#${phasekey}${count}_collapse" role="button" aria-expanded="false" aria-controls="${phasekey}${count}_collapse">
                      <li>${phasevalue}</li>
                      </a> `
                     table += `<div class="collapse" id="${phasekey}${count}_collapse">`
                     count += 1;
                     flag = true
                         }
         
                         else{
                             table += `<li>${phasevalue}</li>`;
                         }
             }
             table += `
              </div></ul></td>`;
             if(event=='delete'){
             table += `<td><button onclick=delete_pf(${element.id})  data-toggle="modal" data-target='#deleteModal' ><i class="bi bi-trash"></i></button></td>`
             } else if(event=='edit'){
             table += `<td><button onclick=edit_pf(${element.id},this) ><i class="bi bi-pen"></i></button></td>`        
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

function edit_pf(id,element){
    parent = element.parentNode.parentNode
    form_product = parent.querySelector('.product').id
    form_part = parent.querySelector('#partname').innerHTML
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
        existing_phases = null;
        data.data.forEach(element=>{
            if(form_product==element.product){
                if(form_part==''){
                    current_productivity = element.productivity['singlepart']
                    console.log(current_productivity,'as')
                }else{
                current_productivity = element.productivity[form_part]
                }
            }
        })
        existing_phases = current_productivity
        phases_to_edit = current_productivity
        console.log(existing_phases,'ae')
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
        
                console.log(data)
            })
        
}

        function delete_pf(id){
            document.getElementById('delete-error').value = ``
      
          document.getElementById("yes").onclick = function () {
              fetch(pf_url+ `?pk=${id}`,
                  {
                      method: 'DELETE',
                      headers: {
                          'Authorization': 'token' + ' ' + token,
                      }
                  })
                  .then(response => {
                      if(response.status==200){
                          console.log('Delete productionflow')
                document.getElementById('delete-error').value = `<p class='text-warning'>deleted successfully</p>`
                 crud_pf('delete')         
            }
                          else{
                              document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                          }
      
                        })      
                    }
                }