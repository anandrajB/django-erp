// let messages = document.querySelector('.messages')
// let token = sessionStorage.getItem('token')
// var form_product;
// var form_part;
// var multipart;
// let pf_table = document.createElement('table')
// pf_table.setAttribute('class', 'table pf-table')
// let thead = document.createElement('thead');
// let tbdy = document.createElement('tbody');
// let td = document.createElement('td')
// let input = document.createElement('select')
// let tr_ids =1
// let part_have_pf = false
// let select = document.createElement('select')
// let option = document.createElement("option");
// let phase_dropdown;
// let phase_list = []
// let phases = []
// let part_list;
// let part_name;
// let part_id;
// let show = true
// var error = false
// let submit_button = document.getElementById('pf_submit')
// let phases_to_edit = []
// var fields_of_productivity = ['phase','productivity','scrap']
// let tbody_for_edit;
// var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
// submit_button.style.display = 'none'
// var delete_productivity = []
// document.getElementById('product_div').style.display = 'none';
// document.getElementById('part_div').style.display = 'none'
// function new_pf(){
//     $.ajax({
//         url: drop_down_url,
//         data: {
//             'model':'product',
//             'name':'product_name',
//         },
//         success: function (data) {
//             console.log(data)
//             // data = ` <option value="">select Product</option>` + data
//             $("#form_product").html(data);
//         }
//     });
//     document.getElementById('product_div').style.display = 'block';
// }

// function get_part (element) {
//     console.log('haia')
//     form_product = element.value;
//     // GetProductionflow(null)
//  $.ajax({
//         url: 'http://127.0.0.1:8000/api/pf_dropdown',
//         data: {
//             'id':form_product,
//             'filter':'yes'
//         },
//         success: function (data) {
//             console.log(data,'sa')
//             // data = ` <option value="">select Part</option>` + data
//             $("#form_parts").html(data.data);
//             part_have_pf = data.exists
//             multipart = data.multipart
//             if(!multipart){
//                 part_list = []
//                 show = true
//                 // document.getElementById('form_parts').setAttribute("disabled", "disabled");
//                 document.getElementById('part_div').style.display = 'none'
//                 if(part_have_pf){
//                     show = false
//                     messages.innerHTML = 'product have production flow already'
//                     return
//                 }
//                 postgetpf(null,null)
//             }
//             else{
//                 part_list = data.part_list
//                 postgetpf(null,null)
//                 show = true
//                 document.getElementById('part_div').style.display = 'block'
//                 // document.getElementById("form_parts").removeAttribute("disabled");
//             }

//         }
//     });

// };

// function postgetpf(id,event){
//     messages.innerHTML = ''
//     tbody_for_edit = ''
//     phases = []
//     table = `<table class='pf-table table'>`
//     table += `<thead><tr><th>phase</th><th>productivity per day</th><th>scrap per 100 units</th><th>action</th></tr></thead>`
//     let button = `<button onclick='get_another_row(this,null,null)'><i class="bi bi-plus"></i></button>`
//     if(event=='edit' && existing_pf &&id){
//     part_id = id

//         part_name = existing_pf[id].part_name
//         table += `<tbody class='edit-table'>`
//      button = `<button onclick='get_another_row(this,${id},"edit")'><i class="bi bi-plus"></i></button>`
//      if(part_name == null || part_name == ''){
//         phase_data = existing_phases['singlepart']
//      }else{
//         phase_data = existing_phases[part_name]
//      }
//      phases_to_edit = []
//      phase_list = []
//         for(i=0;i<phase_data.length;i++){
//             phases_to_edit.push(phase_data[i])
//             phase_list.push(phase_data[i].phase_get.name)
//             console.log(phase_list,'lists')
//             tr = `<tr id='edit-${phase_data[i].id}'>`
//             select = `<select id='form_phase'><option value=''>------</option>`
//                     for(j=0;j<phase_dropdown.length;j++){
//                         // console.log(phase_dropdown[j],'DROPDAOW')
    
