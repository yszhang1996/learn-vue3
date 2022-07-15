/**
 * 在此使用VUE3组合式函数的方式，封装基本的增删改查
 */
import { ref, watch } from "vue";
import { ElMessage } from "element-plus"
import { useDebounceFn } from '@vueuse/core'

interface ResultData {
    code: number;
    msg: string;
    data: any;
}

export function useGetList(params: any, tableData: any[], getList: (params: any) => Promise<ResultData>) {

    // 创建分页时记录当前页码数据，默认第一页
    const pageNumber = ref(1)

    // 创建分页时记录当前每页显示多少条数据，默认一页展示10条
    const pageSize = ref(10)

    // 记录当前列表数据总条数，默认0条
    const total = ref(0)

    // 设置加载中loading标识符，默认为true
    const loading = ref(true)

    const useParams = ref(params)

    // 点击搜索按钮时执行的函数
    const handleQuery = () => {
        pageNumber.value = 1 // 手动点击查询，要重置页码为1
        query()
    }

    // 手动点击重置按钮时执行该函数
    const handleReset = (resetData: any) => {
        console.log('handlereset');

        params.value = resetData
        pageNumber.value = 1
        pageSize.value = 10
        query()
    }


    // 查询函数，请求后端获取tableData数据，同时使用防抖
    const query = useDebounceFn(() => {
        loading.value = true
        getList({
            ...useParams.value,
            pageNumber: pageNumber.value,
            pageSize: pageSize.value,
        }).then((res) => {
            tableData.splice(0, tableData.length, ...res.data.content as [])
            total.value = res.data.total
        }).finally(() => {
            loading.value = false
        })
    }, 300)

    //监听
    watch(
        [pageNumber, pageSize],
        () => {
            // 监听到pageNumber或者pageSize变化，重新获取数据            
            query()
        }
    )

    query()

    return {
        params: useParams,
        tableData,
        pageNumber,
        pageSize,
        loading,
        total,
        handleQuery,
        handleReset,
    }
}

export function useDeleteList(DeleteList: (params: any) => Promise<ResultData>, handleQuery: () => void) {
    // 手动点击删除按钮
    const handleDelete = (id: number) => {
        DeleteList({
            id
        }).then(res => {
            ElMessage.success(res.msg)
            handleQuery()
        })
    }
    return {
        handleDelete
    }
}

export function useAddAndEditList(initFormData: any, AddList: (params: any) => Promise<ResultData>, handleQuery: () => void) {
    const showAddFlag = ref(false)

    // 新增/编辑弹窗的标题
    const addTitle = ref('新增用户')

    const formData = ref(initFormData)

    console.log(formData);


    // 手动点击新增
    const handleAdd = (data: any) => {
        addTitle.value = `新增用户`
        formData.value = data
        showAddFlag.value = true
    }
    const handleEdit = (data: any) => {
        addTitle.value = `编辑用户`
        formData.value = data
        showAddFlag.value = true
    }
    const handleCancel = () => {
        showAddFlag.value = false
    }
    const submit = (callback: () => void) => {
        showAddFlag.value = false
        callback()
    }
    return {
        showAddFlag, addTitle, formData,
        handleAdd, handleEdit, handleCancel, submit
    }
}