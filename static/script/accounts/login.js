
// $("#login-button").click(function(event){
//   event.preventDefault();

// $('form').fadeOut(500);
// $('.wrapper').addClass('form-success');
// });
// localStorage.clear();
let messages = document.querySelector('.messages');
let signup_form = document.getElementById('signup-html-form')
// let change_password_form = document.getElementById('change-password-html')
// change_password_form.style.display = 'none'
// console.log(signup_form,change_password_form);
function login() {
  var host = window.location.protocol + "//" + window.location.host;
  var name =document.getElementById('name').value
  var password =document.getElementById('password').value
  if (!password){
      messages.innerHTML = 'Enter Password:'
      return
  }
  console.log(name,password)
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  console.log(csrftoken)
  fetch(host+'/api/login/',
      {
          method: 'POST',
          body: JSON.stringify({ 'name': name, 'password': password }).toLocaleLowerCase(),
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
              // 'Content-Type': 'application/x-www-form-urlencoded',
          },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
          if (data.status == 'Login Successfull') {
              console.log("data=", data)
              console.log("email=1", data.data.email)
              console.log("tokendata=", data.data.token)
              console.log(data.data)
              sessionStorage.setItem('email', data.data.email)
              // sessionStorage.setItem('user_type', data.data.user_type)
              sessionStorage.setItem("token", data.data.token);
              window.location.href = `${host}/main/`
            }
            else {
                          messages.innerHTML = `<p class='text-warning'>${data.data}</p>`
                        }
          })
        }

// function change_password(){
//   old_password = document.getElementById('form_old_password').value;
//   new_password = document.getElementById('form_new_password').value;
//   if(password != confirm_password){
//     document.querySelector('.cp-messages').innerHTML = "<p class='text-warning'>Passwords don't match</p>";
//     return;
//   }
//   let formData = JSON.stringify({'old_password':old_password,'new_password':new_password});
//   fetch('http://127.0.0.1:8000/api/changepassword/',
//       {
//           method: 'POST',
//           body: JSON.stringify({ 'name': name, 'password': password }),
//           headers: {
//               'Content-Type': 'application/json',
//               'X-CSRFToken': csrftoken,
//               'Authorization': 'token' + ' ' + token,
//               // 'Content-Type': 'application/x-www-form-urlencoded',
//           },
//       })
//       .then(response => response.json())
//       .then(data => {
//           if (data.status == 'Login Successfull') {}})
// }

// function get_cp(){
//   console.log('sd')
//   change_password_form.style.display = 'block';
//   signup_form.style.display = 'none';
// }