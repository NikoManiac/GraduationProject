
<template>
    <div>
        <!-- 未登录界面 -->
        <v-container
            v-if="userInfo.status === 0"
            grid-list-md text-xs-center 
            class="home-feed">
            <v-layout row class="card-item">
                <v-flex xs12>
                    <div style="text-align: left">
                        <div class="headline">欢迎来到茶途</div>
                    </div>
                    <v-layout row>
                        <v-flex xs6 full-height>
                            <v-btn @click="toLogin" v-actmoni class="user-btn_login" color="amber accent-2" dark>登录/注册</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <v-card-media
                                src="../static/img/testimg/1.JPG"
                                height="80px"
                                contain>
                            </v-card-media>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- 登录界面 -->
        <v-container
            v-if="userInfo.status === 1"
            grid-list-md text-xs-center 
            class="home-feed">
            <v-layout row class="card-item">
                <v-flex xs12>
                    <v-card flat>
                        <v-list two-line subheader>
                            <v-list-tile>
                                <v-list-tile-avatar>
                                     <img src="../../static/img/avatar/logo.png">
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                <v-list-tile-title>{{ userInfo.uname }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ userInfo.uIntro}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                <v-btn icon ripple>
                                    <v-icon color="grey lighten-1">info</v-icon>
                                </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                    <v-card flat>
                        <v-btn
                            flat
                            color="yellow"
                            class="white--text">
                            Upload
                            <v-icon right dark>edit</v-icon>
                        </v-btn>

                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- 公共界面 -->
        <v-container style="width:100%;padding:0;margin-top:1rem">
          <v-layout row wrap>
            <v-flex
                xs4
                v-for="item in boxList"
                :key="item.id"
                >
                <v-card flat tile class="user-setting_item">
                    <v-flex full-height>
                        <v-btn
                            icon flat x-large
                            @click="turnToSubPage(item.id, item.route)"
                            style="position: relativel;top:10px">
                            <v-icon class="app-header-icon">star</v-icon>
                        </v-btn>
                        <div>
                            <v-btn flat small>{{ item.name }}</v-btn>
                        </div>
                    </v-flex>
                </v-card>
            </v-flex>
          </v-layout>
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
function setState(store) {
    store.dispatch("appShell/appHeader/setAppHeader", {
        isShowHeader: false
    });
}

export default {
    name: "user",
    data() {
        return {
        items: [
            {
            src: "../static/img/testimg/1.JPG"
            },
            {
            src: "../static/img/testimg/1.JPG"
            },
            {
            src: "../static/img/testimg/1.JPG"
            },
            {
            src: "../static/img/testimg/1.JPG"
            }
        ]
        };
    },
    computed: {
        ...mapState('appUser/appUserPage', [
            'boxList'
        ]),
        ...mapState('userStatus/userStatu', [
            'userInfo'
        ])
    },
    metaInfo: {
        title: "Home",
        titleTemplate: "%s - Lavas",
        meta: [
        { name: "keywords", content: "lavas PWA" },
        {
            name: "description",
            content:
            "旅行攻略，应有尽有"
        }
        ]
    },
    async asyncData({ store, route }) {
        setState(store);
    },
    activated() {
        setState(this.$store);
    },
    methods: {
        toLogin() {
            console.log(this.$router);
            this.$router.replace('Login');
        },
        turnToSubPage(id, route) {
            this.$router.push(route);
        }
    }
};
</script>

<style lang="stylus" scoped>
@require '~@/assets/stylus/variable';
 #app 
    .app-view-with-header
        top 0
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-wrap: wrap;

    h2 {
        font-size: 46px;
        font-weight: 500;
    }
}

.home-feed {
    background-color: #fff;

    .card-item {
        padding: 8px 0px;
        border-bottom: 1px solid $colorBorder;
        box-shadow: none;
    }
}

.carousel {
    height: 200px;
}

.user-btn_login {
    background: $theme;
    box-shadow: none;
    width: 100%;
    color: $colorFont;
}

.user-setting_item {
    height: 100px;
    border-right: 1px $colorBorder solid;
    border-bottom: 1px $colorBorder solid;
}
</style>
