const http = require('http');
// const url = 'http://cg.51bccf.com/finance_user/product_list.html;jsessionid=B8F146DA2B912CF6AAE7FC0DD07923D2?0&PRODUCTS_TYPE###';
const url = 'http://cg.51bccf.com/finance_user/product_list.html?1-1.ILinkListener-body-form-conRptListTainer-conRptList-rptList-1-lnkTitle';
const cheerio = require('cheerio');


http.get(url, function (res) {
    let html = '';
    res.on('data', function (data) {
        html += data;
    }).on('end', function () {
        handler(html);
    })

}).on('error', function () {
    console.log('error')
})

function handler(html) {
    console.log(html);
    let $ = cheerio.load(html);
    return



    let tagA = $('a.invest_title'),
        datas = [];
    // console.log(tagA);
    tagA.each(function (idx, item) {
        let a = $(this);
        datas.push('http://cg.51bccf.com/finance_user/' + a.attr('href'));
    })
    console.log(datas[0]);
    http.get(datas[0], function (res) {
        let html = '';
        res.on('data', function (data) {
            html += data;
        }).on('end', function () {
            console.log('entries')
            console.log(html);
            entries(html);
        })

    }).on('error', function () {
        console.log('error')
    })

    // var jumpBtns = document.querySelectorAll('.invest_title');
    // var datas = [];
    // for (var i = 0, l = jumpBtns.length; i < l; i++) {
    //     var a = jumpBtns[i],
    //         href = a.href;
    //     datas.push(href);
    // }
    // return JSON.stringify(datas);


}


function entries(html) {
    let $ = cheerio.load(html);
    console.log($('#title').text());


}