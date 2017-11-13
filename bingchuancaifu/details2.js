const phantom = require('phantom');
var currentPage = 1;
var pageSize = 0;
var deta_length = 0;

var address = 'http://cg.51bccf.com/finance_user/product_list.html';

initPage();


function initPage() {
    (async function () {
        const instance = await phantom.create();
        const page = await instance.createPage();
        // 进行初次页面的加载
        // await page.addCookie({
        //     name: 'JSESSIONID',
        //     value: '9C137DD40BC18DB6D3C7658682CB9B43',
        //     domain: 'cg.51bccf.com',
        //     path: '/',
        //     expires: '2017年11月13日星期一 下午12:07:20',
        // });
        const status = await page.open(address);
        console.log('%c', status);
        page.evaluate(function () {

            var lastBtn = document.getElementById('last');

            return lastBtn.textContent;

        }).then(function (res) {

            pageSize = res;//获取最大页码
            getDetails(page, address, []);
        });
    })();
}


/**
 * 获取详情
 */
function getDetails(page, url, details) {

    page.open(url).then(function () {
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            var datas = [];
            // 遍历获取数据
            for (var i = 0, l = jumpBtns.length; i < l; i++) {
                var a = jumpBtns[i],
                    href = a.href;
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
                // 进行页面的加载
                const status = await page2.open(hrefs[0]);
                console.log('%c', status);
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
    });

    console.log('');

    console.log('currentPage: ' + currentPage);

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
    page2.open(hrefs[idx]).then(function() {
        // 截图操作
        page2.render('test' + currentPage + '-' + idx + '.png');

        page2.evaluate(function () {
            var name = document.getElementById('title').innerText,//标的名称
                amount = document.getElementsByClassName('detail_value')[0].innerText,//金额
                year_rate = document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                loan_term = document.getElementsByClassName('detail_value')[1].innerText,//期限
                ways = document.getElementById('repayType').innerText,//还款方式
                ensure_ways = document.getElementById('conteeType').children[0].innerText;
            var data = {
                name: name,//标的名称
                amount: amount,//金额
                year_rate: year_rate,//年利率
                loan_term: loan_term,//期限
                ways: ways,//还款方式
                ensure_ways: ensure_ways//保障方式
            };
            // 返回JSON字符串
            return JSON.stringify(data);

        }).then(res => {
            let obj = JSON.parse(res);
            console.log(obj);
            details.push(obj);
            if (++idx < deta_length) {
                entries({page2, hrefs, idx: idx, details, origin});
            } else {
                // page2.off();
                console.log('end------------' + currentPage);
                // 进行翻页的操作
                origin.evaluate(function () {

                    var nextBtn = document.getElementById('next');
                    var text = nextBtn.textContent;

                    nextBtn.click();

                    return text;
                }).then(function (title) {
                    console.log(title);
                    // 判断是否到了最后一页
                    setTimeout(function () {
                        if (currentPage < 2) {
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
    });

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








