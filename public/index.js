var socket = io();
let id;
socket.on('connect',function(){
    id=socket.id;
})
document.getElementById("url").addEventListener("change",()=>{
    let value = document.getElementById("url").value;
    if (value == "") {
        document.querySelector('.miniatura').style.display = "none";
        return;
    }
    fetch("/id",{
        headers:{
            "Content-Type":'application/json'
        },
        method:"POST",
        body:JSON.stringify({url:value})
    }).then(res=>res.json()).then(res=>{
        document.getElementById("video").setAttribute("src",`https://img.youtube.com/vi/${res.id}/mqdefault.jpg`);
        document.querySelector('.miniatura').style.display = "flex";
    }).catch(err=>console.log(err));
})

document.getElementById("form").addEventListener('submit',e=>{
    let url=document.getElementById("url").value;
    let opcion=document.form.Opciones.value;
    let quality = document.form.quality.value;
    fetch("/url",{
        headers:{
        'Content-Type':'application/json'
    },
    method:"POST",
    body:JSON.stringify({uri:url,op:opcion,id:id,quality:quality})
    }).then(res=>res.json()).then(res=>{
        if(res.op==true){
            document.getElementById("title").innerHTML=`${res.title}`;;
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

socket.on("Finish",(data)=>{
    alert(`Se ha convertido con exito.`);
})
socket.on("upload",(data)=>{
    document.getElementById("total").innerHTML=data.downloaded+"% Convertido";
})
