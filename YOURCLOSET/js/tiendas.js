
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

var x = 0; 
let bannerElement = document.querySelector("#banner");



function desvanecer()
{

    bannerElement.style.opacity = "0";
    bannerElement.style.transition = "all 2s";
 
    setTimeout(girar, 1500);


}


function girar() {
    x++;
    if (x > 4) x = 1;
    document.querySelector("#banner").src = "../imagenes/banner/banner/banner" + x + ".png";
    document.querySelector("#banner").style.opacity = "100%";
    document.querySelector("#banner").style.transition = "all 2s";
    setTimeout(desvanecer, 1500);
}
document.body.setAttribute("onload","desvanecer(), girar(),fecha(),hora()");