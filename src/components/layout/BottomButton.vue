<template>
  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <router-link class="nav-link" to="/Upload-File" exact-active-class="active-link">
      <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
    </router-link>
    <router-link class="nav-link" to="/Them-nguoi" exact-active-class="active-link">
      <button class="btn btn-primary" type="button" @click="handleNext">Tiếp tục</button>
    </router-link>
  </div>
</template>

<script>
import { EventBus } from './eventBus';
export default {
  name: 'ButtonGroup',
  methods: {
    handleNext() {
      EventBus.$emit('stepChange', 'next');
    },
    handleBack() {
      EventBus.$emit('stepChange', 'back');
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
}
</style>