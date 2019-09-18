import _ from 'lodash';
//import SectionActions from '../actions/SectionActions';
export const modalStyle = {
    width: '80%',
    maxWidth: '1200px',
    scrollX: 'auto',
    overflow: 'scroll',
    maxHeight: '100%'
};
const libs = {
    display_message: function(messages) {
        _.each(messages, function(m) {
            var msg = $('<div class="success">' + m + '</div>');
            $(msg).one('click', function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            });
            window.setTimeout(function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            }, 10000);
            $('#messages').append(msg);
        });
    },

    display_error: function(messages) {
        _.each(messages, function(m) {
            var msg = $('<div class="error">' + m + '</div>');
            $(msg).one('click', function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            });
            window.setTimeout(function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            }, 5000);
            $('#messages').append(msg);
        });
    }
};

_.assign(window['app'], libs);

export default libs;
