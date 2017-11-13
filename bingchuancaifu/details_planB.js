const phantom = require('phantom');
var currentPage = 1;
var pageSize = 0;
var deta_length = 0;
var history = null;

var address = 'http://cg.51bccf.com/finance_user/product_list.html';

initPage();


function initPage() {
    (async function () {
        const instance = await phantom.create();
        const page = await instance.createPage();
        // 进行初次页面的加载
        const status = await page.open(address);
        console.log('%c', status);
        page.evaluate(function () {
            var lastBtn = document.getElementById('last');

            return lastBtn.textContent;

        }).then(function (res) {

            pageSize = res;//获取最大页码
            getDetails({page, url: address});
        });
    })();
}


/**
 * 获取详情
 */
function getDetails({page, url, details}) {
    console.log(url);
    details = [];
    page.open(url).then(function () {
        console.log(' ');

        console.log('currentPage: ' + currentPage);

        page.evaluate(function () {
            var history = location.href;
            var jumpBtns = document.querySelectorAll('.invest_title');
            var _length = jumpBtns.length;
            return JSON.stringify({_history: history, _length: _length});
        }).then(function (res) {
            var {_history, _length} = JSON.parse(res);//当前页所有详情页href
            history = _history;
            deta_length = _length;
            entries_1({
                history: history,
                page: page,
                details: details,
            })
        });

    });


}







function entries_1({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-1');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[0].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    // 返回JSON字符串
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-1' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 1) {

                        entries_2({
                            history: history,
                            page: page,
                            details: details,
                        })

                    } else {
                        stopEnt({page, url: history, details})
                    }

                })
            }, 2000)

        });

    });
    
}

function entries_2({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-2');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[1].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 2) {
                        entries_3({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_3({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-3');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[2].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 3) {
                        entries_4({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_4({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-4');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[3].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 4) {
                        entries_5({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_5({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-5');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[4].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 5) {
                        entries_6({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_6({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-6');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[5].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 6) {
                        entries_7({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_7({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-7');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[6].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))
                    if (deta_length > 7) {
                        entries_8({
                            history: history,
                            page: page,
                            details: details,
                        })
                    } else {
                        stopEnt({page, url: history, details});
                    }
                })
            }, 2000)

        });

    });

}

function entries_8({page, history, details}) {
    page.open(history).then(function () {
        console.log('currentPage: ' + currentPage + '-8');
        page.evaluate(function () {
            var jumpBtns = document.querySelectorAll('.invest_title');
            // 遍历获取数据
            jumpBtns[7].click();
            // 返回JSON字符串
            return '';
        }).then(function (res) {
            setTimeout(function () {
                page.evaluate(function () {
                    var data = {
                        name: document.getElementById('title').innerText,//标的名称
                        amount: document.getElementsByClassName('detail_value')[0].innerText,//金额
                        year_rate: document.getElementsByClassName('detail_rate')[0].innerText,//年利率
                        loan_term: document.getElementsByClassName('detail_value')[1].innerText,//期限
                        ways: document.getElementById('repayType').innerText,//还款方式
                        ensure_ways: document.getElementById('conteeType').children[0].innerText,//保障方式
                        start_bid_date: document.getElementById('publishDate').innerText,//发布时间

                        base_info: document.getElementById('basicInfo').innerText,//基本情况
                        used: document.getElementById('basicInfo').innerText,//借款用途
                        financial: document.getElementById('basicInfo').innerText,//财务状况
                        credit: document.getElementById('basicInfo').innerText,//信用情况
                        assets_situation: document.getElementById('basicInfo').innerText,//资产情况
                        guarantee_measures: document.getElementById('basicInfo').innerText,//担保措施
                        risk_measures: document.getElementById('basicInfo').innerText,//风险措施
                        check_opinion: document.getElementById('basicInfo').innerText,//审查意见

                        loan_data: [],//借款资料


                    };
                    return JSON.stringify(data);
                }).then(function (res2) {
                    page.render('test1-2' + '.png');
                    details.push(JSON.parse(res2))

                    stopEnt({page, url: history, details});
                })
            }, 2000)

        });

    });

}


function stopEnt({page, url, details}) {
    console.log(details, "@@@@");
    // save(details);

    page.open(url).then(function () {
        // 进行翻页的操作
        page.evaluate(function () {

            var url = location.href;
            var nextBtn = document.getElementById('next');
            var text = nextBtn.textContent;

            nextBtn.click();

            return url;
        }).then(function (resUrl) {
            // 判断是否到了最后一页
            console.log(currentPage);
            setTimeout(function () {
                if (currentPage < 2) {
                    console.log("*********Go to the next page: " + ++currentPage)
                    console.log('获取数据' + details.length + '条');
                    // 如果不是最后一页，递归调用到下一页

                    getDetails({page, url: resUrl, details});

                } else {

                    console.log("----end----");
                    console.log(details);
                    // origin.off();
                    // save(entire);      //保存数据
                }

            }, 2000);
        });
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
    obj = [];
}








