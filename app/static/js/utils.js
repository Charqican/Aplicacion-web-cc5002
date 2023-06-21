// some utility functions

const getInfoDono= (id) => {
    window.location.href = "/informacion-donacion?id="+id;
}

const getInfoPedido= (id) => {
    window.location.href = "/informacion-pedido?id="+id;
}

const previousPage = (page) => {
    page=parseInt(page)
    page-=1
    window.location.href = "/ver-donaciones?page_number="+page;
}

const nextPage = (page) => {
    page=parseInt(page)
    page+=1
    console.log(page)
    window.location.href = "/ver-donaciones?page_number="+page;
}

const previousPageP = (page) => {
    page=parseInt(page)
    page-=1
    window.location.href = "/ver-pedidos?page_number="+page;
}

const nextPageP = (page) => {
    page=parseInt(page)
    page+=1
    console.log(page)
    window.location.href = "/ver-pedidos?page_number="+page;
}