const axios = require('axios');
const cheerio = require('cheerio');

const originalUrl = 'https://www.korea.ac.kr/user/restaurantMenuAllList.do?siteId=university&id=university_050402000000';

// should be valid date: starts from monday, month does not start from 0
function getUrl(startYear, startMonth, startDay) {
    let endYear = Number(startYear);
    let endMonth = Number(startMonth);
    let endDay = Number(startDay);

    if(endMonth < 10)
        endMonth = '0' + endMonth;
    else
        endMonth = endMonth.toString();
    
    if(endDay < 10)
        endDay = '0' + endDay;
    else
        endDay = endDay.toExponential.toString();

    return `https://www.korea.ac.kr/user/restaurantMenuAllList.do?siteId=university&configIdx=&firstWeekDay=${startYear}-${startMonth}-${startDay}&lastWeekDay=${endYear}-${endMonth}-${endDay}&id=university_050402000000`;
}

const getHtml = async (year, month, dayOfMonth) => {
    try {
        // const html = await axios.get(getUrl(year, month, dayOfMonth));
        const html = await axios.get(originalUrl);
        let menuList = [];
        const $ = cheerio.load(html.data);

        const allData = $("#contents_body > div.sub_contents > div > ul");
        allData.map((i, element) => {
            const restaurant = $(element).find("li");
            restaurant.map((j, e) => {
                const restaurantName = $(e).find("strong").text();
                const menuByDate = $(e).find("ol");
                menuByDate.map((k, el) => {
                    let tempDate = $(el).find("span.date").text();
                    const monthAndDay = tempDate.split('/');

                    if(monthAndDay[0].length < 2)
                        monthAndDay[0] = '0' + monthAndDay[0];
                    
                    if(monthAndDay[1].length < 2)
                        monthAndDay[1] = '0' + monthAndDay[1];
                    const date = JSON.stringify({
                        "date": `${year}.${monthAndDay[0]}.${monthAndDay[1]}`,
                        "day": $(el).find("span.day").text() + "요일"
                    });
                    // console.log(date);

                    const menuString = $(el).find("div.menulist > p");
                    var menu = "";
                    const breakfast = [];
                    const lunch = [];
                    const dinner = [];
                    var isBreakfast = false;
                    var isLunch = false;
                    var isDinner = false;

                    if(restaurantName === '산학관 식당') {
                        const tempText = $(el).find('li').text();
                        if(!tempText.startsWith('토')) {
                            const lunchIndex = tempText.indexOf('중식');
                            const dinnerIndex = tempText.indexOf('석식');
                            if(dinnerIndex != -1) {
                                const lunchText = tempText.substring(lunchIndex + 2, dinnerIndex);
                                const lunchList = lunchText.split('[');
                                lunchList.forEach(function(it) {
                                    if(it !== ''){
                                        lunch.push(JSON.stringify({
                                            "menuName": it.replace(/]/g, ' '),
                                            "price": '-'
                                        }));
                                    }
                                });
                                const dinnerText = tempText.substring(dinnerIndex + 2);
                                const dinnerList = dinnerText.split('[');
                                dinnerList.forEach(function(it) {
                                    if(it !== '') {
                                        dinner.push(JSON.stringify({
                                            "menuName": it.replace(/]/g, ' '),
                                            "price": '-'
                                        }));
                                    }
                                });
                            
                            }
                            
                        }
                    }

                    menuString.each((idx, p) => {
                        if(restaurantName === "수당삼양패컬티하우스 송림") {
                            if($(p).find('br').length) {
                                $(p).find('br').replaceWith('\n');
                            }
                            const splitText = $(p).text().replace(/\\/g, '').split('\n');
                            splitText.forEach(function(it) {
                                if(it.indexOf(' ') != -1) {
                                    const temp = it.split(' ');
                                    if(temp[temp.length - 1].indexOf('0') != -1) {
                                        if(temp.length > 2) {
                                            for(let index = 2; index < temp.length; index++) {
                                                temp[1] = temp[1] + " " + temp[index];
                                            }
                                        }
                                        lunch.push(JSON.stringify({
                                            "menuName": temp[0],
                                            "price": temp[1]
                                        }));
                                        dinner.push(JSON.stringify({
                                            "menuName": temp[0],
                                            "price": temp[1]
                                        }));
                                    }   
                                }
                            });
                        } else if(restaurantName === "자연계 학생식당") {
                            if($(p).find('br').length) {
                                $(p).find('br').replaceWith('\n');
                            }
                            const tempText = $(p).text().split(':');
                            tempText.forEach(function(it) {
                                if(it.indexOf('조식') != -1) {
                                    isBreakfast = true;
                                    isLunch = false;
                                    isDinner = false;
                                } else if(it.indexOf('중식') != -1) {
                                    isBreakfast = false;
                                    isLunch = true;
                                    isDinner = false;
                                } else if(it.indexOf('석식') != -1) {
                                    isBreakfast = false;
                                    isLunch = false;
                                    isDinner = true;
                                } else if(it.indexOf('[') != -1 || it.indexOf('(') != -1) {
                                    isBreakfast = false;
                                    isLunch = false;
                                    isDinner = false;
                                }
                            });
                            

                            if(isBreakfast) {
                                breakfast.push(JSON.stringify({
                                    "menuName": tempText[tempText.length - 1],
                                    "price": "-"
                                }));
                            } else if(isLunch) {
                                lunch.push(JSON.stringify({
                                    "menuName": tempText[tempText.length - 1],
                                    "price": "-"
                                }));
                            } else if(isDinner) {
                                dinner.push(JSON.stringify({
                                    "menuName": tempText[tempText.length - 1],
                                    "price": "-"
                                }));
                            }
                            
                        } else if(restaurantName === "안암학사 식당") {
                            if($(p).find('br').length) {
                                $(p).find('br').replaceWith('\n');
                            }
                            const tempText = $(p).text().split('\n');
                            var breakfastMenuName = '';
                            var lunchMenuName = '';
                            var dinnerMenuName = '';

                            tempText.forEach(function(it) {
                                if(it.indexOf('조식') != -1) {
                                    isBreakfast = true;
                                    isLunch = false;
                                    isDinner = false;
                                } else if(it.indexOf('중식') != -1) {
                                    isBreakfast = false;
                                    isLunch = true;
                                    isDinner = false;
                                } else if(it.indexOf('석식') != -1) {
                                    isBreakfast = false;
                                    isLunch = false;
                                    isDinner = true;
                                } else if(it.indexOf('[') != -1 || it.indexOf('(') != -1) {
                                    isBreakfast = false;
                                    isLunch = false;
                                    isDinner = false;
                                }

                                if(it !== '' && !((/[a-zA-Z]/).test(it))) {
                                    const tempSplit = it.split(':');
                                    if(isBreakfast) {
                                        if(breakfastMenuName === '') {
                                            breakfastMenuName = tempSplit[tempSplit.length - 1];
                                        } else {
                                            breakfastMenuName = breakfastMenuName + " " + tempSplit[tempSplit.length - 1];
                                        }
                                    } else if(isLunch) {
                                        if(lunchMenuName === '') {
                                            lunchMenuName = tempSplit[tempSplit.length - 1];
                                        } else {
                                            lunchMenuName = lunchMenuName + " " + tempSplit[tempSplit.length - 1];
                                        }
                                    } else if(isDinner) {
                                        if(dinnerMenuName === '') {
                                            dinnerMenuName = tempSplit[tempSplit.length - 1];
                                        } else {
                                            dinnerMenuName = dinnerMenuName + " " + tempSplit[tempSplit.length - 1];
                                        }
                                    }
                                }
                            });

                            if(breakfastMenuName !== '')
                                breakfast.push(JSON.stringify({ "menuName": breakfastMenuName, "price": '-' }));
                            if(lunchMenuName !== '')
                                lunch.push(JSON.stringify({ "menuName": lunchMenuName, "price": '-' }));
                            if(dinnerMenuName !== '')
                                dinner.push(JSON.stringify({ "menuName": dinnerMenuName, "price": '-' }));
                        } else if(restaurantName === '산학관 식당') {
                            // only for saturday
                            if($(p).find('br').length) {
                                $(p).find('br').replaceWith('\n');
                            }
                            const tempText = $(p).text();
                            if(tempText.indexOf('조식') != -1) {
                                isBreakfast = true;
                                isLunch = false;
                                isDinner = false;
                            } else if(tempText.indexOf('중식') != -1) {
                                isBreakfast = false;
                                isLunch = true;
                                isDinner = false;
                            } else if(tempText.indexOf('석식') != -1) {
                                isBreakfast = false;
                                isLunch = false;
                                isDinner = true;
                            }

                            if(!isBreakfast && !isLunch && !isDinner && tempText === '메뉴미정') {
                                lunch.push(JSON.stringify({
                                    "menuName": '메뉴미정',
                                    "price": '-'
                                }));
                            }
                        } else {
                            if($(p).find('br').length) {
                                $(p).find('br').replaceWith('\n');
                            }
                            const tempText = $(p).text();
                            lunch.push(JSON.stringify({
                                "menuName": tempText,
                                "price": '-'
                            }));
                        }
                    });

                    // console.log(menu);
                    // console.log(breakfast);
                    // console.log(lunch);
                    // console.log(dinner);

                    // put menus into json here. if j is 0, breakfast is empty, and menus are for both lunch and dinner
                    menuList.push({
                        "retaurantName": restaurantName,
                        "date": date,
                        "breakfast": breakfast,
                        "lunch": lunch,
                        "dinner": dinner
                    });
                });
                // console.log(restaurantName);
            });
        });

        console.log(menuList);

    } catch(error) {
        console.error(error);
    }
};

getHtml("2023", "07", "10");