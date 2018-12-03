var damlpzb,refreshUrl;  //档案目录配置flag以及拖拽后页面刷新的url   （add by zhb ----5.28.2012）
var isRefleshTree = true;//是否刷新树
var idAndClass = "";
var newIdsArr;//排序后的id数组
var sorturl; //远程调用的url
var sortData;//除了传送ids，sortNum，如果有其他的可以设置
var oldIdsArr;//排序之前的id数组
var wtArr; // 排序值的数组
var wtObjArr; // 排序隐藏域对象数组
var curJqueryObj;//选择排序的对象
var inputIds = "input[name='ids']";
var inputNum = "input[name='sortNum']";
var tableId = "#tablebody";
function ewayDoInitData() {
    newIdsArr = new Array();
    oldIdsArr = new Array();
    wtArr = new Array();
    wtObjArr = new Array();
    curJqueryObj = null;
    jQuery(inputIds).each(function(i) {
        oldIdsArr[i] = this.value;
    });
    jQuery(inputNum).each(function(i) {
        wtObjArr[i] = this;
        wtArr[i] = this.value;
    });
}
jQuery(function() {
    try {
        ewayDoInitData();
        jQuery(tableId).tableDnD({
                    onDragClass: "Tr_Mouse_Pointer_Move",
                    onDrop: function(table, row) {
                        if(curJqueryObj != null && curJqueryObj != "undefined")
                            curJqueryObj.css("cursor", "wait");
                        jQuery(inputIds).each(function(i) {
                            newIdsArr[i] = this.value;
                        });
                        ewayDoSendSortNum();
                        // To add this method for the sort of SJZL by yal
                        var sjzl = jQuery("#sjzlOrder").val();
                        if(sjzl != null){
                            editSjzlSort("drag");
                        }
                    },
                    onDragStart: function(table, row) {
                        curJqueryObj = jQuery(row);
                        curJqueryObj.css("cursor", "move");
//                        var sjzl = jQuery("#sjzlOrder").val();
//                        if(sjzl != null){
//                            autoScrollByMouse(event);
//                            jQuery("#mouseDrag").val("true");
//                        }
                    }
                });
    } catch(e) {
    }
});
function ewayDoSendSortNum() {
    var oldsx;
    var newsx;
    var oldWeigth = curJqueryObj.find("#ids").val();
    if (damlpzb) {      //上一条语句取得拖拽行对应的数据id应该为bug
        oldWeigth = curJqueryObj.find("input[name='ids']").val();
    }
    var idstring = "";
    var wtstring = "";
    //以前的排序位置
    for (var i = 0; i < oldIdsArr.length; i++) {
        if (oldIdsArr[i] == oldWeigth) {
            oldsx = i;
            break;
        }
    }
    //现在的排序位置
    for (var i = 0; i < newIdsArr.length; i++) {
        if (newIdsArr[i] == oldWeigth) {
            newsx = i;
            break;
        }
    }
    if (oldsx == newsx) {
        curJqueryObj.css("cursor", "default");
        return;
    }
    //alert("old="+(oldsx+1)+"new="+(newsx+1));
    //收集数据传到后台,被移动的当前对象
    idstring = oldIdsArr[oldsx] + ";";
    wtstring = wtArr[newsx] + ";";
    //移动对象之间的对象
    if (oldsx > newsx) {
        for (var i = newsx; i < oldsx; i++) {
            idstring = idstring + oldIdsArr[i] + ";";
            wtstring = wtstring + (parseInt(wtArr[i]) + 1) + ";";
        }
    } else {
        for (var i = oldsx + 1; i <= newsx; i++) {
            idstring = idstring + oldIdsArr[i] + ";";
            wtstring = wtstring + (parseInt(wtArr[i]) - 1) + ";";
        }
    }

    // alert( "sorturl="+sorturl);
    // alert( "idsList="+idstring+"&weightList="+wtstring);
    jQuery.ajax({
                type: "GET",
                url: sorturl,
                data: "idsList=" + idstring + "&weightList=" + wtstring + "&" + sortData,
                success: function(msg) {
                    var isSortSuccess = (jQuery(msg).text().indexOf("true") != -1);
                    if (damlpzb) {
                        isSortSuccess = (msg.indexOf("success") != -1);
                    }
                    if (isSortSuccess) {
                        if (damlpzb) {     //直接刷新页面（档案目录配置表）
                            document.location.href = refreshUrl;
//                             jQuery.messager.alert('\u6D88\u606F\u63D0\u793A', '\u6392\u5e8f\u6210\u529f', 'info', function() {
//                                   document.location.href=refreshUrl;
//                               });
                            return;
                        }
                        //改变拖动对象的排序值
                        if(wtObjArr[oldsx] != null && wtObjArr[oldsx] != "undefined")
                            wtObjArr[oldsx].value = wtArr[newsx];
                        //改变相关对象的排序值
                        if (oldsx > newsx) {
                            for (var i = newsx; i < oldsx; i++) {
                                var c_obj = wtObjArr[i];
                                if(c_obj != null && c_obj != "undefined")
                                    c_obj.value = (parseInt(wtArr[i]) + 1);
                            }
                        } else {
                            for (var i = oldsx + 1; i <= newsx; i++) {
                                var c_obj = wtObjArr[i];
                                if(c_obj != null && c_obj != "undefined"){
                                    c_obj.value = (parseInt(wtArr[i]) - 1);
                                }
                            }
                        }
                        if (isRefleshTree) {
                            if (idAndClass != "") {
                                try {
                                    parent.parent.frames[0].focusEditNode(idAndClass);
                                } catch(e) {
                                }
                            }
                            try {
                                parent.parent.frames[0].document.location.reload();
                                parent.parent.frames[0].reloadChildNode();
                            } catch(e) {
                                parent.parent.frames[1].document.location.reload();
                            }
                        }
                        ewayDoChangeSortNum();
                        ewayDoInitData();
                    } else {
                        //排序错误，刷新当前页面
                        sortNumError();
                    }
                }
            });
}
function ewayDoChangeSortNum() {
    jQuery("#tablebody span[name='sortNum']").each(function(i) {
        jQuery(this).text(i + 1);
    });
    curJqueryObj.css("cursor", "default");
}

function sortNumError() {
    jQuery.messager.alert('\u6D88\u606F\u63D0\u793A', '\u6392\u5E8F\u5931\u8D25\uFF01', 'error', function() {
        document.location.reload();
    });
}


//jQuery(function() {
//    jQuery(tableId).tablesorter({
//        debug:false
//    });
//    jQuery(tableId).bind("sortEnd", function() {
//        jQuery(tableId + " span[name='sortNum']").each(function(i) {
//            jQuery(this).text(i + 1);
//        });
//        ewayDoInitData();
//    });
//});

