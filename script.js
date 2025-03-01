let iconos = [];
let selecciones = [];
let loggedInUser = null;
let usersDB = [];
let soundEnabled = true; // Estado de los efectos de sonido
let generalVolume = 1; // Volumen general
let musicVolume = 1; // Volumen de la música
let sfxVolume = 1; // Volumen de efectos de sonido
let backgroundMusic = new Audio("music1.mp3"); // Música de fondo inicial
backgroundMusic.loop = true; // Repetir la música en bucle
let dificultad = 8; // Dificultad por defecto: Fácil (8 pares)
let startTime = null; // Tiempo de inicio del juego
let endTime = null;   // Tiempo de finalización del juego

// Función para seleccionar la dificultad
function seleccionarDificultad(nivel) {
    dificultad = parseInt(nivel); // Convertir el valor a número
    alert(`Dificultad seleccionada: ${dificultad} pares`);
    generarTablero(); // Generar el tablero con la nueva dificultad
    document.getElementById("difficulty-menu").style.display = "none"; // Ocultar el menú de dificultad
}

// Función para mostrar el menú de dificultad
function mostrarMenuDificultad() {
    document.getElementById("difficulty-menu").style.display = "block";
    document.getElementById("game-over-menu").style.display = "none";
    document.getElementById("tablero").innerHTML = ""; // Limpiar el tablero
}

// Función para cargar los íconos según la dificultad
function cargarIconos() {
    const imagenes = [
        "images/imagen1.jpg", "images/imagen2.jpg", "images/imagen3.jpg",
        "images/imagen4.jpg", "images/imagen5.jpg", "images/imagen6.jpg",
        "images/imagen7.jpg", "images/imagen8.jpg", "images/imagen9.jpg",
        "images/imagen10.jpg", "images/imagen11.jpg", "images/imagen12.jpg",
        "images/imagen13.jpg", "images/imagen14.jpg", "images/imagen15.jpg",
        "images/imagen16.jpg", "images/imagen17.jpg", "images/imagen18.jpg",
        "images/imagen19.jpg", "images/imagen20.jpg", "images/imagen21.jpg",
        "images/imagen22.jpg", "images/imagen23.jpg", "images/imagen24.jpg",
    ];

    // Seleccionar solo las imágenes necesarias según la dificultad
    const imagenesSeleccionadas = imagenes.slice(0, dificultad);

    // Duplicar las imágenes para formar pares
    iconos = [...imagenesSeleccionadas, ...imagenesSeleccionadas];

    // Mezclar las imágenes aleatoriamente
    iconos.sort(() => Math.random() - 0.5);
}

