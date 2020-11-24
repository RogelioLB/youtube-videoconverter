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
        if(res.op==true){
            alert("Convirtiendo");
            name=res.name;
        }else{
            alert("Error al convertir");
        }
    });
    if(opcion=='Audio'){
        document.getElementById("download").setAttribute("href",`${name}.mp3`);
        document.getElementById("download").setAttribute("download",`${name}.mp3`);
    }if(opcion=='Video'){
        document.getElementById("download").setAttribute("href",`${name}.mvk`);
        document.getElementById("download").setAttribute("download",`${name}.mvk`);
    }
    e.preventDefault();
})

var loadInfo = function (videoId) {
    var gdata = document.createElement("script");
    gdata.src = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=jsonc&callback=storeInfo";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(gdata);
};