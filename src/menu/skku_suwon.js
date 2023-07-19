const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const conSpaceList = ["104", "040", "251"]
const resIdList = [3, 11, 12];

const getSkkuSuwonMenu = async(year, month, dayOfMonth) => {
    const restaurantMenuList = [];
    try {
        for(let idx = 0; idx < 3; idx++) {
            var url = `https://www.skku.edu/skku/campus/support/welfare_11_1.do?mode=info&srDt=${year}-${month}-${dayOfMonth}&srCategory=L&conspaceCd=20201${conSpaceList[idx]}&srResId=${resIdList[idx]}&srShowTime=D&srCategory=L`;
            
            // const html = await axios.get(url);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // page.on('dialog', async dialog => {
            //     await dialog.dismiss();
            // });

            await page.goto(url);
            if(await page.$('#jwxe_main_content > div > div.wel_popupWrap > div > div.wel_popBtn') != null) {
                await page.waitForSelector('#jwxe_main_content > div > div.wel_popupWrap > div > div.wel_popBtn');

                await page.evaluate(() => {
                    const checkbox = document.querySelector('#dayChk');
                    checkbox.click();
                });

                await page.evaluate(() => {
                    const popupButton = document.querySelector('#jwxe_main_content > div > div.wel_popupWrap > div > div.wel_popBtn > button');
                    popupButton.click();
                });
            }

            
            
            // at first, choose lunch
            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(1) > a.category_btn');
            await page.evaluate(() => {
                const button = document.querySelector("#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(1) > a");
                button.click();
            });

            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > div.oneday_list > div');

            
            var content = await page.content();
            // let dateList = [];
            let currentDate;
            let menuList = [];
            const $ = cheerio.load(content);

            // restaurant info
            const restaurant = $("#jwxe_main_content > div > div > div > div > div.cafeteria_info > div > div.info_tit > h5").text().replace(/\s/g, "");

            // date info
            const date = $("li.oneday_date").text().replace(/\s/g, "")
            const tempDate = date.split("(");
            // dateList.push({
            //     date: tempDate[0],
            //     day: tempDate[1].substring(0, tempDate[1].length - 1)
            // });
            currentDate = tempDate[0];

            // lunch info
            let lunchList = [];
            var count = await page.$$eval("div.corner_info", divs => divs.length);

            for(let i = 1; i <= count; i++) {
                const menuContainer = $(`#jwxe_main_content > div > div > div > div > div.oneday_list > div > div:nth-child(${i})`);
                menuContainer.map((index, element) => {
                    const price = $(element).find('div.corner_info > ul > li:nth-child(2) > span').text();
                    priceSplit = price.split(':');
                    const menuData = {
                        menuName: $(element).find(`div.corner_info > ul > li:nth-child(1) > div > pre`).text(),
                        price: priceSplit[1].replace(/\s/g, ""),
                    };
                    // lunchList.push(JSON.stringify(menuData));
                    lunchList.push(menuData);
                });
            }

            // breakfast info
            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(2) > a.category_btn');
            await page.evaluate(() => {
                const button = document.querySelector("#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(2) > a");
                button.click();
            });

            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > div.oneday_list > div');

            content = await page.content();

            let breakfastList = [];
            count = await page.$$eval("div.corner_info", divs => divs.length);

            for(let i = 1; i <= count; i++) {
                const menuContainer = $(`#jwxe_main_content > div > div > div > div > div.oneday_list > div > div:nth-child(${i})`);
                menuContainer.map((index, element) => {
                    const price = $(element).find('div.corner_info > ul > li:nth-child(2) > span').text();
                    priceSplit = price.split(':');
                    const menuData = {
                        menuName: $(element).find(`div.corner_info > ul > li:nth-child(1) > div > pre`).text(),
                        price: priceSplit[1].replace(/\s/g, ""),
                    };
                    // breakfastList.push(JSON.stringify(menuData));
                    breakfastList.push(menuData);
                });
            }

            // dinner info
            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(3) > a.category_btn');
            await page.evaluate(() => {
                const button = document.querySelector("#jwxe_main_content > div > div.mg50 > div > div > form > fieldset > div > ul > li:nth-child(3) > a");
                button.click();
            });

            await page.waitForSelector('#jwxe_main_content > div > div.mg50 > div > div > div.oneday_list > div');

            content = await page.content();

            let dinnerList = [];
            count = await page.$$eval("div.corner_info", divs => divs.length);

            for(let i = 1; i <= count; i++) {
                const menuContainer = $(`#jwxe_main_content > div > div > div > div > div.oneday_list > div > div:nth-child(${i})`);
                menuContainer.map((index, element) => {
                    const price = $(element).find('div.corner_info > ul > li:nth-child(2) > span').text();
                    priceSplit = price.split(':');
                    const menuData = {
                        menuName: $(element).find(`div.corner_info > ul > li:nth-child(1) > div > pre`).text(),
                        price: priceSplit[1].replace(/\s/g, ""),
                    };
                    // dinnerList.push(JSON.stringify(menuData));
                    dinnerList.push(menuData);
                });
            }

            menuList = [
                {
                    category: '조식',
                    menu: JSON.stringify(breakfastList)
                }, 
                {
                    category: '중식',
                    menu: JSON.stringify(lunchList)
                }, 
                {
                    category: '석식',
                    menu: JSON.stringify(dinnerList)
                }
            ]

            // menu.map((i, element) => {
            //     let tempMenu = [];
            //     menuList.push()
            //     console.log($(element).find("div > pre").text());
            // });

            // console.log(restaurant);
            // console.log(dateList);
            // console.log(menuList);
            // console.log("\n\n\n");
            await page.close();
            await browser.close();

            restaurantMenuList.push({
                restaurantName: restaurant,
                date: currentDate,
                breakfast: breakfastList.length === 0 ? '[]' : JSON.stringify(breakfastList),
                lunch: lunchList.length === 0 ? '[]' : JSON.stringify(lunchList),
                dinner: dinnerList.length === 0 ? '[]' : JSON.stringify(dinnerList)
            });
        }

        return restaurantMenuList;
        // console.log(restaurantMenuList);
        
    } catch(error) {
        console.error(error);
    }
};

// getSkkuSuwonMenu("2023", "07", "17");

// getHtml("2023", "07", "14");
module.exports = { getSkkuSuwonMenu };