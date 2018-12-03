/**
 * Created by IntelliJ IDEA.
 * User: zw
 * Date: 2010-11-25
 * Time: 11:18:44
 * 验证框架扩展
 */
var validate_subNum = "";//模块标识：总保存按钮的方法中，需要把此属性设置为"",其它单个模块校验，需要把此变量设置为任意数字，要和validType的末尾数字对应起来。
/*
**只验证自己模块的文本,假如不是本模块的，直接返回true
**扩展功能-高峰
*/
function hasCheck(param){	
	alert(param+";");
	if(typeof(param)=="undefined") param = ""; 
	if(validate_subNum != param)return true;
	return false;
}
/*
**从validType中获取模块编号
**例如：validType="IP6",那返回的值为6
**-扩展功能-高峰
*/
function getValidTypeFlag(validType){
	var sub_flag = "";
	for(var i=0;i<validType.length;i++){
		if(parseInt(validType.substring(validType.length-i-1,validType.length)).toString()=="NaN"){
			sub_flag = validType.substring(validType.length-i,validType.length);
			break;
		}		
	}
	return sub_flag;
}

$.extend($.fn.validatebox.defaults.rules, {
    CHS: {
        validator: function (value, param) {
			
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入汉字'
    },
    ZIP: {
        validator: function (value, param) {
        	
            return /^[1-9]\d{5}$/.test(value);
        },
        message: '邮政编码不存在'
    },
    QQ: {
        validator: function (value, param) {
        	
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    email: {
        validator: function (value, param) {
        	
            return /^[\w-\.]+@[\w-]+(\.[\w-]+)+$/.test(value);
        },
        message: '邮箱地址不正确'
    },
    mobile: {
        validator: function (value, param) {
        	
            return (/^((\(\d{2,5}\))|(\d{2,5}\-))?\d{11}$/.test(value) || /^((0\d{2,3})|-){0,1}(\d{7,8})(-(\d{3,}))?$/.test(value));
        },
        message: '手机/电话/传真格式不正确'
    },
    phone: {
        validator: function (value, param) {
        	
            return (/^((0\d{2,3})-{0,1}){0,1}(\d{7,8})(-(\d{3,}))?$/.test(value) || /^((\(\d{2,5}\))|(\d{2,5}\-))?\d{11}$/.test(value)) ;
        },
        message: '电话/传真格式不正确'
    },
    certificate: {
        validator: function (value, param) {
        	
            //return /^[A-Za-z0-9_-]+$/.test(value);
            return true;
        },
        message: '证件号码不能含有特殊字符'
    },
    IP: {
        validator: function (value, param) {
			
            return /^((1?\d?\d|(2([0-4]\d|5[0-5])))\.){3}(1?\d?\d|(2([0-4]\d|5[0-5])))$/.test(value);
        },
        message: 'IP地址不正确'
    },
    loginName: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    safepass: {
        validator: function (value, param) {
            return safePassword(value);
        },
        message: '密码由字母和数字组成，至少6位'
    },
    equalTo: {
        validator: function (value, param) {
            //param[0]：#password 密码输入域的id
            return value == $(param[0]).val();
        },
        message: '两次输入的字符不一至'
    },
    number: {
        validator: function (value, param) {
        	
            return /^\d+$/.test(value);
        },
        message: '请输入数字'
    },
    numberLength: {
        validator: function (value, param) {
           if(param!="undefined"&&param!=""){
               var params = param.split(",");
               param1 = params[0];
               param2 = params[1];
               var  pattern  = eval("/^\\d{1,"+param1+"}(?=(\\.\\d{1,"+param2+"})?$)/");
               return pattern.test(value);
           }
        },
        message: '请输入数字，并且不能超出长度限制'
    },
    float: {
        validator: function (value, param) {
        	if(value.length==1 && value.substring(0,1)=="-")return true;
 			if(value.length>1 && value.substring(0,1)=="-")
        		value = value.substring(1,value.length);
            return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
        },
        message: '只能允许最多两位小数的数字'
    },
    floatNotZero: {
        validator: function (value, param) {

            return /^[0-9]+(\.[0-9]{1,2})?$/.test(value) && value>0;
        },
        message: '只能允许大于0的两位小数的数字'
    },
    floatAndZero:{
    	validator: function (value, param) {
            return /^[0-9]+(\.[0-9]{1,2})?$/.test(value) && value>=0;
        },
        message: '只能允许大于等于0的两位小数的数字'
    },
    percent: {
        validator: function (value, param) {
            return (/^[0-9]{1,2}(\.[0-9]{1,2})?$/.test(value)||value==100);
        },
        message: '请输入正确的百分数'
    },
    blank: {
        validator: function (value, param) {
        	return true;
        },
        message: '不能含有非法字符'
    },
    idcard: {
        validator: function (value, param) {
        	
            return idCard(value);
        },
        message:'请输入正确的身份证号码'
    },
    date:{
        validator: function(value,param){
            //日期验证表达式（yyyy-MM-dd）
            //对日期格式进行验证 要求为2000-2099年  格式为 yyyy-mm-dd[ hh:mi:ss]  并且可以正常转换成正确的日期
            oDateTime = value;
            var pat_hd=/^((20|19)\d{2}-((0[1-9]{1})|(1[0-2]{1}))-((0[1-9]{1})|([1-2]{1}[0-9]{1})|(3[0-1]{1}))){1}(\s\d{2}:\d{2}:\d{2})?$/;
            try{
                if(!pat_hd.test(oDateTime)) throw "日期非法！";
                var arr_dt=oDateTime.split(" ");
                if(arr_dt[0]=='') throw "日期非法！";
                var oDate=arr_dt[0];
                var arr_hd=oDate.split("-");
                var dateTmp;
                dateTmp= new Date(arr_hd[0],parseFloat(arr_hd[1])-1,parseFloat(arr_hd[2]));
                if(dateTmp.getFullYear()!=parseFloat(arr_hd[0]) || dateTmp.getMonth()!=parseFloat(arr_hd[1]) -1 || dateTmp.getDate()!=parseFloat(arr_hd[2])) throw "日期非法！";
                if(arr_dt[1] && arr_dt[1]!='')
                {
                    var oTime=arr_dt[1];
                    var arr_ht=oTime.split(":");
                    dateTmp.setHours(arr_ht[0],arr_ht[1],arr_ht[2]);
                    if(dateTmp.getHours()!=parseFloat(arr_ht[0]) || dateTmp.getMinutes()!=parseFloat(arr_ht[1]) || dateTmp.getSeconds()!=parseFloat(arr_ht[2])) throw "日期非法！";
                }
            }
            catch(ex)
            {
                if(ex.description)
                {return false;}
                else
                {return false;}
            }
            return true;
        },
        message:"请输入正确日期'yyyy-MM-dd'"
    }
});

/* 密码由字母和数字组成，至少6位 */
var safePassword = function (value) {
    return !(/^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/.test(value));
}

//校验分数
var validateMark = function (value) {
	var temp1 = value.split('/');
	if(temp1.length==2 ) {
		if( temp1[0]!=''&& temp1[1]!='' ) {
			if(/^[1-9]{1,2}[0]?$/.test(temp1[0]) && temp1[0] >0 &&( /^[1-9]{1,2}[0]?$/.test(temp1[1])||temp1[1]==100) ){
				var f1 = parseFloat(temp1[0]);
				var f2 = parseFloat(temp1[1]);
				if(f1<=f2) {
					return true;
				}
			}
		}
	} 
    return false; 
}

//校验百分数
var  validatePercent= function (value) {
	return (/^[0-9]{1,2}(\.[0-9]{1,2})?$/.test(value)||value==100);
}

//校验浮点数
var validateFloat = function (value) {
	return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
}

var idCard = function (value) {
    if (value.length == 18 && 18 != value.length) return false;
    var number = value.toLowerCase();
    var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
    var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
    if (re == null || a.indexOf(re[1]) < 0) return false;
    if (re[2].length == 9) {
        number = number.substr(0, 6) + '19' + number.substr(6);
        d = ['19' + re[4], re[5], re[6]].join('-');
    } else d = [re[9], re[10], re[11]].join('-');
    if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
    for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
    return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
}

var isDateTime = function (format, reObj) {
    format = format || 'yyyy-MM-dd';

    var input = this, o = {}, d = new Date();
    var f1 = format.split(/[^a-z]+/gi), f2 = input.split(/\D+/g), f3 = format.split(/[a-z]+/gi), f4 = input.split(/\d+/g);
    var len = f1.length, len1 = f3.length;
    if (len != f2.length || len1 != f4.length) return false;
    for (var i = 0; i < len1; i++) if (f3[i] != f4[i]) return false;
    for (var i = 0; i < len; i++) o[f1[i]] = f2[i];
    o.yyyy = s(o.yyyy, o.yy, d.getFullYear(), 9999, 4);
    o.MM = s(o.MM, o.M, d.getMonth() + 1, 12);
    o.dd = s(o.dd, o.d, d.getDate(), 31);
    o.hh = s(o.hh, o.h, d.getHours(), 24);
    o.mm = s(o.mm, o.m, d.getMinutes());
    o.ss = s(o.ss, o.s, d.getSeconds());
    o.ms = s(o.ms, o.ms, d.getMilliseconds(), 999, 3);
    if (o.yyyy + o.MM + o.dd + o.hh + o.mm + o.ss + o.ms < 0) return false;
    if (o.yyyy < 100) o.yyyy += (o.yyyy > 30 ? 1900 : 2000);
    d = new Date(o.yyyy, o.MM - 1, o.dd, o.hh, o.mm, o.ss, o.ms);
    var reVal = d.getFullYear() == o.yyyy && d.getMonth() + 1 == o.MM && d.getDate() == o.dd && d.getHours() == o.hh && d.getMinutes() == o.mm && d.getSeconds() == o.ss && d.getMilliseconds() == o.ms;
    return reVal && reObj ? d : reVal;
    function s(s1, s2, s3, s4, s5) {
        s4 = s4 || 60, s5 = s5 || 2;
        var reVal = s3;
        if (s1 != undefined && s1 != '' || !isNaN(s1)) reVal = s1 * 1;
        if (s2 != undefined && s2 != '' && !isNaN(s2)) reVal = s2 * 1;
        return (reVal == s1 && s1.length != s5 || reVal > s4) ? -10000 : reVal;
    }
};