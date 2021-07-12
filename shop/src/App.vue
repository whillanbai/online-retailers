<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import signIn from "./views/Login/signIn";

export default {
  name: "app",
  components: { signIn },
};
</script>
<style>
html,
body,
#app {
  height: 100%;
}

.el-breadcrumb {
  margin-bottom: 15px;
}

.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 20px;
}
.el-cascader-menu {
  height: 200px;
}
.el-steps {
  margin: 15px 0;
}
.ql-editor {
  min-height: 300px;
}
</style>