// Función para generar el tablero según la dificultad
function generarTablero() {
    startTime = new Date(); // Iniciar el tiempo cuando se genera el tablero
    cargarIconos();
    selecciones = [];
    const tablero = document.getElementById("tablero");
    tablero.innerHTML = ""; // Limpiar el tablero

    // Calcular el número de columnas según la dificultad
    let columnas;
    if (dificultad === 8) {
        columnas = 4; // 4x4 para 8 pares
    } else if (dificultad === 16) {
        columnas = 6; // 6x6 para 16 pares
    } else if (dificultad === 24) {
        columnas = 8; // 8x8 para 24 pares
    }

    // Aplicar el estilo de columnas al tablero
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 100px)`;

    // Generar las tarjetas
    iconos.forEach((icono, index) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("area-tarjeta");
        tarjeta.innerHTML = `
            <div class="tarjeta" id="tarjeta${index}" onclick="seleccionarTarjeta(${index})">
                <div class="cara trasera" id="trasera${index}">
                    <img src="${icono}" width="100%">
                </div>
                <div class="cara superior">
                    <i class="far fa-question-circle"></i>
                </div>
            </div>
        `;
        tablero.appendChild(tarjeta);
    });

    // Ocultar el menú de dificultad y el menú de "Juego terminado"
    document.getElementById("difficulty-menu").style.display = "none";
    document.getElementById("game-over-menu").style.display = "none";
}

// Función para verificar si el juego ha terminado
function verificarJuegoTerminado() {
    const tarjetas = document.querySelectorAll(".tarjeta");
    const todasVolteadas = Array.from(tarjetas).every(tarjeta => tarjeta.style.transform === "rotateY(180deg)");
    if (todasVolteadas) {
        endTime = new Date(); // Registrar el tiempo de finalización
        const tiempoTranscurrido = (endTime - startTime) / 1000; // Tiempo en segundos

        // Mostrar el mensaje de felicitaciones y el tiempo
        document.getElementById("time-message").textContent = `Tardaste ${tiempoTranscurrido.toFixed(2)} segundos.`;
        document.getElementById("game-over-menu").style.display = "block";

        // Lanzar confeti
        confetti({
            particleCount: 100, // Número de partículas de confeti
            spread: 70,         // Ángulo de dispersión
            origin: { y: 0.6 }  // Posición de origen (0.6 = 60% desde la parte superior)
        });

        // Reproducir un sonido de victoria (opcional)
        playSoundEffect("victory-sound.mp3");
    }
}

// Función para seleccionar una tarjeta
function seleccionarTarjeta(i) {
    let tarjeta = document.getElementById("tarjeta" + i);
    if (tarjeta.style.transform != "rotateY(180deg)") {
        tarjeta.style.transform = "rotateY(180deg)";
        selecciones.push(i);
        playSoundEffect("flip-sound.mp3");
    }
    if (selecciones.length == 2) {
        deseleccionar(selecciones);
        selecciones = [];
    }
    verificarJuegoTerminado(); // Verificar si el juego ha terminado
}

// Función para deseleccionar tarjetas incorrectas
function deseleccionar(selecciones) {
    setTimeout(() => {
        let trasera1 = document.getElementById("trasera" + selecciones[0]);
        let trasera2 = document.getElementById("trasera" + selecciones[1]);
        if (trasera1.innerHTML != trasera2.innerHTML) {
            let tarjeta1 = document.getElementById("tarjeta" + selecciones[0]);
            let tarjeta2 = document.getElementById("tarjeta" + selecciones[1]);
            tarjeta1.style.transform = "rotateY(0deg)";
            tarjeta2.style.transform = "rotateY(0deg)";
        } else {
            trasera1.style.background = "plum";
            trasera2.style.background = "plum";
            playSoundEffect("match-sound.mp3");
        }
    }, 1000);
}

// Función para reproducir efectos de sonido
function playSoundEffect(soundFile) {
    if (soundEnabled) {
        let sound = new Audio(soundFile);
        sound.volume = sfxVolume * generalVolume;
        sound.play();
    }
}

// Resto del código (sin cambios)
function toggleConfigMenu() {
    const configMenu = document.getElementById("config-menu");
    configMenu.style.display = configMenu.style.display === "block" ? "none" : "block";
}

function changeGeneralVolume(volume) {
    generalVolume = parseFloat(volume);
    backgroundMusic.volume = musicVolume * generalVolume;
}

function changeMusicVolume(volume) {
    musicVolume = parseFloat(volume);
    backgroundMusic.volume = musicVolume * generalVolume;
}

function changeSFXVolume(volume) {
    sfxVolume = parseFloat(volume);
}

function toggleSoundEffects(enabled) {
    soundEnabled = enabled;
    if (!soundEnabled) {
        stopAllSounds(); // Detener todos los sonidos si se desactivan
    }
}

function stopAllSounds() {
    document.querySelectorAll("audio").forEach(audio => audio.pause());
}

function changeBackgroundMusic(musicFile) {
    backgroundMusic.pause();
    backgroundMusic = new Audio(musicFile);
    backgroundMusic.loop = true;
    backgroundMusic.volume = musicVolume * generalVolume;
    backgroundMusic.play();
}

function muteAll() {
    generalVolume = 0;
    document.getElementById("volume-general").value = 0;
    document.getElementById("volume-music").value = 0;
    document.getElementById("volume-sfx").value = 0;
    backgroundMusic.volume = 0;
}

document.addEventListener("DOMContentLoaded", () => {
    backgroundMusic.play().catch(error => {
        console.error("Error al iniciar la música:", error);
    });
});

function signup() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if (username && password) {
        if (usersDB.find(user => user.username === username)) {
            alert("Este usuario ya está registrado.");
            return;
        }
        usersDB.push({ username, password });
        alert("Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
    } else {
        alert("Por favor ingresa un nombre de usuario y contraseña.");
    }
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let user = usersDB.find(user => user.username === username && user.password === password);
    if (user) {
        loggedInUser = user;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById("difficulty-menu").style.display = "block"; // Mostrar el menú de dificultad
        alert("Bienvenido, " + username);
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}