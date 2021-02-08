const fetch = require("./node-fetch/lib");
let send = require('./mail'); // 邮箱提醒


let info; // 全局变量，存储用户信息


// 模拟登录
async function login () {
  console.log("提交登录表单");
  let url = "https://api.weishao.com.cn/login?source=%2Foauth%2Fauthorize%3Fclient_id%3DpqZ3wGM07i8R9mR3%26redirect_uri%3Dhttp%253A%252F%252Fncp.suse.edu.cn%252Fcheck%252Fquestionnaire%26response_type%3Dcode%26scope%3Dbase_api%26state%3Druijie";
  let res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    "referrerPolicy": "no-referrer",
    "body": `schoolcode=suse&username=${info['学号']}&password=${info['密码']}&verifyValue=&verifyKey=${info['学号']}_suse&ssokey=`,
    "method": "POST",
    "mode": "cors",
    redirect: 'manual' // 手动重定向，才可以拿到location
  });

  // 返回oauth2cookie
  let oauth2cookie = res.headers.get("set-cookie").split(";")[0];
  console.log(oauth2cookie);
  url = res.headers.get("location"); // 获得重定向地址
  console.log("\n第1次重定向");
  console.log(url);


  // 第一次 重定向
  res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "no-referrer",
    "body": null,
    "method": "GET",
    "mode": "cors",
    redirect: 'manual'
  });
  url = res.headers.get("location")
  console.log("\n第2次重定向");
  console.log(url);

  // 第二次 重定向
  res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": oauth2cookie
    },
    "referrerPolicy": "no-referrer",
    "body": null,
    "method": "GET",
    "mode": "cors",
    redirect: 'manual'
  })
  url = res.headers.get("location")
  console.log("\n第3次重定向");
  console.log(url);


  // 第三次 重定向
  res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "no-referrer",
    "body": null,
    "method": "GET",
    "mode": "cors",
    redirect: 'manual'
  })

  let cookie = res.headers.get("set-cookie").split(";")[0];
  console.log("真正的登录cookie:", cookie);
  if (cookie) console.log('\n登录成功');
  return cookie;
}


// 获取用户信息
async function getUserInfo (cookie) {
  let userInfo = await fetch("http://ncp.suse.edu.cn/userInfo", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": cookie
    },
    "referrer": "https://yq.weishao.com.cn/questionnaire",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }).then(res => {
    return res.json();
  }).then(json => {
    return json.data;
  })
  // console.log(userInfo);
  if (userInfo) console.log('\n获取用户信息成功');
  return userInfo;
}


// 模拟提交
function submit (cookie, body) {
  fetch("http://ncp.suse.edu.cn/api/questionnaire/questionnaire/addMyAnswer", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": cookie
    },
    "referrer": "http://ncp.suse.edu.cn/questionnaire/addanswer?page_from=onpublic&activityid=102&can_repeat=1",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": body,
    "method": "POST",
    "mode": "cors"
  }).then(res => {
    res.text().then(text => {
      console.log('\n提交结果>> ', text)
      send('打卡成功', text);
    })
  })
}


// 执行
async function main () {
  // 获取GitHub Secrets
  if(!process.env["INFO"]){
    console.error('GitHub Secrets没有填写，程序中止');
    send('打卡失败', 'GitHub Secrets没有填写');
    return
  }
  info = JSON.parse(process.env["INFO"]);
  if (!(info['学号'] && info['密码'] && info['位置'])) {
    console.error('GitHub Secrets信息不完整，请按文档说明填写，程序中止');
    send('打卡失败', 'GitHub Secrets信息不完整，请按文档说明填写');
    return
  }
  let cookie = await login();
  let userInfo = await getUserInfo(cookie);
  if (!userInfo) {
    console.error('\n获取用户信息失败，程序中止');
    send('打卡失败', '获取用户信息失败');
    return
  }
  info['姓名'] = userInfo['username'];
  info['path'] = userInfo['path'];
  info['组织'] = userInfo['organization'];
  info['性别'] = userInfo['gender'];
  // if(!info['电话']) info['电话'] = userInfo['cellphone'];
  if (!(info['姓名'] && info['path'] && info['组织'] && info['性别'])) {
    console.error('\n用户信息不完整，请检查手机微哨【个人资料】的完成度');
    send('打卡失败', '用户信息不完整，请检查手机微哨【个人资料】的完成度');
    return
  }

  // 默认数据 改变位置
  let body = {"sch_code":"suse","stu_code":info['学号'],"stu_name":info['姓名'],"identity":"student","path":info['path'],"organization":info['组织'],"gender":info['性别'],"activityid":"102","anonymous":0,"canrepeat":1,"repeat_range":1,"question_data":[{"questionid":1232,"optionid":"1904","optiontitle":"未在校","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1233,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":7,"option_sort":0,"range_value":"","content":info["位置"],"isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1234,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":4,"option_sort":0,"range_value":"","content":"在家","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1235,"optionid":"1906","optiontitle":"未接触过","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1236,"optionid":"1907","optiontitle":"没有出现症状","question_sort":0,"question_type":2,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1237,"optionid":"1913","optiontitle":"否，身体健康","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1238,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.7","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1239,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.8","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1240,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.6","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1241,"optionid":"1918","optiontitle":"是","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true}],"totalArr":[{"questionid":1232,"optionid":"1904","optiontitle":"未在校","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1233,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":7,"option_sort":0,"range_value":"","content":info["位置"],"isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1234,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":4,"option_sort":0,"range_value":"","content":"在家","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1235,"optionid":"1906","optiontitle":"未接触过","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1236,"optionid":"1907","optiontitle":"没有出现症状","question_sort":0,"question_type":2,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1237,"optionid":"1913","optiontitle":"否，身体健康","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1238,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.7","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1239,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.8","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1240,"optionid":0,"optiontitle":0,"question_sort":0,"question_type":3,"option_sort":0,"range_value":"","content":"36.6","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true},{"questionid":1241,"optionid":"1918","optiontitle":"是","question_sort":0,"question_type":1,"option_sort":0,"range_value":"","content":"","isotheroption":0,"otheroption_content":"","isanswered":true,"answerid":0,"answered":true}],"private_id":0}
  // 提交表单
  submit(cookie, JSON.stringify(body))

}

main()