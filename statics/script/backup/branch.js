var host_url = window.location.protocol + '//' + window.location.host
console.log(host_url,window.location.host,window.location.protocol)
var branch_url1 = host_url + '/api/branch/'
var branch_container = document.querySelector('.branch-main')
var token=sessionStorage.getItem('token')
var submit_button = document.getElementById('branchButton')
var modal = document.getElementById('BranchModal')
var messages = document.querySelector('.messages')


// $.ajax({
//     url: drop_down_url,
//     data: {
//         'model':'country',
//         'name':'country_name',
//     },
//     success: function (data) {
//         console.log(data)
//         $("#id_branch_country").html(data);
//     }
// });
common_drop_down_get('country',`id_branch_country`,'country_name')
    function getbranch(){
        fetch(crud_url+'?model=branch',
        {
            method: 'GET',
            headers: {
                'Accecpt': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'token' + ' ' + token,
            },
        })
        .then(response =>{ 
            console.log(response)
            return response.json()
           }).then(data => {
            console.log(data)
            branch_data = data.data;
            if(data.status == 'success'&&  branch_data.length){
                table = create_table(branch_data,'branch');
                branch_container.innerHTML = table;
                document.getElementById('branchButton').setAttribute('onclick',`add_branch(${null})`)
                
                        }
            else{
                branch_container.innerHTML = ''
            }
                    })
                
            submit_button.setAttribute('onclick',`create_branch(${null})`)
                }
    getbranch();
    function branchEdit(id,event){
        messages.innerHTML = ''                    
        // $('#BranchModal').modal('show')
        var parent = event.target.parentElement.parentElement
        console.log(parent)
        var newname = parent.querySelector('#cityname').innerHTML 
        var newstate = parent.querySelector('#state').innerHTML
        var newcountry = parent.querySelector('#country').innerHTML
        var newpincode = parent.querySelector('#pincode').innerHTML
        var newgst_number = document.querySelector('#GST_Number').innerHTML
        document.getElementById('id_branch_cityname').value = newname
        document.getElementById('id_branch_state').value = newstate
        document.getElementById('id_branch_country').value = newcountry
        document.getElementById('id_branch_pincode').value = newpincode
        document.getElementById('id_branch_gstnumber').value = newgst_number
        submit_button.setAttribute('onclick',`add_branch(${id})`)
    }
    function add_branch_show(){
        messages.innerHTML=''
        document.getElementById("id_branch_cityname").value = ''
        document.getElementById('id_branch_state').value = ''
        document.getElementById('id_branch_country').value = ''
        document.getElementById('id_branch_pincode').value = ''
        document.getElementById('id_branch_gstnumber').value = ''
        document.getElementById('branchButton').setAttribute('onclick',`add_branch(${null})`)
    }
    function add_branch(id){
        let cityname =  document.getElementById('id_branch_cityname').value;
        let state = document.getElementById('id_branch_state').value;
        let country = document.getElementById('id_branch_country').value;
        let pincode = document.getElementById('id_branch_pincode').value;
        let gstnumber = document.getElementById('id_branch_gstnumber').value;
        let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        token = sessionStorage.getItem('token');
        console.log(cityname,state,country,pincode,gstnumber,csrftoken)
        var branch = JSON.stringify({'cityname':cityname,'state':state,'country':country,'pincode':pincode,"GST_Number":gstnumber}).toLocaleLowerCase()
        console.log(branch)
        if(id==null){
            fetch(crud_url +`?model=branch` ,
                {
                    method: 'POST',
                    body: branch,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken,
                        'Authorization': 'token' + ' ' + token,
                    },
                })
                .then(response =>{ 
                    console.log(response)
                  
                    if(response.status ==201 ){
                       
                        getbranch()
                        messages.innerHTML = `<p class='text-success'> Branch created </p>`
                    }
                    return response.json()
                }).then((data) =>{
                    if(data.status=='failure'){
                        error = ''
                        for (const [key, value] of Object.entries(data.data)) {
                            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                        }
                       messages.innerHTML = error
                    }
                })
                    }else{
                      
                        console.log(cityname,state,country,pincode,gstnumber,csrftoken)
    
                        fetch(`${crud_url}?model=branch&pk=${id}`,
                        {
                         method: 'PUT',
                         body: branch,
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
                             messages.innerHTML = `<p class='text-success'> branch updated</p>`
                             getbranch()
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
}     
function branchDelete(id){
        // $('#deleteModal').modal('show')
          document.getElementById('yes').onclick=function(){
            fetch(`${crud_url}?model=branch&pk=${id}`,
            {
             method: 'DELETE',
             headers: {
                 'Authorization': 'token' + ' ' + token,
             }
         })
         .then(response =>{ 
             console.log(response)

            if(response.status==200){
                getbranch()
                document.getElementById('delete-error').value = `<p class='text-warning'>deleted successfully</p>`

                }
                else{
                    document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
                }
            })
          }
         
    }