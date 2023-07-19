const axios = require('axios');
const cheerio = require('cheerio');

function kaimaru(lan_din, date){
    let anything = 
    axios({
    // 크롤링을 원하는 페이지 URL
    url: 'https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=fclt&stt_dt=' + date,
    method: 'GET',
    responseType: 'arraybuffer',
})

    // 성공했을 경우
    .then(response => {
        let list = [];
        const $ = cheerio.load(response.data);
        const title = $('#tab_item_1 > h3').text();
        const when = $('#tab_item_1 > table > thead > tr > th:nth-child('+lan_din + ')').text();
        menu = ''
        if (lan_din == 1){
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ')').text();
        }
        else {
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ') > ul').text();
        }


        // console.log(Title(title).title)
        // console.log(Title(title).date)
        // console.log(when);
        // console.log(kaimaru_data(menu))
        kaimaru_data(menu).forEach(function(it) {
            list.push({
                menuName: it.content,
                price: it.price
            });
        });

        return list;
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });

    return anything;
};
function Title(input) {
    const regex = /\[([^[\]]+)\]\s.+?\s-\s(.+)/;
    const matches = input.match(regex);

    if (matches && matches.length >= 3) {
        const title = matches[1].trim();
        const date = matches[2].trim();
        return { title, date };
    }

    return null;
}
function kaimaru_data(input) {
    const titleRegex = /([^\n]+)\((\d+,\d\d\d)\)/;
    const contentRegex = /([^\n]+)(?:\s\(([\d,]+)\))?/;

    const lines = input.split('\n');
    const data = [];
    let currentTitle = '';
    let currentPrice = '';
    let previousTitle = '';
    let i = 0;
    for (let line of lines) {
        if (line.trim().length === 0) {
        continue;
        } else if (titleRegex.test(line)) {
        const matches = line.match(titleRegex);
        currentTitle = matches[1].trim();
        currentPrice = matches[2].replace(',', '').trim();
        } else if (contentRegex.test(line) && line.includes("Kcal") == false && line.includes("야채샐러드&드레싱") == false) {
        const matches = line.match(contentRegex);
        const content = matches[1].trim().replace(/\(\d+(,\d+)*\)/, '').trim();

        if (previousTitle == ''){
           data.push({
            title: currentTitle,
            price: parseInt(currentPrice),
            content: content,});
            previousTitle =  currentTitle;
        }else if (currentTitle == previousTitle){

            data[i].content += "/n" +content;
            continue;
        }
        else{
            i++;
            data.push({
                title: currentTitle,
                price: parseInt(currentPrice),
                content: content,});
                previousTitle =  currentTitle;
        }

        }
    }
    return data;
}
function west(bre_lan_din, date){
    let anything = axios({
    // 크롤링을 원하는 페이지 URL
    url: 'https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=west&stt_dt=' + date,
    method: 'GET',
    responseType: 'arraybuffer',
})

    // 성공했을 경우
    .then(response => {
        let list = [];
        const $ = cheerio.load(response.data);
        const title = $('#tab_item_1 > h3').text();
        const when = $('#tab_item_1 > table > thead > tr > th:nth-child('+bre_lan_din +')').text();
        menu = '';
        if (bre_lan_din == 1) {
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('+bre_lan_din +')').text();
        }else{
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('+bre_lan_din +') > ul').text();
        }
        // console.log(Title(title).title)
        // console.log(Title(title).date)
        // console.log(when);
        // console.log(west_data(menu,bre_lan_din));

        west_data(menu,bre_lan_din).forEach(function(it) {
            list.push({
                menuName: it.content,
                price: it.price
            });
        });

        return list;
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });
    
    return anything;
}
function west_data(input,bre_lan_din) {
    lines = input.replace(/\t/, '').trim();

    lines = lines.split('\n');
    let currentPrice = '';
    let currentTitle = '';
    if (bre_lan_din == 1 ){
        currentTitle = "조식";
        currentPrice = "3700"
    } else if (bre_lan_din == 2 ){
        currentTitle = "중식";
        currentPrice = "5000"
    } else if (bre_lan_din == 3 ){
        currentTitle = "석식";
        currentPrice = "5000"
    }
    const data = [];
    let i = 0;
    data.push({title: currentTitle,price: parseInt(currentPrice),content: ""});
    for (let line of lines) {
        if (line.trim().length === 0) {
        continue;
        }
        else if ( line.includes("cal")){
            data[i].content = data[i].content.slice(0,-1);
        }
        else if (line.includes("**<")){
            i++;
            currentTitle = line.substring(3,5);
            currentPrice = line.substring(6,11).replace(",","");
            data.push({title: currentTitle,price: parseInt(currentPrice),content: ""});

        }else {

            var regex = /\d/; 
            var index = line.search(regex);
            if (index !== -1){
                line = line.substring(0,index);
            }
            data[i].content += line + "/n" ;
        }


    }
return data;
}
function east2(lan_din, date){
    let anything = axios({
    // 크롤링을 원하는 페이지 URL
    url: 'https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=east2&stt_dt=' + date,
    method: 'GET',
    responseType: 'arraybuffer',
})
    // 성공했을 경우
    .then(response => {
        let list = [];
        const $ = cheerio.load(response.data);
        const title = $('#tab_item_1 > h3').text();
        const when = $('#tab_item_1 > table > thead > tr > th:nth-child('+lan_din + ')').text();
        menu = ''
        if (lan_din == 1){
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ')').text();
        }
        else {
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ') > ul').text();
        }
        // console.log(Title(title).title)
        // console.log(Title(title).date)
        // console.log(when);
        // console.log()

        east2_data(menu).forEach(function(it) {
            list.push({
                menuName: it.content,
                price: it.price
            });
        });

        return list;
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });

    return anything;
}
function east2_data(input) {
    lines = input.replace(/\t/, '').trim();
    lines = lines.split('\n');
    let currentPrice = '';
    let currentTitle = '';
    const data = [];
    let i = -1;
    for (let line of lines) {
        if (line.trim().length === 0) {
        continue;
        }
        else if ( line.includes("cal")){
            data[i].content = data[i].content.slice(0,-1);
        }
        else if (line.includes("<")){
            cur_line = line.split(" ");
            i++;
            currentTitle = cur_line[0].substring(1);
            currentPrice = cur_line[1].slice(0,-2).replace(",","");
            data.push({title: currentTitle,price: parseInt(currentPrice),content: ""});
        }else {
            var words = line.split(" ");
            data[i].content += words[0] + "/n" ;
        }
    }
    for (var count = 0 ; count < i; count++){
        data[count].content = data[count].content.slice(0,-1);
    }
return data;
}
function emp(lan_din, date){
    let anything = axios({
    // 크롤링을 원하는 페이지 URL
    url: 'https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=emp&stt_dt=' + date,
    method: 'GET',
    responseType: 'arraybuffer',
})
    // 성공했을 경우
    .then(response => {
        let list = [];
        const $ = cheerio.load(response.data);
        const title = $('#tab_item_1 > h3').text();
        const when = $('#tab_item_1 > table > thead > tr > th:nth-child('+lan_din + ')').text();
        menu = ''
        if (lan_din == 1){
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ')').text();
        }
        else {
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +lan_din +   ') > ul').text();
        }
        // console.log(Title(title).title)
        // console.log(Title(title).date)
        // console.log(when);
        // console.log()

        emp_data(menu).forEach(function(it) {
            list.push({
                menuName: it.content,
                price: it.price
            });
        });

        return list;
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });

    return anything;
}
function emp_data(input) {
    lines = input.replace(/\t/, '').trim();
    lines = lines.split('\n');
    const data = [];
    let currentTitle = '';
    let currentPrice = "5000";
    let i = 0;
    for (let line of lines) {
        if (line.trim().length === 0) {
        continue;
        } else if(line.includes("cal")){
            continue;
        }
        else if ( i == 0) {
            data.push({title: line,price: parseInt(currentPrice),content: ""});
        }else {
            var words = line.split(" ");
            data[0].content += words[0] + "/n" ;
        }
        i++;
    }
    if(data.length != 0) {
        data[0].content = data[0].content.slice(0,-1);
    }
    
    return data;
}
function east1(bre_lan_din, date){
    let anything = axios({
    // 크롤링을 원하는 페이지 URL
    url: 'https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=east1&stt_dt=' + date,
    method: 'GET',
    responseType: 'arraybuffer',
})
    // 성공했을 경우
    .then(response => {
        let list = [];

        const $ = cheerio.load(response.data);
        const title = $('#tab_item_1 > h3').text();
        const when = $('#tab_item_1 > table > thead > tr > th:nth-child('+bre_lan_din + ')').text();
        menu = ''
        if (bre_lan_din == 1){
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +bre_lan_din +   ')').text();
        }
        else {
            menu = $('#tab_item_1 > table > tbody > tr > td:nth-child('   +bre_lan_din +   ') > ul').text();
        }
        // console.log(Title(title).title)
        // console.log(Title(title).date)
        // console.log(when);
        // console.log()

        east1_data(menu,bre_lan_din).forEach(function(it) {
            list.push({
                menuName: it.content,
                price: it.price
            });
        });
        
        return list;
        
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });
    return anything;
}
function east1_data(input,bre_lan_din) {
    lines = input.trim().replace(/\t/g,"dsa").replace(/dsadsa/g,"dsa");
    lines = lines.split('\n');
    const data = [];
    let i = -1;
    for (let line of lines) {
        if (line.trim().length <= 1) {
        continue;
        } else if(line.includes("cal")){
            continue;
        }
        else if (line.includes("Self")){
            continue;
        }
        else if ( line.includes("<")) {
            i++;
            var regex = /<([^>]+)>(.+)/;
            var matches = line.match(regex);
            var word1 = ""
            var word2 = ""
            if (matches) {
                word1 = matches[1];
                word2 = matches[2];
            }
            if (word2.length == 3){
                data.push({title: word1,price: "-",content: ""});
            }else{
                data.push({title: word1,price: parseInt(word2.trim().replace(',',"").replace("원","")),content: ""});
            }
        }else {
            var words = line.split("dsa");

            if ( words.length == 3){

                data[i].content += words[0] + words[2]+"/n";

            }
            else if ( words.length == 2){
                if (bre_lan_din == 2){
                    data[i].content += words[0] + words[1]+"/n";
                }else{
                    data[i].content += words[0] + "/n";
                }

            }else {
                data[i].content += words[0] +"/n";
            }
        }   
    }
    for (var count = 0 ; count < i+1; count++){
        while (data[count].content.endsWith("/n")){
            data[count].content = data[count].content.slice(0,-2);
        }
        //data[count].content = data[count].content;
    }
    return data;
}

