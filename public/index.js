document.getElementById("form").addEventListener('submit',e=>{
    let url=document.getElementById("url").value;
    let opcion=document.form.Opciones.value;
    
    fetch("/url",{
        headers:{
        'Content-Type':'application/json'
    },
    method:"POST",
    body:JSON.stringify({uri:url,op:opcion})
    }).then(res=>res.json()).then(res=>{
        if(res.op===true)alert("Empezando a convertir");
        else alert("Error al convertir");
    });
    if(opcion=='Audio'){
        document.getElementById("download").setAttribute("href","audio.mp3");
        document.getElementById("download").setAttribute("download","audio.mp3");
    }if(opcion=='Video'){
        document.getElementById("download").setAttribute("href","video.mkv");
        document.getElementById("download").setAttribute("download","video.mkv");
    }
    e.preventDefault();
})