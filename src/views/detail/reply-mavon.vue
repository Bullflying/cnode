<template>
  <section class="comments mt-15">
    <Card title="添加回复" :bordered="false" :dis-hover="true">
      <form class="reply-form" @submit.prevent="reply">
        <mavon-editor v-model.trim="formData.value" :subfield="formData.subfield" :toolbars="formData.toolbars" class="reply-form-mavon"></mavon-editor>
        <Button type="primary" html-type="submit" :loading="isLoading">{{btnText}}</Button>
      </form>
    </Card>
  </section>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'ReplyMavon',
  data(){
    return {
      formData: {
        value: '',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          quote: true, // 引用
          ul: true, // 无序列表
          ol: true, // 有序列表
          link: true, // 链接
          // imagelink: true, // 图片链接
          help: true, // 帮助
          preview: true, // 预览
          fullscreen: true // 全屏编辑
        },
        subfield: false
      },
      newComments: 0,
      isLoading: false
    };
  },
  computed: {
    //按钮文字
    btnText(){
      return this.isLoading ? 'Loading...' : '回复';
    }
  },
  methods: {
    async reply(){
      let content = this.formData.value;

      if(content){
        //有内容
        this.isLoading = true;

        let accesstoken = Cookies.get('accesstoken');
        let topicId = this.$route.params.id;

        let {data} = await this.$api.reply(topicId, {
          accesstoken,
          content
        });
        
        if(data.success){
          //评论发布成功
          this.newComments++;
          this.$emit('new-comment', this.newComments);
          this.formData.value = '';
        }else{
          //评论发布失败
          alert('评论发布失败');
        }

        this.isLoading = false;
      }else{
        //没内容
        this.$nextTick(() => {
          let textarea = document.querySelector('.auto-textarea-input');

          textarea.focus();
        });
      }
    }
  }
}
</script>

<style>
.reply-form {padding: 10px;}
.reply-form-mavon {margin-bottom: 24px;}
</style>
