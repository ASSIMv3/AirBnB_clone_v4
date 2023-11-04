$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityID] = amenityName;
    } else {
      delete selectedAmenities[amenityID];
    }

    const amenitiesList = Object.values(selectedAmenities).join(', ');
    ('.filters .amenities h4').text(amenitiesList);
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function searchPlaces (searchData) {
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(searchData),
      success: function (data) {
        $('.places').empty();

        data.forEach(function (place) {
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
          `;
          $('.places').append(article);
        });
      },
      error: function (error) {
        console.log('Error:', error);
      }
    });
  }

  searchPlaces({});

  $('button[type="button"]').click(function () {
    const selectedAmenities = [];
    $('input[type="checkbox"]:checked').each(function () {
      selectedAmenities.push($(this).data('id'));
    });

    const searchData = {
      amenities: selectedAmenities
    };

    searchPlaces(searchData);
  });
});
