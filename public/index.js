document.getElementById("form").addEventListener('submit',e=>{
    let url=document.getElementById("url").value;
    fetch("/url",{
        headers:{
        'Content-Type':'application/json'
    },
    method:"POST",
    body:JSON.stringify({uri:url})
    }).then(res=>res.json()).then(res=>{
        if(res.op===true)alert("Se convirtio con exito");
        else alert("Error al convertir");
    });
    e.preventDefault();
})