
$(document).on('click', '#actionButton', function(){
	$('.overlay').css('display', 'flex');
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    var commands = {
        '*say': function (say) {
            msg.text = 'Powiedziałeś: '+say;
            msg.lang = 'pl';
            window.speechSynthesis.speak(msg);
        }
    };
    annyang.setLanguage('pl')
    annyang.addCommands(commands);
    annyang.debug();
    annyang.start();

    $('webview').css('transform', 'scale(1.2)')
});

$(document).on('click', '.overlay', function(){
	$('.overlay').css('display', 'none');
});