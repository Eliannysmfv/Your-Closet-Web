

function fecha()
{
    let fecha=new Date();

    let d=fecha.getDate();
    let m=fecha.getMonth()+1;
    let y=fecha.getFullYear();

    document.getElementById("pf").innerHTML="Fecha: "+d+"/"+m+"/"+y;
    setTimeout("Fecha()",1000);
}

function hora() {

    let hora = new Date();
    let h = hora.getHours();
    let m = hora.getMinutes();
    let s = hora.getSeconds();

    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;

    let ampm = "AM";
    if (h >= 12) {
        ampm = "PM";
        if (h > 12) {
            h -= 12;
        }
    }
    document.querySelector("#ph").innerHTML = "Hora local: " + h + ":" + m + ":" + s + " " + ampm;
    setTimeout("hora()", 1000);
}


function desvanecer
()
{
    document.querySelector("#banner").style.opacity="0";
    document.querySelector("#banner").style.transition="all 2s";
    setTimeout("girar()",1500);
}
 var x=0;

function girar() {
    x++;
    if (x > 4) x = 1;
    document.querySelector("#banner").src = "../imagenes/banner/banner/banner" + x + ".png"; // Ajustar la ruta de la imagen
    document.querySelector("#banner").style.opacity = "100%";
    document.querySelector("#banner").style.transition = "all 2s";
    setTimeout(desvanecer, 1500);
}

document.body.setAttribute("onload","desvanecer(), girar(),fecha(),hora()");


var refranes=[
    "Elige lo mejor para tu pequeña! ¡Descuentos exclusivos en vestidos, conjuntos y accesorios para niñas",
    "Celebra la dulzura de la infancia con nuestras promociones especiales! ¡Compra 2 prendas y llévate la tercera gratisen todo quiere, todo lo pierde", 
    "Por compras mayores a s/ 200 obtén el 10% de descuento!"];

var indice=0;
setInterval(muestra,1500);

function muestra() {
    indice++;
    if(indice>=refranes.length)
    {
        indice=0;
    }
    document.getElementById("salida").innerHTML=refranes[indice];
}