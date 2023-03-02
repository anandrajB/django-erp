var messages = document.querySelector('.messages')
document.getElementById('Partiestypebtn').onclick=function(){
    var partytype=document.getElementById('id_partytype_name').value
    console.log(partytype)
    let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch(crud_url+'?model=partytype',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'party_type':partytype
                    }).toLocaleLowerCase(),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token' + ' ' + token,
                        'X-CSRFToken': csrftoken
                    }
                })
                .then(response => {
                    if(response.status != 201){
                        console.log(data.data)
                        error = ''
                        for (const [key, value] of Object.entries(data)) {
                            error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                        }
                        messages.innerHTML = error
                      
                    }
                    else{
                        GetPartyType()
                        messages.innerHTML = `<p class='text-success'> Party type ${partytype} Created Successfully </p>`
                    }
                    return
                })
    }
function GetPartyType(){
    token=sessionStorage.getItem('token')
    fetch(crud_url+`?model=partytype`,
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
    var content = '<div class="d-flex flex-row justify-content-center flex-wrap">'
        if(data.status == 'success'){
        data.data.forEach(element => {
            console.log(element)
            content += `<div class="card mx-2 my-5 " id=${element.id}>
            <div>
            <p class=" float-end mx-3 "><i class="bi bi-pen" data-toggle="modal" data-target="#partiestypeModal" onclick=PartyTypeEdit(${element.id},event) ></i></p>
            <p class=" float-end "><i class="bi bi-trash" data-toggle="modal" data-target="#deleteModal" onclick=DeletePartytype(${element.id}) ></i></p>
            </div>
                <p class="mx-5" id="partytype_name">${element.party_type}</p>
            </div>`           
        })
    }
    content += `</div>`
        document.getElementById('partytypedata').innerHTML=content
        console.log(content,'content')
       })
}
GetPartyType()

function PartyTypeEdit(id,event){
    messages.innerHTML = ''
    parent = event.target.parentElement.parentElement.parentElement
    var cid = parent.id
    console.log(parent)
    console.log(id)
    tableFields = parent.querySelectorAll('p');
    // messages.innerHTML=''
    var data = new Object
    for (item in tableFields) {
        if (String(tableFields[item].innerHTML).includes('<ul')) {
            var div = document.createElement('div');
            div.innerHTML = tableFields[item].innerHTML.trim();
            id = div.getElementsByTagName('ul > li')
            l = new Array
            arr = Array.from(div.querySelectorAll("ul > li")).map(el => l.push(el.innerHTML))
            data[tableFields[item].id] = l
            continue
        }
        if (tableFields[item].innerHTML) {
            data[tableFields[item].id] = tableFields[item].innerHTML
        }
        else {
            data[tableFields[item].id] = ''
        }
    }

    console.log(data)
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (!key || key == 'undefined') {
                continue
            }
            if (typeof (data[key]) == 'object') {
                arr = data[key]
                var div = document.getElementById(key)
                content = ''
                data[key].forEach(d => {
                    console.log(d)
                    content += `<p class='m-2'>${d}<i class="bi bi-trash" onclick=RemovePart('${d}')></i></p>`
                })
                div.innerHTML = content
                continue
            }
        }
        console.log(key)
        document.getElementById(`id_${key}`).value = data[key]
    }
   
    document.getElementById('Partiestypebtn').onclick=function(){
            var partytype=document.getElementById('id_partytype_name').value
            console.log(partytype)
            let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                fetch(crud_url+`?model=partytype&pk=${cid}`,
                        {
                            method: 'PUT',
                            body: JSON.stringify({
                                'party_type':partytype
                            }).toLocaleLowerCase(),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'token' + ' ' + token,
                                'X-CSRFToken': csrftoken
                            }
                        })
                        .then(response => {
                            console.log(response)
                            return response.json()
                        }).then(data => {
                            if(data.status == 'success'){
                                console.log(data.data)
                                error = ''
                                for (const [key, value] of Object.entries(data)) {
                                    error += `<p class='text-danger'> ${key} : ${value[0]} </p>`
                                }
                                messages.innerHTML = error
                              
                            }
                            else{
                                GetPartyType()
                                messages.innerHTML = `<p class='text-success'> Party type ${partytype} Updated Successfully </p>`
                            }
                            return
                        })
            }
}
function DeletePartytype(id){
    token=sessionStorage.getItem('token')
    document.getElementById("yes").onclick=function(){
      fetch(crud_url+`?model=partytype&pk=${id}`,
      {
       method: 'DELETE',
       headers: {
           'Authorization': 'token' + ' ' + token,
       }
   }).then(response => {
       console.log(data)
       if(response.status == 200){
        GetPartyType()
       }
   })
  
    }
}
