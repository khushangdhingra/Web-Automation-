//npm init -y
//npm install minimist
// Search -> libraries for browser automation
//npm install puppeteer
// node .\addmoderator.js --url=https://www.hackerrank.com --config=config.json

let minimist= require("minimist");
let fs= require("fs");
let puppeteer= require("puppeteer");

let args= minimist(process.argv);

let data= fs.readFileSync(args.config,"utf-8");

let jsondata= JSON.parse(data);//ab ye object ban gaya hai

async function run(){
    let browser= await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:[
            '--start-maximized' // you can also use '--start-fullscreen'
         ]
    });
    let page = await browser.newPage();
   

    await page.goto(args.url);    
    await page.waitForSelector("a[href='https://www.hackerrank.com/access-account/']");
    await page.click("a[href='https://www.hackerrank.com/access-account/']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']",jsondata.userid,{delay: 20});

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']",jsondata.password,{delay: 20});

    await page.waitFor(3000);
    await page.click("button[data-analytics='LoginPassword']");
    
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    // await page.waitForSelector("p.mmT");
    // await page.click("p.mmT");

    // await page.waitFor(3000);//wait karenge kyunki pop up khul jata hai

    
    // await page.waitForSelector("li[data-tab='moderators']");
    // await page.click("li[data-tab='moderators']");


    // await page.waitForSelector("input#moderator");
    // await page.type("input#moderator",jsondata.moderator,{delay:20});

    // await page.keyboard.press("Enter");




    // await page.click("");
    // await browser.close();
    // await page.click("");
    // await browser.close();

    await page.waitForSelector("a.backbone.block-center");
    let curls = await page.$$eval("a.backbone.block-center",function(atags){

        //here instead of these below line it will be much better to use the map function that
        //we learnt in activity 2

    //1(difficult way)

    // let urls=[];

    // for(let i=0;i<atags.length;i++){
    //     let url= atags[i].getAttribute("href");
    //     urls.push(url);
    // }
    // return urls;

       //Method 2

    // let urls= atags.map(function(atag,i){
    //     return atag.getAttribute("href");
    // })
    // return urls;

        //method 3
    
    //let urls= atags.map(atag=> atag.getAttribute("href"));
    //return urls

       //method 4 (most simplest method)

    return atags.map(atag=>atag.getAttribute("href"));
    
});

    // console.log(curls);
    
    for(let i=0;i<curls.length;i++){
        let ctab= await browser.newPage();
        await ctab.goto(args.url + curls[i]);        
        await ctab.bringToFront();
        await ctab.waitFor(2000);
        await ctab.waitForSelector("li[data-tab='moderators']");
        await ctab.click("li[data-tab='moderators']");

        await ctab.waitForSelector("input#moderator");
        await ctab.type("input#moderator",jsondata.moderator,{delay:20});
        await ctab.keyboard.press("Enter");
        // await saveModerator(ctab,jsondata.moderator);
        await ctab.close();
        
    }

    // await saveModerator(ctab, moderator{})



}



run();