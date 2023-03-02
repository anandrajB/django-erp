var host_url = window.location.protocol + '//' + window.location.host
var user_url = host_url + '/api/resetpassword/'
function forgetpassword(uid,token){
    var host = window.location.protocol + "//" + window.location.host;  
    var uid = document.getElementById('uid').innerHTML
    console.log(uid);
    var token = document.getElementById('token').innerHTML
    console.log(token);
    var new_password = document.getElementById('new_password').value;
    var confirm_password = document.getElementById('confirm_password').value;
    console.log(new_password);
    console.log(confirm_password);
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(csrftoken)
    fetch('http://127.0.0.1:8000/api/setpassword/',
    {
        method: 'PATCH',
        body: JSON.stringify({'new_password': new_password,'confirm_password': confirm_password,"uid":uid,"token":token}),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        
        },
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      if(!data.status){
        messages.innerHTML = `<p class='text-success'>Reseted successfuly</p>`
            localStorage.setItem('new_password', data.data.new_password)
            window.location.href = `${host}/http://127.0.0.1:8000/`
        }
        else{
            messages.innerHTML = `<p class='password is incorrect'>${data.data}</p>`
        }
    })
}
function check_password(element){
    confirm_password = document.getElementById('confirm_password').value
    password = document.getElementById('new_password').value
    // console.log(confirm_password)
    // console.log(password)
    if(confirm_password!= password){
        document.querySelector('.messages').innerHTML = '<p class="text-warning mx-3">password does not match</p>'
    }else{
        document.querySelector('.messages').innerHTML = '<p class="text-warning mx-3">password correct</p>'
    }
}