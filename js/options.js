var settings = getSettings();
$(function(){
	$('input:checkbox').checkbox();
    for (var key in settings) {
        $('#'+key).prop('checked', settings[key]);
        $('#'+key).change(function() {
               var val = $(this).is(':checked');
               settings[$(this).attr("id")] = val;
               localStorage["settings"] = JSON.stringify( settings);
           });
    }
});