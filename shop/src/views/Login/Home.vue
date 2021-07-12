<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <img src="../../assets/img/3.jpeg" alt="" />
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!--侧边栏区域-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menulist"
            :key="item.id"
          >
            <template #title>
              <!--图标-->
              <i :class="icons[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template #title>
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边主体内容区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      icons: {
        125: "el-icon-user-solid",
        103: "el-icon-s-operation",
        101: "el-icon-s-order",
        102: "el-icon-s-comment",
        145: "el-icon-s-help",
      },
      isCollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/signin");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    //点击按钮折叠与展开
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: pink;
}
.el-header img {
  height: 60px;
  width: 60px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>