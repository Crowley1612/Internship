<template>
  <div class="step-container">
    <a-steps :current="currentStep" :items="items" class="step-wizard"></a-steps>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      items: [
        { title: "Tải lên tài liệu", href: "/Chinh-sua-van-ban" },
        { title: "Thiết lập người nhận", href: "/Them-nguoi" },
        { title: "Thiết lập vùng ký", href: "/Thiet-lap-vung-ky" },
        { title: "Hoàn tất và xác nhận", href: "/Xac-nhan" },
      ],
      currentStep: 0,
    };
  },
  methods: {
    next() {
      if (this.currentStep < this.items.length - 1) {
        this.currentStep++;
        this.$router.push(this.items[this.currentStep].href);
      }
    },
    prev() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.$router.push(this.items[this.currentStep].href);
      }
    },
    finish() {
      message.success("Processing complete!");
    },
  },
  watch: {
    "$route.path": {
      handler(newPath) {
        const itemIndex = this.items.findIndex((item) => item.href === newPath);
        if (itemIndex !== -1) {
          this.currentStep = itemIndex;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-wizard {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
}

.nav-button {
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-button[type="default"] {
  background-color: #e9ecef;
  color: #495057;
}

.nav-button[type="primary"] {
  background-color: #007bff;
  color: #ffffff;
}

.nav-button[type="success"] {
  background-color: #28a745;
  color: #ffffff;
}

.nav-button:hover {
  opacity: 0.85;
}

[data-theme="dark"] .step-container {
  background-color: #1f1f1f;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .steps-content {
  background-color: #2f2f2f;
  color: #e9ecef;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .nav-button[type="default"] {
  background-color: #6c757d;
  color: #ffffff;
}

[data-theme="dark"] .nav-button[type="primary"] {
  background-color: #007bff;
  color: #ffffff;
}

[data-theme="dark"] .nav-button[type="success"] {
  background-color: #28a745;
  color: #ffffff;
}
</style>