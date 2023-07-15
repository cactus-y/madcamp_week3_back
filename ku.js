const axios = require('axios');
const cheerio = require('cheerio');

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
        const html = await axios.get(getUrl(year, month, dayOfMonth));
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
                    const date = {
                        date: `${year}.${monthAndDay[0]}.${monthAndDay[1]}`,
                        day: $(el).find("span.day").text() + "요일"
                    };
                    console.log(date);

                    const menuString = $(el).find("div.menulist > p");
                    var menu = "";
                    const breakfast = [];
                    const lunch = [];
                    const dinner = [];
                    var isBreakfast = false;
                    var isLunch = false;
                    var isDinner = false;

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
                                        lunch.push({
                                            menuName: temp[0],
                                            price: temp[1]
                                        });
                                        dinner.push({
                                            menuName: temp[0],
                                            price: temp[1]
                                        });
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
                            

                            if(isBreakfast == true) {
                                breakfast.push({
                                    menuName: tempText[tempText.length - 1],
                                    price: "-"
                                });
                            } else if(isLunch == true) {
                                lunch.push({
                                    menuName: tempText[tempText.length - 1],
                                    price: "-"
                                });
                            } else if(isDinner == true) {
                                dinner.push({
                                    menuName: tempText[tempText.length - 1],
                                    price: "-"
                                });
                            }
                            
                        }
                    });

                    // console.log(menu);
                    console.log(breakfast);
                    console.log(lunch);
                    console.log(dinner);

                    // put menus into json here. if j is 0, breakfast is empty, and menus are for both lunch and dinner

                    

                });
                console.log(restaurantName);
            });
        });

    } catch(error) {
        console.error(error);
    }
};

getHtml("2023", "07", "10");