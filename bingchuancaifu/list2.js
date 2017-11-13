const phantom = require('phantom');

var currentPage = 1;          // 当前页数
var pageSize = null;         // 总的页数

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://supervisory:flzx_3qc@123.206.210.251:27017/supervisory';

//冰川财富
var address = 'http://cg.51bccf.com/finance_user/product_list.html?12';


(async function () {
    const instance = await phantom.create();
    const page = await instance.createPage();
    // 进行初次页面的加载
    const status = await page.open(address);
    console.log('%c',status);
    // 读取总的条数，进而获取到总的页数
    page.evaluate(function () {
        var lastBtn = document.getElementById('last');
        return lastBtn.textContent;

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
            var lis = document.querySelectorAll('#conRptList>li');
            var datas = [];
            // 遍历获取数据
            for (var i = 0, l = lis.length; i < l; i++) {
                var li = lis[i],
                    tr = li.querySelector('tr');
                datas.push({
                    name: li.querySelector('a>span').innerText,//标的名称
                    amount: tr.children[2].querySelector('.f_30').innerText,//金额
                    year_rate: tr.children[0].querySelector('span').innerText,//年利率
                    loan_term: tr.children[1].querySelector('.invest_list_value').innerText,//期限
                    state: tr.children[4].innerText,//状态
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

                var nextBtn = document.getElementById('next');
                var text = nextBtn.textContent;

                nextBtn.click();

                return text;
            }).then(function(title) {
                console.log(title, "next")
                // 判断是否到了最后一页
                setTimeout(function () {
                    if(currentPage < pageSize) {
                        // 如果不是最后一页，递归调用到下一页
                        currentPage++;
                        loadList(page, page.url);

                    } else {
                        console.log("----end----");
                        console.log(entire);

                        save(entire);                                                          //保存数据
                    }

                }, 2000);
            });

        });
    }, 2000)
}






function save(obj) {
    // 数据库进行存储
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
    // phantom.exit();
}