//                         if(phase_data[i].phase == phase_dropdown[j].id){
//                             select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
//                         }
//                         else if(!phase_list.includes(phase_dropdown[j].name)){
//                             // console.log(phase_list.includes(phase_dropdown[j].name),phase_dropdown[j].name,'checksd')
//                             select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//                         }
//                         // else{
//                         //     select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//                         // }
//                     }
//                     tr += `<td>${select}</td>`
//                     tr += `<td><input type='number' value='${phase_data[i].quantity_perday}' id='form_productivity'></input></td>
//                     `
//                     tr += `<td><input type='number' value='${phase_data[i].scrap_quantity}' id='form_scrap'></input></td>`
//                     let delete_button = `<button onclick='remove_row(this,${phase_data[i].id})'><i class="bi bi-trash"></i></button>`
//                     tr += `<td>${delete_button}</td>`
//                     tr += `</tr>`
//                     table += tr
//         }
//         table+= `</tbody>`
//     }
//     else{
//         document.querySelector('.pf-container').innerHTML = ''
//         // document.getElementById('part_div').style.display = 'block'
//     }
//     select = `<select id='form_phase'> <option value=''>------</option>`
//     for (var i = 0; i < phase_dropdown.length; i++) {
//         if(!phase_list.includes(phase_dropdown[i].name)){
//             select += `<option value='${phase_dropdown[i].id}'>${phase_dropdown[i].name}</option>`
//         }
//     }
//     console.log(phases_to_edit,'edit phase')

//     table += `<tbody><tr id='input'><td>${select}</td><td><input type='number' id='form_productivity'></input></td>
//     <td><input type='number' id='form_scrap'></input></td><td>${button}</td></tr></tbody>`
//     table += `</table>`
//     // if(show){
//         document.querySelector('.pf-form').innerHTML = table
//         submit_button.style.display = 'block'
//         if(event == 'edit'){
//             console.log(event,'hi')
//             submit_button.setAttribute('onclick','submit_edit()')
//         }
//     // }

// }

// $.ajax({
//     url: window.location.protocol+ '//'+ window.location.host +'/api/dropdownjson',
//     data: {
//         'model':'productionphases',
//         'name':'phase_name',
//     },
//     success: function (data) {
//         console.log(data)
//         // $("#form_phase").html(data.html);
//         // input.html(data);
//         phase_dropdown = data.list
//     }
// });

// function create_table_form_pf(){
//     table = `<table class='pf-table table'>`
//     table += `<thead><tr><th>phase</th><th>productivity per day</th><th>scrap per 100 units</th><th>action</th></tr></thead>`
//     let button = `<button onclick='get_another_row(this,null,null)'><i class="bi bi-plus"></i></button>`
//     // if(event=='edit' && existing_pf &&id){
//         tbody_for_edit = ''
//         // part_name = existing_pf[id].part_name
//         tbody_for_edit += `<tbody class='edit-table'>`
//      button = `<button onclick='get_another_row(this,${part_id}, "edit")'><i class="bi bi-plus"></i></button>`
//         for(i=0;i<phases_to_edit.length;i++){
//             tr = `<tr id='edit-${phases_to_edit[i].id}'>`
//             select = `<select id='form_phase'><option value=''>------</option>`
//                     for(j=0;j<phase_dropdown.length;j++){
//                         // console.log(phase_dropdown[j],'DROPDAOW')
    
//                         if(phases_to_edit[i].phase == phase_dropdown[j].id){
//                             select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
//                         }
//                         // else if(!phase_list.includes(phase_dropdown[j].name)){
//                             else{
//                             select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//                             }
//                         // }
//                     }
//                     tr += `<td>${select}</td>`
//                     tr += `<td><input type='number' value='${phases_to_edit[i].quantity_perday}' id='form_productivity'></input></td>
//                     `
//                     tr += `<td><input type='number' value='${phases_to_edit[i].scrap_quantity}' id='form_scrap'></input></td>`
//                     let delete_button = `<button onclick='remove_row(this,${part_id})'><i class="bi bi-trash"></i></button>`
//                     tr += `<td>${delete_button}</td>`
//                     tr += `</tr>`
//                     tbody_for_edit += tr
//         }
//         tbody_for_edit += `</tbody>`
//     // }
//     table += tbody_for_edit
//     table += `<tbody>`

//     for(i=0; i<phases.length; i++){
//         tr = `<tr id='${i+1}'>`
// select = `<select id='form_phase'><option value=''>------</option>`
//         for(j=0;j<phase_dropdown.length;j++){
//             // console.log(phase_dropdown[j],'DROPDAOW')
//             // if(!phase_list.includes(phase_dropdown[j].name)){

