
/*
 * JQuery zTree 2.2
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Date: 2010-12-15
 *
 */
var zTree;
var setting;
var zNodes = [];

setting = {
    async:true,
    checkType:{ "Y":"", "N":"" },
    checkRadioType:"level",
    //asyncUrl:getAsyncUrl, //获取节点数据的URL地址
    expandSpeed:"",
    //简单Array数组转换为JSON嵌套数据参数
    isSimpleData: true,
    treeNodeKey: "",
    treeNodeKey: "id",
    treeNodeParentKey: "pId",
    callback:{
        beforeClick:zTreeBeforeClick,
        beforeRightClick:zTreeBeforeRightClick,
        beforeMouseDown:zTreeBeforeMouseDown,
        beforeMouseUp:zTreeBeforeMouseUp,
        beforeChange:zTreeBeforeChange,
        beforeDrag:zTreeBeforeDrag,
        beforeDrop:zTreeBeforeDrop,
        beforeRename:zTreeBeforeRename,
        beforeRemove:zTreeBeforeRemove,
        beforeExpand:zTreeBeforeExpand,
        beforeCollapse:zTreeBeforeCollapse,

        click:zTreeOnClick,
        //rightClick: zTreeRightClick,
        mouseDown:zTreeMouseDown,
        mouseUp:zTreeMouseUp,
        change:zTreeChange,
        drag:zTreeOnDrag,
        drop:zTreeOnDrop,
        rename:zTreeOnRename,
        remove:zTreeOnRemove,
        expand:zTreeOnExpand,
        collapse:zTreeOnCollapse,
        asyncSuccess:zTreeOnAsyncSuccess,
        asyncError:zTreeOnAsyncError
    }
};

function getAsyncUrl(treeNode) {
}


$(document).ready(function () {
    var rootNodes = setting.root;
    if (rootNodes != null) {
        for (var i = 0; i < rootNodes.length; i++) {
            if (rootNodes[i].icon == null)
                rootNodes[i].icon = webRootPath+"/skin/silver/images/xtree/foldericon.png";
            if (rootNodes[i].openIcon == null)
                rootNodes[i].openIcon = webRootPath+"/skin/silver/images/xtree/openfoldericon.png";
            if (rootNodes[i].isParent == null)
                rootNodes[i].isParent = "true";
            if (rootNodes[i].autoExpand == null)
                rootNodes[i].autoExpand = "true";
        }
    }
    zNodes = rootNodes;
    refreshTree(getAsyncUrl);
    initRootExpand(zNodes);

});

function refreshTree(asyncUrl) {
    try {
        setting.asyncUrl = asyncUrl;
        zTree = $("#treeDemo").zTree(setting, zNodes);
    }
    catch (e) {
    }
}

function refreshZTree() {
//	refreshTree(getAsyncUrl);
    this.location.reload();
}

function expandAll(treeNode, msg) {
    var obj = jQuery.parseJSON(msg);
    if (obj == '') {
        $("#" + treeNode.tId + "_switch").attr("class", "switch_center_docu");
    }
    for (var i = 0; i < obj.length; i++) {
        var znode = zTree.getNodeByParam("id", obj[i].id);
        zTree.expandNode(znode, true, false);
    }
}

function initExpand(msg) {
    var obj = jQuery.parseJSON(msg);
    for (var i = 0; i < obj.length; i++) {
        var znode = zTree.getNodeByParam("id", obj[i].id);
        if (znode.autoExpand) {
            zTree.expandNode(znode, true, false);
        }
    }
}

function initRootExpand(obj) {
    if (obj != null) {
        for (var i = 0; i < obj.length; i++) {
            var znode = zTree.getNodeByParam("id", obj[i].id);
            if (znode.autoExpand) {
                zTree.expandNode(znode, true, false);
            }
        }
    }
}


function expandAllTree(msg) {
    var obj = jQuery.parseJSON(msg);
    for (var i = 0; i < obj.length; i++) {
        var znode = zTree.getNodeByParam("id", obj[i].id);
        zTree.expandNode(znode, true, false);
    }
}

function expandTreeByLevel() {
    var rootNode = zTree.getNodeByTId("treeDemo_1");
    zTree.expandNode(rootNode, true, false);
    var treeNodeButtons = $.merge($(".switch_center_close"), $(".switch_bottom_close"), $(".switch_root_close"));
    for (var i = 0; i < treeNodeButtons.length; i++) {
        var childNode = zTree.getNodeByTId(treeNodeButtons.eq(i).attr("id").replace("_switch", ""));
        zTree.expandNode(childNode, true, false);
    }
}

function closeAll() {
    var rootNode = zTree.getNodeByTId("treeDemo_1");
    zTree.expandNode(rootNode, false, false);
    var childNodes = rootNode.nodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodes != undefined) {
            zTree.expandNode(childNodes[i], false, false);
        }
    }
}

function reloadChildNode() {
    var treeNode = zTree.getSelectedNode();
    if (treeNode != null && !treeNode.isParent) {
        refreshTree(getAsyncUrl);
    }
    if (treeNode) {
        if ($("#" + treeNode.tId + "_ico").attr("class") == "ico_open") {
            zTree.reAsyncChildNodes(treeNode, "refresh", true);
        } else {
            zTree.reAsyncChildNodes(treeNode, "refresh", false);
        }
    }
}
// add by renfei   加载树时，默认选中根节点   解决刚打开的页面 右侧添加或者删除  左侧树不刷新的问题
function loadParentNodeSelected() {
    var rootNode = zTree.getNodeByTId("treeDemo_1");
    zTree.selectNode(rootNode);
}

