const axios = require('axios');
const cheerio = require('cheerio');
function student(which,bre_lan_din, date){
    let dates = date.split(".")
    let anything = 
    axios({
        // 크롤링을 원하는 페이지 URL
        url: 'https://food.podac.poapper.com/v2/menus/' + dates[0] +"/"+ dates[1] +"/"+ dates[2],
        method: 'GET',
    })

    // 성공했을 경우
    .then(response => {
        dates = date.split(".");
        date_string = dates[1] +"/"+dates[2] + "("+ getDayOfWeek(date)+ ")";
        if (which == "student"){
            // console.log("학생식당");
            // console.log(date_string);
            let breakfast1 = '';
            let breakfast2 = '';
            let lunch = '';
            let dinner = '';
            const breakfastList = [];
            const lunchList = [];
            const dinnerList = [];

            if (bre_lan_din == 1){
                // console.log("조식(breakfast) 08:00 ~ 09:30");
                for (count = 0 ; count < response.data.BREAKFAST_A.foods.length ; count++){
                    // console.log(response.data.BREAKFAST_A.foods[count].name_kor)
                    if(count == 0) 
                        breakfast1 = breakfast1 + response.data.BREAKFAST_A.foods[count].name_kor;
                    else
                        breakfast1 = breakfast1 + ' ' + response.data.BREAKFAST_A.foods[count].name_kor;
                }
                for (count = 0 ; count < response.data.BREAKFAST_B.foods.length ; count++){
                    // console.log(response.data.BREAKFAST_B.foods[count].name_kor)
                    if(count == 0)
                        breakfast2 = breakfast2 + response.data.BREAKFAST_B.foods[count].name_kor;
                    else
                        breakfast2 = breakfast2 + ' ' + response.data.BREAKFAST_B.foods[count].name_kor;
                }

                if(breakfast1.length > 0) {
                    breakfastList.push({
                        menuName: breakfast1,
                        price: '-'
                    });
                }
    
                if(breakfast2.length > 0) {
                    breakfastList.push({
                        menuName: breakfast2,
                        price: '-'
                    });
                }

                return breakfastList;
            } else if (bre_lan_din == 2){
                // console.log("중식(lunch) 11:30 ~ 13:30");
                for (count = 0 ; count < response.data.LUNCH.foods.length ; count++){
                    // console.log(response.data.LUNCH.foods[count].name_kor)
                    if(count == 0)
                        lunch = lunch + response.data.LUNCH.foods[count].name_kor;
                    else
                        lunch = lunch + ' ' + response.data.LUNCH.foods[count].name_kor;
                }

                if(lunch.length > 0) {
                    lunchList.push({
                        menuName: lunch,
                        price: '-'
                    });
                }

                return lunchList;
            }else {
                // console.log("석식(dinner) 17:30 ~ 19:00");
                for (count = 0 ; count < response.data.DINNER.foods.length ; count++){
                    // console.log(response.data.DINNER.foods[count].name_kor)
                    if(count == 0)
                        dinner = dinner + response.data.DINNER.foods[count].name_kor;
                    else
                        dinner = dinner + ' ' + response.data.DINNER.foods[count].name_kor;
                }

                if(dinner.length > 0) {
                    dinnerList.push({
                        menuName: dinner,
                        price: '-'
                    });
                }

                return dinnerList;
            }


        }else if(which == "wisdom"){
            // console.log("위즈덤");
            // console.log(date_string);
            // console.log("중식 11:50 ~ 13:00");
            let lunch = '';
            let lunchList = [];

            for (count = 0 ; count < response.data.STAFF.foods.length ; count++){
                // console.log(response.data.STAFF.foods[count].name_kor)
                if(count == 0)
                    lunch = lunch + response.data.STAFF.foods[count].name_kor;
                else
                    lunch = lunch + ' ' + response.data.STAFF.foods[count].name_kor;
            }

            if(lunch.length > 0) {
                lunchList.push({
                    menuName: lunch,
                    price: '-'
                });
            }

            return lunchList;
        }else {
            // console.log("더 블루힐");
            // console.log(date_string);
            // console.log("중식 11:30 ~ 13:30");
            let lunch = '';
            let lunchList = [];

            for (count = 0 ; count < response.data.INTERNATIONAL.foods.length ; count++){
                // console.log(response.data.INTERNATIONAL.foods[count].name_kor)
                if(count == 0)
                    lunch = lunch + response.data.INTERNATIONAL.foods[count].name_kor;
                else
                    lunch = lunch + ' ' + response.data.INTERNATIONAL.foods[count].name_kor;
            }

            if(lunch.length > 0) {
                lunchList.push({
                    menuName: lunch,
                    price: '-'
                });
            }
            return lunchList;         
        }
    })
    // 실패했을 경우
    .catch(err => {
        console.log(err);
        return [];
    });

    return anything;
};

function getDayOfWeek(dateString) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
};
// student("",1,"2023.07.17")

const getPostechMenu = async (year, month, dayOfMonth) => {
    try {
        const dateString = year + '.' + month + '.' + dayOfMonth;
        const restaurantMenuList = [];
        let breakfastList = [];
        let lunchList = [];
        let dinnerList = [];

        // 학생식당
        breakfastList = await student('student', 1, dateString);
        lunchList = await student('student', 2, dateString);
        dinnerList = await student('student', 3, dateString);

        restaurantMenuList.push({
            restaurantName: '학생식당_해동아우름홀',
            date: dateString,
            breakfast: breakfastList.length === 0 ? '' : JSON.stringify(breakfastList),
            lunch: lunchList.length === 0 ? '' : JSON.stringify(lunchList),
            dinner: dinnerList.length === 0 ? '' : JSON.stringify(dinnerList)
        });

        // 위즈덤
        lunchList = await student('wisdom', 2, dateString);
        
        restaurantMenuList.push({
            restaurantName: '위즈덤',
            date: dateString,
            breakfast: '',
            lunch: lunchList.length === 0 ? '' : JSON.stringify(lunchList),
            dinner: ''
        });

        // 더블루힐
        lunchList = await student('thebluehill', 2, dateString);

        restaurantMenuList.push({
            restaurantName: '더블루힐',
            date: dateString,
            breakfast: '',
            lunch: lunchList.length === 0 ? '' : JSON.stringify(lunchList),
            dinner: ''
        });

        // console.log(restaurantMenuList);
        return restaurantMenuList;
        

    } catch(err) {
        console.log(err);
    }
};

getPostechMenu("2023", "07", "17");

module.exports = { getPostechMenu };