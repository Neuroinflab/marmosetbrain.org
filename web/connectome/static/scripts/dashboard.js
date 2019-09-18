_.assign(app, {
    display_message: function(messages) {
        _.each(messages, function(m) {
            var msg = $('<div class="success">' + m + '</div>');
            $(msg).one('click', function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            });
            /*
            window.setTimeout(function() {
                msg.slideUp(function() {
                    $(this).remove();
                });
            }, 10000);
            */
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
});

$(function() {
    //$.fn.editable.defaults.url = '/api/marmoset/edit'; 
    if (app.allow_admin) {
        $('#section-marmoset .editable').editable({
            combodate: {
                minYear: 1990,
                maxYear: 2017
            },
            className: 'tip-yellow',
            emptytext: '&lt;empty&gt;',
            url: '/api/marmoset/edit'
        });
        $('#section-injection .editable').editable({
            className: 'tip-yellow',
            emptytext: '&lt;empty&gt;',
            source: source_tracer_list,
            url: '/api/injection/edit'
        });
        $('#section-injection .section').editable({
            className: 'tip-yellow',
            emptytext: '&lt;empty&gt;',
            source: source_section_list,
            url: '/api/injection/edit'
        });
        $('#section-injection .region').editable({
            className: 'tip-yellow',
            emptytext: '&lt;empty&gt;',
            source: source_region_list,
            url: '/api/injection/edit'
        });
        $('#section-injection').on('click', '.onoffswitch-label', function(e) {
            var $label = $(this);
            var value;
            if ($label.hasClass('disabled')) {
                e.preventDefault();
                return;
            }
            var id = $label.attr('for');
            var $checkbox = $('#' + id);
            if ($checkbox.is(':checked')) {
                value = 'Hidden';
            } else {
                value = 'Active';
            }
            var pk = $checkbox.data('pk');
            //$checkbox.prop('disabled', true);
            $label.addClass('disabled');
            $.ajax('/api/injection/edit', {
                method: 'POST',
                data: {
                    pk: pk,
                    name: 'status',
                    value: value
                },
                success: function(data) {
                    $label.removeClass('disabled');
                }
            });
        });
    } else {
        $('#section-injection .onoffswitch-checkbox').prop('disabled', true);
        var css = 'a:hover,a:focus { text-decoration: none }';
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);        
        app.display_message(['Admin feature disabled. Content is read only. Click here to access <a href="http://marmoset.mrosa.org/dashboard">http://marmoset.mrosa.org</a> for admin features.']);
    }
});
