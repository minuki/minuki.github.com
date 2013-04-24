$(document).ready(function(){

    $("div#content").dblclick(function () {
        // Extract Selected string
        selectedString = getSelected();
	    selectedString += "";

        // Extract only numbers
        numbers = extractOnlyNumber(selectedString);

        if(numbers != ""){
            getClienLegoDB(numbers, 'dbclick');
        }

    });

    $('.ui-widget-overlay').live('click', function() {
        $(".ui-dialog-content").dialog("close");
    });

});



