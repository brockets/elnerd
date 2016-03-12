var commands = {
    'otwórz *strona': openSite,
    'włącz *strona': openSite,
    'idź do *strona': openSite,
    'idź na *strona': openSite,
    'przejdź na *strona': openSite,
    'pokaż *usluga': runService,
    'wyświetl *usluga': runService,
    'w telewizji': odpalProgram,
    'program telewizyjny': odpalProgram,
    'telewizja': odpalProgram,
    'plotki': odpalPlotki,
    'wiadomości': odpalNewsy,
    'wydarzenia': odpalNewsy,
    'informacje': odpalNewsy,
    'lista funkcji': getHelp,
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
    'podziękuj': sayThanks,
    '*say': function (say) {
        $('#speechContainer').text(say);
    },
};

$(document).on('click', '.newsList a', function(e){
	e.preventDefault();
	url = $(this).attr('href');

    if ($('.micwrapper').is(':visible')) {
        $('.micwrapper').hide();
    }
    if ($('webview').is(':hidden')) {
        $('webview').show();
    	document.querySelector('webview').src = url;
    }
    if ($('.newsList').is(':visible')) {
        $('.newsList').hide();
    }
});

annyang.setLanguage('pl')
annyang.addCommands(commands);
annyang.debug();

function sayThanks() {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.text = 'Dziękuję za uwagę. Pozdrawiam wszystkich.';
    msg.lang = 'pl';
    msg.pitch = 1;
    msg.voice = voices[3];
    window.speechSynthesis.speak(msg);
}

function getHelp() {

    helpContent = '<div style="text-align: center;">';
    helpContent += '<h2>Lista funkcji</h2>';

    helpContent += '<p><strong>włącz <nazwa strony> np. "włącz facebooka" </strong><br> (onet, wp, pocztę)</p>';
    helpContent += '<p><strong>pokaż wiadomości</strong><br>(pokazuje najważniesze newsy)</p>';
    helpContent += '<p><strong>program telewizyjny</strong><br>(pokazuje program TV)</p>';
    helpContent += '<p><strong>w telewizji</strong><br>(pokazuje program TV)</p>';
    helpContent += '<p><strong>wstecz / do przodu</strong><br>(pokazuje wcześniejszą/następną stronę)</p>';
    helpContent += '<p><strong>przewiń w dół / w górę</strong></p>';
    helpContent += '<p><strong>lista funkcji </strong><br>(pokazuję tę listę)</p>';
    helpContent += '</div>';

    uglipop({
        class: 'smallModal',
        source: 'html',
        content: helpContent
    });
    setTimeout(function () {
        $('#uglipop_overlay_wrapper').click();
    }, 5000);
}


annyang.addCallback('result', function () {
    $('.activateSpeech').addClass('working');
    setTimeout(function () {
        $('.activateSpeech').removeClass('working');
    }, 1000);
    if ($('#uglipop_overlay_wrapper').is(':visible')) {
        $('#uglipop_overlay_wrapper').click();
    }
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

function odpalProgram() {
    runService('program');
}

function odpalPlotki() {
    runService('plotki');
}

function odpalNewsy() {
    runService('wiadomości');
}

function runService(service) {
    var url = "";
    if (service == 'wiadomości' || service == 'wydarzenia' || service == 'informacje') {
        url = 'http://wiadomosci.wp.pl/kat,1329,ver,rss,rss.xml';
    } else if (service == 'program') {
        url = 'http://tv.wp.pl/rss.xml';
    } else if (service == 'pogodę') {
        url = 'http://pogoda.wp.pl/rss.xml';
    } else if (service == 'horoskop') {
        url = 'http://horoskop.wp.pl/cid,1,hid,88,rss.xml';
    } else if (service == 'sport') {
        url = 'http://sport.wp.pl/rss.xml';
    } else if (service == 'niewiarygodne' || service == 'dziwne' || service == 'ciekawostki') {
        url = 'http://niewiarygodne.pl/rss.xml';
    } else if (service == 'prasę' || service == 'gazety') {
        url = 'http://wiadomosci.wp.pl/kat,8131,ver,rss,rss.xml';
    } else if (service == 'naukowe' || service == 'mądre' || service == 'naukę') {
        url = 'http://wiadomosci.wp.pl/kat,18032,ver,rss,rss.xml';
    } else if (service == 'plotki') {
        url = 'http://interia.pl.feedsportal.com/c/34004/f/625122/index.rss';
    } else {
        return false;
    }

    if ($('.micwrapper').is(':visible')) {
        $('.micwrapper').hide();
    }
    if ($('webview').is(':visible')) {
        $('webview').hide();
    }
    if ($('.newsList').is(':hidden')) {
        $('.newsList').show();
    }
    $.ajax({
            url: 'https://ajax.googleapis.com/ajax/services/feed/load?&output=json_xml&v=1.0&num=25&q=' + encodeURIComponent(url),
        })
        .done(function (data) {
            data = JSON.parse(data);
            data = $(data.responseData.feed.entries);
            newsHTML = '<div class="row"><div class="col s12 cards-container light-green darken-4">';
            data.each(function (index, dataSet) {
                newsHTML = newsHTML + '<div class="card light-green lighten-5">\
                                            <div class="card-image">\
                                                <img src="' + ($.parseHTML($(this)[0].content)[0].src || $($.parseHTML($(this)[0].content)[0]).find('img')[0].src || 'http://fakeimg.pl/398x265/558b2f/558b2f') + '">\
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
    pages['pocztę'] = 'https://accounts.google.com/ServiceLogin?service=mail#identifier';
    pages['poczta'] = 'https://accounts.google.com/ServiceLogin?service=mail#identifier';
    pages['wp'] = 'http://wp.pl';
    pages['wykop'] = 'http://wykop.pl';
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