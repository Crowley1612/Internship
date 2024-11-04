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
import axios from "axios"; // Import axios

export default {
  name: "User",
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sender: "Người gửi không xác định", // Khởi tạo giá trị mặc định cho sender
    };
  },
  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Chào buổi sáng,";
      if (hour < 18) return "Chào buổi chiều,";
      return "Chào buổi tối,";
    },
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get("http://localhost:3003/users");
        // Lấy username từ response, giả định rằng response.data là mảng các user
        if (response.data.length > 0) {
          this.sender = response.data[0].username; // Gán username của user đầu tiên vào sender
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    },
  },
  mounted() {
    this.fetchUserData(); // Gọi hàm fetchUserData khi component được gắn vào DOM
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
