function create_form(){

    let content = ''
    let list_content = ''
// console.log(data,'form-data')
    // header
    // new_btn = document.createElement('button')
    // new_btn.setAttribute()
    content +=  `<button type="button" class="btn btn-sm btn-primary float-end m-5" data-toggle="modal" data-target="#${model_name}Modal" 
     onclick="show_form('${model_name}')">
     Add ${model_name}
   </button>`

//   body
  content += ` <div class="modal fade" id="${model_name}Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">`
  content += `<div class="modal-dialog" role="document">`
  content += `<div class="modal-content">`
  content += `<div class="modal-header">  <h5 class="modal-title" id="exampleModalLabel">Add ${model_name}</h5>
           <button type="button" class="close btn bg-none" data-dismiss="modal" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
          </div>`
   content += `<div class="modal-body text-center" onchange='check_allfilled("${model_name}")'>
   <div class="model-messages"></div>`
//    content += `${csrf_token}`

   for (let [key, value] of Object.entries(form_content)) {

        content +=  `<div class="form-group">`
        content +=  `<label for="form_${key}"  class="control-label">${value['label']}</label>`

    if(value['input'] == 'select'){

         if(key == 'department' && model_name =='user'){           
   
         content += `<select name="form_${key}" onchange=${key}_change(this) class='form-select' id="form_${key}"><option value="">---------</option></select>`
         get_dropdown(key)
        }
        else if(model_name=='user' && key == 'department_subdivision' || key == 'role'){
            content += `<select name="form_${key}" class='form-select' id="form_${key}"><option value="">---------</option></select>`
        }
        else{
        content += `<select name="form_${key}" class='form-select' id="form_${key}"><option value="">---------</option></select>`
        get_dropdown(key)   
    }

    }
    else if(value['field'] == 'list'){
        list_data[key] = []
        content += `<input type=text class="form-control" placeholder='${key}' id="form_${key}">`
        content += `<span>add ${key}</span> <button onclick="add_item('${key}')"><i class="bi bi-plus"></i></button>`
        list_content += `<div id='${key}_list' class='${key}_list'></div>`
    }
    else if(value['type'] == 'checkbox'){
            content +=  `<label for="form_${key}" class="control-label">${key}</label>`
            content +=  `<input type=${value} class="form-radio" placeholder='${key}' id="form_${key}">`
    }
    else{
// console.log(key,'key',model,'model')

//         // content +=  `<label for="form_${key}" class="control-label">${key}</label>`

    content +=  `<input type=${value['type']} class="form-control" placeholder='${key}' id="form_${key}">`

    }
        content +=  `</div>`

}
    content += `</div>` + list_content
// footer
    content += `<div class="modal-footer">
     <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
     <button type="submit" class="btn btn-primary" data-dismiss="modal" disabled onclick='submit_data(null)' id="${model_name}Button">Submit</button>
     </div>
     </div>
     </div>
     </div>`

    return content;
}
