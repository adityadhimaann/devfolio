;(function ($) {

    "use strict";

    $(document).ready(function () {
        $('.your-date').datetimepicker({
            timepicker: false,
            format:'F j, Y',
            scrollInput : false,
        });  
        $('.your-time').datetimepicker({
            datepicker: false,
            format:'H:i',
            scrollInput : false,
        });  
    });

})(jQuery);