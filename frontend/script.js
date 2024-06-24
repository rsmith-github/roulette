document.addEventListener('DOMContentLoaded', function () {
    initWheel();

    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('message', (event) => {
        const num = parseInt(event.data);
        spinWheel(num);
    });
});

function initWheel() {
    const wheel = document.querySelector('.roulette-wrapper .wheel');
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

    const rows = 12;
    const card = 75 + 3 * 2;
    let landingPosition = rows * 15 * card + position * card;

    const randomize = Math.floor(Math.random() * 75) - 75 / 2;

    landingPosition = landingPosition + randomize;

    const object = {
        x: Math.floor(Math.random() * 50) / 100,
        y: Math.floor(Math.random() * 20) / 100
    };

    wheel.style.transitionTimingFunction = `cubic-bezier(0, ${object.x}, ${object.y}, 1)`;
    wheel.style.transitionDuration = '6s';
    wheel.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`;

    setTimeout(function () {
        wheel.style.transitionTimingFunction = '';
        wheel.style.transitionDuration = '';

        const resetTo = -(position * card + randomize);
        wheel.style.transform = `translate3d(${resetTo}px, 0px, 0px)`;
    }, 6 * 1000);
}