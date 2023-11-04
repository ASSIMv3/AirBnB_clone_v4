$(document).ready(function () {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    $('input[type="checkbox"]').change(function () {
        const id = $(this).data('id');
        const name = $(this).data('name');

        if ($(this).is(':checked')) {
            if ($(this).hasClass('state')) {
                selectedStates[id] = name;
            } else if ($(this).hasClass('city')) {
                selectedCities[id] = name;
            } else {
                selectedAmenities[id] = name;
            }
        } else {
            if ($(this).hasClass('state')) {
                delete selectedStates[id];
            } else if ($(this).hasClass('city')) {
                delete selectedCities[id];
            } else {
                delete selectedAmenities[id];
            }
        }

        const selectedLocations = [...Object.values(selectedStates), ...Object.values(selectedCities)];
        const locationsList = selectedLocations.join(', ');
        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.filters .locations h4').text(locationsList);
        $('.filters .amenities h4').text(amenitiesList);
    });

    $.get('http://localhost:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    function searchPlaces(searchData) {
        $.ajax({
            url: 'http://localhost:5001/api/v1/places_search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(searchData),
            success: function(data) {
                $('.places').empty();

                data.forEach(function(place) {
                    const article = document.createElement('article');
                    article.innerHTML = `
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">${place.description}</div>
                        <div class="reviews">
                            <h2 id="${place.id}n" class="treview">Reviews</h2>
                            <span id="${place.id}"">Show</span>
                            <ul id="${place.id}r"></ul>
                        </div>
                    `;
                    $('.places').append(article);
                });
            },
            error: function(error) {
                console.log('Error:', error);
            },
        });
    }

    searchPlaces({});

    $('button[type="button"]').click(function() {
        const searchData = {
            states: Object.keys(selectedStates),
            cities: Object.keys(selectedCities),
            amenities: Object.keys(selectedAmenities),
        };

        searchPlaces(searchData);
    });

    function showReviews (obj) {
        if (obj === undefined) {
          return;
        }
        if (obj.textContent === 'Show') {
          obj.textContent = 'Hide';
          $.get(`http://localhost:5001/api/v1/places/${obj.id}/reviews`, (data, textStatus) => {
            if (textStatus === 'success') {
              $(`#${obj.id}n`).html(data.length + ' Reviews');
              for (const review of data) {
                toggleReview(review, obj);
              }
            }
          });
        } else {
          obj.textContent = 'Show';
          $(`#${obj.id}n`).html('Reviews');
          $(`#${obj.id}r`).empty();
        }
      }

      $('.places').on('click', 'span', function() {
        showReviews(this);
      });
      
      function toggleReview (review, obj) {
        const date = new Date(review.created_at);
        const month = date.toLocaleString('en', { month: 'long' });
        const day = dateFormat(date.getDate());
      
        if (review.user_id) {
          $.get(`http://localhost:5001/api/v1/users/${review.user_id}`, (data, textStatus) => {
            if (textStatus === 'success') {
              $(`#${obj.id}r`).append(
                `<li class="review_item"><h3>From ${data.first_name} ${data.last_name} the ${day + ' ' + month + ' ' + date.getFullYear()}</h3>
                <p class="review_text">${review.text}</p>
                </li>`);
            }
          });
        }
      }
      
      function dateFormat (dom) {
        if (dom === 31 || dom === 21 || dom === 1) return dom + 'st';
        else if (dom === 22 || dom === 2) return dom + 'nd';
        else if (dom === 23 || dom === 3) return dom + 'rd';
        else return dom + 'th';
      }
});
