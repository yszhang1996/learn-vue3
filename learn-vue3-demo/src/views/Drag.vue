<template>
    <div>
        <div class="text">
            <span>通过自定义指令的方式实现拖拽</span><br />
            <span>试着拖拽黄色小球</span>
        </div>
            <div class="drag-container" v-move>

            </div>
    </div>
</template>

<script setup lang="ts">
import { Directive, DirectiveBinding } from 'vue';
const vMove: Directive<any, void> = (el: HTMLElement, bingding: DirectiveBinding) => {
    let moveElement: HTMLDivElement = el as HTMLDivElement
    console.log(moveElement);

    const mouseDown = (e: MouseEvent) => {
        console.log(e);

        let X = e.clientX - el.offsetLeft
        let Y = e.clientY - el.offsetTop
        const move = (e: MouseEvent) => {
            el.style.left = e.clientX - X + 'px'
            el.style.top = e.clientY - Y + 'px'
            console.log(el.style.left, el.style.top);
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move)
        })
    }
    moveElement.addEventListener('mousedown', mouseDown)
}
</script>

<style scoped>
.drag-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    /* margin: 0 auto; */
    cursor: pointer;
    background-color: goldenrod;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.text{
 user-select: none;
}
</style>