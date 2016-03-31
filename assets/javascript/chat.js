/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function () {
    // Web Speech API 
      var voicelist = responsiveVoice.getVoices();

      var vselect = $("#voiceselection");

      $.each(voicelist, function() {
        vselect.append($("<option />").val(this.name).text(this.name));
      });

      $('#isPlaying').on('click', function() {
        $('#r').text(window.speechSynthesis.speaking)
      });

     // Chat feature
    var myDataRef = new Firebase('https://vivid-torch-7282.firebaseio.com/chat');

    // Chat box add data on keypress
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          myDataRef.push({name: name, text: text});
          $('#messageInput').val('');
        }
      });
      myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
      function displayChatMessage(name, text) {
        $('<div/>').addClass('chatMsg').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      }; 
});