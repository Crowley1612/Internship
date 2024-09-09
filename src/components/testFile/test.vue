<template>
  <a-card>
    <div class="info-header">
      <h2>Thông tin cơ bản</h2>
      <a-button type="text" class="edit-button" @click="onEdit">Thay đổi thông tin</a-button>
    </div>
    <div class="info-content">
      <div class="info-item">
        <span class="label">Họ và tên:</span>
        <span class="value">Đỗ Thị Thu Hằng 1</span>
      </div>
      <div class="info-item">
        <span class="label">Mã số thuế:</span>
        <span class="value">0103930279</span>
      </div>
      <div class="info-item">
        <span class="label">Công ty:</span>
        <span class="value">Nacencomm SCT</span>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'UserInfoCard',
  methods: {
    onEdit() {
      // Handle edit action
      console.log('Edit button clicked');
    }
  }
};
</script>

<style scoped>
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.edit-button {
  color: #1890ff;
}

.info-content {
  margin-top: 10px;
}

.info-item {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.value {
  margin-left: 10px;
}
</style>