//                 // select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//             // }
//             if(phase_list[i] == phase_dropdown[j].name){
//                 select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
//             }
//             else{
//                 select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//             }
//         }
//         tr += `<td>${select}</td>`
//         tr += `<td><input type='number' value='${phases[i].productivity}' id='form_productivity'></input></td>
//         `
//         tr += `<td><input type='number' value='${phases[i].scrap}' id='form_scrap'></input></td>`
//         let delete_button = `<button onclick='remove_row(this,null)'><i class="bi bi-trash"></i></button>`
//         tr += `<td>${delete_button}</td>`
//         tr += `</tr>`
//         table += tr
//     }
//     select = `<select id='form_phase'> <option value=''>------</option>`
//     for(j=0;j<phase_dropdown.length;j++){
//         if(!phase_list.includes(phase_dropdown[j].name)){
//             select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
//         }
//         else if(phase_list[i] == phase_dropdown[j].name){
//             select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
//         }
//     }
//     table += `<tr id='input'><td>${select}</td><td><input type='number' id='form_productivity'></input></td>
//     <td><input type='number' id='form_scrap'></input></td><td>${button}</td></tr>`
//     table += `</tbody></table>`
//     return table
// }

// function get_another_row(element,id,event){
//     parent = element.parentNode.parentNode
//     children = parent.parentNode.childNodes
//     messages.innerHTML = ''
//     for(index=0;index<fields_of_productivity.length;index++){
//         element = fields_of_productivity[index]
//         if(parent.querySelector(`#form_${element}`) && parent.querySelector(`#form_${element}`).value == ''){
//             messages.innerHTML = `<p class="text-warning"> please fill ${element} </p>`
//             return
//         }
//     }
//     phase_list = []
//     // if(part_name){
//         children_for_edit = (parent.parentNode.parentNode).querySelector('.edit-table')
//         console.log(children_for_edit,'edit event')
//         console.log('before-edit',phases_to_edit)

//         for(i=0;i<phases_to_edit.length;i++){
//             child = children_for_edit.querySelector(`#edit-${phases_to_edit[i].id}`)
//             // console.log(child,'child')
//             sel_element = child.querySelector('#form_phase')
//         phases_to_edit[i]['phase_name'] =sel_element.options[sel_element.selectedIndex].text
//         phase_list.push( phases_to_edit[i].phase_get.name)
//         phases_to_edit[i]['quantity_perday'] = child.querySelector('#form_productivity').value
//         phases_to_edit[i]['scrap_quantity'] = child.querySelector('#form_scrap').value
//         phases_to_edit[i]['phase'] = sel_element.options[sel_element.selectedIndex].value
//         }
//         console.log('after-edit',phases_to_edit)
//     // }
//     let phase_details = {}
//  phases = []
//     for(let i =0;i<children.length;i++){
//     let phase_details = {}
//         sel_element = children[i].querySelector('#form_phase')
//         phase_details['phase'] =sel_element.options[sel_element.selectedIndex].text
//         phase_list.push(phase_details['phase'])
//         phase_details['productivity'] = children[i].querySelector('#form_productivity').value
//         phase_details['scrap'] = children[i].querySelector('#form_scrap').value
//         phase_details['phase_id'] = sel_element.options[sel_element.selectedIndex].value
//         phases.push(phase_details)
//         // console.log(phase_details,'datger')
//     }
//     table = create_table_form_pf()
//     document.querySelector('.pf-form').innerHTML = table
//     if(form_product && phases.length){
  
//             submit_button.style.display = 'block'
//     }else{
//         submit_button.style.display = 'none'
//     }
// }


// function remove_row(element,id){
//     console.log(phases,'da')
//     if(id){
//         for(i=0;i<phases_to_edit.length;i++){
//             // console.log(phases_to_edit[i].id,id,'check')
//             if(phases_to_edit[i].id == id){

//                 delete_productivity.push(id)
//                 let index = phase_list.indexOf(phases_to_edit[i].phase_get.name);
//                 console.log(phase_list,index,'check_for_list')
//                 if (index !== -1) {
//                   phase_list.splice(index, 1);
//                 }
//                 phases_to_edit.splice(i,1)
//                 break
//             }
//         }

//         // phases_to_edit.splice(id, 1);
//         console.log(phases_to_edit,'after_delete')
//     }
//     else{
//     parent_id = parseInt(element.parentNode.parentNode.id)-1
//     if (parent_id <= phases.length){
//         phase_name = phases[parent_id]
//         phases.splice(parent_id, 1);
//         let index = phase_list.indexOf(phase_name);
//         if (index !== -1) {
//           phase_list.splice(index, 1);
//         }
//     }
// }
//     console.log(phases)

//     table = create_table_form_pf()
//     document.querySelector('.pf-form').innerHTML = table
// }

