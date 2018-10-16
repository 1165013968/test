function downloadCSV(csv) {
    // var csv = '姓名,期中成绩,期末成绩\n张三,60,99\n李四,99,88';
    
    // var a = document.createElement('a');
    // a.href = 'data:text/txt;charset:UTF-8,\ufeff'+encodeURIComponent(csv);
    // a.download = '测试成绩.csv';
    // a.click();

    var blob = new Blob(['\ufeff' + csv],{type:'application/pdf,charset=UTF-8'});
    openDownloadDialog(blob,'测试.csv')

}

function openDownloadDialog(url,saveName) {
    if(window.navigator && window.navigator.msSaveOrOpenBlob){  /* for IE */
        window.navigator.msSaveOrOpenBlob(url,saveName);
    }else{  /* for not IE*/
        if(typeof url == 'object' && url instanceof Blob){
            url = URL.createObjectURL(url);
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || '';
    
        var event;
        if(window.MouseEvent) {
            event = new MouseEvent('click');   /* for firefox */
        }else{
            event = document.createEvent('MouseEvents');
            event.initEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
        }
        aLink.dispatchEvent(event);
    }
    
}

$(function(){
    $('#downCsv').click(function(){
        $.ajax('exl.json').then(function(res){
            var csv = res.data;
            downloadCSV(csv);
        })
        
    });


})