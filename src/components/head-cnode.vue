<template>
  <Header :style="{padding: 0}">
    <Menu mode="horizontal" theme="dark" :active-name="activeName" :style="{'background-color': 'transparent'}">
      <Row type="flex" justify="center">
        <Col span="7">
          <router-link :to="{name: 'Home'}">
            <img src="@/assets/images/cnode_logo.png" alt="cnode_logo" class="inline-pic" />
          </router-link>
        </Col>
        <!-- <Col span="8" offset="6" class-name="headnav"> -->
        <Col span="3" offset="11" class-name="headnav">
          <div class="ks-clear head-menu" @click="signOut">
            <MenuItem :name="index" v-for="(item, index) in whichOne" :key="item.path" :to="{name: item.name}" :class="{'badge': isMymes(item.name), 'head-menu-out': isOut(item.name)}">{{item.title}}</MenuItem>
          </div>
        </Col>
      </Row>
    </Menu>
  </Header>
</template>

<script>
import topNav from '@/router/topNav';
import topNavLogin from '@/router/topNavLogin';
import Cookies from 'js-cookie';

export default {
  name: 'HeadCnode',
  data(){
    return {
      topNav,
      topNavLogin,
      whichOne: [],
      myToken: '',
      activeName: -1
    };
  },
  watch: {
    $route(){
      this.whichTopNav();
      this.messageCount();
    }
  },
  created(){
    this.whichTopNav();
    this.messageCount();
  },
  computed: {
    //从 vuex 获取未读消息数
    mesCount(){
      return this.$store.state.notReadCount;
    },
    //从 vuex 获取我的信息字段
    myInfoKeys(){
      // return this.$store.state.myInfo;
      return this.$store.getters.getMyField;
    }
  },
  methods: {
    //顶部导航显示项
    whichTopNav(){
      let isLogin = Cookies.get('success');
      let name = this.$route.name;
      let index = -1;
      
      if(isLogin){
        //登录了
        this.whichOne = this.topNavLogin;

        index = this.topNavLogin.findIndex(obj => {
          if(name === 'Main'){
            //首页
            return obj.name === 'Home';
          }else{
            //不是首页
            return obj.name === name;
          }
        });

        this.$nextTick(() => {
          let headNav = document.querySelector('.headnav');

          // headNav.className = 'ivu-col ivu-col-span-9 ivu-col-offset-5 headnav';
          headNav.className = 'ivu-col ivu-col-span-4 ivu-col-offset-10 headnav';
        });
      }else{
        //没登录
        this.whichOne = this.topNav;

        index = this.topNav.findIndex(obj => {
          if(name === 'Main'){
            //首页
            return obj.name === 'Home';
          }else{
            //不是首页
            return obj.name === name;
          }
        });
      }

      this.activeName = index;
    },
    //判断是否是未读消息
    isMymes(name){
      return name === 'Mymes' ? true : false;
    },
    //判断是否是退出
    isOut(name){
      return name === 'Signout' ? true : false;
    },
    //获取未读消息数
    messageCount(){
      let accesstoken = Cookies.get('accesstoken');

      this.myToken = accesstoken;

      if(this.myToken){
        //登录了
        this.$store.dispatch('getNotReadAc', {accesstoken});

        setTimeout(() => {
          if(this.mesCount !== 0){
            //有未读消息
            this.$nextTick(() => {
              let myMes = document.querySelector('.badge');
            
              myMes.setAttribute('mesCount', this.mesCount);

              let headNav = document.querySelector('.headnav');

              // headNav.className = 'ivu-col ivu-col-span-10 ivu-col-offset-5 headnav';
              headNav.className = 'ivu-col ivu-col-span-5 ivu-col-offset-9 headnav';
            });
          }else{
            //没有未读消息
            this.$nextTick(() => {
              let myMes = document.querySelector('.badge');

              myMes.removeAttribute('mesCount');

              let headNav = document.querySelector('.headnav');

              // headNav.className = 'ivu-col ivu-col-span-9 ivu-col-offset-5 headnav';
              headNav.className = 'ivu-col ivu-col-span-4 ivu-col-offset-10 headnav';
            });
          }
        }, 120);
      }else{
        //没登录
        this.$nextTick(() => {
          let headNav = document.querySelector('.headnav');

          // headNav.className = 'ivu-col ivu-col-span-8 ivu-col-offset-6 headnav';
          headNav.className = 'ivu-col ivu-col-span-3 ivu-col-offset-11 headnav';
        });
      }
    },
    //退出
    signOut(e){
      let classIndex = e.target.className.indexOf('head-menu-out');

      if(e.target.nodeName === 'A' && classIndex !== -1){
        //点的是退出
        this.myInfoKeys.forEach(myField => {
          Cookies.remove(myField);
        });

        Cookies.remove('myField');
        this.whichTopNav();
        this.messageCount();
        this.$store.commit('isLoginMu', {success: false});
      }
    }
  }
}
</script>

<style>
.head-menu a.ivu-menu-item {padding: 0 15px;}
[mesCount]:before {
  content: attr(mesCount);
  margin-right: 5px;
  color: white;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  background-color: #80BD01;
  text-align: center;
  display: inline-block;
  line-height: 1.5;
  min-width: 20px;
}
</style>
