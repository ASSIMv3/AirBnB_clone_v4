$(document).ready(function () {
  const selectedAmenities = {};

  $('input[type="checkbox"]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checke')) {
      selectedAmenities[amenityID] = amenityName;
    } else {
      delete selectedAmenities[amenityID];
    }

    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.filters .amenities h4').text(amenitiesList);
  });
});