let messages = document.querySelector('.messages')
let token = sessionStorage.getItem('token')
var form_product;
var form_part;
var multipart;
let pf_table = document.createElement('table')
pf_table.setAttribute('class', 'table pf-table')
let thead = document.createElement('thead');
let tbdy = document.createElement('tbody');
let td = document.createElement('td')
let input = document.createElement('select')
let tr_ids =1
let part_have_pf = false
let select = document.createElement('select')
let option = document.createElement("option");
let phase_dropdown;
let phase_list = []
let phases = []
let part_list;
let part_name;
let part_id;
let show = true
var error = false
let submit_button = document.getElementById('pf_submit')
let phases_to_edit = []
var fields_of_productivity = ['phase','productivity','scrap']
let tbody_for_edit;
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
submit_button.style.display = 'none'

var delete_productivity = []
document.getElementById('product_div').style.display = 'none';
document.getElementById('part_div').style.display = 'none'
function new_pf(){
    $.ajax({
        url: host_main+`/api/dropdown`,
        data: {
            'model':'product',
            'name':'product_name',
        },
        success: function (data) {
            console.log(data)
            // data = ` <option value="">select Product</option>` + data
            $("#form_product").html(data.html);
        }
    });
    document.getElementById('product_div').style.display = 'block';
}

function get_part (element) {
    console.log('haia')
    form_product = element.value;
    // GetProductionflow(null)
 $.ajax({
        url: 'http://127.0.0.1:8000/api/pf_dropdown',
        data: {
            'id':form_product,
            'filter':'yes'
        },
        success: function (data) {
            console.log(data,'sa')
            // data = ` <option value="">select Part</option>` + data
            $("#form_parts").html(data.data);
            part_have_pf = data.exists
            multipart = data.multipart
            if(!multipart){
                part_list = []
                show = true
                // document.getElementById('form_parts').setAttribute("disabled", "disabled");
                document.getElementById('part_div').style.display = 'none'
                if(part_have_pf){
                    show = false
                    messages.innerHTML = 'product have production flow already'
                    return
                }
                postgetpf(null,null)
            }
            else{
                part_list = data.part_list
                postgetpf(null,null)
                show = true
                document.getElementById('part_div').style.display = 'block'
                // document.getElementById("form_parts").removeAttribute("disabled");
            }

        }
    });

};

function postgetpf(event){
    messages.innerHTML = ''
    tbody_for_edit = ''
    phases = []
    table = `<table class='pf-table table'>`
    table += `<thead><tr><th>phase</th><th>productivity per day</th><th>scrap per 100 units</th><th>action</th></tr></thead>`
    let button = `<button onclick='get_another_row(this,null,null)'><i class="bi bi-plus"></i></button>`
    if(event=='edit'){

        // part_name = existing_pf[id].part_name
        table += `<tbody class='edit-table'>`
     button = `<button onclick='get_another_row(this,"edit")'><i class="bi bi-plus"></i></button>`
        phase_data = existing_phases
     phases_to_edit = []
     phase_list = []
        for(i=0;i<phase_data.length;i++){
            phases_to_edit.push(phase_data[i])
            phase_list.push(phase_data[i].phase_get.name)
            console.log(phase_list,'lists')
            tr = `<tr id='edit-${phase_data[i].id}'>`
            select = `<select id='form_phase'><option value=''>------</option>`
                    for(j=0;j<phase_dropdown.length;j++){
                        // console.log(phase_dropdown[j],'DROPDAOW')
    
                        if(phase_data[i].phase == phase_dropdown[j].id){
                            select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
                        }
                        else {
                            // console.log(phase_list.includes(phase_dropdown[j].name),phase_dropdown[j].name,'checksd')
                            select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
                        }
                        // else{
                        //     select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
                        // }
                    }
                    tr += `<td>${select}</td>`
                    tr += `<td><input type='number' value='${phase_data[i].quantity_perday}' id='form_productivity'></input></td>
                    `
                    tr += `<td><input type='number' value='${phase_data[i].scrap_quantity}' id='form_scrap'></input></td>`
                    let delete_button = `<button onclick='remove_row(this,${phase_data[i].id})'><i class="bi bi-trash"></i></button>`
                    tr += `<td>${delete_button}</td>`
                    tr += `</tr>`
                    table += tr
        }
        table+= `</tbody>`
    }
    else{
        document.querySelector('.pf-container').innerHTML = ''
        // document.getElementById('part_div').style.display = 'block'
    }
    select = `<select id='form_phase'> <option value=''>------</option>`
    for (var i = 0; i < phase_dropdown.length; i++) {
        if(!phase_list.includes(phase_dropdown[i].name)){
            select += `<option value='${phase_dropdown[i].id}'>${phase_dropdown[i].name}</option>`
        }
    }
    console.log(phases_to_edit,'edit phase')

    table += `<tbody><tr id='input'><td>${select}</td><td><input type='number' id='form_productivity'></input></td>
    <td><input type='number' id='form_scrap'></input></td><td>${button}</td></tr></tbody>`
    table += `</table>`
    // if(show){
        document.querySelector('.pf-form').innerHTML = table
        submit_button.style.display = 'block'
        if(event == 'edit'){
            console.log(event,'hi')
            submit_button.setAttribute('onclick','submit_edit()')
        }
    // }

}