const getKaistMenu = async (year, month, dayOfMonth) => {
    try {
        const dateString = year + '.' + month + '.' + dayOfMonth;
        const dateParameter = year + '-' + month + '-' + dayOfMonth;
        const restaurantMenuList = [];
        let breakfastList = [];
        let lunchList = [];
        let dinnerList = [];

        // 카이마루
        breakfastList = await kaimaru(1, dateParameter);
        lunchList = await kaimaru(2, dateParameter);
        dinnerList = await kaimaru(3, dateParameter);

        restaurantMenuList.push({
            restaurantName: '카이마루',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
        });

        // 교수회관
        breakfastList = await emp(1, dateParameter);
        lunchList = await emp(2, dateParameter);
        dinnerList = await emp(3, dateParameter);

        restaurantMenuList.push({
            restaurantName: '교수회관',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
        });

        // 동맛골_학생식당
        breakfastList = await east1(1, dateParameter);
        lunchList = await east1(2, dateParameter);
        dinnerList = await east1(3, dateParameter);

        restaurantMenuList.push({
            restaurantName: '동맛골_학생식당',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
        });

        // 동맛골_교직원식당
        breakfastList = await east2(1, dateParameter);
        lunchList = await east2(2, dateParameter);
        dinnerList = await east2(3, dateParameter);

        restaurantMenuList.push({
            restaurantName: '동맛골_교직원식당',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
        });

        // 서맛골
        breakfastList = await west(1, dateParameter);
        lunchList = await west(2, dateParameter);
        dinnerList = await west(3, dateParameter);

        restaurantMenuList.push({
            restaurantName: '서맛골',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
        });

        // console.log(restaurantMenuList);
        return restaurantMenuList;


    } catch(err) {
        console.log(err);
    }
};

module.exports = { getKaistMenu };