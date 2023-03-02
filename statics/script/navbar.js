let managements = {'master-data':{'type':'dropdown'},'inventory':{'type':'link','url':'/inventory',},'sales':{'type':'link','url':'/inventory',},
'purchase':{'type':'link','url':'/purchase',},'production':{'type':'link','url':'/production',}}

function get_navbar(){
   let  nav =  ` <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" data-bs-keyboard="false" data-bs-backdrop="false">
    <div class="offcanvas-header">
        <h6 class="offcanvas-title d-none d-sm-block" id="offcanvas">Menu</h6>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body px-0">
        <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu"> `

    for (let [key,value] of Object.entries(managements)){
      nav +=   `<li class="nav-item">`
        if(value['type'] == 'link'){
            nav += `  <a href="${value['url']}" class="nav-link text-truncate">
            </i><span class="ms-1 d-none d-sm-inline">${key}</span>
        </a>`
   
        }else if(value['type'] != 'link'){
           nav += `<a href="#" data-bs-toggle="dropdown" class="nav-link dropdown-toggle  text-truncate"
                            aria-expanded="false">
                            <i class="fs-5 bi-speedometer2"></i><span class="ms-1 d-none d-sm-inline">Admin</span> </a>
                        <ul class="dropdown-menu text-small shadow" aria-labelledby="admin">
                            <li><a class="dropdown-item" id="data-management-url" href="#">Data Management</a></li>
                            <hr class="dropdown-divider">
                            <li><a class="dropdown-item" id="user-management-url" href="#">Manage users</a></li>
                            <hr class="dropdown-divider">
                            <li><a class="dropdown-item" id="settings-url" href="#">Settings</a></li>
                        </ul>`
        }
        nav +=  `</li>`
    }
    nav += `  </ul> </div></div>`
    document.querySelector('.navbar-container').innerHTML = nav
}
// get_navbar()

{/**/}

// <!-- {<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" data-bs-keyboard="false" data-bs-backdrop="false">
//     <div class="offcanvas-header">
//         <h6 class="offcanvas-title d-none d-sm-block" id="offcanvas">Menu</h6>
//         <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//     </div>
//     <div class="offcanvas-body px-0">
//         <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu">
//             <li class="nav-item">
//                 <a href="#" class="nav-link text-truncate">
//                     <i class="fs-5 bi-house"></i><span class="ms-1 d-none d-sm-inline">Home</span>
//                 </a>
//             </li>
//             <li>
//                 <a href="#submenu1" data-bs-toggle="collapse" class="nav-link text-truncate">
//                     <i class="fs-5 bi-speedometer2"></i><span class="ms-1 d-none d-sm-inline">Dashboard</span> </a>
//             </li>

//             <li>
//                 <a href="#" class="nav-link text-truncate">
//                     <i class="fs-5 bi-table"></i><span class="ms-1 d-none d-sm-inline">sales-management</span></a>
//             </li>

//             <li class="admin">
//                 <a href="#" data-bs-toggle="dropdown" class="nav-link dropdown-toggle  text-truncate"
//                     aria-expanded="false">
//                     <i class="fs-5 bi-speedometer2"></i><span class="ms-1 d-none d-sm-inline">Admin</span> </a>
//                 <ul class="dropdown-menu text-small shadow" aria-labelledby="admin">
//                     <li><a class="dropdown-item" id="data-management-url" href="#">Data Management</a></li>
//                     <hr class="dropdown-divider">
//                     <li><a class="dropdown-item" id="user-management-url" href="#">Manage users</a></li>
//                     <hr class="dropdown-divider">
//                     <li><a class="dropdown-item" id="settings-url" href="#">Settings</a></li>
//                 </ul>
//             </li>


//             <li>
//                 <a href="#" class="nav-link text-truncate">
//                     <i class="fs-5 bi-people"></i><span class="ms-1 d-none d-sm-inline">Customers</span> </a>
//             </li>
//         </ul>
//     </div>
// </div>} -->
