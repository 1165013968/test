var damlpzb,refreshUrl;  //����Ŀ¼����flag�Լ���ק��ҳ��ˢ�µ�url   ��add by zhb ----5.28.2012��
var isRefleshTree = true;//�Ƿ�ˢ����
var idAndClass = "";
var newIdsArr;//������id����
var sorturl; //Զ�̵��õ�url
var sortData;//���˴���ids��sortNum������������Ŀ�������
var oldIdsArr;//����֮ǰ��id����
var wtArr; // ����ֵ������
var wtObjArr; // �����������������
var curJqueryObj;//ѡ������Ķ���
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
    if (damlpzb) {      //��һ�����ȡ����ק�ж�Ӧ������idӦ��Ϊbug
        oldWeigth = curJqueryObj.find("input[name='ids']").val();
    }
    var idstring = "";
    var wtstring = "";
    //��ǰ������λ��
    for (var i = 0; i < oldIdsArr.length; i++) {
        if (oldIdsArr[i] == oldWeigth) {
            oldsx = i;
            break;
        }
    }
    //���ڵ�����λ��
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
    //�ռ����ݴ�����̨,���ƶ��ĵ�ǰ����
    idstring = oldIdsArr[oldsx] + ";";
    wtstring = wtArr[newsx] + ";";
    //�ƶ�����֮��Ķ���
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
                        if (damlpzb) {     //ֱ��ˢ��ҳ�棨����Ŀ¼���ñ�
                            document.location.href = refreshUrl;
//                             jQuery.messager.alert('\u6D88\u606F\u63D0\u793A', '\u6392\u5e8f\u6210\u529f', 'info', function() {
//                                   document.location.href=refreshUrl;
//                               });
                            return;
                        }
                        //�ı��϶����������ֵ
                        if(wtObjArr[oldsx] != null && wtObjArr[oldsx] != "undefined")
                            wtObjArr[oldsx].value = wtArr[newsx];
                        //�ı���ض��������ֵ
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
                        //�������ˢ�µ�ǰҳ��
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

