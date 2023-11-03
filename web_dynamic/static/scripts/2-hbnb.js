$(document).ready(function () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });

    const selectedAmenities = {};

    $('input[type="checkbox"]').change(function () {
        const amenityID = $(this).data("id");
        const amenityName = $(this).data("name");

        if ($(this).is(":checked")) {
            selectedAmenities[amenityID] = amenityName;
        } else {
            delete selectedAmenities[amenityID];
        }

        const amenitiesList = Object.values(selectedAmenities).join(", ");
        $(".filters .amenities h4").text(amenitiesList);
    });
});
