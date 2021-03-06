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

var start_date = new Date(Date.now())
var end_date = new Date(Date.now())
start_date.setMonth(end_date.getMonth() - 6)
var data
var ctx = document.getElementById('chart-container').getContext('2d');
var chartobject

function to_rgba(rgb, opacity) {
  str = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')'
  return str;
}

function start_index(x) {
  return x >= start_date
}

function end_index(x) {
  return x >= end_date
}

function to_date_string(d) {
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear()

  if (month.length < 2)
        month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  console.log([month, day, year].join('/'))
  return [month, day, year].join('/');
}

function update_chart(data) {
  var timeLabels = data.slice(1).map(function(row) { return row[0]; }).map(date => new Date(date));
  var start = timeLabels.findIndex(start_index)
  var end = timeLabels.findIndex(end_index)
  var timeLabels = timeLabels.slice(start, end)
  console.log(timeLabels)

  var datasets = [];
  for (var i = 1; i < data[0].length; i++) {
    datasets.push(
      {
        label: data[0][i], // column name
        data: data.slice(1).map(function(row) {return row[i]}).slice(start, end), // data in that column
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

  chartobject.data['datasets'] = datasets
  chartobject.data['timeLabels'] = timeLabels

  chartobject.config.data.labels = timeLabels
  chartobject.update()
}

function render_chart(data) {
  var timeLabels = data.slice(1).map(function(row) { return row[0]; }).map(date => new Date(date));
  var start = timeLabels.findIndex(start_index)
  var end = timeLabels.findIndex(end_index)
  var timeLabels = timeLabels.slice(start, end)
  console.log(start)
  console.log(end)

  var datasets = [];
  for (var i = 1; i < data[0].length; i++) {
    datasets.push(
      {
        label: data[0][i], // column name
        data: data.slice(1).map(function(row) {return row[i]}).slice(start, end), // data in that column
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

  chartobject = new Chart(ctx, {
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
              if (value instanceof Date) {
                x = value.toISOString().split('T')[0].split('-')
                if (x[1].length < 2){
                  x[1] = '0' + x[1]
                }
                if (x[2].length < 2) {
                  x[2] = '0' + x[2]
                }
                return x[2] + '.' + x[1] + '.' + x[0]
              }
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
            beginAtZero: true,
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
    }
  })
}

function get_data(csvString) {
  data = Papa.parse(csvString).data;
  render_chart(data)
}

$(document).ready(function() {

  $.get('https://raw.githubusercontent.com/henrythier/polls/master/Data/normalised/semi_month.csv', get_data)
  // Read data file and create a chart

  $(function() {
    $('input[name="daterange"]').daterangepicker({
      opens: 'center',
      showDropdowns: true,
      startDate: start_date,
      endDate: end_date,
      locale: {
        format: 'DD.MM.YYYY'
      },
      autoApply: true,
    }, function(start_input, end_input, label) {
      start_date = new Date(start_input.format('YYYY-MM-DD'));
      end_date = new Date(end_input.format('YYYY-MM-DD'))
      update_chart(data)
    });
  });
  });
