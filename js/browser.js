window.onresize = doLayout;

var isLoading = false;


onload = function () {
    var webview = document.querySelector('webview');
    doLayout();

    document.querySelector('#back').onclick = function () {
        if($('#back').hasClass('disabled')) {
            return;
        }
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                webview.goBack();
            });
        } else {
            webview.goBack();
        }
    };

    document.querySelector('#forward').onclick = function () {
        if($('#forward').hasClass('disabled')) {
            return;
        }
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                webview.goForward();
            });
        } else {
            webview.goForward();
        }
    };

    document.querySelector('#home').onclick = function () {
        if ($('.micwrapper').is(':hidden')) {
            $('.micwrapper').show();
        }
        if ($('webview').is(':visible')) {
            $('webview').hide();
        }
        if ($('.newsList').is(':visible')) {
            $('.newsList').html('').hide();
        }
        annyang.abort();
        annyang.start();
        document.querySelector('#location').value = 'Strona domowa';
        // navigateTo('file:index.html');
    };

    document.querySelector('#reload').onclick = function () {
        if (isLoading) {
            webview.stop();
        } else {
            webview.reload();
        }
    };
    document.querySelector('#reload').addEventListener(
        'webkitAnimationIteration',
        function () {
            if (!isLoading) {
                document.body.classList.remove('loading');
            }
        });

    document.querySelector('#location-form').onsubmit = function (e) {
        e.preventDefault();

        if ($('.micwrapper').is(':visible')) {
            $('.micwrapper').hide();
        }
        if ($('webview').is(':hidden')) {
            $('webview').fadeIn(1, function () {
                navigateTo(document.querySelector('#location').value);
            });
        } else {
            navigateTo(document.querySelector('#location').value);
        }
    };

    document.querySelector('#location').onfocus = function () {
        this.focus();
        this.select()
    };

    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
    webview.addEventListener('did-finish-load', handleLoadCommit);
};

function navigateTo(url) {
    var r = /^.+?:/;
    if (r.test(url)) {
        document.querySelector('webview').src = url;
    } else {
        if (r.test('http://' + url)) {
            document.querySelector('webview').src = 'http://' + url;
        } else {
            document.querySelector('webview').src = "https://google.pl/search?q=" + encodeURIComponent(url);
        }
    }
    document.querySelector('#location').value = document.querySelector('webview').src;
}

function doLayout() {
    var webview = document.querySelector('webview');
    var controls = document.querySelector('#controls');
    var controlsHeight = controls.offsetHeight;
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var webviewWidth = windowWidth;
    var webviewHeight = windowHeight - controlsHeight;

    webview.style.width = webviewWidth + 'px';
    webview.style.height = webviewHeight + 'px';

    var newsList = document.querySelector('.newsList');
    newsList.style.width = webviewWidth + 'px';
    newsList.style.height = webviewHeight + 'px';

}

function handleLoadCommit() {
    var webview = document.querySelector('webview');
    document.querySelector('#location').value = webview.getURL();
    document.querySelector('#back').disabled = !webview.canGoBack();
    document.querySelector('#forward').disabled = !webview.canGoForward();
}

function handleLoadStart(event) {
    document.body.classList.add('loading');
    isLoading = true;

    if (!event.isTopLevel) {
        return;
    }

    document.querySelector('#location').value = event.url;
}

function handleLoadStop(event) {
    isLoading = false;
}

function handleLoadRedirect(event) {
    if (typeof (event.newUrl) !== 'undefined') {
        // fix dla undefined w pasku adresu
        document.querySelector('#location').value = event.newUrl;
    }
}

(function(f,a){function g(b,a,c){b.addEventListener?b.addEventListener(a,c):b.attachEvent("on"+a,function(){c.call(b)})}function k(b){b&&("string"==typeof b["class"]&&b["class"]&&a.getElementById("uglipop_popbox").setAttribute("class",b["class"]),b.keepLayout&&!b["class"]&&a.getElementById("uglipop_popbox").setAttribute("style","position:relative;height:300px;width:300px;background-color:white;opacity:1;"),"string"==typeof b.content&&b.content&&"html"==b.source&&(a.getElementById("uglipop_popbox").innerHTML=b.content),"string"==typeof b.content&&b.content&&"div"==b.source&&(a.getElementById("uglipop_popbox").innerHTML=a.getElementById(b.content).innerHTML));a.getElementById("uglipop_overlay_wrapper").style.display="";a.getElementById("uglipop_overlay").style.display="";a.getElementById("uglipop_content_fixed").style.display=""}function h(){a.getElementById("uglipop_overlay_wrapper").style.display="none";a.getElementById("uglipop_overlay").style.display="none";a.getElementById("uglipop_content_fixed").style.display="none"}g(a,"DOMContentLoaded",function(){var b=a.createElement("div"),e=a.createElement("div"),c=a.createElement("div"),d=a.createElement("div");e.id="uglipop_content_fixed";e.setAttribute("style","position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);opacity:1;");c.id="uglipop_popbox";d.id="uglipop_overlay_wrapper";d.setAttribute("style","position:absolute;top:0;bottom:0;left:0;right:0;");b.id="uglipop_overlay";b.setAttribute("style","position:fixed;top:0;bottom:0;left:0;right:0;opacity:0.3;width:100%;height:100%;background-color:black;");d.appendChild(b);e.appendChild(c);a.body.appendChild(d);a.body.appendChild(e);a.getElementById("uglipop_overlay_wrapper").style.display="none";a.getElementById("uglipop_overlay").style.display="none";a.getElementById("uglipop_content_fixed").style.display="none";d.addEventListener("click",h);g(f,"keydown",function(a){27==a.keyCode&&h()});f.uglipop=k})})(window,document);