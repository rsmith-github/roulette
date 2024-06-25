const socket = new WebSocket('ws://localhost:8080');

document.addEventListener('DOMContentLoaded', function () {


    if (localStorage.getItem("username")) {
        initWheel();
    } else {
        handleLogin();
    }

    handleAdminRoll();

    socket.addEventListener('message', (event) => {
        const num = parseInt(event.data);
        if (Number.isInteger(num)) {
            spinWheel(num);
        }
    });

    handleLogout();
});

function initWheel() {
    const wheel = document.querySelector('.roulette-wrapper .wheel');

    // show roulette wrapper
    document.querySelector('.roulette-wrapper').style.display = 'flex';

    // hide login
    document.querySelector('.login-screen').style.display = 'none'

    if (localStorage.getItem('username') === 'admin') {
        document.getElementById('roll-button').style.display = 'block';
    }

    let row = '';

    row += "<div class='row'>";
    row += "  <div class='card red'>1</div>";
    row += "  <div class='card black'>14</div>";
    row += "  <div class='card red'>2</div>";
    row += "  <div class='card black'>13</div>";
    row += "  <div class='card red'>3</div>";
    row += "  <div class='card black'>12</div>";
    row += "  <div class='card red'>4</div>";
    row += "  <div class='card green'>0</div>";
    row += "  <div class='card black'>11</div>";
    row += "  <div class='card red'>5</div>";
    row += "  <div class='card black'>10</div>";
    row += "  <div class='card red'>6</div>";
    row += "  <div class='card black'>9</div>";
    row += "  <div class='card red'>7</div>";
    row += "  <div class='card black'>8</div>";
    row += "</div>";

    for (let x = 0; x < 29; x++) {
        wheel.insertAdjacentHTML('beforeend', row);
    }
}

function spinWheel(roll) {
    const wheel = document.querySelector('.roulette-wrapper .wheel');
    const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
    const position = order.indexOf(roll);

    const rows = 8; // how many full rotations are spun
    const card = 75 + 3 * 2; // pixel width
    let landingPosition = rows * 15 * card + position * card;

    const randomize = Math.floor(Math.random() * 75) - 75 / 2;

    landingPosition = landingPosition + randomize;

    wheel.style.transitionDuration = '6s';
    wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;


    let promise1 = new Promise(function (resolve, reject) {
        setTimeout(function () {
            wheel.style.transitionDuration = '';

            const resetTo = -(position * card + randomize);
            wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
            resolve();
        }, 6 * 1000);

    })

    Promise.all([promise1]).then(function () {

        function updateScores() {
            socket.send(JSON.stringify({ name: 'updateScores' }))
            console.log('notified server to update scores');
        }
        updateScores();

    })



}

function handleLogin() {

    const username = document.getElementById('username');
    const loginButton = document.getElementById('login-button');

    loginButton.addEventListener('click', () => {
        if (username.value || localStorage.getItem("username")) {
            localStorage.setItem('username', username.value)
            initWheel();

            // send message to add user to 'database'
            socket.send(JSON.stringify({ name: 'login', username: username.value }))

        };


    })


}

function handleLogout() {
    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('username');
        // hide roulette wrapper
        document.querySelector('.roulette-wrapper').style.display = 'none';

        // show login
        document.querySelector('.login-screen').style.display = 'block'
    })
}

function handleAdminRoll() {

    const rollButton = document.querySelector('.roll-button');

    rollButton.addEventListener('click', () => {
        const userObject = JSON.stringify({ name: localStorage.getItem('username') })
        socket.send(userObject)
    })

}