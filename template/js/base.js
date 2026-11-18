
/* Highlight */
$( document ).ready(function() {
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');
});

// Load Videos in the Docs
$(document).ready(function () {
    $('img[alt="YouTube"]').each(function () {
        var id = $(this).attr('src').split('/')[$(this).attr('src').split('/').length - 1];
        var video = '<iframe style="width: 95%; height: 221px;" src="https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';
        $(this).replaceWith(video);
    });
});

$('body').scrollspy({
    target: '.bs-sidebar',
});

// Keep section positions and the active link in sync after layout changes.
function refreshScrollSpy() {
    $('body').scrollspy('refresh');
    $('body').scrollspy('process');
}

$(window).on('load resize', refreshScrollSpy);
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshScrollSpy);
}


/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});
