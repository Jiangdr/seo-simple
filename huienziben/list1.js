const phantom = require('phantom');

var currentPage = 1;          // 当前页数
var pageSize = null;         // 总的页数

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://supervisory:flzx_3qc@123.206.210.251:27017/supervisory';

//惠恩资本理财网
var address = 'https://www.huienziben.com/loaninfo/openLoan.htm';  // 需要爬取的项目列表页


(async function () {
    const instance = await phantom.create();
    const page = await instance.createPage();
    // 进行初次页面的加载
    const status = await page.open(address);
    console.log('%c',status);
    // 读取总的条数，进而获取到总的页数
    page.evaluate(function () {
        var ul = document.querySelectorAll('.pag_ul');
        var lis = ul[0].children;
        return lis[lis.length - 2].textContent;

    }).then(function (res) {

        pageSize = res;
        loadList(page, address);
    });

})();


var entire = [];

/**
 * 爬取
 * @param {*} page  phantom的page
 * @param {*} url   要爬取的url
 */
function loadList(page, url) {

    page.open(url);

    console.log('');
    console.log('pageSize: ' + pageSize, 'currentPage: ' + currentPage);

    setTimeout(function () {
        page.evaluate(function () {
            var trs = document.querySelectorAll('.jiekuanTable tbody tr');
            var datas = [];
            // 遍历获取数据
            for (var i = 0, l = trs.length; i < l; i++) {
                var tr = trs[i];
                datas.push({
                    name: tr.children[0].innerText,//标的名称
                    amount: tr.children[2].innerText,//金额
                    year_rate: tr.children[3].innerText,//年利率
                    loan_term: tr.children[4].innerText,//期限
                    state: tr.children[6].innerText,//状态
                })
            }
            // 返回JSON字符串
            return JSON.stringify(datas);
        }).then(function (res) {
            var data = JSON.parse(res);
            // console.log(data);
            entire = entire.concat(data);
            // 进行翻页的操作
            page.evaluate(function(){

                var ul = document.getElementsByClassName('pag_ul');
                var lis = ul[0].children,
                    nextBtn = lis[lis.length - 1].children[0];
                var pageNum = document.getElementsByClassName('pag_s_1');
                var text = pageNum[0].textContent;

                nextBtn.click();

                return text;
            }).then(function(title) {
                console.log(title, "next")
                // 判断是否到了最后一页
                setTimeout(function () {
                    if(currentPage < pageSize) {
                        // 如果不是最后一页，递归调用到下一页
                        if (currentPage % 3 === 0) {
                            save(entire);//保存数据
                            entire = [];
                        }
                        currentPage++;
                        loadList(page, page.url);

                    } else {
                        console.log("----end----");
                        console.log(entire);

                        save(entire);//保存数据
                    }

                }, 2000);
            });

        });
    }, 2000)
}




function save(obj) {
    // 数据库进行存储
    console.log(obj);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        console.log("连接数据库成功！");
        var collection = db.collection('mark');
        collection.insert(obj, function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            console.log('插入数据成功:');
            db.close();
        });
    });

}






