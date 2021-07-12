<template>
  <div class="a">
    <div class="sign">
      <!--<background></background>-->
      <!--头像-->
      <div class="head_portrait">
        <img src="../../assets/img/1.jpg" alt="" />
      </div>
      <!--密码和用户名-->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input
            prefix-icon="iconfont icon-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//import Background from "../Background";
export default {
  //components: { Background },
  name: "signIn",
  data() {
    return {
      //数据表单绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        //验证表单
        name: [],
        //验证密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        else {
          this.$message.success("登录成功");
          this.$router.push("/home");
        }
        //将token保存到sessionStorage
        window.sessionStorage.setItem("token", res.data.token);
      });
    },
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
.sign {
  width: 500px;
  height: 350px;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.head_portrait {
  height: 130px;
  width: 130px;
  border-radius: 50%;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.head_portrait img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.btns {
  display: flex;
  justify-content: center;
}
.login_form {
  position: absolute;
  bottom: 50px;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
}
</style>

