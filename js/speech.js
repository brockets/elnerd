var msg = new SpeechSynthesisUtterance();
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