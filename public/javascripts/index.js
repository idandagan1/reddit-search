$body = $("body");

$(document).on({
    ajaxStart: () => { $body.addClass("loading");   },
    ajaxStop: () => { $body.removeClass("loading"); }
});

$('#redditSearchForm').keyup(e => {
    e.keyCode === 13 ? $('#redditSearchBtn').click() : null;
});