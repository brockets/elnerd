var commands = {
    'otwórz *strona': openSite,
    'włącz *strona': openSite,
    'idź do *strona': openSite,
    'idź na *strona': openSite,
    'przejdź na *strona': openSite,
    'pokaż *usluga': runService,
    'wyświetl *usluga': runService,
    'w telewizji': odpalProgram,
    'horoskop': odpalHoroskop,
    'pogoda': odpalPogode,
    'ciekawostki': odpalDziwne,
    'program telewizyjny': odpalProgram,
    'telewizja': odpalProgram,
    'plotki': odpalPlotki,
    'wiadomości': odpalNewsy,
    'wydarzenia': odpalNewsy,
    'informacje': odpalNewsy,
    'lista funkcji': getHelp,
    'lista komend': getHelp,
    'pomoc': getHelp,
    'powiększ stronę': enlargePage,
    'powiększyć stronę': enlargePage,
    'zmniejsz stronę': resetPage,
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
    'podziękuj ładnie': sayThanks,
    'szukaj *fraza': google,
    'wyszukaj *fraza': google,
    '*say': function (say) {
        $('#speechContainer').text(say);
    },
};

$(document).on('click', '.newsList a', function (e) {
    e.preventDefault();
    url = $(this).attr('href');

    if ($('.micwrapper').is(':visible')) {
        $('.micwrapper').hide();
    }
    if ($('webview').is(':hidden')) {
        $('webview').show();
        setTimeout(function(){
        	document.querySelector('webview').src = url;
        }, 500);
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

function enlargePage() {
	if($('webview').is(':visible')) {
		document.querySelector('webview').executeJavaScript('document.body.style.zoom = "150%"');
	} else {
		return;
	}
}


function resetPage() {
	if($('webview').is(':visible')) {
		document.querySelector('webview').executeJavaScript('document.body.style.zoom = "100%"');
	} else {
		return;
	}
}

function getHelp() {

    helpContent = '<div style="text-align: center;">';
    helpContent += '<h2>Lista funkcji</h2>';

    helpContent += '<p><strong>otwórz <nazwa strony> np. "facebooka" </strong><br> (onet, wp, pocztę)</p>';
    helpContent += '<p><strong>wiadomości</strong><br>(pokazuje najważniesze newsy)</p>';
    helpContent += '<p><strong>plotki</strong><br>(gwiazdy, celebryci, skandale)</p>';
    helpContent += '<p><strong>szukaj</strong><br>(wyszukuje frazę)</p>';
    helpContent += '<p><strong>w telewizji</strong><br>(pokazuje program TV)</p>';
    helpContent += '<p><strong>horoskop</strong><br>(wyświetla horoskop)</p>';
    helpContent += '<p><strong>ciekawostki</strong><br>(pokazuje ciekawe newsy ze świata)</p>';
    helpContent += '<p><strong>pogoda</strong><br>(pokazuje pogodę)</p>';
    helpContent += '<p><strong>wstecz / do przodu</strong><br>(pokazuje wcześniejszą/następną stronę)</p>';
    helpContent += '<p><strong>przewiń w dół / w górę</strong></p>';
    helpContent += '<p><strong>lista funkcji </strong><br>(pokazuję tę listę)</p>';
    helpContent += '<p><i>i wiele wiele innych...</i></p>';
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
     document.querySelector('#location').value = 'Program TV';
}

function odpalDziwne() {
    runService('dziwne');
}

function odpalPogode() {
    runService('pogoda');
}

function odpalHoroskop() {
    runService('horoskop');
}

function odpalPlotki() {
    runService('plotki');
     document.querySelector('#location').value = 'Plotki ;)';
}

function odpalNewsy() {
    runService('wiadomości');
     document.querySelector('#location').value = 'Wiadomości';
}

function google(fraza) {
    if ($('.micwrapper').is(':visible')) {
        $('.micwrapper').hide();
    }
    if ($('webview').is(':hidden')) {
        $('webview').fadeIn(1, function () {
            document.querySelector('webview').src = "https://google.pl/search?q=" + encodeURIComponent(fraza);
        });
    } else {
        document.querySelector('webview').src = "https://google.pl/search?q=" + encodeURIComponent(fraza);
    }
}

function runService(service) {
    var url = "";
    if (service == 'wiadomości' || service == 'wydarzenia' || service == 'informacje') {
        url = 'http://wiadomosci.wp.pl/kat,1329,ver,rss,rss.xml';
    } else if (service == 'program') {
        url = 'http://tv.wp.pl/rss.xml';
    } else if (service == 'pogodę' || service == 'pogoda') {
        url = 'http://pogoda.wp.pl/rss.xml';
    	 document.querySelector('#location').value = 'Pogoda';
    } else if (service == 'horoskop') {
        url = 'http://horoskop.wp.pl/cid,1,hid,88,rss.xml';
    	 document.querySelector('#location').value = 'Horoskop';
    } else if (service == 'sport') {
        url = 'http://sport.wp.pl/rss.xml';
    	 document.querySelector('#location').value = 'Sport';
    } else if (service == 'niewiarygodne' || service == 'dziwne' || service == 'ciekawostki') {
        url = 'http://niewiarygodne.pl/rss.xml';
    	 document.querySelector('#location').value = 'Ciekawostki';
    } else if (service == 'prasę' || service == 'gazety') {
        url = 'http://wiadomosci.wp.pl/kat,8131,ver,rss,rss.xml';
    	 document.querySelector('#location').value = 'Prasa';
    } else if (service == 'naukowe' || service == 'mądre' || service == 'naukę') {
        url = 'http://wiadomosci.wp.pl/kat,18032,ver,rss,rss.xml';
    	 document.querySelector('#location').value = 'Naukowe';
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
												<a class="light-green-text text-darken-3" href="' + $(this)[0].link + '">przeczytaj więcej</a>\
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
    if($('a#back').hasClass('disabled')) {
    	return;
    }
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
    if($('a#forward').hasClass('disabled')) {
    	return;
    }
    var webview = document.querySelector('webview');
    if ($('webview').is(':hidden')) {
        $('webview').fadeIn(1, function () {
            webview.goForward();
        });
    } else {
        webview.goForward();
    }
}