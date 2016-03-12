
function recognizePage(strona) {
	return 'http://facebook.pl';
}

var commands = {
	'włącz *strona': function (strona) {
		url = recognizePage(strona);
		$('#speechContainer').text('Przejdź do ' + strona);
		setTimeout(function(){
			console.log(url);
			if($('.micwrapper').is(':visible')) {
				$('.micwrapper').hide();
			}
			if($('webview').is(':hidden')) {
				$('webview').fadeIn(1, function(){
        			document.querySelector('webview').src = url;
				});
			}
		}, 1000);
	},
	'*say': function (say) {
		$('#speechContainer').text(say);
	},
};
annyang.setLanguage('pl')
annyang.addCommands(commands);
annyang.debug();
annyang.start();

$(document).on('click', '#actionButton', function(){
	'use strict';
	$(this).addClass('speechDisabled');
	annyang.pause();
});

$(document).on('click', '#actionButton.speechDisabled', function(){
	'use strict';
	$(this).removeClass('speechDisabled');
	annyang.resume();
});