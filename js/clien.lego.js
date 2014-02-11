// Get selected text from browser
function getSelected() {
    if(window.getSelection) { return window.getSelection(); }

    else if(document.getSelection) { return document.getSelection(); }

    else {
		var selection = document.selection && document.selection.createRange();
		if(selection.text) { return selection.text; }
		return false;
    }

    return false;
}

// Extract number from selected string
function extractOnlyNumber(selectedString){
    return selectedString.replace(/[^\d.]/g, "");
}

// Add comma to number
function commify(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;   
  n += '';                          

  while (reg.test(n))
    n = n.replace(reg, '$1' + ',' + '$2');

  return n;
}

jQuery.fn.searchBoxV = function(txtLegend){
    //Default values
    if(txtLegend == undefined){
        txtLegend = "Set number (e.g. : 10211)";
    }
    
    //The form tag
    var form = $(this);
    
    txtInput = form.find("input[type=text]");
    submitButton = form.find("input[type=submit]");
    
    txtInput
    .attr("value",txtLegend);
    
    //Events
    txtInput
    .bind("focus",function(){
        if($(this).attr("value") == txtLegend){
            $(this).attr("value","");    
        }
    });
    
    txtInput
    .bind("blur",function(){
        if($(this).attr("value") == ''){
            $(this).attr("value",txtLegend);
        }
    });

    /*
    
    submitButton
    .bind("click",function(){
        q = txtInput.val();
        getClienLegoDB(q);

        return false;
    })

    form
    .submit(function() {
        q = txtInput.val();
        getClienLegoDB(q);

        return false;
    })

    */
};

