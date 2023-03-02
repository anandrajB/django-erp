function presentdata(data,keys,starstar_kwargs,){
    console.log(keys)
    var content='<div class="d-flex flex-row justify-content-center flex-wrap">'
    data.forEach(element => {
        console.log(element)
        content += `<div class="card mx-2 my-5 " id=${element.id}>
        <div>
        <p class=" float-end mx-3 "><i class="bi bi-pen" onclick=${starstar_kwargs.editfunction}(${element.id},event) ></i></p>
        <p class=" float-end "><i class="bi bi-trash" onclick=${starstar_kwargs.deletefunction}(${element.id},event) ></i></p>
        </div>
            <p class="mx-5" id="phase_name">${element.phase_name}</p>
        </div>`
        
    })
    content += `</div>`
    return content
}
 keys=Object.keys(data[0])
        content= presentdata(data,keys,{editfunction:'RawmaterialsEdit',deletefunction:'RawmaterialsDelete'})
        document.getElementById('rawmaterialsdata').innerHTML=content