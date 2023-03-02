
let messages = document.querySelector('.messages')

document.getElementById('phaseButton').onclick=function(){
    messages.innerHTML = ''
token=sessionStorage.getItem('token')
let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
var phase=document.getElementById("phase").value
fetch(crud_url+`?model=productionphase`,
{
    method: 'POST',
    body: JSON.stringify({ 'phase_name':phase }).toLocaleLowerCase(),
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
            getphase()
           messages.innerHTML = `<p class='text-success'> Phase created </p>`
        }
        else{
            console.log(data.data)
            error = ''
            for (const [key, value] of Object.entries(data.data)) {
                error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
            }
            // messages.innerHTML = error
            messages.innerHTML = error
        }
    }
    )
}
function getphase(){
    messages.innerHTML = ''
    var content='<div class="d-flex flex-row justify-content-center flex-wrap">'
    token=sessionStorage.getItem('token')
    fetch(crud_url+`?model=productionphase`,
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
        // content = '<div>'
        content = ''
        if(data.status == 'success'){
            content += create_table(data.data,'phase')
        // data.data.forEach(element => {
        //     console.log(element)
        //     content += `<div class="card mx-2 my-5 " id=${element.id}>
        //     <div>
        //     <p class=" float-end mx-3 "><i class="bi bi-pen" data-toggle="modal" data-target="#PhaseModal" onclick=PhaseEdit(${element.id},event) ></i></p>
        //     <p class=" float-end "><i class="bi bi-trash" data-toggle="modal" data-target="#deleteModal" onclick=DeletePhase(${element.id}) ></i></p>
        //     </div>
        //         <p class="mx-5" id="phase_name">${element.phase_name}</p>
        //     </div>`
            
        // })
    }
        content += `</div>`
        document.getElementById('phasedata').innerHTML=content
       })
}
getphase()
function phaseEdit(id,event){
    token=sessionStorage.getItem('token')
    messages.innerHTML = ''
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    var parent=event.target.parentElement.parentElement
    var name=parent.querySelector('#phase_name').innerHTML
    document.getElementById('phase').value=name
    document.getElementById('phaseButton').onclick=function(){
        var newname=document.getElementById('phase').value
        console.log(newname)
        fetch(crud_url+`?model=productionphase&pk=${id}`,
       {
        method: 'PUT',
        body: JSON.stringify({ 'phase_name':newname }).toLocaleLowerCase(),
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
            getphase()
           messages.innerHTML = `<p class='text-success'> phase updated </p>`
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
    })
}
}
function DeletePhase(id){
      token=sessionStorage.getItem('token')
      document.getElementById("yes").onclick=function(){
        fetch(crud_url+`?model=productionphase&pk=${id}`,
        {
         method: 'DELETE',
         headers: {
             'Authorization': 'token' + ' ' + token,
         }
     })
     .then(response =>{ 
        if(response.status==200){
            getphase()
            }
            else{
                document.getElementById('delete-error').value = `<p class='text-warning'>can't able to delete</p>`
            }
        })
        
      }
     
}