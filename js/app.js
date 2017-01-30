(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  //DECLARE VARS
  let form = document.querySelector('form');
  let title = document.querySelector('#search');
  let listings = document.querySelector('#listings');
  let plot='';

  //ADD EVENT LISTENER TO SEARCH FORM
  form.addEventListener('submit', Search);
  //SEARCH CALLBACK
  function Search(event) {
    event.preventDefault();
    //IF FORM IS BLANK, VALIDATE WITH A TOAST
    if (title.value === '') {
      Materialize.toast('Please Enter A Search Term!', 4000)
    }
    else {
      //CLEAR ANY PREVIOUS SEARCH RESULTS FROM MOVIES ARRAY
      while (movies.length > 0) {
        movies.pop();
      }
      //CLEAR THE DOM ELEMENT CONTAINING PREVIOUS SEARCH RESULTS
      listings.innerHTML = '';
      //FETCH OMDB SEARCH DATA
      fetch(`http://www.omdbapi.com/?s=${title.value}`)
      //JSONIFY RESPONSE OBJECT
      .then(function(res){
        return res.json();
      })
      //IF THERE ARE HITS, FOR EACH HIT, CREATE A MOVIE OBJECT AND PUSH TO MOVIES ARRAY
      .then (function(res){
        if (res.Search){
          res.Search.forEach(function(element){

            let filmObject = new Object;
            filmObject.id = element.imdbID;
            filmObject.poster = element.Poster;
            filmObject.title = element.Title;
            filmObject.year = element.Year;
            filmObject.plot = plot;
            console.log(plot);
            movies.push(filmObject);

          });
          renderMovies();

        }
        //IF THERE ARE NO HITS, TOAST VALIDATION
        else {
          Materialize.toast('No Results!', 4000);
        }
      });
    }
  }
})();
