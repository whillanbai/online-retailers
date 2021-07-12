<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesdialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!--表单-->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, il) in scope.row.children" :key="item1">
              <!--一级权限-->
              <el-col :span="5">
                {{ item1.authName }}
              </el-col>
              <!--二级权限和三级权限-->
              <el-col :span="19"></el-col>
            </el-row>
            <pre>
              {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="380">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="380">
        </el-table-column>
        <el-table-column prop="id" label="操作" width="380">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-loading"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加用户框-->
    <!--添加用户弹出框-->
    <el-dialog title="添加用户" :visible="rolesdialogVisible" width="50%">
      <el-form ref="editRef" :model="addRolesForm" label-width="80px">
        <!--填写区域-->
        <el-form-item label="角色名称">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--按钮区域-->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rolesAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--修改用户弹出框-->
    <el-dialog title="修改用户" :visible="rolesEdit" width="50%">
      <el-form ref="rolesRef" :model="rolesEditForm" label-width="80px">
        <!--填写区域-->
        <el-form-item label="角色名称">
          <el-input v-model="rolesEditForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesEditForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--按钮区域-->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rolesEdit = false">取 消</el-button>
          <el-button type="primary" @click="rolesEditInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有列表数据
      rolesList: [],
      rolesdialogVisible: false,
      rolesEdit: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      rolesEditForm: {},
      rolesInfo: {
        info: "",
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles", {
        params: this.rolesInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.rolesList = res.data;
    },
    //点击按钮添加新用户
    rolesAdd() {
      this.$refs.rolesRef.validate(async (valid) => {
        if (!valid) return;
        //发送网络请求
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.rolesdialogVisible = false;
        this.getRolesList();
      });
    },
    //编辑查询用户
    async showRoles(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      this.rolesEditForm = res.data;
      this.rolesEdit = true;
      console.log(res);
    },
    rolesEditInfo() {
      this.$refs.rolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.rolesEditForm.roleId,
          {
            roleName: this.rolesEditForm.roleName,
            roleDesc: this.rolesEditForm.roleDesc,
          }
        );
        console.log(res);
        console.log(this.rolesEditForm.id);
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        //关闭对话框
        this.rolesEdit = false;
        //修改数据
        this.getRolesList();
        //提示修改成功
        this.$message.success("修改用户成功");
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>