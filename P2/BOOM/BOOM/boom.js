console.log("Ejecutando JS...");

const digitos = document.getElementsByClassName("digito");
let clave = []; // Array para almacenar la clave secreta
let count = 0; // Contador de dígitos adivinados correctamente
let secretkey; // Variable para almacenar la clave secreta generada

//-- Generar números aleatorios del 0 al 9 para la clave secreta
function getRandomInt() {
    let key = [];
    for (let i = 0; i < 4; i++) {
        key.push(Math.floor(Math.random() * 10));
    }
    return key;
}

//-- Función de adivinanza de dígitos
function digito(ev) {
    const digitoAdivinado = parseInt(ev); // Convertir el valor del botón a un número entero
    console.log("Valor: " + digitoAdivinado);

    // Verificar si el dígito adivinado coincide con algún dígito de la clave secreta
    while (count < secretkey.length) {
        for (let i = 0; i < secretkey.length; i++) {
            if (digitoAdivinado === secretkey[i]) {
                // Si coincide, mostrar el dígito adivinado en la interfaz y cambiar el color a blanco
                clave.push(digitoAdivinado);

                // Actualizar el contenido del elemento span correspondiente con el dígito adivinado
                clavesElementos[i].textContent = digitoAdivinado;
                clavesElementos[i].style.color = "white";

                count++; // Incrementar el contador de dígitos adivinados correctamente
                
                // Si se han adivinado todos los dígitos, detener el cronómetro
                if (count === 4) {
                    crono.stop();
                }
                return; // Terminar la función una vez que se ha encontrado una coincidencia
            }
        }
        break;
    }
}


//-- Asignar la función de adivinanza de dígitos a los botones numéricos
for (let boton of digitos) {
    boton.onclick = (ev) => {
        digito(ev.target.value)
    }
}

//-- Elementos de la GUI
const gui = {
    display: document.getElementById("display"),
    start: document.getElementById("start"),
    stop: document.getElementById("stop"),
    reset: document.getElementById("reset")
}

// Array para almacenar las referencias a los elementos span que representan los dígitos de la clave secreta
const clavesElementos = document.querySelectorAll('#secretpassword .clave');


//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    secretkey = getRandomInt(); // Generar una nueva clave secreta
    console.log("Clave secreta: " + secretkey.join('')); // Mostrar la clave secreta en la consola
    crono.start();
    document.body.style.backgroundColor = "red";
}

//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    secretkey = null; // Reiniciar la clave secreta al reiniciar el juego
    crono.reset();
    //-- Recargar la página cuando se reinicia
    window.location.reload(); 
}
