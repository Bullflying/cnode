<template>
  <div class="content-main">
    <Spin size="large" fix v-if="$store.state.spinShow"></Spin>
    <div class="main-article">
      <div v-if="true" class="panel">
        <div class="ks-clear arti-head">
          <span v-if="info.top || info.good" :class="{top: info.top, good: info.good}">{{topGood}}</span>
          <h1>{{info.title}}</h1>
        </div>
        <Row class-name="ptb-10">
          <Col span="11" class-name="mian-info">
            <span>发布于{{createTime}}</span>  
            <span>作者 {{authorName}}</span>
            <span>{{info.visit_count}} 次浏览</span>  
            <!-- <span>最后一次编辑是 7 个月前</span> -->
            <span>来自 {{tab}}</span>
            <br />
            <Icon type="ios-create-outline" size="22" title="编辑" v-if="isAuthor" />
          </Col>
          <Col span="3" offset="10" class-name="ta-r" v-if="isLogin">
            <Button type="success" class="collect" :class="{'cancel-col': info.is_collect}" @click="collect(info.id)">{{isCollect}}</Button>
          </Col>
        </Row>
        <div class="article">
          <div v-html="decodeContent" class="topic_content" @click="clickImg($event)"></div>
        </div>
      </div>
    </div>
    <big-img v-if="isRenderBig" @clickit="viewImg" :imgSrc="imgSrc" :top="topImg"></big-img>
  </div>
</template>

<script>
import navConfig from '@/router/navConfig';
import BigImg from './big-img';
import Cookies from 'js-cookie';

export default {
  name: 'CnodeArticleVx',
  data(){
    return {
      isRenderBig: false,
      imgSrc: '',
      topImg: 0
    };
  },
  components: {BigImg},
  created(){
    // console.log(this.authorName);
    this.getDetailVuex();
    this.$emit('author-name', this.authorName);
  },
  mounted(){
    setTimeout(() => {
      //给文章内所有链接设置在新选项卡打开
      let links = document.querySelector('.topic_content').querySelectorAll('a');

      links.forEach(item => {
        item.target = '_blank';
      });
    }, 1000);
  },
  watch: {
    $route(){
      this.getDetailVuex();
    }/* ,
    info(){
      this.spinShow = false;
      this.$emit('get-user', this.info.author.loginname);
      this.$emit('get-replies', this.info.replies);
    } */
  },
  computed: {
    //创建时间
    createTime(){
      return this.getTimeCR(this.info.create_at);
    },
    //获取分类
    tab(){
      let item = navConfig.find(item => item.params.tab === this.info.tab);

      if(item){
        //item 存在
        return item.title;
      }
    },
    //获取作者名
    authorName(){
      //下面这行执行了两次，所以要先确保有值，再进行操作。
      /* if(this.info.author){
        return this.info.author.loginname;
      } */
      
      return this.$store.state.detail.author.loginname;
    },
    //置顶或精华
    topGood(){
      if(this.info.top && this.info.good){
        //优先显示置顶
        return '置顶';
      }else if(this.info.top){
        //置顶
        return '置顶';
      }else if(this.info.good){
        //精华
        return '精华';
      }
    },
    //判断是否登录
    isLogin(){
      let isLogin = Cookies.get('success');

      return isLogin;
    },
    //显示收藏或取消收藏
    isCollect(){
      return this.info.is_collect ? '取 消 收 藏' : '收 藏';
    },
    //判断是不是自己的文章
    isAuthor(){
      let myLoginname = Cookies.get('loginname');

      if(this.info.author){
        return this.info.author.loginname === myLoginname ? true : false;
      }
    },
    //从 vuex 获取反转义后的内容
    decodeContent(){
      return this.$store.getters.decodeContent;
    },
    //从 vuex 获取细览
    info(){
      return this.$store.state.detail;
    }
  },
  methods: {
    //获取时间
    getTimeCR(time){
      let ct = new Date(time);

      return `${ct.getFullYear()}年${ct.getMonth()+1}月${ct.getDate()}日`;
    },
    //通知 vuex 获取文章细览及向上传递作者名、回复
    getDetailVuex(){
      this.$store.commit('showSpinMu', {show: true});

      let id = this.$route.params.id;
      let accesstoken = Cookies.get('accesstoken');

      if(accesstoken){
        //登录了
        this.$store.dispatch('getDetailAc', {id, accesstoken});
      }else{
        //没登录
        this.$store.dispatch('getDetailAc', {id});
      }
    },
    //放大图片
    clickImg(e) {
      if(e.target.nodeName === 'IMG'){
        this.isRenderBig = true;
        // 获取当前图片地址
        this.imgSrc = e.target.src;
        this.topImg = e.target.offsetTop;
      }
    },
    //退出大图
    viewImg(){
      this.isRenderBig = false;
    },
    //收藏或取消收藏
    collect(id){
      let accesstoken = Cookies.get('accesstoken');

      if(this.info.is_collect){
        //取消收藏
        this.$api.deCollectTopic({
          accesstoken,
          topic_id: id
        }).then(res => {
          this.info.is_collect = false;
        }, error => {
          console.log(error);
        });
      }else{
        //收藏
        this.$api.collectTopic({
          accesstoken,
          topic_id: id
        }).then(res => {
          this.info.is_collect = true;
        }, error => {
          console.log(error);
        });
      }
    }
  }
}
</script>

