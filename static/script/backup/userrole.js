var host_url = window.location.protocol + '//' + window.location.host
var user_role_url = host_url + '/api/user-role/'
var userrole_container = document.querySelector('.user-role-container')
var token=sessionStorage.getItem('token')
var submit_button = document.getElementById('user_roleButton')
var messages = document.querySelector('.messages')
var error_flag = false
// var modal = document.getElementById('BranchModal')

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


    function getuser_role(){
        // messages.innerHTML = ''
        var content='<div class="d-flex flex-row justify-content-center flex-wrap">'
        fetch(crud_url+'?model=userrole',
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
            //     <p class=" float-end mx-3 "><i class="bi bi-pen" data-toggle="modal" data-target="#user_roleModal" onclick=user_roleEdit(${element.id},event) ></i></p>
            //     <p class=" float-end "><i class="bi bi-trash" data-toggle="modal" data-target="#deleteModal" onclick=user_roleDelete(${element.id}) ></i></p>
            //     </div>
            //         <p class="mx-5" id="user_role_id">${element.role}</p>
            //     </div>`
            // })
            // content += `</div>`
            // content = create_table(data,'user_role')
            content = ''
            if(data.status == 'success' && data.data.length){
            content = create_table(data.data, 'userrole')
            submit_button.setAttribute('onclick',`create_userrole(${null})`)
            }
            userrole_container.innerHTML = content

        })
    }
    getuser_role()
    function userroleEdit(id,event){
        messages.innerHTML = ''
        var parent=event.target.parentElement.parentElement
        var role=parent.querySelector('#role').innerHTML
        var department = parent.querySelector('#department').childNodes[0].id
        document.getElementById('form_department').value = department
        document.getElementById('user_role').value=role
        submit_button.setAttribute('onclick',`create_userrole(${id})`)
    }

    function create_userrole(id){
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var role=document.getElementById('user_role').value
        var department = document.getElementById('form_department').value
        // console.log(newname)
        if(id){
        fetch(crud_url+'?model=userrole'+`&pk=${id}`,
       {
        method: 'PUT',
        body: JSON.stringify({ 'role':role,'department':department }).toLocaleLowerCase(),
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
        messages.innerHTML = `<p class='text-success'> User Role Updated Successfully<p>`
        getuser_role()
    }

    error_flag = false
    })}
    else{
        fetch(crud_url+'?model=userrole',
        {
            method: 'POST',
            body: JSON.stringify({ 'role':role ,'department':department}).toLocaleLowerCase(),
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
                    messages.innerHTML = `<p class='text-success'> User Role ${data.data.role} Created Successfully</p>`
                    getuser_role()
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
function add_user_role(){
    messages.innerHTML = ''
    document.getElementById('user_role').value = ''
    submit_button.setAttribute('onclick',`create_userrole(${null})`)

}
    function userroleDelete(id){
        // $('#deleteModal').modal('show')
          document.getElementById("yes").onclick=function(){
            fetch(crud_url+'?model=userrole'+`&pk=${id}`,
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
                getuser_role()
                }
                else{
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }
            })
          }
    }