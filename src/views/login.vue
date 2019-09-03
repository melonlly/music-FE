<template>
    <div class="login">
        <i class="back" @click="exit"></i>
        <div class="logo-wrapper">
            <div class="icon"></div>
            <div class="wave in"></div>
            <div class="wave out"></div>
        </div>
        <div class="login-wrapper">
            <div class="input-box user-name">
                <input type="text" placeholder="请输入用户名" ref="name" @input="onNameInput" />
            </div>
            <div class="input-box user-password">
                <input type="password" placeholder="请输入密码" ref="password" @input="onPasswordInput" />
            </div>
        </div>
        <div class="btn-wrapper">
            <div class="login-btn" @click="login">登录</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component({
    name: "Login",
    components: {}
})
export default class Login extends Vue {
    name: string = ""; // 登录名
    password: string = ""; // 密码
    @Mutation("SET_LOGIN")
    setLogin!: (login: boolean) => void;

    activated() {
        (this.$refs.name as any).focus();
    }

    private exit() {
        this.setLogin(false);
    }
    private onNameInput(e: any) {
        this.name = e.target.value || "";
    }
    private onPasswordInput(e: any) {
        this.password = e.target.value || "";
    }
    // 登录
    private login() {}
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.login {
    background: $default-light-color;
    letter-spacing: 1px;
    .back {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 50;
        width: 24px;
        height: 24px;
        background-image: url("~assets/images/close.png");
        background-size: contain;
        transform: rotate(270deg);
    }
    .logo-wrapper {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        height: 0;
        overflow: hidden;
        .icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
            width: 100px;
            height: 50px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            @include bg-image("~assets/images/logo");
        }
        .wave {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 50;
            border-radius: 100%;
            animation: wave 6s linear infinite;
            &.in {
                animation-delay: 1.5s;
            }
            &.out {
                animation-delay: 0s;
            }
        }
    }
    .login-wrapper {
        width: 100%;
        .input-box {
            text-align: center;
            input {
                height: 48px;
                width: 60%;
                border-radius: 24px;
                padding-left: 20px;
                background: #ffffff;
                color: #a9a9a9;
            }
            &.user-name {
            }
            &.user-password {
                margin-top: 20px;
            }
        }
    }
    .btn-wrapper {
        width: 100%;
        margin-top: 30px;
        text-align: center;
        .login-btn {
            display: inline-block;
            background: $default-light-color;
            color: #ffffff;
            border: 1px solid #ffffff;
            border-radius: 24px;
            height: 48px;
            width: 30%;
            line-height: 48px;
            text-align: center;
        }
    }
}
@keyframes wave {
    from {
        width: 1%;
        height: 1%;
        border: 1px solid rgba(255, 255, 0, 0.6);
    }
    to {
        width: 130%;
        height: 130%;
        filter: blur(2px);
        border: 1px solid rgba(255, 255, 0, 0.1);
    }
}
</style>
