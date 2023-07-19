const axios = require('axios');
const cheerio = require('cheerio');

const url = ["1", "2", "4", "6", "7", "8"]
var restaurant;

function changeDateUrl(year, month, dayOfMonth) {
    return `?p_p_id=foodView_WAR_foodportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_foodView_WAR_foodportlet_sFoodDateDay=${dayOfMonth}&_foodView_WAR_foodportlet_sFoodDateYear=${year}&_foodView_WAR_foodportlet_action=view&_foodView_WAR_foodportlet_sFoodDateMonth=${month}`;
}

const getHyuMenu = async (year, month, dayOfMonth) => {
    const restaurantMenuList = [];
    try {
        for(let idx = 0; idx < url.length; idx++) {
            const html = await axios.get('https://www.hanyang.ac.kr/web/www/re' + url[idx] + changeDateUrl(year, month, dayOfMonth));
            // let dateList = [];
            // let menuList = [];
            let breakfastList = [];
            let lunchList = [];
            let dinnerList = [];
            const $ = cheerio.load(html.data);
            
            // restaurant info
            if(idx == 0) {
                const restaurant_temp = $("strong.font-point5").text().split(" ");
                restaurant = restaurant_temp[0];
            } else {
                restaurant = $("strong.font-point5").text().replace(/\s/g, "");
            }


            // date info
            const date = $("div.day-selc");
            let currentDate = '';
            date.map((i, element) => {
                // dateList[i] = {
                //     date: $(element).find("strong").text().replace(/\s/g, ""),
                //     day: $(element).find("span").text().replace(/\s/g, "").replace("달력", ''),
                // };
                currentDate = $(element).find("strong").text().replace(/\s/g, "");
            });

            // menu info
            const menu = $("div.in-box");
            menu.map((i, element) => {
                let menu = [];
                $(element).find("a.thumbnail").map((j, e) => {
                    const tempList = [];
                    var menuName;
                    const price = $(e).find("p.price").text().replace(/\s/g, "");
                    const tempMenu = $(e).find("h3");
                    tempMenu.each((index, list) => {
                        if($(list).find('br').length) {
                            $(list).find('br').replaceWith('\n');
                        }

                        var str = $(list).text();
                        const strlist = str.split('\n');
                        strlist.forEach(function(e) {
                            tempList.push(e.replace(/\s/g, ""));
                        });

                        const filtered = tempList.filter((value, k, arr) => {
                            return value != '';
                        });

                        if(price == '-') {
                            if(idx == 3 || idx == 4) {
                                menuName = filtered[0];
                            } else {
                                menuName = filtered[0] + "\n" + filtered[1];
                            }   
                        } else {
                            menuName = filtered[0];
                        }

                        // menu.push(JSON.stringify({
                        //     menuName: menuName,
                        //     price: price,
                        // }));
                        menu.push({
                            menuName: menuName,
                            price: price
                        });

                    // console.log(filtered);
                    // console.log(price);
                    });
                
                });
                // menuList[i] = {
                //     category: $(element).find("h4").text().replace(/\s/g, ""),
                //     menu: menu,
                // }
                const category = $(element).find("h4").text().replace(/\s/g, "");
                if(category === '조식') {
                    menu.forEach(function(it) {
                        breakfastList.push(it);
                    });
                } else if(category === '중식') {
                    menu.forEach(function(it) {
                        lunchList.push(it);
                    });
                } else if(category === '석식') {
                    menu.forEach(function(it) {
                        dinnerList.push(it);
                    });
                }
            });

            // console.log(restaurant);
            // console.log(dateList);
            // console.log(menuList);
            // console.log("\n\n\n");

            restaurantMenuList.push({
                restaurantName: restaurant,
                date: currentDate,
                breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
                lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
                dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
            });

        }

        // console.log(restaurantMenuList);
        return restaurantMenuList;
         
    } catch(error) {
        console.log(error);
        return [];
    }
};

// getHyuMenu("2023", "06", "14");
module.exports = { getHyuMenu };