$.ajax({
    url: window.location.protocol+ '//'+ window.location.host +'/api/dropdown',
    data: {
        'model':'productionphase',
        'name':'phase_name',
    },
    success: function (data) {
        console.log(data)
        // $("#form_phase").html(data.html);
        // input.html(data);
        phase_dropdown = data.list
    }
});

function create_table_form_pf(){
    table = `<table class='pf-table table'>`
    table += `<thead><tr><th>phase</th><th>productivity per day</th><th>scrap per 100 units</th><th>action</th></tr></thead>`
    let button = `<button onclick='get_another_row(this,null,null)'><i class="bi bi-plus"></i></button>`
    // if(event=='edit' && existing_pf &&id){
        tbody_for_edit = ''
        // part_name = existing_pf[id].part_name
        tbody_for_edit += `<tbody class='edit-table'>`
     button = `<button onclick='get_another_row(this,${part_id}, "edit")'><i class="bi bi-plus"></i></button>`
        for(i=0;i<phases_to_edit.length;i++){
            tr = `<tr id='edit-${phases_to_edit[i].id}'>`
            select = `<select id='form_phase'><option value='' onchange=change_field('edit','phase',this,${i})>------</option>`
                    for(j=0;j<phase_dropdown.length;j++){
                        // console.log(phase_dropdown[j],'DROPDAOW')
    
                        if(phases_to_edit[i].phase == phase_dropdown[j].id){
                            select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
                        }
                        // else if(!phase_list.includes(phase_dropdown[j].name)){
                            else{
                            select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
                            }
                        // }
                    }
                    tr += `<td>${select}</td>`
                    tr += `<td><input type='number' onchange=change_field('edit','quantity',this,${i}) value='${phases_to_edit[i].quantity_perday}' id='form_productivity'></input></td>
                    `
                    tr += `<td><input type='number' value='${phases_to_edit[i].scrap_quantity}' onchange=change_field('edit','scrap',this,${i}) id='form_scrap'></input></td>`
                    let delete_button = `<button onclick='remove_row(this,${part_id})'><i class="bi bi-trash"></i></button>`
                    tr += `<td>${delete_button}</td>`
                    tr += `</tr>`
                    tbody_for_edit += tr
        }
        tbody_for_edit += `</tbody>`
    // }
    table += tbody_for_edit
    table += `<tbody>`

    for(i=0; i<phases.length; i++){
        tr = `<tr id='${i+1}'>`
select = `<select id='form_phase' onchange=change_field(null,'phase',this,${i})><option value='' >------</option>`
        for(j=0;j<phase_dropdown.length;j++){
            // console.log(phase_dropdown[j],'DROPDAOW')
            // if(!phase_list.includes(phase_dropdown[j].name)){

                // select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
            // }
            if(phases[i].phase_id == phase_dropdown[j].id){
                select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
            }
            else{
                select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
            }
        }
        tr += `<td>${select}</td>`
        tr += `<td><input type='number' onchange=change_field(null,'quantity',this,${i}) value='${phases[i].quantity_perday}' id='form_productivity'></input></td>
        `
        tr += `<td><input type='number' value='${phases[i].scrap_quantity}' onchange=change_field(null,'scrap',this,${i}) id='form_scrap'></input></td>`
        let delete_button = `<button onclick='remove_row(this,null)'><i class="bi bi-trash"></i></button>`
        tr += `<td>${delete_button}</td>`
        tr += `</tr>`
        table += tr
    }
    select = `<select id='form_phase'> <option value=''>------</option>`
    for(j=0;j<phase_dropdown.length;j++){
        if(!phase_list.includes(phase_dropdown[j].name)){
            select += `<option value='${phase_dropdown[j].id}'>${phase_dropdown[j].name}</option>`
        }
        else if(phase_list[i] == phase_dropdown[j].name){
            select += `<option value='${phase_dropdown[j].id}' selected>${phase_dropdown[j].name}</option>`
        }
    }
    table += `<tr id='input'><td>${select}</td><td><input type='number' id='form_productivity'></input></td>
    <td><input type='number' id='form_scrap'></input></td><td>${button}</td></tr>`
    table += `</tbody></table>`
    return table
}

