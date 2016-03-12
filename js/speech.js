var commands = {
    'otwórz *strona': openSite,
    'włącz *strona': openSite,
    'idź do *strona': openSite,
    'idź na *strona': openSite,
    'przejdź na *strona': openSite,
    'pokaż *usluga': runService,
    'wyświetl *usluga': runService,
    'pokaż *usluga': runService,
    'cofnij': back,
    'wstecz': back,
    'do tyłu': back,
    'do przodu': forward,
    'naprzód': forward,
    'powtórz': forward,
    'przewiń w dół': slideDown,
    'w dół': slideDown,
    'przewiń w górę': slideUp,
    'w górę': slideUp,
    '*say': function (say) {
        $('#speechContainer').text(say);
    },
};
annyang.setLanguage('pl')
annyang.addCommands(commands);
annyang.debug();

annyang.addCallback('result', function () {
    $('.activateSpeech').addClass('working');
    setTimeout(function () {
        $('.activateSpeech').removeClass('working');
    }, 1000);
});

annyang.start();

$(document).on('click', '#actionButton', function () {
    'use strict';
    $(this).addClass('speechDisabled');
    annyang.pause();
});

$(document).on('click', '#actionButton.speechDisabled', function () {
    'use strict';
    $(this).removeClass('speechDisabled');
    annyang.resume();
});

function runService(service) {
    if ($('.micwrapper').is(':visible')) {
        $('.micwrapper').hide();
    }
    if ($('webview').is(':visible')) {
        $('webview').hide();
    }
    var url = "";
    if (service == 'wiadomości' || service == 'wydarzenia' || service == 'informacje') {
        url = 'http://wiadomosci.wp.pl/kat,1329,ver,rss,rss.xml';
    } else if (service == 'program') {
        url = 'http://wiadomosci.wp.pl/kat,1515,ver,rss,rss.xml';

    } else {
        return false;
    }
    if ($('.newsList').is(':hidden')) {
        $('.newsList').show();
    }
    $.ajax({
            url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=25&q=' + encodeURIComponent(url),
        })
        .done(function (data) {
            data = JSON.parse(data);
            data = $(data.responseData.feed.entries);
            newsHTML = '<div class="row"><div class="col s12 cards-container light-green darken-4">';
            data.each(function (dataSet) {
                newsHTML = newsHTML + '<div class="card light-green lighten-5">\
                                            <div class="card-image">\
                                                <img src="' + ($.parseHTML($(this)[0].content)[0].src || 'http://fakeimg.pl/398x265/558b2f/558b2f') + '">\
                                            <span class="card-title">' + $(this)[0].title + '</span>\
                                            </div>\
											<div class="card-content">\
												<p>' + $(this)[0].contentSnippet + '</p>\
											</div>\
											<div class="card-action">\
												<a class="light-green-text text-darken-3" href="' + $(this)[0].link + '">przeczytaj artykuł</a>\
											</div>\
										</div>';
            });

            newsHTML = newsHTML + '</div></div>';

            $('.newsList').html(newsHTML);
        });
}

function recognizePage(strona) {
    var pages = {};

    pages['facebook'] = 'http://facebook.pl';
    pages['facebooka'] = 'http://facebook.pl';
    pages['google'] = 'http://google.pl';
    pages['onet'] = 'http://onet.pl';
    pages['wp'] = 'http://wp.pl';
    strona = strona.toLowerCase();
    return pages[strona];
}

function openSite(strona) {
    url = recognizePage(strona);
    $('#speechContainer').text('Przejdź do ' + strona);
    setTimeout(function () {
        console.log(url);
        if ($('.micwrapper').is(':visible')) {
            $('.micwrapper').hide();
        }
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                document.querySelector('webview').src = url;
            });
        } else {
            document.querySelector('webview').src = url;
        }
    }, 1300);
}

function slideDown(say) {
    $('#speechContainer').text(say);
    var webview = document.querySelector('webview');
    if ($('webview').is(':hidden')) {
        if ($('.scrollable').is(':visible')) {
            $('.scrollable').scrollTop($('.scrollable').scrollTop() + 500);
        } else {
            $('webview').fadeIn(1, function () {
                webview.executeJavaScript("document.querySelector('body').scrollTop=document.querySelector('body').scrollTop + 400");
            });
        }
    } else {
        webview.executeJavaScript("document.querySelector('body').scrollTop=document.querySelector('body').scrollTop + 400");
    }
}

function slideUp(say) {
    $('#speechContainer').text(say);
    var webview = document.querySelector('webview');
    if ($('webview').is(':hidden')) {
        if ($('.scrollable').is(':visible')) {
            $('.scrollable').scrollTop($('.scrollable').scrollTop() - 500);
        } else {
            $('webview').fadeIn(1, function () {
                webview.executeJavaScript("document.querySelector('body').scrollTop=document.querySelector('body').scrollTop - 400");
            });
        }
    } else {
        webview.executeJavaScript("document.querySelector('body').scrollTop=document.querySelector('body').scrollTop - 400");
    }
}

function back(say) {
    $('#speechContainer').text(say);
    var webview = document.querySelector('webview');
    if ($('webview').is(':hidden')) {
        $('webview').fadeIn(1, function () {
            webview.goBack();
        });
    } else {
        webview.goBack();
    }
}

function forward(say) {
    $('#speechContainer').text(say);
    var webview = document.querySelector('webview');
    if ($('webview').is(':hidden')) {
        $('webview').fadeIn(1, function () {
            webview.goForward();
        });
    } else {
        webview.goForward();
    }
}