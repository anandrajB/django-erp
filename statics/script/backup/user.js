var host_url = window.location.protocol + '//' + window.location.host
var user_url = host_url + '/api/signup/'
let user_edit_url = host_url + '/api/user/'
let department_url = host_url + `/api/department/`
var user_container = document.querySelector('.user-container')
var token=sessionStorage.getItem('token')
var submit_button = document.getElementById('userButton')
var messages = document.querySelector('.messages')
// var dropdown = document.querySelector('.form_department')
var error_flag = false



// var modal = document.getElementById('BranchModal')
    function getuser(){
        // var content='<div class="d-flex flex-row justify-content-center flex-wrap">'
        fetch(user_url,
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
            if(data.length){
            content = create_table(data,'user')
            user_container.innerHTML = content
            }
            submit_button.setAttribute('onclick',`create_user(${null})`)
        })
    }
    function get_signup_details(){
        var dept_dropdown= host_url+'/api/dropdown';
    
            $.ajax({
                url: dept_dropdown,
                data: {
                    'model': 'department',
                'name':'name',

                },
                success: function (data) {
                    $("#form_department").html(data)
                }
            });
        var userroll_dropdown = host_url+'/api/dropdown';
            $.ajax({
                url: userroll_dropdown,
                data: {
                    'model': 'user_role',
                'name':'role',
                },
                success: function (data) {
                    $("#form_role").html(data)
                }
            });
        };
    
        function get_division(element){
            let department_id = $(element).val();
            console.log(department_id,'asd');
            var userroll_dropdown = host_url+'/api/dropdown';
            $.ajax({
                url: userroll_dropdown,
                data: {
                    'model': 'sub_division',
                'name':'name',
                'filter_by': 'department',
                'filter_value': department_id,
                },
                success: function (data) {
                    $("#form_division").html(data)
                }
            });
            $.ajax({
                url: userroll_dropdown,
                data: {
                    'model': 'user_role',
                'name':'role',
                'filter_by': 'department',
                'filter_value': department_id,
                },
                success: function (data) {
                    $("#form_role").html(data)
                }
            });
        }
        get_signup_details()

    getuser()
    function userEdit(id,event){
        messages.innerHTML = ''
        let parent=event.target.parentElement.parentElement
        let email=parent.querySelector('#email').innerHTML
        let department = parent.querySelector('#department').childNodes[0].id
        let phone = parent.querySelector('#phone').innerHTML
        let name = parent.querySelector('#name').innerHTML
        let role = parent.querySelector('#role').innerHTML
        let sub_division = parent.querySelector('#department_subdivision').childNodes[0].id
        console.log(email,department,phone,name,sub_division,role)

        if(department=='-'){
            department = ''
        }
        if(sub_division=='-'){
            sub_division = ''
        }
        if(role == '-'){
        role = ''
        }
        console.log(email,department,phone,name,sub_division,role)
        console.log(department,'des')
        document.getElementById('form_name').value = String(name).toLowerCase()
        document.getElementById('form_email').value = String(email).toLowerCase()
        document.getElementById('form_phone').value = String(phone).toLowerCase()
        document.getElementById('form_department').value = String(department).toLowerCase()
        document.getElementById('form_department').onchange()
        // console.log(division_element,'aw')
        // get_division(document.getElementById('form_department'))

        document.getElementById('form_role').value = String(role).toLowerCase()

        if(department ==''){
            $("#form_division").html('<option value="">---------</option>')
        }
        else{
            var userroll_dropdown = host_url+'/api/dropdown';
            $.ajax({
                url: userroll_dropdown,
                data: {
                    'model': 'sub_division',
                'name':'name',
                'filter_by': 'department',
                'filter_value': department,
                },
                success: function (data) {
                    $("#form_division").html(data)
                }
            }).then(()=>{
            document.getElementById('form_division').value = String(sub_division).toLowerCase()
            });
        }
        submit_button.setAttribute('onclick',`create_user(${id})`)
    }

    function create_user(id){
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        let name=document.getElementById('form_name').value
        let department=document.getElementById('form_department').value
        let phone=document.getElementById('form_phone').value
        let sub_division = document.getElementById('form_division').value
        let user_role = document.getElementById('form_role').value
        let email=document.getElementById('form_email').value
        // console.log(newname)
        let data =  JSON.stringify({
            'email': email, 'phone': phone,
             'name': name, 'department':department,'department_subdivision':sub_division,'role':user_role
        })
        if(id){
        fetch(`${user_edit_url}${id}`,
       {
        method: 'PUT',
        body: data.toLocaleLowerCase(),
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
        getuser()
    }

    error_flag = false
    })}
    else{
        let password = random_password()
        let data =  JSON.stringify({
            'email': email, 'phone': phone,'password':password,
             'name': name, 'department':department,'department_subdivision':sub_division,'role':user_role,
        })
        console.log('hai')
        fetch(user_url,
        {
            method: 'POST',
            body: data.toLocaleLowerCase(),
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
                if(data.status == 'created'){
                    console.log(data.data)
                    messages.innerHTML = `<p class='text-success'> User Role ${data.data.user} Created Successfully</p>`
                    getuser()
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
    function userDelete(id){
        // $('#deleteModal').modal('show')
          document.getElementById("yes").onclick=function(){
            fetch(`${user_edit_url}${id}`,
            {
             method: 'DELETE',
             headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin" : "*", 
                 'Authorization': 'token' + ' ' + token,
             }
         })
         .then(response =>{ 
            console.log(response)
            if(response.status==200){
           getuser()
           }
           else{
               document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
           }
            })
          }
    }


    
    
    function check_email(element){
        console.log(element.value)
        if (!/@gmail\.com$/.test(element.value)) {
            document.getElementById('email-errors').innerHTML = '<span class="text-warning mx-3">not a valid email</span>'
            return
        }
        existing_email = sessionStorage.getItem('email')
        if(existing_email == element.value){
                console.log('email does not exist')
                document.getElementById('email-errors').innerHTML = ''
                return
        }
        url_for_check = new URL('http://127.0.0.1:8000/api/signup/');
        url_for_check.searchParams.append('email', element.value);
        fetch(url_for_check, {
            method: 'GET',
        }).then(res => {
            // console.log('res',res)
            return res.json();
        }).then(data=>{
            console.log(data)
            if (data.length){
                console.log('email already exists')
                document.getElementById('email-errors').innerHTML = '<span class="text-warning mx-3">email already exists</span>'
            }else{
                console.log('email does not exist')
                document.getElementById('email-errors').innerHTML = ''
            }                         
        })
    }

function random_password(){
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    let password = "";
    for (var i = 0; i < passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber +1);
     }
     return password
}