function get_another_row(element,event){
    parent = element.parentNode.parentNode
    children = parent.parentNode.childNodes
    messages.innerHTML = ''
    for(index=0;index<fields_of_productivity.length;index++){
        element = fields_of_productivity[index]
        if(parent.querySelector(`#form_${element}`) && parent.querySelector(`#form_${element}`).value == ''){
            messages.innerHTML = `<p class="text-warning"> please fill ${element} </p>`
            return
        }
    }
    phase_list = []
    // if(part_name){
        children_for_edit = (parent.parentNode.parentNode).querySelector('.edit-table')
        console.log(children_for_edit,'edit event')
        console.log('before-edit',phases_to_edit)

        for(i=0;i<phases_to_edit.length;i++){
            child = children_for_edit.querySelector(`#edit-${phases_to_edit[i].id}`)
            // console.log(child,'child')
            sel_element = child.querySelector('#form_phase')
        phases_to_edit[i]['phase_name'] =sel_element.options[sel_element.selectedIndex].text
        phase_list.push( phases_to_edit[i].phase_get.name)
        phases_to_edit[i]['quantity_perday'] = child.querySelector('#form_productivity').value
        phases_to_edit[i]['scrap_quantity'] = child.querySelector('#form_scrap').value
        phases_to_edit[i]['phase_id'] = sel_element.options[sel_element.selectedIndex].value
        }
        console.log('after-edit',phases_to_edit)
    // }
    let phase_details = {}
 phases = []
    for(let i =0;i<children.length;i++){
    let phase_details = {}
        sel_element = children[i].querySelector('#form_phase')
        phase_details['phase_name'] =sel_element.options[sel_element.selectedIndex].text
        phase_list.push(phase_details['phase'])
        phase_details['quantity_perday'] = children[i].querySelector('#form_productivity').value
        phase_details['scrap_quantity'] = children[i].querySelector('#form_scrap').value
        phase_details['phase_id'] = sel_element.options[sel_element.selectedIndex].value
        phases.push(phase_details)
        // console.log(phase_details,'datger')
    }
    table = create_table_form_pf()
    document.querySelector('.pf-form').innerHTML = table
    if(form_product && phases.length){
  
            submit_button.style.display = 'block'
    }else{
        submit_button.style.display = 'none'
    }
}


function remove_row(element,id){
    console.log(phases,'da')
    if(id){
        for(i=0;i<phases_to_edit.length;i++){
            // console.log(phases_to_edit[i].id,id,'check')
            if(phases_to_edit[i].id == id){

                delete_productivity.push(id)
                let index = phase_list.indexOf(phases_to_edit[i].phase_get.name);
                console.log(phase_list,index,'check_for_list')
                if (index !== -1) {
                  phase_list.splice(index, 1);
                }
                phases_to_edit.splice(i,1)
                break
            }
        }

        // phases_to_edit.splice(id, 1);
        console.log(phases_to_edit,'after_delete')
    }
    else{
    parent_id = parseInt(element.parentNode.parentNode.id)-1
    if (parent_id <= phases.length){
        phase_name = phases[parent_id]
        phases.splice(parent_id, 1);
        let index = phase_list.indexOf(phase_name);
        if (index !== -1) {
          phase_list.splice(index, 1);
        }
    }
}
    console.log(phases)

    table = create_table_form_pf()
    document.querySelector('.pf-form').innerHTML = table
}
function change_field(event,field,element,index){
    // index = element.parentNode.parentNode.id
    let phases_to_change = phases[index]
    if(event && event == 'edit'){
        phase_to_change = phases_to_edit[index]
    }
    console.log(element,element.text,'change')
        if(field == 'phase'){
            phases_to_change.phase_name = element.text
            phases_to_change.phase_id = element.value
        }
        else if(field == 'quantity'){
            phases_to_change.quantity_perday = element.value 
        }
        else if(field == 'scrap'){
            phases_to_change.scrap_quantity = element.value
        }
}