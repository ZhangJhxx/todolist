// 路由文件
const express = require("express");
const router = express.Router();

const conn = require("./db");

// 查询所有todo数据
router.get("/api/getTodos", (req, res) => {
  const sqlStr = "select * from todo_list;";
  conn.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      res.json({ code: 1, msg: "获取数据失败" });
    } else {
      res.json({ code: 0, todos: results });
    }
  });
});

// 插入todo
router.post("/api/addTodo", (req, res) => {
  const sqlStr = `insert into todo_list values (0, '${req.body.val}', 0);`;
  conn.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err.sqlMessage);
      res.json({ code: 1, msg: "插入新todo失败" });
    } else {
      console.log(results);
      res.json({ code: 0, msg: "插入成功" });
    }
  });
});

// 删除todo
router.post("/api/delTodo", (req, res) => {
  const { done, val } = req.body;
  console.log('done, val ',done, val );
  const sqlStr = `delete from todo_list where val='${val}' and done=${Number(
    done
  )}`;
  conn.query(sqlStr, (err, results) => {
    if (err) {
      res.json({ code: 1, msg: "删除todo失败" });
    } else {
      console.log(results);
      res.json({ code: 0, msg: "删除成功" });
    }
  });
});

// 批量删除已完成todo
router.post("/api/batchDelTodo", (req, res) => {
  const { done } = req.body;
  const sqlStr = `delete from todo_list where done=${Number(done)}`;
  conn.query(sqlStr, (err, results) => {
    if (err) {
      res.json({ code: 1, msg: "批量删除todo失败" });
    } else {
      console.log(results);
      res.json({ code: 0, msg: "批量删除todo成功" });
    }
  });
});

router.post("/api/modifyTodo", (req, res) => {
  const { done, val } = req.body;
  conn.query(
    `update todo_list set done=${Number(done)} where val='${val}'`,
    (err, results) => {
      if (err) {
        res.json({ code: 1, msg: "变更todo状态失败" });
      } else {
        console.log(results);
        res.json({ code: 0, msg: "更改状态成功" });
      }
    }
  );
});

module.exports = router;
