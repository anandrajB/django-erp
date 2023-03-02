var host_url = window.location.protocol + '//' + window.location.host
var user_url = host_url + '/api/forgetpassword/'
function forgetpassword(){
    var host = window.location.protocol + "//" + window.location.host;  
    var email = document.getElementById('Email').value;
    console.log(email);
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(csrftoken)
    fetch('http://127.0.0.1:8000/api/forgetpassword/',
    {
        method: 'POST',
        body: JSON.stringify({"email": email}),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        
        },
    }).then(response => response.json())
    .then(data => {
      console.log(data)
        if (data.status == 'successfull') {
            // localStorage.setItem('email', data.data.email)
            window.location.href = `${host}/main/`
        }
        else{
            messages.innerHTML = `<p class='email error'>${data.data}</p>`
        }
    })
}
   