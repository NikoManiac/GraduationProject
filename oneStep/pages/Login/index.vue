<template>
    <v-tabs
        v-model="active"
        color="white"
        fixed-tabs
        slider-color="yellow">
        <v-tab
            v-for="item in navs"
            :key="item"
            ripple>
            {{ item }}
        </v-tab>
        <!-- 登录tab -->
        <v-tab-item>
            <v-layout row class="login-form">
                <v-flex xs3>
                    <v-subheader>手机</v-subheader>
                </v-flex>
                <v-flex xs9>
                    <input type="text" class="login-input" v-model="loginInfo.userPhone" placeholder="手机登录更安全哟">
                </v-flex>
            </v-layout>
            <v-layout row class="login-form">
                <v-flex xs3>
                    <v-subheader>密码</v-subheader>
                </v-flex>
                <v-flex xs9>
                    <input type="password" class="login-input" v-model="loginInfo.userPassword" placeholder="">
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs5 offset-xs1>
                    <v-alert
                        outline
                        color="error"
                        class="alert-error"
                        :value="alertControl.status"
                        transition="scale-transition">
                        提示：{{ alertControl.text}}
                    </v-alert>
                </v-flex>
                <v-flex xs5>
                    <button style="text-align:right" class="text-lg-right">忘记密码</button>
                </v-flex>
            </v-layout>
            <v-layout row class="login-form">
                <v-flex xs12>
                    <button class="login-btn" @click="userLoginControl">登录</button>
                </v-flex>
            </v-layout>
        </v-tab-item>
        <!-- 注册tab -->
        <v-tab-item>
            <v-layout row class="login-form">
                <v-flex xs3>
                    <v-subheader>手机</v-subheader>
                </v-flex>
                <v-flex xs9>
                    <input type="text" class="login-input" v-model="registerInfo.userPhone" placeholder="手机号">
                </v-flex>
            </v-layout>
            <v-layout row class="login-form">
                <v-flex xs3>
                    <v-subheader>验证码</v-subheader>
                </v-flex>
                <v-flex xs5>
                    <input type="text" class="login-input" v-model="registerInfo.varifyCode" placeholder="验证码">
                </v-flex>
                <v-flex xs4>
                    <div>
                        <button @click="getVerifyCode" class="login-btn_code">提交</button>
                    </div>
                </v-flex>
            </v-layout>
            <v-layout row class="login-form">
                <v-flex xs3>
                    <v-subheader>密码</v-subheader>
                </v-flex>
                <v-flex xs9>
                    <input type="text" class="login-input" v-model="registerInfo.userPassword" placeholder="password">
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs5 offset-xs1>
                    <v-alert
                        outline
                        color="error"
                        class="alert-error"
                        :value="alertControl.status"
                        transition="scale-transition">
                        提示：{{ alertControl.text}}
                    </v-alert>
                </v-flex>
            </v-layout>
            <v-layout row class="login-form">
                <v-flex xs12>
                    <button class="login-btn" @click="userRegisterControl">注册</button>
                </v-flex>
            </v-layout>
        </v-tab-item>
    </v-tabs>
    <!-- <v-container fluid>
        
    </v-container> -->
</template>
<script>
import storage from '../../lib/storage.js';
import {mapState, mapMutations, mapActions} from 'vuex';

