let host_url = window.location.protocol + "//" + window.location.host
function signup() {
    console.log('signup called')
    // // console.log(($("#signupbox").valid())) 
    // document.getElementById("myForm").submit();
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var email = document.getElementById('newemail').value
    console.log(email)
    var phone = document.getElementById('newphone').value
    var name = document.getElementById('user').value
    var password = document.getElementById('newpassword').value
    var checkpassword = document.getElementById('checkpassword').value
    var department = document.getElementById('form_department').value
    var sub_division = document.getElementById('form_division').value
    var user_role = document.getElementById('form_role').value
    console.log(`department: ${department}, sub_division: ${sub_division}, user_role: ${user_role}`)
    if (email == '' || password == '' || phone == '' || name == '' || checkpassword == ''){
        document.getElementById('signup-errors').innerHTML = '<span class="text-warning mx-3">Please fill all the fields</span>'
        return
    }
    fetch('http://127.0.0.1:8000/api/signup/',
        {
            method: 'POST',
            body: JSON.stringify({
                'email': email, 'phone': phone,
                 'name': name, 'password': password, 
                 'department':department,'department_subdivision':sub_division,'role':user_role
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        }).then(response => { return response.json()
        }).then(data => {
            console.log(data)
            if (data.status == 'created') {
            //    return window.location.href = `${host_url}/login`
            document.querySelector('.messages-login').innerHTML = '<p class="text-success"> user registered successfully</p>'
            }
            else{
                console.log(data)
            error = ''
            for (const [key, value] of Object.entries(data.data)) {
                console.log('sd',value)
                error += `<p class='text-warning'>${key} : ${value} </p>`
            }
            console.log(error,'sa')
            document.querySelector('.messages-login').innerHTML =error
            // document.getElementById('response').style.display = 'block'
            }
        })
    return true;
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
        department_id = $(element).val();
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
    }

    get_signup_details()

function check_email(element){
    console.log(element.value)
    if (!/@gmail\.com$/.test(element.value)) {
        document.getElementById('email-errors').innerHTML = '<span class="text-warning mx-3">not a valid email</span>'
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

function check_password(element){
    cp = element.value
    password = document.getElementById('newpassword').value
    console.log(cp,password)
    if(cp!= password){
        document.getElementById('password-errors').innerHTML = '<span class="text-warning mx-3">password does not match</span>'
    }else{
        document.getElementById('password-errors').innerHTML = ''
    }
}