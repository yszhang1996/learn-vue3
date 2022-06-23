<template>
    <div>
        <button @click="shuffle">shuffle</button>
        <div class="sudoku-container">
            <transition-group move-class="shuffle-animation">
                <div class="cell" v-for="(item) in list" :key="item.id">{{item.number}}</div>
            </transition-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import _ from 'lodash'

let list = ref(Array.apply(null, { length: 81 } as number[]).map((_, index) => {
    return {
        id: index,
        number: (index % 9) + 1
    }
}))

console.log(list.value);

const shuffle = ()=>{
    list.value = _.shuffle(list.value)
}

</script>

<style lang="scss">

.sudoku-container{
    width:245px;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
}

.cell{
    width:25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid black;
}

.shuffle-animation{
    transition: all 1s;
}

</style>