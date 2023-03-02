var host_url = window.location.protocol + '//' + window.location.host
var division_url = host_url + '/api/subdivision/'
let department_url = host_url + `/api/department/`
var division_container = document.querySelector('.division-container')
var token=sessionStorage.getItem('token')
var submit_button = document.getElementById('divisionButton')
var messages = document.querySelector('.messages')
var dropdown = document.querySelector('.form_department')
var error_flag = false

$.ajax({
    url: drop_down_url,
    data: {
        'model':'department',
        'name':'name',
    },
    success: function (data) {
        console.log(data)
        $("#form_department").html(data);
    }
});

    function getdivision(){
        // var content='<div class="d-flex flex-row justify-content-center flex-wrap">'
        fetch(crud_url+'?model=subdivision',
        {
            method: 'GET',
            headers: {
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
           }).then(data => {
            // data.forEach(element => {
            //     console.log(element)
            //     content += `<div class="card mx-2 my-5 " id=${element.id}>
            //     <div>
            //     <p class=" float-end mx-3 "><i class="bi bi-pen" data-toggle="modal" data-target="#divisionModal" onclick=divisionEdit(${element.id},event) ></i></p>
            //     <p class=" float-end "><i class="bi bi-trash" data-toggle="modal" data-target="#deleteModal" onclick=divisionDelete(${element.id}) ></i></p>
            //     </div>
            //         <p class="mx-5" id="division_id">${element.division}</p>
            //     </div>`
            // })
            // content += `</div>`
            content = ''
            if(data.status =='success'&& data.data.length){
            content = create_table(data.data,'division')
            }
            division_container.innerHTML = content

            submit_button.setAttribute('onclick',`create_division(${null})`)
        })
    }
    getdivision()
    function divisionEdit(id,event){
        messages.innerHTML = ''
        var parent=event.target.parentElement.parentElement
        var name=parent.querySelector('#name').innerHTML
        // var department = parent.querySelector('#department').innerHTML
        var department_get = parent.querySelector('#department').childNodes[0].id

        document.getElementById('form_name').value= name
        document.getElementById('form_department').value= department_get
        submit_button.setAttribute('onclick',`create_division(${id})`)
    }

    function create_division(id){
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var name=document.getElementById('form_name').value
        var department=document.getElementById('form_department').value
        // console.log(newname)
        if(id){
        fetch(crud_url+'?model=subdivision'+`&pk=${id}`,
       {
        method: 'PUT',
        body: JSON.stringify({ 'name':name ,'department':department }).toLocaleLowerCase(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
            'X-CSRFToken': csrftoken
        }
       
    })
    .then(response =>{ 
        console.log(response)
        if(response.status!=200){
             error_flag = true
         }
        return response.json()
       }).then(data => {
        console.log(data)
        if(error_flag){
        error = ''
        for (const [key, value] of Object.entries(data)) {
            error += `<p class='text-danger'> ${value[0]} </p>`
        }
        messages.innerHTML = error
    }else{
        messages.innerHTML = `<p class='text-success'> Updated Successfully<p>`
        getdivision()
    }

    error_flag = false
    })}
    else{
        fetch(crud_url+'?model=subdivision',
        {
            method: 'POST',
            body: JSON.stringify({ 'name':name ,'department':department }).toLocaleLowerCase(),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
            }).then(data => {
                console.log(data)
                if(data.status == 'success'){
                    console.log(data.data)
                    messages.innerHTML = `<p class='text-success'> Sub division Created Successfully</p>`
                    getdivision()
                }else{
                    console.log(data.data)
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${value[0]} </p>`
                    }
                    messages.innerHTML = error
                }
                
            })
    
    }

}
function add_division(){
    messages.innerHTML = ''
    document.getElementById('form_name').value = ''
    document.getElementById('form_department').value = ''
    submit_button.setAttribute('onclick',`create_division(${null})`)
}
    function divisionDelete(id){
        messages.innerHTML = ''
        // $('#deleteModal').modal('show')
          document.getElementById("yes").onclick=function(){
            fetch(crud_url+'?model=subdivision'+`&pk=${id}`,
            {
             method: 'DELETE',
             headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin" : "*", 
                 'Authorization': 'token' + ' ' + token,
             }
         })
         .then(response =>{ 
 
            if(response.status==200){
           getdivision()
           }
           else{
               document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
           }
            })
          }
    }