function setState(store) {
    store.dispatch("appShell/appHeader/setAppHeader", {
        isShowHeader: false
    });
}
export default {
    name: "login",
    data() {
        return {
            navs: ['登录', '注册'],
            loginInfo: {
                userPhone: null,
                userPassword: null
            },
            registerInfo: {
                userPhone: null,
                userCodePhone: null,
                userPassword: null,
                varifyCode: null
            },
            alertControl: {
                status: false,
                text: ''
            },
            code: 0,
            errprTipInfo: ['号码不存在', '密码错误', '号码格式错误', '验证码错误', '密码不能为空'],
            active: null
        };
    },
    async asyncData({ store, route }) {
        setState(store);
    },
    activated() {
        setState(this.$store);
    },
    methods: {
        ...mapMutations('global', {
            setMsgTip: 'SETMSGTIP'
        }),
        ...mapActions('userStatus/userStatu', [
            'setUserInfo'
        ]),
        next() {
            const active = parseInt(this.active);
            this.active = (active < 2 ? active + 1 : 0).toString();
            this.alertStatusChange(false);
        },
        alertStatusChange(status, text) {
            this.alertControl.status = status;
            this.alertControl.text = text;
        },
        verifyPhone(value) {
            return /^1[34578]\d{9}$/.test(value);
        },
        getVerifyCode() {
            // 获取验证码
            // 1. 验证手机号
            if (!this.verifyPhone(this.registerInfo.userPhone)) {
                this.alertStatusChange(true, this.errprTipInfo[2]);
                return;
            }
            // 绑定手机号，防止用户获取验证码后，修改手机号
            this.registerInfo.userCodePhone = this.registerInfo.userPhone;
            this.$http.get("/api/user", {
                params: {
                    userPhone: this.registerInfo.userPhone
                }
            }).then(
                ({data}) => {
                    console.log(data);
                    if( parseInt(data.status) === 1 ) {
                        this.code = data.data;
                        console.log(data);
                        this.setMsgTip({msgSwitch: true, msgText: '验证码发送成功'});
                    }
                    else {
                        this.setMsgTip({msgSwitch: true, msgText: '获取验证码失败，请稍后再试'});
                    }
                }
            );
        },
        userLoginControl() {
            if (!this.verifyPhone(this.loginInfo.userPhone)) {
                this.alertStatusChange(true, this.errprTipInfo[2]);
                return;
            }
            if (!this.loginInfo.userPassword) {
                this.alertStatusChange(true, this.errprTipInfo[4]);
                return;
            }
            this.$http.put("/api/user", {
                userPhone: this.loginInfo.userPhone,
                userPassword: this.loginInfo.userPassword
            }).then(({data}) => {
                    console.log(data);
                    if (data.status) {
                        // 将token写入localstorage
                        storage.setItem('oneStep_token', data.token);
                        this.setUserInfo(data.user);
                        // 将消息同步到store
                        this.setMsgTip({msgSwitch: true, msgText: data.message});

                        // 跳转到之前的页面
                        let AimPath = this.$route.query.redirect || '/';
                        this.$router.push(AimPath);
                    }
                    else {
                        this.setMsgTip({msgSwitch: true, msgText: data.message});
                    }
                }).catch((e) => {
                    console.log(e);
                    this.setMsgTip({msgSwitch: true, msgText: '服务器错误'});
                })
        },
        userRegisterControl() {
            // 检查验证码
            if (parseInt(this.registerInfo.varifyCode) != parseInt(this.code)) {
                this.setMsgTip({msgSwitch: true, msgText: '验证码错误'});
                return;
            }
            if (!this.registerInfo.userPassword) {
                
                this.alertStatusChange(true, this.errprTipInfo[4]);
                return;
            }
            this.$http.post("/api/user", {
                userPhone: this.registerInfo.userCodePhone,
                userPassword: this.registerInfo.userPassword
            }).then(
                function ({data}) {
                    console.log(data);
                    if (data.status) {
                        this.setMsgTip({msgSwitch: true, msgText: '注册成功，请重新登录'});
                        // 切换到登录界面
                        this.active = 0;
                    }
                    else {
                        this.setMsgTip({msgSwitch: true, msgText: '注册失败，请稍后再试'});
                    }
                    // 将数据同步到store
                },
                function (err) {
                    this.setMsgTip({msgSwitch: true, msgText: '注册失败，请稍后再试'});
                }
            );
        }
    }
};
</script>
<style lang="stylus" scoped>
@require '~@/assets/stylus/variable';

.login-form {
    margin: 1rem;
    border-bottom: 1px solid $theme;
}

.login-input {
    width: 100%;
    height: 100%;
    outline: none;
}

.alert.alert--outline
    border none!important
    padding 0

.login-btn_code {
    padding: 0.8rem;
    width: 100%;
    border-radius: 5px;
    background: $theme;
    text-align: center;
}
.text-lg-right
    padding 4px
.login-btn {
    width: 100%;
    padding: 1rem;
    border-radius: 5px;
    background: $theme;
    text-align: center;
}
</style>

