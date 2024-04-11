//-- Elementos de la gui
const gui = {
  display : document.getElementById("cronometro")
}

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//-- Declaración de variables y objetos
//-- Obtención del canvas y de los elementos HTML a usar
const canvas = document.getElementById("ctiro");
const ctx = canvas.getContext("2d");
var cerdo = document.getElementById("cerdo");
var cerdo_ko = document.getElementById("cerdo_ko");
var pajaro_amarillo = document.getElementById("pajaro_amarillo");

//-- Dimensiones canvas
canvas.width = 640;
canvas.height = 400;

//-- Valores interfaz
// Velocidad
const vel_range = document.getElementById("vel_range");
const vel_range_disp = document.getElementById("vel_range_disp");
vel_range_disp.innerHTML = vel_range.value;

// Ángulo
const ang_range = document.getElementById("ang_range");
const ang_range_disp = document.getElementById("ang_range_disp");
ang_range_disp.innerHTML = ang_range.value;

//-- Coordenadas iniciales del proyectil
let xop = 0;
let yop = 50;
let xp;
let yp;

//-- Coordenadas iniciales del objetivo
let xomin = canvas.width - (canvas.width - 200);
let xomax = canvas.width - 25;
let xo = Number(getRandomInt(xomin, xomax)); //getRandomXO(xomin,xomax);
let yo = 370;

//--Declaración de velocidad y ángulo
let velp, angp;

//-- Gravedad terrestre y tiempo
const gt = 9.8;
let t = 0;

//-- Variable para controlar el uso de botones
var block = 0; //-- 0 = no bloqueo; 1 = bloqueo

//-- Variables de altura (h) y anchura (w) del proyectil para calcular colisión
//-- Variable radio (r) para calculo de colisión
let h, w, r;

//-- Variables para el punto de perímetro del proyectil más
//    cercano a la circunferencia objetivo (px, py)
let px, py;

//-- Variables para comprobar colision y victoria;
let colision = 0;
let victoria;

//-- Acceder al botón de disparo
const btnLanzar = document.getElementById("btnLanzar");

//-- Acceder al botón de inicio
const btnIniciar = document.getElementById("btnIniciar");

//-- función para pintar el objetivo
function dibujarO(x, y, img) {
  //Radio circunferencia objetivo
  r = 25;

  //-- Pintando el objetivo
  ctx.beginPath();

  //-- Dibujar un circulo: coordenadas x,y del centro
  //-- Radio, Angulo inicial y angulo final
  ctx.arc(x, y, r, 0, 2 * Math.PI);

  ctx.drawImage(img, x-25, y-25)

  ctx.closePath();
}

//-- función para pintar el proyectil
function dibujarP(x, y, lx, ly) {

    //-- Pintando el proyectil
    ctx.beginPath();

    //-- Definir un rectángulo de dimensiones lx x ly,
    ctx.rect(x, y, lx, ly);

    //-- Añadimos imagen
    ctx.drawImage(pajaro_amarillo, x, y)

    ctx.closePath();

    w = x;
    h = y;
}

function dibujarTiroP() {
  xp = xop + velp * Math.cos(angp * Math.PI / 180) * t; //Se calcula posición x del proyectil
  yp = yop + velp * Math.sin(angp * Math.PI / 180) * t - 0.5 * gt * t * t; //Se calcula posición y del proyectil
  t += 0.1; //La simulación avanza cada 0.1 segundos, para más lento disminuir éste número
}

pajaro_amarillo.onload = ()=> {
  //-- Insertar la imagen en el canvas, una vez que
  //-- ya esté cargada!
  ctx.drawImage(pajaro_amarillo, xop, canvas.height-yop);
};

cerdo.onload = ()=> {
  //-- Insertar la imagen en el canvas, una vez que
  //-- ya esté cargada!
  ctx.drawImage(cerdo, xo-25,yo-25);
};

//-- Dibujar el objetivo
dibujarO(xo, yo, cerdo); // Pintar el objetivo

//-- Dibujar el proyectil en la posición inicial
dibujarP(xop, canvas.height-yop, 50, 50); // Pintar el proyectil

//-- Función principal de actualización
function lanzar() {
  //-- Implementación del algoritmo de animación:
  if (xp + 50 > canvas.width || xp < 0 || yp > canvas.height || yp - 50 < 0) {
    colision = 1;
    victoria = 0;
  }

  //-- Velocidad y ángulo incial del proyectil
  if (block == 0) {
    velp = Number(vel_range.value);
    angp = Number(ang_range.value);
    block = 1;
  }

  //-- Comprobar si hay colisión
  // (px, py) centro del proyectil
  px = xp + 25;
  py = (canvas.height - yp) + 25;
  distancia = Math.sqrt( (xo - px)*(xo - px) + (yo - py)*(yo - py) );
  if ( distancia < r ) {
    colision = 1;
    victoria = 1;
  }


  //-- 1) Actualizar posición de los elementos
  dibujarTiroP();
  //-- 2) Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //-- 3) Pintar los elementos en el canvas
  dibujarO(xo,yo, cerdo); // Pintar el objetivo

  dibujarP(xp, canvas.height-yp, 50, 50, "red"); // Pintar el proyectil

  if (colision == 0) {
    //-- 4) Repetir
    requestAnimationFrame(lanzar);
  }
  if (colision == 1 && victoria == 0) {
    crono.stop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "100px Verdana";
    ctx.fillStyle = 'red'
    ctx.fillText("TRY AGAIN", 70, 230);
  }
  
  if (colision == 1 && victoria == 1) {
    crono.stop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarO(xo, yo, cerdo_ko)
    ctx.font = "100px Verdana";
    ctx.fillStyle = 'gold'
    ctx.fillText("WINNER", 80, 230);

    // Crear elemento de imagen para el confeti
    const confetiImg = document.createElement("img");
    confetiImg.src = "confeti.gif"; // Reemplaza "confeti.gif" con la ruta de tu GIF de confeti
    confetiImg.style.position = "fixed";
    confetiImg.style.top = "0";
    confetiImg.style.left = "0";
    confetiImg.style.width = "100%";
    confetiImg.style.height = "100%";
    confetiImg.style.zIndex = "9999";
  
    // Agregar el confeti al cuerpo del documento
    document.body.appendChild(confetiImg);
  }
}

//-- Otras funciones....
//-- Función de retrollamada del botón de disparo
btnLanzar.onclick = () => {
  if (block == 0) {
    lanzar();
    crono.start();
  }
  block = 1;
}

//-- Función de retrollamada del botón de inicio
btnIniciar.onclick = () => {
  location.reload();
}

//-- Función genera numero aleatorio para la pos del onjetivo
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
}

//-- Función para mostrar valore de la interfaz de velocidad
vel_range.oninput = () => {
  vel_range_disp.innerHTML = vel_range.value;
}  

//-- Función para mostrar valor de la interfaz ángulo
ang_range.oninput = () => {
  ang_range_disp.innerHTML = ang_range.value;
}  

//ctx.beginPath()
//ctx.moveTo(xop, canvas.height-yop)
//ctx.quadraticCurveTo(xop, yop, xo, yo)
//ctx.stroke();