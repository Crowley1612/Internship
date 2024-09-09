<template>
    <div class="nav-bar col-md-2 text-white p-3">
      <div class="logo mb-3">
        <img src="/src/assets/download.png" alt="Logo" />
      </div>
      <nav class="navbar">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link
              :class="isActive('/Trang-chu') ? 'nav-link active-link' : 'nav-link'"
              to="/Trang-chu"
              exact-active-class="active-link"
            >
              <i class="bi bi-file-earmark-text"></i> Quản lý tài liệu
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/Quan-ly-danh-muc"
              exact-active-class="active-link"
            >
              <i class="bi bi-list"></i> Quản lý danh mục
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/Quan-ly-danh-ba"
              exact-active-class="active-link"
            >
              <i class="bi bi-person-lines-fill"></i> Danh bạ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/Cai-dat"
              exact-active-class="active-link"
            >
              <i class="bi bi-gear"></i> Cài đặt
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/Dang-nhap"
              exact-active-class="active-link"
            >
              <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    isActive(route) {
      // Check if the current route matches '/Trang-chu' or specific routes
      return (
        this.$route.path === route ||
        ['/Upload-file', '/Chinh-sua-van-ban', '/Them-nguoi', '/Thiet-lap-vung-ky', '/Xac-nhan'].includes(
          this.$route.path
        )
      );
    },
  },
};
</script>

<style scoped>
/* Navbar Styling */
.nav-bar {
    position: sticky;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
    background-color: #1E3A8A;
    padding-top: 20px;
    padding-left: 10px;
    padding-right: 10px;
}

.navbar {
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
}

.logo img {
    width: 80%;
    height: auto;
    margin: 0 auto;
    display: block;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.logo img:hover {
    transform: scale(1.1);
}

/* Navigation Link Styling */
.nav-link {
    color: #ffffff;
    font-size: 16px;
    padding: 12px 20px;
    margin: 8px 0;
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.nav-link i {
    margin-right: 15px;
}

.nav-link:hover {
    background-color: #2563EB;
    color: #ffffff;
    transform: scale(1.05);
}

.active-link {
    background-color: #2563EB;
    color: #ffffff;
    font-weight: bold;
}

.nav-item+.nav-item {
    margin-top: 10px;
}

/* Custom Scrollbar */
.nav-bar::-webkit-scrollbar {
    width: 8px;
}

.nav-bar::-webkit-scrollbar-thumb {
    background: #2563EB;
    border-radius: 4px;
}

.nav-bar::-webkit-scrollbar-thumb:hover {
    background: #1E3A8A;
}
</style>