const socket = new WebSocket('ws://localhost:8080');

document.addEventListener('DOMContentLoaded', function () {


    if (localStorage.getItem("username")) {
        initWheel();
    } else {
        handleLogin();
    }

    handleAdminRoll();

    socket.addEventListener('message', (event) => {
        const data = parseInt(event.data);

        if (Number.isInteger(data)) {

            spinWheel(data);

        } else {

            let table = document.getElementById('table');
            let parsed = JSON.parse(event.data)

            // set header row
            table.innerHTML = '<tr><th>Name</th><th>Bet Placed</th><th>Coins</th></tr>'

            // other rows
            for (user in parsed) {
                if (parsed[user]) {
                    table.insertAdjacentHTML("beforeend", `<tr name="${user}"><td>${user}</td><td>${parsed[user].bet === undefined ? 'no bet placed' : parsed[user].bet}</td > <td>${parsed[user].coins}</td></tr > `)
                }
            }
        }
    });

    handleBets();
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
        document.getElementById('bets').style.display = 'none';
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

    let object = {
        x: Math.floor(Math.random() * 50) / 100,
        y: Math.floor(Math.random() * 20) / 100
    };

    wheel.style.transitionTimingFunction = 'cubic-bezier(0,' + object.x + ',' + object.y + ',1)';
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
            if (localStorage.getItem('username') === 'admin') {
                socket.send(JSON.stringify({ name: 'updateScores' }))
                console.log('notified server to update scores');
            }
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


function handleBets() {

    document.getElementById('bet-button').addEventListener('click', () => {
        // get bet amount
        let bet = document.getElementById('bet-amount').value

        socket.send(JSON.stringify({ name: 'bet', username: localStorage.getItem('username'), bet: bet, amount: 10 }))
    })

}