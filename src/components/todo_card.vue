<template>
  <div id="card_content">
    <span id="card_title">Add ToDos</span>
    <form action="" @submit="handle_sub">
      <div id="card_input">
        <label :class="[isLabelActive ? 'active' :'']"  id="label_for_new_todo" for="new_todo">what's need to be done</label>
        <input 
        @focus="isLabelActive = !isLabelActive"
        @blur="isLabelActive = !isLabelActive"
         type="text" name="" id="new_todo" v-model="inputVal">
      </div>
      <input type="submit" value="add newTodo" id="add_new_todo" >
    </form>
  </div>
</template>

<script>
  import { defineComponent,getCurrentInstance,ref } from 'vue';
  export default defineComponent({
      setup(props,ctx){
        let inputVal =ref('');
        let isLabelActive =ref(false);
        const handle_sub=(e)=>{
          e.preventDefault();
          if(inputVal.value==''){
            return;
          }
          ctx.emit('handle',inputVal.value);
          inputVal.value='';
        }
        return {
          handle_sub,
          inputVal,
          isLabelActive
        }
      }
   })
</script>

<style scoped lang="less">
div#card_content {
  padding:20px;
  border-bottom: 1px solid #ccc;
  span#card_title {
    display: block;
    line-height: 32px;
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 300;
  }

  form {
    div#card_input {
      position: relative;
      padding-top:15px ;
      label#label_for_new_todo {
        position: absolute;
        color: #9e9e9e;
        transition: transform .2s ease-out;
        transform: translateY(12px);
        &.active{
          color: #26a69a;
          transform-origin: 0 0;
          transform:translateY(-12px) scale(0.8);
        }
      }

      input#new_todo {
        background-color: transparent;
        border: none;
        border-bottom: 1px solid #9e9e9e;
        border-radius: 0;
        outline: none;
        height: 3rem;
        width: 100%;
        margin-bottom: 12px;
        transition: border 0.2s ease-out;
        &:focus{
          border-bottom: 2px solid #26a69a;
        }
      }
    }

    input#add_new_todo {
      border: none;
      background-color: #26a69a;
      color: #fff;
      font-size: 16px;
      border-radius: 2px;
      display: inline-block;
      height: 36px;
      line-height: 36px;
      padding: 0 2rem;
      vertical-align: middle;
      transition: all 0.3 ease-out;
      cursor: pointer;
      &:hover{
        height: 38px;
        background-color: #2bbbad;
      }
    }
    
  }
}


</style>