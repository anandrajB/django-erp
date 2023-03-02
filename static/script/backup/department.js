let host_url = window.location.protocol + "//" + window.location.host
let branch_url = host_url + '/api/branch/'
let department_url = host_url + `/api/department/`
let token = sessionStorage.getItem('token')
let branch_container = document.querySelector('.branch-main')
var department_container = document.querySelector('.department-container')
var submit_button = document.getElementById('deptButton')
var modal = document.getElementById('deptModal')
let messages = document.querySelector('.messages')

    function getdepartment(){
        console.log(crud_url)
        fetch(crud_url+'?model=department',
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
            let content = ''
            console.log(data,'s')
            if(data.data.length){
                 content = create_table(data.data,'dept')
            }
            department_container.innerHTML = content
            // $('#deptModal').modal('hide');
            submit_button.setAttribute('onclick',`create_dept(${null})`)
        })
    }
    getdepartment()
    function deptEdit(id,event){
        messages.innerHTML = ''
        // $('#deptModal').modal('show')
        // var parent=event.target.parentElement.parentElement.parentElement
        console.log(event.target.parentElement.parentElement,'parent')
        var parent = event.target.parentElement.parentElement
        var name=parent.querySelector('#name').innerHTML
        var role_get = parent.querySelector('#role').innerHTML

        document.getElementById('dept_name').value=name
        document.getElementById('dept_role').value = role_get
        submit_button.setAttribute('onclick',`create_dept(${id})`)
    }

    function create_dept(id){
        messages.innerHTML = ''
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        dept_name = document.getElementById('dept_name').value
        role = document.getElementById('dept_role').value 

        if(id){
          let  crud_edit_url =  new URL('http://127.0.0.1:8000/api/get')
            crud_edit_url.searchParams.append('model', 'department');
          crud_edit_url.searchParams.append('pk',id)
        fetch(crud_edit_url,
       {
        method: 'PUT',
        body: JSON.stringify({ 'name':dept_name,'role':role }).toLocaleLowerCase(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token' + ' ' + token,
            'X-CSRFToken': csrftoken
        }
       
    })
    .then(response =>{ 
        console.log(response)
        return response.json()
       }).then(data => {
        console.log(data)

        if(data.status == 'success'){

            messages.innerHTML = `<p class='text-success'> department updated</p>`
            getdepartment()
         }
         else{
             console.log(data)
             error = ''
             for (const [key, value] of Object.entries(data.data)) {
                 error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
             }
             // messages.innerHTML = error
             messages.innerHTML = error
         }

    })}
    else{
        fetch(crud_url+'?model=department',
        {
            method: 'POST',
            body: JSON.stringify({ 'name':dept_name,'role':role }).toLocaleLowerCase(),
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
                    getdepartment()
                    document.querySelector('.messages').innerHTML = `<p class='text-success'> department created </p>`
                }
                else{
                    console.log(data.data)
                    error = ''
                    for (const [key, value] of Object.entries(data.data)) {
                        error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                    }
                    // messages.innerHTML = error
                    document.querySelector('.messages').innerHTML = error
                }
    
                console.log(data)
            })
    
    }

}
function add_dept(){
    messages.innerHTML = ''
    document.getElementById('dept_name').value= ''
    document.getElementById('dept_role').value = ''
    submit_button.setAttribute('onclick',`create_dept(${null})`)

}
    function deptDelete(id){
          let  crud_edit_url =  new URL('http://127.0.0.1:8000/api/get')
          crud_edit_url.searchParams.append('model', 'department');
        crud_edit_url.searchParams.append('pk',id)
        
        // $('#deleteModal').modal('show')
          document.getElementById("yes").onclick=function(){
            fetch(crud_edit_url,
            {
             method: 'DELETE',
             headers: {
                 'Authorization': 'token' + ' ' + token,
             }
         })
         .then(response =>{ 
             console.log(response)
             if(response.status==200){
            getdepartment()
            // $(".modal-backdrop").remove();
            }
            else{
                document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
            }
            })
          }
         
    }