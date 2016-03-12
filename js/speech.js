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

var commands = {
    'włącz *strona': function (strona) {
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
    },
    'pokaż *usluga': function (usluga) {
        runService(usluga);
    },
    'cofnij': function (say) {
        $('#speechContainer').text(say);
        var webview = document.querySelector('webview');
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                webview.goBack();
            });
        } else {
            webview.goBack();
        }
    },
    'do przodu': function (say) {
        $('#speechContainer').text(say);
        var webview = document.querySelector('webview');
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                webview.goForward();
            });
        } else {
            webview.goForward();
        }
    },
    'przewiń w dół': function (say) {
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
    },
    'przewiń w górę': function (say) {
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
    },
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
    if (service == 'wiadomości') {
        if ($('.newsList').is(':hidden')) {
            $('.newsList').show();
        }
        $.ajax({
                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=25&q=' + encodeURIComponent('http://www.tvn24.pl/ciekawostki-michalki,5.xml'),
            })
            .done(function (data) {
                data = JSON.parse(data);
                data = $(data.responseData.feed.entries);
                newsHTML = '<div class="row"><div class="col s12 cards-container">';
                data.each(function (dataSet) {
                    newsHTML = newsHTML + '<div class="card light-green darken-3">\
                                            <div class="card-image">\
                                                <span class="card-title">' + $(this)[0].title + '</span>\
                                            </div>\
											<div class="card-content">\
												<p class="white-text">' + $(this)[0].contentSnippet + '</p>\
											</div>\
											<div class="card-action">\
												<a class = "light-green-text" href="' + $(this)[0].link + '">przeczytaj artykuł <i class="material-icons">open_in_new</i></a>\
											</div>\
										</div>';
                });

                newsHTML = newsHTML + '</div></div>';

                $('.newsList').html(newsHTML);
            });


    }

}