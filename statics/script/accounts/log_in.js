let messages = document.querySelector('.messages');
function login(){
    var host = window.location.protocol + "//" + window.location.host;
    var employee_id  =document.getElementById('id_emp').value
    var password = document.getElementById('id_password').value
    if(!password){
        messages.innerHTML = 'Enter Password:'
        return
    }
    console.log( employee_id ,password)
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(csrftoken)
    fetch(host+'/api/login/',
        {
            method:'POST',
            body:JSON.stringify({'employee_id': employee_id ,'password':password}).toLowerCase(),
            headers:{
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
}).then(response=>
    response.json())
   .then(data=>{
    console.log(data)
    if (data.status == 'Login Successfull') {
        console.log("data=", data)
        console.log("tokendata=", data.data.token)
        console.log(data.data)
        sessionStorage.setItem('email', data.data.email)
        sessionStorage.setItem("token", data.data.token);
        window.location.href = `${host}/data-management/`
      }
      else {
                    messages.innerHTML = `<p class='text-warning'>${data.data}</p>`
                  }
    })
  }

  