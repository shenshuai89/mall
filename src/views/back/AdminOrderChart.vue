<template>
    <div class="chart">
        <ve-line :data="chartData1" :colors="colors" width="800px" :settings="chartSettings"></ve-line>
        <ve-histogram :data="chartData2" width="800px" :colors="colors2" :settings="chart2Settings"></ve-histogram>
        <ve-map :data="chartData3"></ve-map>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">请先登录，否则无法使用此功能！</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="closeModal">关   闭</a>
            </div>
        </modal>
    </div>
</template>
  
<script>
    import axios from 'axios'
    import Modal from '@/components/Modal.vue'
    export default {
    name:"adminOrderChart",
    data(){
        this.chartSettings = {
            metrics: ['访问用户', '下单用户'],
            dimension: ['日期']
        }
        return {
            mdShow:false,
            colors:['#c23531','#2f4554', '#61a0a8',
                '#d48265', '#91c7ae','#749f83', 
                '#ca8622', '#bda29a','#6e7074',
            '#546570', '#c4ccd3'],
            chartData1: {
                columns: ['日期', '访问用户', '下单用户', '下单率'],
                rows: [
                    { '日期': '1月', '访问用户': 1393, '下单用户': 1093},
                    { '日期': '2月', '访问用户': 3530, '下单用户': 3230},
                    { '日期': '3月', '访问用户': 2923, '下单用户': 2623},
                    { '日期': '4月', '访问用户': 1723, '下单用户': 1423},
                    { '日期': '5月', '访问用户': 3192, '下单用户': 2492 },
                    { '日期': '6月', '访问用户': 4193, '下单用户': 3293},
                    { '日期': '7月', '访问用户': 1393, '下单用户': 1093},
                    { '日期': '8月', '访问用户': 3530, '下单用户': 3230},
                    { '日期': '9月', '访问用户': 2923, '下单用户': 2623},
                    { '日期': '10月', '访问用户': 1723, '下单用户': 1423},
                    { '日期': '11月', '访问用户': 4593, '下单用户': 4193 },
                    { '日期': '12月', '访问用户': 3530, '下单用户': 3492}
                ]
            },
            chartData2: {
                columns: ['产品', '产品销量', '热卖比重'],
                rows: [
                    { '产品': '插线板', '产品销量': 1393, '热卖比重': 0.32 },
                    { '产品': '小钢炮音箱', '产品销量': 3530, '热卖比重': 0.26 },
                    { '产品': '小米6X', '产品销量': 2923, '热卖比重': 0.86 },
                    { '产品': '无线蓝牙耳麦', '产品销量': 1723, '热卖比重': 0.49 },
                    { '产品': '小米净水器', '产品销量': 3792, '热卖比重': 0.23 },
                    { '产品': 'IPhoneX', '产品销量': 4593, '热卖比重': 0.78 }
                ]
            },
            colors2:[
                '#d48265', '#bda29a'
            ],
            chart2Settings:{
                axisSite: { right: ['热卖比重'] },
                yAxisType: ['KMB', 'percent'],
                yAxisName: ['数值', '比率']
            },
            chartData3: {
                columns: ['位置', '下单数'],
                rows: [
                    { '位置': '吉林', '下单数': 123},
                    { '位置': '内蒙古', '下单数': 223},
                    { '位置': '黑龙江', '下单数': 923},
                    { '位置': '山西', '下单数': 523},
                    { '位置': '四川', '下单数': 723},
                    { '位置': '重庆', '下单数': 323},
                    { '位置': '云南', '下单数': 513},
                    { '位置': '安徽', '下单数': 1523},
                    { '位置': '湖南', '下单数': 2523},
                    { '位置': '广东', '下单数': 3523},
                    { '位置': '广西', '下单数': 1523},
                    { '位置': '河南', '下单数': 2023 },
                    { '位置': '北京', '下单数': 1223 },
                    { '位置': '上海', '下单数': 2123 },
                    { '位置': '浙江', '下单数': 4123 }
                ]
            }
        }
    },
    mounted() {
        this.init();
    },
    components:{
        Modal
    },
    methods: {
        init(){
            axios.get("/users/checkLogin").then((response)=>{
                let res = response.data;
                if(res.status == 0){

                }else{
                    this.mdShow = true
                }
            })
        },
        closeModal(){
            this.mdShow = false;
        }
    }
}
</script>
<style>
    .chart{
        margin: 80px 0 0 20px;
    }
</style>