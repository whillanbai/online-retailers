<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--添加模块-->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="treeTable"
      >
        <!--slot-scope="scope"表示作用域插槽，用来接收数据-->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightred"></i>
        </template>
        <!--排序-->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 1]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible="addCateDialogVisible"
      width="30%"
      @click="addCateDialogClosed"
    >
      <!-- 填写信息 -->
      <el-form
        ref="addCateRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <!-- v-model表示选中的选项，options表示数据来源，props表示在data中设置的属性对象，@change表示发生改变触发的方法 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      //添加用户框开关
      addCateDialogVisible: false,
      //商品分类列表数据
      catelist: [],
      //总数据条数
      total: 0,
      columns: [
        {
          //列的标题名称
          label: "分类名称",
          //绑定的数组
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //将当前列定义为模板列
          type: "template",
          //表示当前列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          //将当前列定义为模板列
          type: "template",
          //表示当前列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          //将当前列定义为模板列
          type: "template",
          //表示当前列使用的模板名称
          template: "opt",
        },
      ],
      /* 添加用户规则 */
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      /* 添加用户的对象 */
      addCateForm: {
        /* 名称 */
        cat_name: "",
        /* 父级分类的ID */
        cat_pid: 0,
        /* 分类等级 */
        cat_level: 0,
      },
      //父级分类的数据列表
      parentCateList: [],
      //级联表的属性
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        //触摸触发
        expandTrigger: "hover",
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    //因为是get请求需要指定参数，用params指定参数
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      //把数据赋值给catelist
      this.catelist = res.data.result;
      //将数据条数赋值给total
      this.total = res.data.total;
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听页码值
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      //获取父级数据
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级数据失败");
      }
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-dialog {
  height: 300px;
  width: 400;
}
.el-cascader {
  width: 100%;
}
</style>