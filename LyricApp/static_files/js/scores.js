$(() => {
  const graphScore = (data, id, title, type) => {
    console.log('data[0] is', data[0]);
    console.log('data[1] is', data[1]);
    const trace = setTrace(data[0], data[1], 'rgb(55, 128, 191)', type);

    data = [trace];
    const layout = {
      title: title,
      xaxis: {
        title: 'x'
      },
      yaxis: {
        title: 'y'
      }
    };

    Plotly.newPlot("scores-" + id, data, layout);
  }

  const setTrace = (x, y, color, type) => {
    return {
      x: x,
      y: y,
      type: type, /* 'scatter', 'bar' */
      line: {
        color: color
      }
    };
  }

  let data = [];
  let user = '';
  
  if (!sessionStorage.username || sessionStorage.username === '') {
    $('#scores').html('<p>No user currently logged in. Please <a href="#login">Login</a>.</p>');
  }
  else {
    user = sessionStorage.username;
    console.log("Current user: " + user);
    
    $('#scores-name').html('<p>Logged in as: ' + user + '.</p>');
  }
  
  $('#songSelection').click(() => {
    const title = $('#songTitle').val();
    const artist = $('#songArtist').val();
    
    if (!title || !artist) {
      alert('Please enter both the title and the artist!');
    }
    else {
      $.ajax({
        url: 'showScore',
        type: 'POST',
        dataType: 'json',
        data: {
          username: user,
          title: title,
          artist: artist
        },
        success: (data) => {
          console.log(data);
          
          /* band-aid because the server should send an error code, not the client-side handling it */
          if (!data.scores) {
            $('#scores-graph').html('<p>No scores found for that song.</p>');
          }
          else {
            data = data.scores;
            let xData = [];
            let yData = [];
            
            for (let i = 0; i < data.length; ++i) {
              xData.push(data[i].date);
              yData.push(data[i].score);
            }
            
            $('#scores-graph').empty();
            $('#scores-description').html('<p>Showing scores over time for: ' + title + ', by ' + artist + '.</p>');
            graphScore([xData, yData], 'graph', 'Scores ', 'scatter')
          }
        }
      });
    }
  });
});