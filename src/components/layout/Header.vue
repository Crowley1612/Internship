<template>
  <div class="user">
    <b>
      <p class="first-sentence">{{ greeting }} {{ sender }}</p>
      <p class="second-sentence">
        Phương thức ký: Remote Sign || Mã bút ký: 400196
      </p>
    </b>
  </div>
</template>

<script>
export default {
  name: "User",
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Chào buổi sáng,";
      if (hour < 18) return "Chào buổi chiều,";
      return "Chào buổi tối,";
    },
    sender() {
      return this.documents.length > 1
        ? this.documents[1].nguoiGui
        : "Người gửi không xác định";
    },
  },
};
</script>
<style scoped>
.user {
  margin-top: auto;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
  position: sticky;
}

.first-sentence {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1e3a8a;
}

.second-sentence {
  font-size: 1rem;
  color: #1e3a8a;
}
</style>
