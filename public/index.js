document.getElementById("url").addEventListener("change",()=>{
    let value = document.getElementById("url").value;
    fetch("/id",{
        headers:{
            "Content-Type":'application/json'
        },
        method:"POST",
        body:JSON.stringify({url:value})
    }).then(res=>res.json()).then(res=>{
        document.getElementById("video").setAttribute("src",`https://img.youtube.com/vi/${res.id}/mqdefault.jpg`);
    }).catch(err=>console.log(err));
})

document.getElementById("form").addEventListener('submit',e=>{
    let url=document.getElementById("url").value;
    let opcion=document.form.Opciones.value;
    let name=document.getElementById("name").value;
    fetch("/url",{
        headers:{
        'Content-Type':'application/json'
    },
    method:"POST",
    body:JSON.stringify({uri:url,op:opcion,name:name})
    }).then(res=>res.json()).then(res=>{
        console.log(res.op);
        if(res.op==true){
            alert("Convirtiendo");
            if(opcion=='Audio'){
                document.getElementById("download").setAttribute("href",`${res.names}.mp3`);
                document.getElementById("download").setAttribute("download",`${res.names}.mp3`);
            }else{
                document.getElementById("download").setAttribute("href",`${res.names}.mkv`);
                document.getElementById("download").setAttribute("download",`${res.names}.mkv`);
            }
        }else{
            alert("Error al convertir");
        }
    });

    e.preventDefault();
})

