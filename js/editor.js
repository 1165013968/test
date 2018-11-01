var settings = {
    autoHeightEnabled: false,
    initialFrameHeight: 200,
    initialFrameWidth: "100%",
    toolbars: [
        ['fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertcode', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help']
    ]
}

var ue = UE.getEditor("container",settings);
// var ue = UE.getContent();

ue.ready(function(){
    ue.setContent("<p style='color:red;'>this is a test of ueditor</p>");
    ue.setContent("<span id='click' style='font-weight:bold;'>click</span>",true);

})

document.getElementById("select").onclick = function(){
// console.log(ue)
    
    var ht = ue.getPlainTxt();
    // var ht = ue.getContentTxt();
    // var ht = ue.getContent();
    // ht = ue.execCommand('selectall');
    // var selection = ue.selection.getText();  ???空
    console.log(ht);
    document.getElementById("article").innerHTML = ht;

    // ue.setDisabled('source');
    //    disableBtn("enable");
    
    // var ups = uParse('#click',{
    //     rootPath:"./libs/ueditor1_4_3_3/"
    // })
    // console.log(ups)

}