function updateNodeName(data) {
    var treeNode = zTree.getSelectedNode();
    if (treeNode) {
        treeNode.name = data;
        zTree.updateNode(treeNode, true);
    }
}

function updateNodeNameAndIcon(name, isValid, oldValid) {
    var treeNode = zTree.getSelectedNode();
    if (treeNode) {
        treeNode.name = name;
        if (isValid != oldValid) {
            var icon = treeNode.icon;
            var path = icon.substring(0, icon.lastIndexOf("/") + 1);
            var valid = icon.substring(icon.lastIndexOf("/") + 1, icon.length);
            if (isValid == 0) {
                treeNode.icon = path + 'valid' + valid;
            } else {
                treeNode.icon = path + valid.substring(5, valid.length);
            }
        }
        zTree.updateNode(treeNode, true);
    }
}

function updateNodeNameAndIconByIconPath(name, iconPath) {
    var treeNode = zTree.getSelectedNode();
    if (treeNode) {
        treeNode.name = name;
        if (iconPath != null && iconPath != '') {
            treeNode.icon = iconPath;
        }
        zTree.updateNode(treeNode, true);
    }
}

function focusSelectNode(data) {
    //var selectedNode = zTree.getNodeByTId($("a[name='"+data+"']").attr("id").replace("_a",""));
    var selectedNode = zTree.getNodeByParam("idAndClass", data);
    zTree.selectNode(selectedNode);
}

function focusEditNode(data) {
    //var selectedNode = zTree.getNodeByTId($("a[name='"+data+"']").attr("id").replace("_a",""));
    var selectedNode = zTree.getNodeByParam("idAndClass", data);
    zTree.selectEditNode(selectedNode);
}

function getCheckNodesIds() {
    var checkNodesIds = "";
    var checkNodes = zTree.getCheckedNodes(true);
    for (var i = 0; i < checkNodes.length; i++) {
        checkNodesIds = checkNodesIds + checkNodes[i].id + ";";
    }
    if (checkNodesIds != "") {
        checkNodesIds = checkNodesIds.substring(0, checkNodesIds.length - 1);
    }
    return checkNodesIds;
}

function getCheckNodesIdsAndNames() {
    var checkNodesIdsAndNames = new Array();
    var checkNodes = zTree.getCheckedNodes(true);
    for (var i = 0; i < checkNodes.length; i++) {
        checkNodesIdsAndNames[i] = checkNodes[i].id + ":" + checkNodes[i].name;
    }
    return checkNodesIdsAndNames;
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {

}

function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {

}

function zTreeBeforeClick(treeId, treeNode) {

}

function zTreeBeforeRightClick(treeId, treeNode) {

}

function zTreeBeforeMouseDown(treeId, treeNode) {

}

function zTreeBeforeMouseUp(treeId, treeNode) {
}

function zTreeBeforeChange(treeId, treeNode) {
}

function zTreeBeforeDrag(treeId, treeNode) {
}

function zTreeBeforeDrop(treeId, treeNode, targetNode, moveType) {
}

function zTreeBeforeRename(treeId, treeNode) {
}

function zTreeBeforeRemove(treeId, treeNode) {
}

function zTreeOnClick(event, treeId, treeNode) {
}

function getMouse(event) {
}

function zTreeRightClick(event, treeId, treeNode) {
}

function zTreeMouseDown(event, treeId, treeNode) {
}

function zTreeMouseUp(event, treeId, treeNode) {
}

function zTreeChange(event, treeId, treeNode) {
}

function zTreeOnDrag(event, treeId, treeNode) {
}

function zTreeOnDrop(event, treeId, treeNode, targetNode, moveType) {
}

function zTreeOnRename(event, treeId, treeNode) {
}

function zTreeOnRemove(event, treeId, treeNode) {
}

function zTreeBeforeExpand(treeId, treeNode) {
}

function zTreeOnExpand(event, treeId, treeNode) {
}

function zTreeBeforeCollapse(treeId, treeNode) {
}

function zTreeOnCollapse(event, treeId, treeNode) {
}
function zinit(isWithToolBar) {
    loadParentNodeSelected();
    var rsb_height = document.body.offsetHeight;
    if (typeof(isWithToolBar) == "undefined" || isWithToolBar == "" || isWithToolBar == null) {
        $('#treedemo').css({'height':rsb_height - 28});
        $('#treeDemodiv').css({'height':rsb_height - 28});
        $('#treeDemodiv').css({'width':document.body.offsetWidth});
        $('#treeDemo').css({'width':document.body.offsetWidth - 28});
    }
    else if (isWithToolBar == "ToolsBar") {
        $('#treedemo').css({'height':rsb_height - 25});
        $('#treeDemodiv').css({'height':rsb_height - 25});
    }
    else {
        $('#treedemo').css({'height':rsb_height});
        $('#treeDemodiv').css({'height':rsb_height});
        $('#treeDemo').css({'width':document.body.offsetWidth - 28});
    }
}
