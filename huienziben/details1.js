const phantom = require('phantom');
var currentPage = 1;
var pageSize=0;
var deta_length = 0;

var address='https://www.huienziben.com/loaninfo/openLoan.htm';

initPage();

function initPage() {
    (async function () {
        const instance = await phantom.create();
        const page = await instance.createPage();
        await page.addCookie({
            name: 'JSESSIONID',
            value: '5E2344AD5BD26D328690576171788DDC',
            domain: 'www.huienziben.com',
            path: '/',
            // expires: '2017年11月13日星期一 上午11:30:18',
        });
        const cookies = await page.cookies();
        console.log(cookies)
        // 进行初次页面的加载

        page.open(address).then(function() {
            // 截图操作
            page.render('test.png');

            console.log('%c','success');
            page.evaluate(function () {
                var ul = document.querySelectorAll('.pag_ul');
                var lis = ul[0].children;
                return lis[lis.length - 2].textContent;
            }).then(function (res) {

                pageSize = res;//获取最大页码
                getDetails(page, address, []);
            });
        });
    })();
}


/**
 * 获取详情
 */
function getDetails(page, url, details) {

    page.open(url);

    console.log('');

    console.log('currentPage: ' + currentPage);

    setTimeout(function () {
        page.evaluate(function () {
            var datas = [];
            // 遍历获取数据
            var trs = document.querySelectorAll('.jiekuanTable tbody tr');
            for (var i = 0, l = trs.length; i < l; i++) {
                var href = trs[i].children[0].children[1].href;
                datas.push(href);
            }
            // 返回JSON字符串
            return JSON.stringify(datas);
        }).then(function (res) {
            var hrefs = JSON.parse(res);//当前页所有详情页href
            console.log('详情页href', hrefs);
            deta_length = hrefs.length;

            (async function () {
                const instance = await phantom.create();
                const page2 = await instance.createPage();
                // 进行详情页面的加载
                const status = await page2.open(hrefs[0]);
                console.log('%c',status);
                page2.evaluate().then(function () {

                    entries({
                        page2,
                        origin: page,
                        idx: 0,
                        hrefs,
                        details,
                    });

                });

            })();

        });
    }, 2000)
}

/**
 * 进入详情页
 * @param page
 * @param origin
 * @param hrefs
 * @param idx
 * @param details
 */
function entries({page2, hrefs, idx, details, origin}) {

    console.log('Enter the details page ', currentPage + '-' + idx);
    page2.open(hrefs[idx]);

    setTimeout(function(){

        page2.evaluate(function(){
            var name = document.getElementsByClassName('listInfoTitle')[0].innerText//标的名称
                // amount = document.getElementsByClassName('detail_value')[0].innerText,//金额
                // year_rate = document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                // loan_term = document.getElementsByClassName('detail_value')[1].innerText,//期限
                // ways = document.getElementById('repayType').innerText,//还款方式
                // ensure_ways = document.getElementById('conteeType').children[0].innerText;
            var data = {
                name: name,//标的名称
                // amount: amount,//金额
                // year_rate: year_rate,//年利率
                // loan_term: loan_term,//期限
                // ways: ways,//还款方式
                // ensure_ways: ensure_ways//保障方式
            };
            // 返回JSON字符串
            return JSON.stringify(data);

        }).then(res => {
            let obj = JSON.parse(res);
            details.push(obj);
            if (++idx < deta_length){
                entries({page2, hrefs, idx: idx, details, origin});
            }else {
                // page2.off();
                console.log('end------------' + currentPage);
                // 进行翻页的操作
                origin.evaluate(function(){

                    var ul = document.getElementsByClassName('pag_ul');
                    var lis = ul[0].children,
                        nextBtn = lis[lis.length - 1].children[0];
                    var pageNum = document.getElementsByClassName('pag_s_1');
                    var text = pageNum[0].textContent;

                    nextBtn.click();

                    return text;
                }).then(function(title) {
                    // 判断是否到了最后一页
                    setTimeout(function () {
                        if(currentPage < 1) {
                            console.log(title, "Go to the next page: " + ++currentPage)
                            console.log('获取数据' + details.length + '条');
                            // 如果不是最后一页，递归调用到下一页

                            getDetails(origin, origin.url, details);


                        } else {

                            console.log("----end----");
                            console.log(details);
                            // origin.off();
                            // save(entire);      //保存数据
                        }

                    }, 2000);
                });
            }

        })
    }, 3000)

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
}












