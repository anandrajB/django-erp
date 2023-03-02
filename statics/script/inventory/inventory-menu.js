let menu_items = {
    'inventory':['new-sales-order','sales-order'],
    'sales-order':['new-sales-order','sales-order'],
    'production':['production-order'],

}

let url = new URLSearchParams(window.location.search)
model_name = url.get('model_name')

function get_menu(){
    let menuitem =  menu_items[model_name]
    console.log(menuitem,'da')
        data = ''
     menuitem.forEach((element)=>{
        data +=` <a href="${host}/${element}" class="nav-link text-truncate"">
        <div class="card mx-2 my-5 p-5 ">${element.replace(/-/g,' ')}</div>
    </a>`
     })
     document.querySelector('.inventory-menu').innerHTML = data
    }
get_menu()