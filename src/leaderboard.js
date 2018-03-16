const request = require('request-promise-native');

const API_ROOT = 'http://chrisinajar.com:6969/';

module.exports = checkLeaderboard;

function checkLeaderboard () {
  $(function() {
    var elem = $('.loaderboard');
    console.log('Checking for leaderboard!', elem);
    if (elem.length) {
      fillLeaderboard(elem);
    }
  });
}
async function fillLeaderboard (elem) {
  var data = await request.get(API_ROOT + 'top');

  data = JSON.parse(data);

  data.forEach(function (player) {
    var row = $('<tr />');
    elem.append(row);

    row.append('<td>' + player.ranking + '</td>');
    row.append($('<td />').text(player.name));
    row.append('<td>' + roundForDisplay(player.mmr) + '</td>');
  })
}

function roundForDisplay (number) {
  return (~~(number * 1000)) / 1000;
}
