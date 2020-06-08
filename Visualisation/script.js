var TITLE = 'Bi-Monthly Polls Data for Major German Parties';

var X_AXIS = 'Date';  // x-axis label and label in tooltip
var Y_AXIS = 'Poll'; // y-axis label and label in tooltip

var BEGIN_AT_ZERO = false;  // Should x-axis start from 0? `true` or `false`

var SHOW_GRID = true; // `true` to show the grid, `false` to hide
var SHOW_LEGEND = true; // `true` to show the legend, `false` to hide
var party_colors = {
    'CDU/CSU': [0, 0, 0],
    'SPD': [227, 0, 15],
    'GRÜNE': [100, 161, 45],
    'FDP': [255,237,0],
    'LINKE': [165,36,96],
    'AfD': [0,102,153],
    'REP': [139,69,19],
    'PIRATEN': [255,136,0],
    'Rechte': [139,69,19],
    'Non-Voters': [211,211,211],
    'FW': [0,126,132],
    'NPD': [139,69,19],
    'KPD/DKP': [255,0,0],
    'DRP': [105,105,105],
    'GB/BHE': [125,125,125],
    'DP': [145,145,145],
    'BP': [165,165,165],
    'Zentrum': [185,185,185],
    'Other': [85,85,85]
  }

function to_rgba(rgb, opacity) {
  str = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')'
  return str;   // The function returns the product of p1 and p2
}

$(document).ready(function() {

  // Read data file and create a chart
  $.get('https://raw.githubusercontent.com/henrythier/polls/master/Data/normalised/semi_month.csv', function(csvString) {

    var data = Papa.parse(csvString).data;
    var timeLabels = data.slice(1).map(function(row) { return row[0]; });

    var datasets = [];
    for (var i = 1; i < data[0].length; i++) {
      datasets.push(
        {
          label: data[0][i], // column name
          data: data.slice(1).map(function(row) {return row[i]}), // data in that column
          fill: false, // `true` for area charts, `false` for regular line charts
          borderColor: to_rgba(party_colors[data[0][i]], 0.8),
          backgroundColor: to_rgba(party_colors[data[0][i]], 0.5),
          pointBackgroundColor: to_rgba(party_colors[data[0][i]], 0.5),
          pointBorderColor: to_rgba(party_colors[data[0][i]], 1),
          pointHoverBackgroundColor: to_rgba(party_colors[data[0][i]], 0.8),
          pointHoverBorderColor: to_rgba(party_colors[data[0][i]], 1),
        }
      )
    }

    // Get container for the chart
    var ctx = document.getElementById('chart-container').getContext('2d');

    new Chart(ctx, {
      type: 'line',

      data: {
        labels: timeLabels,
        datasets: datasets,
      },

      options: {
        title: {
          display: true,
          text: TITLE,
          fontSize: 14,
        },
        legend: {
          display: SHOW_LEGEND,
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: X_AXIS !== '',
              labelString: X_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              callback: function(value, index, values) {
                return value.toLocaleString();
              }
            }
          }],
          yAxes: [{
            beginAtZero: true,
            scaleLabel: {
              display: Y_AXIS !== '',
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: BEGIN_AT_ZERO,
              callback: function(value, index, values) {
                return value.toLocaleString()
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, all) {
              return all.datasets[tooltipItem.datasetIndex].label
                + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        plugins: {
          colorschemes: {
            scheme: 'brewer.Paired12'
          }
        }
      }
    });

  });

});
