var app_config = {
    "xzt_api" : "https://api.nicoer.com/api/v1/get-profession-rank/LiGongXiaoZhenTan",
    "my_openid" : ""
}

var gradata = [];
var classList = [];
initApp(true);

function initApp(f) {
    $('#rank_table').children().remove();
    $('#rank_table').append(
        "<th>排名</th><th>绩点</th><th>班级</th><th>年级</th><th>操作</th>"
    );
    f?getList():{};
}

function getList() {
    $.ajax({
        type : "POST",
        contentType: "application/json;charset=UTF-8",
        url : app_config.xzt_api,
        data : JSON.stringify({
            openid : app_config.my_openid,
            type : 2
        }),
        success : function(result) {
            if(!!result.code) return alert(result.msg);
            gradata = result.data; 
            rlistHandler(result.data)
        },
        error : function(e){
            alert('加载失败');
        }
    })
}

function rlistHandler(data) {
    // console.log(data);
    classList = [];
    $('#sel_class').children().remove();
    $('#sel_class').append('<option value ="all">全部</option>');
    data.forEach((e, index) => {
        add1Row(e, index)
        if(classList.indexOf(e.class) < 0){
            classList.push(e.class);
            $('#sel_class').append('<option value ="'+e.class+'">'+e.class+'</option>')
        }
    });
    $('.loading').hide()
}

$(document).ready(function(){
    $("#sel_class").change(function(){
        var selected=$(this).children('option:selected').val()
        if (selected=='all') {
            initApp();
            rlistHandler(gradata);
        } else {
            initApp();
            gradata.forEach((e, index)=>{
                if(e.class==selected){
                    add1Row(e, index)
                }
            })
        }
        
    });
});

$('body').on('click', '#reload', ()=>{
    $('.loading').show();
    initApp(true);
})

function add1Row(item, index) {
    $("#rank_table").append(
        '<tr style="'+(item.openid==app_config.my_openid?"color:green;font-weight:bold":"")+'">'
        +'<td>'+(index+1)+'</td>'
        +'<td>'+item.rank+'</td>'
        +'<td>'+item.class+'</td>'
        +'<td>'+item.profession+'</td>'
        +'<td><a id="whoisthis" bid="'+item.openid+'" href="javascript:;">查看</a></td>'
        +'</tr>'
    )
}

$('body').on('click', '#whoisthis', (e)=>{
    $('.loading').show();
    var item = $(e.target);
    console.log(item[0])
    var row = item.parent().parent()
    row.parent().children('#userinfo').remove();
    getUserInfo(item.attr('bid'), (res)=>{
        // console.log(res)
        var data = res.data
        var subjects = ""
        for (var key in data) {
            // console.log(key) 
            // console.log(data.key.score)
            subjects += ('<tr><td>'
            + key
            + '</td>'
            + '<td>'
            + data[key].score
            + '</td>'
            + '<td>'
            + data[key].avg
            + '</td>' 
            + '<td>'
            + data[key].max 
            + '</td>' 
            + '<td>'
            + data[key].min
            + '</td>' 
            + '<td>'
            + data[key].gpa
            + '</td>' 
            + '<td>'
            + data[key].avg_gpa
            + '</td>' 
            + '<td>'
            + data[key].count
            + '</td>' 
            + '<td>'
            + data[key].rank
            + '</td></tr>' )
        }
        $(
            '<div class="info-window">'
            +'<table id="userinfo" border="1" cellspacing="0" cellpadding="5">'
            +'<tr border="0">'
            +'<td colspan="1">姓名：'+res.name+'</td>'
            +'<td colspan="7">年级：'+res.profession+'</td>'
            +'<td><a id="squeezeAll" href="javascript:;">关闭</a></td>'
            +'</tr>'
            +'<th>科目</th>'
            +'<th>成绩</th>'
            +'<th>平均分</th>'
            +'<th>最高分</th>'
            +'<th>最低分</th>'
            +'<th>绩点</th>'
            +'<th>平均绩点</th>'
            +'<th>提交人数</th>'
            +'<th>排名</th>'
            + subjects
            +'</table></div>'
        ).prependTo('body');
        $('.loading').hide();
        $('.l-mask').show();
    })

    $('body').on('click', '#squeezeAll', ()=>{
        $('.info-window').remove();
        $('.l-mask').hide();
    })

})

function getUserInfo(openid, callback) {
    $.ajax({
        type : "POST",
        contentType: "application/json;charset=UTF-8",
        url : app_config.xzt_api,
        data : JSON.stringify({
            openid : openid,
            type : 1
        }),
        success : function(result) {
            callback(result);
        },
        error : function(e){
            alert('加载失败');
        }
    })
}

$(window).error((e)=>{
    console.log(e);
    alert("发生错误:\nmsg: "+e.originalEvent.error.message+"\nstack: "+e.originalEvent.error.stack)
})