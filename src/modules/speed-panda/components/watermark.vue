<template lang="html">
    <div class="page-watermark">
        极速熊猫，诗和远方
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    methods: {
        
    },
    watch: {
        
    },
};
</script>

<style lang="scss" scoped>
.page-watermark {
    background: #F8F8F8;
    padding: 24px 0;
    text-align: center;
    font-size: 12px;
    color: #BFBFBF;
    letter-spacing: -0.24px;

    &:before {
        content: '';
        position: relative;
        height: 1px; 
        width: 32px;
        background-color: #BFBFBF;
        display: inline-block;
        top: -4px;
        right: 4px;
    }
    &:after {
        content: '';
        position: relative;
        height: 1px; 
        width: 32px;
        background-color: #BFBFBF;
        display: inline-block;
        top: -4px;
        left: 4px;
    }

}
</style>