<style>
.content-main {
  /* z-index:1;
  position: relative; */
  margin-bottom: 15px;
}
.main-top {
  width :100%;
  height :44px;
  line-height :32px;
  z-index :100;
  overflow :hidden;
  top :0;
  border-bottom :1px solid #ddd;
  text-align :center;
  line-height :44px;
}
.main-article{
  box-sizing: border-box;
  top :45px;
  bottom :0;
  width :100%;
  height :100%;
  padding :15px 30px;
  background-color :#fff;
  overflow-y :auto;
  border-radius: 4px 4px 0 0;
  -moz-border-radius: 4px 4px 0 0;
  -webkit-border-radius: 4px 4px 0 0;
}
.arti-head * {float: left;}
.arti-head span {
  margin: 7px 5px 0 0;
  color: white;
  padding: 2px 3px;
  font-size: 10px;
  font-weight: 400;
  border-radius: 4px;
  text-align: center;
  vertical-align: middle;
}
.arti-head span.good {background: #e67e22;}
.arti-head span.top {background-color: #42b983;}
.mian-info{
  font-size :12px;
  color : #838383;
}
  
.mian-info span:before{
  content: "•";
}
.mian-info i {
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
  color: #999;
}
.mian-info i:hover {color: #08C;}
.article{
  padding-top: 10px;
  border-top: solid 1px #E5E5E5;
}

.markdown-text p,.preview p {
	white-space: pre-wrap;
	white-space: -moz-pre-wrap;
	white-space: -pre-wrap;
	white-space: -o-pre-wrap;
	word-wrap: break-word;
	line-height: 2em;
	margin: 1em 0;
  font-size: 18px;
}

.markdown-text>:last-child,.preview>:last-child,textarea#title {
	margin-bottom: 1em;
}

.markdown-text>:first-child,.preview>:first-child {
	margin-top: 0;
}

.markdown-text li,.preview li {
	font-size: 14px;
	line-height: 2em;
}

.markdown-text li code,.markdown-text p code,.preview li code,.preview p code {
	color: #000;
	background-color: #fcfafa;
	padding: 4px 6px;
}

/* .markdown-text img {
	cursor: pointer;
} */

.markdown-text h1 code,.markdown-text h2 code,.markdown-text h3 code,.markdown-text h4 code,.markdown-text h5 code,.markdown-text h6 code {
	font-size: inherit;
	color: inherit;
}

.panel .markdown-text a {
	color: #08c;
}

.preview {
	padding: .5em;
	font-size: 15px;
	min-height: 200px;
	word-break: break-all;
}

.preview p>img {
	display: block;
	box-shadow: 0 0 4px rgba(0,0,0,.6);
}

.markdown_editor .markdown_in_editor,.markdown_editor .markdown_in_preview {
	display: none;
}

.markdown_editor.in_editor .markdown_in_editor,.markdown_editor.in_preview .markdown_in_preview {
	display: block;
}
blockquote{padding:0 0 0 15px;margin:0 0 20px;border-left:5px solid #eee}
blockquote p{font-size:17.5px;font-weight:300;line-height:1.25}
blockquote small{color:#999}blockquote small:before{content:'\2014 \00A0'}blockquote.pull-right{float:right;padding-right:15px;padding-left:0;border-right:5px solid #eee;border-left:0}blockquote.pull-right p,blockquote.pull-right small{text-align:right}blockquote.pull-right small:before{content:''}blockquote.pull-right small:after{content:'\00A0 \2014'}blockquote:after,blockquote:before,q:after,q:before{content:""}
.preview p,.reply_content p,.reply_form p,.topic_content p{font-size:15px;line-height:1.7em;overflow:auto}
.panel .markdown-text a:link, .panel .markdown-text a:visited {color: #08C;}
.panel .markdown-text a:hover {text-decoration: underline;}
.topic_content h2 {font-size: 26px;}
.preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6, .reply_area h1, .reply_area h2, .reply_area h3, .reply_area h4, .reply_area h5, .reply_area h6, .topic_content h1, .topic_content h2, .topic_content h3, .topic_content h4, .topic_content h5, .topic_content h6 {
  margin: 30px 0 15px;
  border-bottom: 1px solid #EEE;
}
div pre.prettyprint{font-size:14px;border-radius:0;padding:0 15px;border:none;margin:20px -10px;border-width:1px 0;background:#f7f7f7;-o-tab-size:4;-moz-tab-size:4;tab-size:4}
pre code {
  font-size: 12px;
  white-space: pre-wrap;
}
/* .topic_content div ul {list-style-position: inside;} */
.topic_content div ul li ul {padding-left: 25px;}
.topic_content table {
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
}
.topic_content table tr {
  border-top: 1px solid #CCC;
  background-color: white;
  padding: 0;
  margin: 0;
}
.topic_content table tr th, .topic_content table tr td {
  border: 1px solid #CCC;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
  font-weight: 700;
}
.topic_content table tr td>:last-child {margin-bottom: 0;}
.topic_content table tr td>:first-child {margin-top: 0;}
.topic_content p img {cursor: pointer;}
.cancel-col {
  background-color: #E5E5E5;
  border-color: #E5E5E5;
  color: #333;
}
.cancel-col:hover {
  background-color: #909090;
  border-color: #909090;
  color: white;
}
</style>