// Get information from Fusion table
function getClienLegoDB(number, mode){
	var query = "SELECT model_number, name_US, name_KR, pieces, year_US, RRP_US, year_KR, RRP_KR, RRP_KR_change, sub_index FROM "; 
	//query += '12430vQv6KXdKK7ZJLszGHgwZecIA4FlAC2oDJQs '; 
	query += '17OcX-wZCCf9x3nyGgIorgRxw2_GrABBdOoVcRyA '; 
	query += "WHERE model_number=" + number;

        var encodedQuery = encodeURIComponent(query);

        // Construct the URL
        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=AIzaSyASH3KXEb3ByYcyTAJMTK7agGErXKi9hhs');

	// Define Table Placeholder
        var dataElement = document.createElement('div');

        // Send the JSONP request using jQuery
        $.ajax({
          url: url.join(''),
          dataType: 'jsonp',
          success: function (data) {
            var rows = data['rows'];

	    if(rows == undefined) {
        /*
		if(mode == 'dbclick'){
		    showBrickSetInfo(number);
		    return false;
		} else { */
		    $('<p>No Informaion @ Clien :: Lego :: Fusion Tables</p>').appendTo(dataElement);
		    $('<p>&nbsp;</p>').appendTo(dataElement);
		    $('<p>Your cooperation would be greatly appreciated.</p>').appendTo(dataElement);
		    $('<p>Do you want to be an editor? Please contact with Minuki</p>').appendTo(dataElement);
		    $('<p>&nbsp;</p>').appendTo(dataElement);
		    $('<p><a href="https://www.google.com/fusiontables/DataSource?docid=12430vQv6KXdKK7ZJLszGHgwZecIA4FlAC2oDJQs" target=_blank> -> Go to Fusion Tables</a></p>').appendTo(dataElement);
		//}
	    }


            for (var i in rows) {
	      var modelNumber = rows[i][0];
	      var subIndex = rows[i][9];

              var fullModelNumber = modelNumber + "-" + subIndex;

	      var nameUS = rows[i][1];
	      var nameKR = rows[i][2];
	      var pieces = rows[i][3];
	      var yearUS = rows[i][4];
	      var rrpUS = rows[i][5];       // RRP (Recomended Retail Price)
	      var yearKR = rows[i][6];
	      var rrpKR = rows[i][7];
              var rrpKRChange = rows[i][8];

	      var pppUS = (rrpUS / pieces).toFixed(2);  // PPP (Price Per Piece)
	      var pppKR = (rrpKR / pieces).toFixed(2);;

	

		// Set information table
		tableElement = document.createElement('table');
		tableElement.className = 'basic';

		var html = '<caption> Set information</caption>'
		html += '<thead>';
		html += '<tr><th>Image</th><th>Number</th><th>Name</th><th>Pieces</th>';
		html += '</thead>';

		html += '<tbody>';
		html += '<tr>';
	        html += '<td><img alt="' + nameUS + '" src="http://www.1000steine.com/brickset/thumbs/tn_' + fullModelNumber + '_jpg.jpg"></td>';
	        html += '<td>' + fullModelNumber + '</td>';
	        html += '<td>' + nameUS + "<br />" + nameKR + '</td>';
	        html += '<td>' + pieces + '</td>';
		html += '</tr>';
		html += '</tbody>';

		$(html).appendTo(tableElement);
		dataElement.appendChild(tableElement);

		// Price information table
		var tableElement = document.createElement('table');
	     	tableElement.className = 'basic';

		var html = '<caption> Price information</caption>'
		html += '<thead>';
		html += '<tr><th>Country</th><th>Year released</th><th>Retail price</th><th>Price per Piece</th>';
		html += '</thead>';

		html += '<tbody>';
		html += '<tr>';
	        html += '<td>US</td>';
	        html += '<td>' + yearUS + '</td>';
	        html += '<td class="price_emphasis">' +'$' + commify(rrpUS) + '</td>';
	        html += '<td>' +'$' + commify(pppUS) + '</td>';
		html += '</tr>';

		html += '<tr>';
	        html += '<td>KR</td>';
	        html += '<td>' + yearKR + '</td>';
	        html += '<td class="price_emphasis">' + commify(rrpKR) + ' Won</td>';
	        html += '<td>' + commify(pppKR) + ' won</td>';
		html += '</tr>';

                if (rrpKRChange != ""){
                html += '<tr>';
	        html += '<td></td>';
	        html += '<td></td>';
                html += '<td class="price_change">' + rrpKRChange.replace(/\|/gi, '<BR />') + '</td>';
	        html += '<td></td>';
                html += '</tr>';
                }
		 
		html += '</tbody>';

		$(html).appendTo(tableElement);
		dataElement.appendChild(tableElement);

		// Discount Calculator Table
                tableElement = document.createElement('table');
		tableElement.className = 'basic';

		var html = '<caption> Discount calculator</caption>'
		html += '<thead>';
		html += '<tr><th>Retail price - KR</th><th>20% Discount</th><th>25% Discount</th><th>30% Discount</th>';
		html += '</thead>';

		html += '<tbody>';
		html += '<tr>';
	        html += '<td>' + commify(rrpKR) + ' Won</td>';
	        html += '<td>' + commify(Math.round(rrpKR * 0.8)) + ' Won</td>';
	        html += '<td>' + commify(Math.round(rrpKR * 0.75)) + ' Won</td>';
	        html += '<td>' + commify(Math.round(rrpKR * 0.7)) + ' Won</td>';
		html += '</tr>';
		html += '</tbody>';

		$(html).appendTo(tableElement);

		linkHtml = "<a href='http://shop.lego.com/ko-KR/product/?p=" + modelNumber + "' target='_blank'>Shop@Home Korea</a>";
		linkHtml += "<a href='http://brickset.com/detail/?set=" + fullModelNumber + "' target='_blank'> |  Brickset.com</a>";
		linkHtml += "<a href='http://www.brickpicker.com/bpms/set.cfm?set=" + fullModelNumber + "' target='_blank'> |  Brickpicker.com</a>";
		linkHtml += "<a href='http://set.brickinside.com/search.php?query=" + modelNumber + "' target='_blank'> |  Brickinside.com</a>";
		linkHtml += "<a href='http://www.bricklink.com/catalogPG.asp?S=" + fullModelNumber + "-&colorID=0&v=D&viewExclude=Y&cID=Y=' target='_blank'> |  BrickLink Price Guide</a>";

		dataElement.appendChild(tableElement);
		$(linkHtml).appendTo(dataElement);
            }

	    var $dialog = $('<div></div>')
	    .html(dataElement)
	    .dialog({
		autoOpen: false,
		modal: true,
		height: 470,
		width: 600,
		title: "Clien :: Lego :: PriceChecker (Beta version)" 
	    });
	    $dialog.dialog('open');

          },
	 error:function(request,status,error){ 
		alert(!"code:"+request.status+"\n"+ "message:"+request.responseText); 
	}
        });

}


