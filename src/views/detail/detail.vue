<template>
  <Row type="flex" justify="center" :gutter="16" class-name="pt-15">
    <Col span="16" class-name="leftcol" :style="{padding: 0}">
      <cnode-article @get-user="getUserDe" @get-replies="getRepliesDe" :newComment="hasNewComment" :newReplyCom="hasNewReplyCom"></cnode-article>
      <comments :allReplies="replies" @up-to-detail="upDetail" @add-render="addRenderDe" @new-reply-comment="newReplyComDe"></comments>
      <!-- <reply v-if="false"></reply> -->
      <reply-mavon v-if="isLogin && loginname" @new-comment="newCommentDe"></reply-mavon>
    </Col>
    <Col span="5">
      <author :authorName="loginname" v-if="loginname" @user-to-detail="otherTopics"></author>
      <ads></ads>
      <others :otherTopics="recentTopics"></others>
      <no-reply></no-reply>
    </Col>
  </Row>
</template>

<script>
import CnodeArticle from './cnode-article';
import Comments from './comments';
// import Reply from './reply';
import ReplyMavon from './reply-mavon';
import Ads from '@/components/side/ads';
import NoReply from '@/components/side/no-reply';
import Author from '@/components/side/author';
import Others from '@/components/side/others';
import Vue from 'vue';

export default {
  name: 'Detail',
  components: {
    CnodeArticle,
    Ads,
    NoReply,
    Author,
    Others,
    Comments,
    // Reply,
    ReplyMavon
  },
  data(){
    return {
      loginname: '',
      recentTopics: [],
      userData: {},
      replies: [],
      hasNewComment: 0,
      hasNewReplyCom: 0
    };
  },
  watch: {
    $route(){
      this.otherTopics(this.userData);
    }
  },
  computed: {
    //判断是否登录
    isLogin(){
      /* let isLogin = Cookies.get('success');

      return isLogin; */
      // return this.$store.state.isLogin;
      return this.$store.getters.getIsLogin;
    }
  },
  methods: {
    //获取作者注册名
    getUserDe(loginname){
      this.loginname = loginname;
    },
    //获取回复
    getRepliesDe(replies){
      this.replies = replies;
    },
    //获得新话题评论通知
    newCommentDe(newNum){
      this.hasNewComment = newNum;
    },
    //获得新评论回复通知
    newReplyComDe(newComNum){
      this.hasNewReplyCom = newComNum;
    },
    //获取作者其它话题
    otherTopics(user){
      let id = this.$route.params.id;
      let recentTo = user.recent_topics;
      let others = recentTo.slice(0, 5);
      let index = others.findIndex(topic => topic.id === id);
      
      if(index !== -1){
        //当前浏览的主题和其它话题重复了
        if(recentTo.length > 5){
          //其它话题大于5条，才有替补
          let substitution = recentTo[5];

          others.splice(index, 1, substitution);
        }else{
          //其它话题小于等于5条，没有替补
          others.splice(index, 1);
        }
      }

      this.recentTopics = others;
      this.userData = user;
    },
    //给评论点赞
    upDetail(obj){
      let reply = this.replies.find(reply => reply.id === obj.id);

      if(reply){
        //找到这条评论
        if(obj.action === 'up'){
          //点赞
          reply.ups.push(obj.myId);
          reply.is_uped = true;
        }else{
          //取消点赞
          let index = reply.ups.findIndex(userId => userId === obj.myId);

          if(index !== -1){
            //找到我的 id
            reply.ups.splice(index, 1);
          }

          reply.is_uped = false;
        }
      }
    },
    //添加渲染评论表单
    addRenderDe(commentId){
      let targetComment = this.replies.find(reply => reply.id === commentId);

      if(targetComment && targetComment.renderReply === undefined){
        //找到那条评论且没有 renderReply 属性
        // targetComment.renderReply = true;
        Vue.set(targetComment, 'renderReply', true);
      }else if(targetComment){
        //找到那条评论，已经设置过 renderReply 属性
        targetComment.renderReply = !targetComment.renderReply;
      }
    }
  }
}
</script>