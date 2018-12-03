var currObj;
jQuery(function() {
    var h_item = 22 * jQuery("#ewayMenu div[onclick]").size();
    var l_h = 2 * jQuery("#ewayMenu .menu-sep").size();
    var menu = h_item + l_h;
    var h = document.body.clientHeight - 27 - menu;
    jQuery("#tablebody tr").bind('contextmenu', function(e) {
        if (e.pageY > h) {
            jQuery('#ewayMenu').menu('show', {
                        left: e.pageX,
                        top: e.pageY - menu
                    });
        } else {
            jQuery('#ewayMenu').menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
        }
        currObj = this;
        return false;
    });
});
var ewaylistForm;
jQuery(function() {
    try {
        var pageSize = parseInt(jQuery("#pageSize").val());
        var finalPageSize = parseInt(jQuery("#finalPageSize").val());
        var totalSize = parseInt(jQuery("#totalSize").val());
        var currentPageNo = parseInt(jQuery("#currentPageNo").val());
        jQuery('#pagination').pagination({
                    total:totalSize,
                    pageSize:pageSize,
                    pageNumber:currentPageNo,
                    pageList:[finalPageSize,100,200,500],   //
                    onSelectPage:function(pageNumber, pageSize) {
                        jQuery(this).pagination('loading');
                        jQuery("#pageSize").val(pageSize);
                        jQuery("#currentPageNo").val(pageNumber);
                        ewaylistForm.submit();
                        jQuery(this).pagination('loaded');
                    }
                });
    } catch(e) {
    }
});
