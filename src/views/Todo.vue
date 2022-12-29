<template>
  <div id="container">
    <div id="main">
      <CardToDo @handle="addList" />
      <div id="card_action">
        <span id="list_title">ToDos</span>
        <span class="card_count">
          <span class="item_left">{{ going_todo }}</span> items left
        </span>
        <div id="card_select">
          <label
            :class="[isSelectActive ? 'active' : '']"
            id="label_for_sel"
            for="select"
            >select here and press enter</label
          >
          <input
            @focus="isSelectActive = !isSelectActive"
            @blur="isSelectActive = !isSelectActive"
            type="text"
            name=""
            id="select"
            v-model="userInput"
          />
        </div>
        <ul
          class="collection"
          @click="
            delSingleItem($event);
            toggleDone($event);
          "
        >
          <li
            class="collection_item"
            :key="item.id"
            v-for="(item, idx) in selectedList"
          >
            <input
              :data-idxcheckbox="idx"
              type="checkbox"
              :checked="item.done"
              name=""
              id=""
            />
            <p>
              <span>{{ item.val }}</span>
              <span :data-idxicon="idx" class="iconfont icon-close"></span>
            </p>
          </li>
        </ul>
        <div id="button_wrap">
          <button
            :class="[buttonActive.clear ? 'active' : '']"
            id="clear"
            @click="clearCompleted('clear')"
          >
            Clear Completed
          </button>
          <button
            :class="[buttonActive.all ? 'active' : '']"
            id="all"
            @click="showAll('all')"
          >
            All
          </button>
          <button
            :class="[buttonActive.going ? 'active' : '']"
            id="going"
            @click="showGoing('going')"
          >
            Active
          </button>
          <button
            :class="[buttonActive.completed ? 'active' : '']"
            id="completed"
            @click="showDone('completed')"
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let _ = require("lodash");
import {
  getData,
  addNewList,
  delListItem,
  modifyListItem,
  batchDelList
} from "../api/todo.js";
import { ref, defineComponent, reactive, computed } from "vue";
import CardToDo from "../components/todo_card.vue";
export default defineComponent({
  name: "Todo",
  components: { CardToDo },
  setup() {
    const buttonActive = reactive({
      clear: false,
      all: false,
      going: false,
      completed: false,
    });
    const todo_list = reactive([]);
    let isSelectActive = ref(false);
    let going_todo = ref(0);
    //selectTodo记录done的情况
    let selectTodo = ref("");
    //userInput记录用户输入的情况
    let userInput = ref("");
    async function getList() {
      const res = await getData();
      const todoList = res.todos.map((item) => {
        return {
          val: item.val,
          done: Boolean(item.done)
        };
      });
      console.log('todo', todoList);
      todo_list.push(...todoList);
      going_todo.value = initGoingTodo();
    }
    function initGoingTodo() {
      let count = 0;
      todo_list.forEach((item) => {
        if (item.done === false) count++;
      });
      return count;
    }
    async function addList(val) {
      let data = { val, done: false };
      todo_list.push(data);
      going_todo.value++;
      await addNewList(data);
    }

    function toggleDone(e) {
      if (!e.target.matches("input")) return;
      const el = e.target;
      const index = el.dataset.idxcheckbox;
      const item = todo_list[index];
      item.done = !item.done;
      going_todo.value += item.done === true ? -1 : 1;
      const { val, done } = item;
      modifyListItem({ val, done });
    }

    function delSingleItem(e) {
      if (!e.target.matches("span.iconfont")) return;
      const el = e.target;
      const index = el.dataset.idxicon;
      const item = todo_list[index];
      going_todo.value -= item.done === true ? 0 : 1;
      todo_list.splice(index, 1);
      let { val, done } = item;
      delListItem({ val, done });
    }

    function clearCompleted(key) {
      clearButtonActive(key);
      for (let key in todo_list) {
        if (todo_list[key].done === true) {
          todo_list.splice(key, 1);
        }
      }
      batchDelList({ done: true });
    }

    const clearButtonActive = (key) => {
      for (const k in buttonActive) {
        buttonActive[k] = false;
      }
      buttonActive[key] = !buttonActive[key];
    };

    const selectedList = computed(() => {
      if (selectTodo.value === "" && userInput.value === "") {
        return todo_list;
      } else if (userInput.value !== "") {
        return todo_list.filter((item) => item.val.includes(userInput.value));
      } else if (selectTodo.value !== "") {
        return todo_list.filter(
          (item) => item.done.toString() == selectTodo.value
        );
      } else {
        return todo_list.filter((item) => {
          return (
            item.done.toString() == selectTodo.value &&
            item.val.includes(userInput.value)
          );
        });
      }
    });

    function showAll(key) {
      clearButtonActive(key);
      selectTodo.value = "";
    }

    function showDone(key) {
      clearButtonActive(key);
      selectTodo.value = "true";
    }

    function showGoing(key) {
      clearButtonActive(key);
      selectTodo.value = "false";
    }

    getList();
    return {
      going_todo,
      selectedList,
      buttonActive,
      isSelectActive,
      userInput,
      getData,
      addList,
      delSingleItem,
      toggleDone,
      clearCompleted,
      showAll,
      showDone,
      showGoing,
    };
  },
});
</script>

<style scoped lang="less">
#container {
  margin: 0 auto;
  max-width: 960px;
  #main {
    margin: 0.5rem auto;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%),
      0 3px 1px -2px rgb(0 0 0 / 20%);
    width: 900px;
    height: 100%;
    border-radius: 2px;
    div#card_action {
      padding: 20px;
      span#list_title {
        display: block;
        line-height: 32px;
        margin-bottom: 8px;
        font-size: 24px;
        font-weight: 400;
      }

      span.card_count {
        color: #999;
      }

      div#card_select {
        margin-top: 15px;
        label#label_for_sel {
          position: absolute;
          color: #9e9e9e;
          transition: transform 0.2s ease-out;
          transform: translateY(12px);
          &.active {
            color: #26a69a;
            transform-origin: 0 0;
            transform: translateY(-12px) scale(0.8);
          }
        }

        input#select {
          background-color: transparent;
          border: none;
          border-bottom: 1px solid #9e9e9e;
          border-radius: 0;
          outline: none;
          height: 3rem;
          width: 100%;
          margin-bottom: 0.5rem;
          transition: border 0.2s ease-out;
          &:focus {
            border-bottom: 2px solid #26a69a;
          }
        }
      }

      ul.collection {
        margin: 0.5rem 0 1rem 0;
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
        li.collection_item {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
          &:last-child {
            border: none;
          }
          input {
            margin: 10px;
            &:checked + p {
              background: #f9f9f9;
            }
            &:checked + p > span:first-child {
              text-decoration: line-through;
            }
          }

          p {
            border-left: 1px solid #e0e0e0;
            padding-left: 20px;
            padding-right: 20px;
            flex: 1;
            line-height: 40px;
            transition: background 0.5s;
            font-weight: 200;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              &:nth-child(2) {
                cursor: pointer;
              }
              :hover {
                color: rgb(243, 93, 93);
              }
            }

            span.iconfont.icon-close:hover {
              color: rgb(243, 93, 93);
            }
          }
        }
      }
      button {
        margin: 3px;
        padding: 3px 7px;
        text-decoration: none;
        border: 1px solid transparent;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          border-color: rgba(175, 47, 47, 0.2);
        }
        &.active {
          border-color: rgba(175, 47, 47, 0.534);
        }
      }
    }
  }
}
</style>
