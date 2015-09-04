ui.radio = {
    toggle: function (target) {
        $(target).find('input:radio').each(function () {
            var name = $(this).attr('name');
            var parent = $(this).closest('.J_radio_toggle_c');
            var checked = parent.find('input:radio[name="' + name + '"]:checked').val();
            parent.data('value', checked);
            $(this).click(function () {
                var val = $(this).val();
                //
                var value = parent.data('value');
                //
                if (val == value) {
                    parent.data('value', '');
                    $(this).prop('checked', false);
                } else {
                    parent.data('value', val);
                }
            })
        });
    }
}