// Get information from Fusion table
function getMembershipInfo(q){

	// Search by nickname 
	var query = "SELECT no, nickname, clien_id, interest, location, last_activity, status FROM "; 
	query += '1kVu25AxZJmYPMBKytQjimuZ0EpaxNzPzKUmrwJI '; 
	query += "WHERE nickname CONTAINS IGNORING CASE '" + q + "'";

        var encodedQuery = encodeURIComponent(query);

        // Construct the URL
        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=AIzaSyASH3KXEb3ByYcyTAJMTK7agGErXKi9hhs');

	//alert(url.join(''));

	// Define Table Placeholder
        var dataElement = document.createElement('div');

        // Send the JSONP request using jQuery
        $.ajax({
          url: url.join(''),
          dataType: 'jsonp',
          success: function (data) {
            var rows = data['rows'];


		// Member Table
                tableElement = document.createElement('table');
		tableElement.className = 'basic2';

	    if(rows == undefined) {
		html = '<tr><td colspan=7>No results</td></tr>'
		total_count = 0
	    }
	    else {
		total_count = rows.length

		var html = '<thead>';
		html += '<tr>';
		html += '<th>NO</th>';
		html += '<th>Image</th>';
		html += '<th>Nickname</th>';
		html += '<th>ID</th>';
		html += '<th>Interest</th>';
		html += '<th>Location</th>';
		html += '<th>Last activity</th>';
		html += '<th>Status</th>';


		html += '</thead>';

		html += '<tbody>';

		    for (var i in rows) {
		      var number = rows[i][0];
		      var nickname = rows[i][1];
		      var clien_id = rows[i][2];
		      var interest = rows[i][3];
		      var location = rows[i][4];
		      var last_activity = rows[i][5];  
		      var status = rows[i][6];


			html += '<tr>';
			html += '<td>' + number + '</td>' 
			html += '<td>' 
			        + '<img src="/cs2/data/member/'  
				+ clien_id.substr(0,2) + '/' + clien_id + '.gif"'
				+' onerror="this.style.visibility = \'hidden\'"/> </td>';
			html += '<td>' + nickname + '</td>' 
			html += '<td>' + clien_id + '</td>';
			html += '<td>' + interest + '</td>';
			html += '<td>' + location + '</td>';
			html += '<td>' + last_activity + '</td>';
			if(status == "normal") {
				html += '<td class="normal">' + 'normal' + '</td>';
			} else {
				html += '<td class="warning">' + status + '</td>';
			}
			html += '</tr>';

		    }
			html += '</tbody>';
            }

		$(html).appendTo(tableElement);
		
		//result_html = "<span> Query : " + q + ", # of results : " + total_count + "</span>";
		//$(result_html).appendTo(dataElement);

		dataElement.appendChild(tableElement);
	    var $dialog = $('<div></div>')
	    .html(dataElement)
	    .dialog({
		autoOpen: false,
		modal: true,
		height: 400,
		width: 800,
		title: "Clien :: Lego :: Member" 
	    });
	    $dialog.dialog('open');



          },
	 error:function(request,status,error){ 
		alert(!"code:"+request.status+"\n"+ "message:"+request.responseText); 
	}
        });

}

function showBrickSetInfo(numbers){

            var page = "http://www.brickset.com/embed/set/?set=" + numbers + "-1";
	    var $dialog = $('<div></div>')
	    .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
	    .dialog({
		autoOpen: false,
		modal: true,
		height: 120,
		width: 450,
		title: "BrickSet" 
	    });
	    $dialog.dialog('open');
}




$(document).ready(function(){

    $(".board_main").dblclick(function () {
        // Extract Selected string
        selectedString = getSelected();
	selectedString += "";

        // Extract only numbers
        numbers = extractOnlyNumber(selectedString);

        if(numbers != ""){
            //showBrickSetInfo(numbers);
            getClienLegoDB(numbers, 'dbclick');
        }
    });

    $('.ui-widget-overlay').live('click', function() {
        $(".ui-dialog-content").dialog("close");
    });

    $("form#price_checker").searchBoxV();
    $("form#member_search").searchBoxV('Nickname');

    $('#price_checker').submit(function() {
         q = $('#input_q').val();
         getClienLegoDB(q);

         return false;
    });

    $('#member_search').submit(function() {
	
         q = $('#input_m').val();
         getMembershipInfo(q);
	
         return false;
    });

});
