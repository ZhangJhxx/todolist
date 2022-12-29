// 入口文件
const express = require("express");
const app = express();
const router = require("./router");
const path = require("path");
// 设置跨域
app.use((req, res, next) => {
  //判断路径
  if (req.path !== "/" && !req.path.includes(".")) {
    res.set({
      "Access-Control-Allow-Credentials": true, //允许后端发送cookie
      "Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
      "Access-Control-Allow-Headers": "X-Requested-With,Content-Type", //设置请求头格式和类型
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", //允许支持的请求方式
      "Content-Type": "application/json; charset=utf-8", //默认与允许的文本格式json和编码格式
    });
  }
  req.method === "OPTIONS" ? res.status(204).end() : next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

app.use(express.static(path.join(__dirname, "dist")));
const PORT = 9999;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
