$(function(){
    var searchBox = $('.box-search');

    searchBox.hide();

    $('#opcl-search').on('click', function(){
        var searchIcon = $('.side-menu ul li i.fa-search');
        if(searchBox.is(':visible')) {
            searchIcon.css("color: white");
            searchBox.fadeOut();
        } else {
            searchIcon.css("color: #007BFF");
            searchBox.fadeIn();
        }
    })

    var sourceBox = $('.box-links');

    sourceBox.hide();

    $('#opcl-source').on('click', function(){
        if(sourceBox.is(':visible')) {
            sourceBox.fadeOut();
        } else {
            sourceBox.fadeIn();
        }
    })

    var bookBox = $('.box-book-type');

    //bookBox.hide();

    $('#book-type').on('click', function(){
        if(bookBox.is(':visible')) {
            bookBox.fadeOut();
        } else {
            bookBox.fadeIn();
        }
    })
})