<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closeModal">关闭</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <div class="error-wrap">
                    <slot name="message"></slot>
                </div>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdShow == true" @click="closeModal"></div>
    </div>
</template>

<script>
    export default{
        props:["mdShow"],
        data(){
            return {
                loginModalFlag:true,
                errorTip:true,
                userName:'',
                userPwd:''
            }
        },
        methods:{
            closeModal(){
                this.$emit("close")
            }
        }
    }
</script>

