export function randomNumberInRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getRandomValueFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomPercentage(val) {
    return Math.random() < val;
}