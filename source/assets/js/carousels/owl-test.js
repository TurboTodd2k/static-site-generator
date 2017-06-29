$(document).ready(function() {
    $("#client-slider").owlCarousel({
        navigation: true, // Show next and prev buttons
        navigationText: [
            "<i class='icon-chevron-left icon-white'><</i>",
            "<i class='icon-chevron-right icon-white'>></i>"
        ],
        slideSpeed: 300,
        paginationSpeed: 400,
        items: 3,
        itemsDesktop: false,
        itemsDesktopSmall: false,
        itemsTablet: false,
        itemsMobile: false,
        //owl v2 options
        margin: 15,
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            991: {
                items: 3
            }
        },
        pagination: false
    });
});
