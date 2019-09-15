<template>
    <div class="login">
        <back @back="exit"></back>
        <div class="logo-wrapper">
            <div class="icon"></div>
            <div class="wave in"></div>
            <div class="wave out"></div>
        </div>
        <div class="login-wrapper">
            <div class="input-box user-name">
                <input
                    type="text"
                    placeholder="请输入用户名"
                    autocomplete="off"
                    ref="name"
                    @input="onNameInput"
                />
            </div>
            <div class="input-box user-password">
                <input
                    type="password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    ref="password"
                    @input="onPasswordInput"
                />
            </div>
        </div>
        <div class="btn-wrapper">
            <div :class="getLoginCls" @click="login">登录</div>
            <div :class="getLoginCls" @click="register">注册</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Mutation, Getter } from "vuex-class";
import { encrypt } from "@/utils/utils";
import Back from '@/components/Back.vue';

@Component({
    name: "Login",
    components: {
        Back
    }
})
export default class Login extends Vue {
    name: string = ""; // 登录名
    password: string = ""; // 密码

    @Getter("getTo") toPath!: string

    @Mutation("SET_USERINFO")
    private setUserInfo!: (userinfo: any) => void
    @Mutation("SET_SHOWLOGIN")
    private setShowLogin!: (showLogin: boolean) => void

    activated() {
        (this.$refs.name as any).focus();
    }

    private get getLoginCls() {
        return this.check() ? "login-btn" : "login-btn disable";
    }

    private exit() {
        this.setShowLogin(false)
    }
    private onNameInput(e: any) {
        this.name = e.target.value || "";
    }
    private onPasswordInput(e: any) {
        this.password = e.target.value || "";
    }
    // 登录
    private login() {
        if (this.check()) {
            this.$axios
                .post("/user/login", {
                    name: this.name,
                    password: encrypt(this.password)
                })
                .then(res => {
                    if (res.status === this.$OK) {
                        const user = res.data
                        if (user) {
                            // 用户存在 -> 保存会话 -> 退出登录页面
                            console.log(`用户存在 -> 退出登录页面`)
                            this.setUserInfo(user)
                            this.setShowLogin(false)
                            this.$router.push(this.toPath)
                        } else {
                            this.$bus.$emit("toast", "用户不存在或密码错误，请重试！", true)
                        }
                    } else {
                        this.$bus.$emit("toast", `登录失败！`, true)
                    }
                });
        }
    }
    // 注册
    private register() {
        if (this.check()) {
            this.$axios
                .post("/user/register", {
                    name: this.name,
                    password: encrypt(this.password)
                })
                .then(res => {
                    if (res.status === this.$OK) {
                        const user = res.data
                        // 注册成功 -> 保存会话 -> 退出登录页面
                        console.log(`注册成功 -> 退出登录页面`)
                        this.setUserInfo(user)
                        this.setShowLogin(false)
                        this.$router.push(this.toPath)
                    } else {
                        this.$bus.$emit("toast", `注册失败！`, true)
                    }
                });
        }
    }
    // 检查账号、密码
    private check() {
        return this.name && this.password;
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/mixin.scss";
.login {
    background: $default-light-color;
    letter-spacing: 1px;
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
            width: 28%;
            margin: 0 2%;
            line-height: 48px;
            text-align: center;
            &.disable {
                color: rgba(255, 255, 255, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
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
