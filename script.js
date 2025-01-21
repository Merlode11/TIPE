// Change the position of the button on the screen randomly when the button is clicked
const button = document.getElementById('button');
const startButton = document.getElementById('start');
const homeContainer = document.getElementById('home');
const scoreContainer = document.getElementById('scoring');
const score = document.getElementById('score');
const timer = document.getElementById('time');

const MAX_CLICKS = 10;

let date = Date.now();
let centi = 0;
let mili = 0;
let sec = 0;
let sec_;
let afficher;

let isInGame = false;
let coords = [];
let buttonPositions = [];
let curves = [[]];
let clicks = 0;

function endGame() {
    button.classList.add('hidden');
    startButton.classList.remove('hidden');
    homeContainer.classList.remove('hidden');
    scoreContainer.classList.add('hidden');
    isInGame = false;
    clicks = 0;
    score.innerHTML = clicks + '/' + MAX_CLICKS;
    console.log(sec_ + ':' + centi + mili + ' !');
    console.log(coords);
    let send = true;
    // If the website is used from a file, didn't work with the fetch
    if (window.location.protocol !== 'file:')
        send = confirm(sec_ + ':' + centi + mili + ' !' + "\nVoulez vous envoyer votre résultat pour faire des tests ?\nSeront inclus: date, heure, temps, dimensions de l'écran, système d'exploitation, positions de la souris durant la partie.")
    let data = {
        bot: navigator.userAgent.toLowerCase().includes('python bot'),
        date: Date.now(),
        width: window.innerWidth,
        height: window.innerHeight,
        os: window.navigator.oscpu,
        time: sec * 1000 + centi * 100 + mili,
        coords: coords,
        buttonPositions: buttonPositions,
        curves: curves
    };
    if(send) fetch("http://127.0.0.1:5000/upload_tipe", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(r => r.json()).then(r => console.log(r));

    let text = JSON.stringify(data, null, 2);
    download(Date.now() + '.json', text);
    coords = [];
    buttonPositions = [];
    raz();
}

button.addEventListener('click', (event) => {
    const top = Math.random() * (window.innerHeight - 60);
    const left = Math.random() * (window.innerWidth - 150);

    button.style.top = `${top}px`;
    button.style.left = `${left}px`;
    const rect = button.getBoundingClientRect();
    buttonPositions.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    });

    let [x, y] = [event.clientX, event.clientY];
    coords.push({
        x,
        y,
        date,
        isClick: true
    });
    curves[clicks].push({
        x,
        y,
        date,
        isClick: true
    })
    clicks++;
    curves.push([]);
    score.innerHTML = clicks + '/' + MAX_CLICKS;
    if (clicks >= MAX_CLICKS) {
        endGame();
    }
});

startButton.addEventListener('click', () => {
    button.classList.remove('hidden');
    const top = Math.random() * (window.innerHeight - 60);
    const left = Math.random() * (window.innerWidth - 150);

    button.style.top = `${top}px`;
    button.style.left = `${left}px`;
    const rect = button.getBoundingClientRect();
    buttonPositions.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    });
    startButton.classList.add('hidden');
    homeContainer.classList.add('hidden');
    scoreContainer.classList.remove('hidden');
    isInGame = true;
    date = Date.now();
    chrono();
    score.innerHTML = clicks + '/' + MAX_CLICKS;
});

window.addEventListener('mousemove', (event) => {
    if (isInGame) {
        let [x, y] = [event.clientX, event.clientY];
        coords.push({
            x,
            y,
            date
        });
        curves[clicks].push({
            x,
            y,
            date
        });
        date = Date.now();
    }
});

window.addEventListener("click", (event) => {
    if (isInGame) {
        let [x, y] = [event.clientX, event.clientY];
        coords.push({
            x,
            y,
            date,
            isClick: true
        });
        curves[clicks].push({
            x,
            y,
            date,
            isClick: true
        })
        date = Date.now();
    }
});

timer.innerHTML = '0' + sec + ':' + '0' + mili;


function chrono() {
    setInterval(function() {
        mili++;
        if (mili > 9) {
            mili = 0;
        }
    }, 1);

    centi++;
    centi * 10; //=======pour passer en dixièmes de sec
    //=== on remet à zéro quand on passe à 1seconde
    if (centi > 9) {
        centi = 0;
        sec++;
    }

    if (sec < 10) {
        sec_ = '0' + sec;
    } else {
        sec_ = sec;
    }

    afficher = sec_ + ':' + centi + mili;
    timer.innerHTML = afficher;

    reglage = window.setTimeout('chrono();', 100);
}

function arret() {
    window.clearTimeout(reglage);
}

function raz() { // pour remettre à zéro
    centi = 0;
    mili = 0;
    sec = 0;
    afficher = sec + '0:' + centi + mili;
    timer.innerHTML = afficher;
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
