window.onresize = doLayout;

var isLoading = false;

onload = function () {
    var webview = document.querySelector('webview');
    doLayout();

    document.querySelector('#back').onclick = function () {
        webview.goBack();
    };

    document.querySelector('#forward').onclick = function () {
        webview.goForward();
    };

    document.querySelector('#home').onclick = function () {
        navigateTo('http://www.github.com/');
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
        navigateTo(document.querySelector('#location').value);
    };

    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
    webview.addEventListener('did-finish-load', handleLoadCommit);
};

function navigateTo(url) {
    document.querySelector('webview').src = url;
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
}

function handleLoadCommit() {
    var webview = document.querySelector('webview');
    document.querySelector('#location').value = webview.getUrl();
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
    document.querySelector('#location').value = event.newUrl;
}