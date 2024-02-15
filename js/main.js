// El código va aquí ->

/* 1) Crear las variables con los elementos en el html ó también se le dice
    poner la referencuia a los dos botones y a los 2 campos
*/
let btnAgregar = document.getElementById("btnAgregar");
let btnClear = document.getElementById("btnClear");
let txtNombre = document.getElementById("Name");
let txtNumber = document.getElementById("Number");

let alertValidaciones = document.getElementById("alertValidaciones");
let alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
let tablaListaCompras = document.getElementById("tablaListaCompras"); //-> es un elemento
let cuerpoTabla = tablaListaCompras.getElementsByTagName("tbody").item(0); // -> esto es por nodo

let contadorProductos = document.getElementById("contadorProductos");
let productosTotal = document.getElementById("productosTotal");
let precioTotal = document.getElementById("precioTotal");



let precio = 0; //Variable usada para getPrecio
let isValid = true; // Variable bandera para getPrecio
let contador = 0;
let costoTotal = 0;
let totalEnProductos = 0;

let datos = new Array();


/*
2) Agregar una oreja al botón de limpiar
   Limpia toda la lista de compras incluyendo los campos.
   -El primer parametro click
   -Segundo parametro es la función con el evento
   preventDefault para evitar la funcionalidad por default en el navegador.
   y se ejecute lo que yo tengo.
 */
btnClear.addEventListener("click", function(event){
    event.preventDefault();
    txtNombre.value="";
    txtNumber.value="";
    alertValidacionesTexto.innerHTML="";
    alertValidaciones.style.display="none";
    txtNombre.style.border = ""; // para regresar el borde sin rojo cuando se agrega correctamente
    txtNumber.style.border = "";
    contador = 0;
    costoTotal = 0;
    totalEnProductos= 0;
    contadorProductos.innerText = contador;
    productosTotal.innerText = totalEnProductos;
    precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;
    localStorage.setItem("contadorProductos", contador);
    localStorage.setItem("totalEnProductos", totalEnProductos);
    localStorage.setItem("costoTotal", costoTotal);
    localStorage.removeItem("datos");
    datos = new Array;
    cuerpoTabla.innerText = "";
    // Podemos regresar el foco al campo del nombre.
    txtNombre.focus();
});//btnClear

/*
4) Validando que la longitud no sea 0
*/
    function validarCantidad(){
        if(txtNumber.value.length==0){
            return false;
        }// if length
        // Verificamos que sea un número
        if(isNaN(txtNumber.value)){
            return false;
        }//isNaN
        // Verificamos que la cantidad sea mayor a cero y primero le hicimos un cambio de tipo para que no sea string sino number
        
        if(Number(txtNumber.value)<=0){
            return false;
        }//if

        return true;
    }// validarCantidad

/**
 5) Inventar un precio
     utilizamos Math.random -> se multiplica por 75 para que nos de un número entre 0 y 75.
     Para transformarlo a un entero y 2 decimales. -> parseInt((Math.random() * 90)*100) / 100;
     Para 3 decimales sería entre 1000
 */
    function getPrecio(){
        return parseInt((Math.random() * 90) * 100) /100;
    }//getPrecio




/*
3) Validar la información de los campos.
    Usaremos el isNaN para validar que sea un nombre.
*/
btnAgregar.addEventListener("click",function(event){
    event.preventDefault();
    // Aquí le decimos que si ya corrijo el código se quite la alerta y solo apareza si se cumple el if
    alertValidacionesTexto.innerHTML="";
    alertValidaciones.style.display="none";
    txtNombre.style.border = ""; // para regresar el borde sin rojo cuando se agrega correctamente
    txtNumber.style.border = "";
    isValid = true;//Cada que presiono el boton debe ir en true.

    txtNombre.value = txtNombre.value.trim(); // Le quita los espacios en blanco al inicio y al final.
    txtNumber.value = txtNumber.value.trim();
    if(txtNombre.value.length <3){
        alertValidacionesTexto.insertAdjacentHTML("beforeend",`
        El <strong> Nombre </strong> no es correcto<br/>`);
        alertValidaciones.style.display="block"; // Con esta propiedad block es que se muestra, es decir le quita el none que está en el HTML Y lo cambia por block.
        txtNombre.style.border = "solid red thin";
        isValid=false;//Bandera para saber si se hace lo de getPrecio o no.
    }// if length <3

    if(! validarCantidad()){
        alertValidacionesTexto.insertAdjacentHTML("beforeend",`
        El <strong> Cantidad </strong> no es correcta<br/>`);
        alertValidaciones.style.display="block";
        // Le puedo indicar con style que se le cambie el borde
        txtNumber.style.border = "solid red thin";
        isValid = false;//Bandera para saber si se hace lo de getPrecio o no.
    }//if ! validarCantidad
    if(isValid){
        contador++;
        precio = getPrecio();
        row = `<tr>
            <td>${contador}</td>
            <td>${txtNombre.value}</td>
            <td>${txtNumber.value}</td>
            <td>${precio}</td>
        </tr>
        `;

        /**Estamos creando una cadena y abajo el parse está tomando esa cadena para convertirla a un objeto */
        let elemento = `{"id": ${contador},
                        "nombre" : "${txtNombre.value}",
                        "cantidad" : ${txtNumber.value},
                        "precio" : ${precio}
        }`;

        //Metiendo los datos de elemento al array datos.
        datos.push(JSON.parse(elemento));
        console.log(datos);
        localStorage.setItem("datos", JSON.stringify(datos));// El método set solo acepta cadenas, pero con el strinify lo transformo a cadena.

        cuerpoTabla.insertAdjacentHTML("beforeend", row);
        contadorProductos.innerText = contador;
        totalEnProductos += parseFloat(txtNumber.value);
        productosTotal.innerText = totalEnProductos;
        costoTotal += precio * parseFloat(txtNumber.value);
        precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;

        //7) Guardarlo en contador productos:

        localStorage.setItem("contadorProductos", contador);
        localStorage.setItem("totalEnProductos", totalEnProductos);
        localStorage.setItem("costoTotal", costoTotal);


        //Después de agregar el elemento borra los campos y regresa el focus al nombre.
        txtNombre.value="";
        txtNumber.value="";
        txtNombre.focus();

    }//if isValid
});//btnAgregar


//Para sacar la infomación del local storage y lo ponga en la ventana
window.addEventListener("load", function(event){
    event.preventDefault();
    if (this.localStorage.getItem("contadorProductos") != null){
        contador = Number(this.localStorage.getItem("contadorProductos"));
        totalEnProductos = Number(this.localStorage.getItem("totalEnProductos"));
        costoTotal = Number(this.localStorage.getItem("costoTotal"));

        contadorProductos.innerText = contador;
        productosTotal.innerText = totalEnProductos;
        //Todo lo que regresa el localStorage lo regresa en String por eso arriba se le hizo el parse a Number
        precioTotal.innerText = `$ ${costoTotal.toFixed(2)}`;
    }//if != null
    
    if(this.localStorage.getItem("datos")!= null){
        datos = JSON.parse(this.localStorage.getItem("datos"));
        datos.forEach((r) => {
        let row = `<tr>
            <td>${r.id}</td>
            <td>${r.nombre}</td>
            <td>${r.cantidad}</td>
            <td>${r.precio}</td>
        </tr>`;
        cuerpoTabla.insertAdjacentHTML("beforeend", row);
    });
    }// datos null

});//Window load
