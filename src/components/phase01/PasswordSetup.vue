<template>
    <div class="background">
        <div class="form-container">
            <h2>Tạo mật khẩu mới</h2>

            <div class="form-group">
                <label for="email">Tài khoản (Email):</label>
                <input type="email" id="email" value="" disabled />
            </div>

            <div class="form-group">
                <label for="new-password">
                    <span class="required">*</span> Mật khẩu đăng nhập
                </label>
                <input type="password" id="new-password" v-model="password" placeholder="Nhập mật khẩu mới" />
            </div>

            <div class="form-group">
                <label for="confirm-password">
                    <span class="required">*</span> Xác nhận mật khẩu
                </label>
                <input type="password" id="confirm-password" v-model="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới" />
            </div>

            <button class="submit-button" :disabled="!isFormValid">Tiếp tục</button>

            <div class="password-requirements">
                <p>Mật khẩu yêu cầu:</p>
                <ul>
                    <li :class="{ valid: isMinLength }">Tối thiểu 6 ký tự</li>
                    <li :class="{ valid: hasUppercase }">Ít nhất một chữ cái viết hoa</li>
                    <li :class="{ valid: hasSpecialChar }">Ít nhất một ký tự đặc biệt</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            password: '',
            confirmPassword: '',
        };
    },
    computed: {
        isMinLength() {
            return this.password.length >= 6;
        },
        hasUppercase() {
            return /[A-Z]/.test(this.password);
        },
        hasSpecialChar() {
            return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
        },
        isPasswordMatch() {
            return this.password === this.confirmPassword;
        },
        isFormValid() {
            return this.isMinLength && this.hasUppercase && this.hasSpecialChar && this.isPasswordMatch;
        },
    },
};
</script>
<style scoped>
.background {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: radial-gradient(circle, #6da6f5, #4689f5, #1b50c5);
}

.form-container {
    background-color: #2b2e37;
    padding: 30px;
    width: 400px;
    border-radius: 8px;
    color: #fff;
    text-align: center;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #fff;
}

.form-group {
    margin-bottom: 15px;
    text-align: left;
}

label {
    font-size: 14px;
    color: #b0b3c5;
    display: block;
    margin-bottom: 5px;
}

.required {
    color: #f00;
}

input[type="email"],
input[type="password"] {
    width: 100%;
    padding: 10px;
    background-color: #333;
    border: 1px solid #555;
    color: #fff;
    border-radius: 4px;
    outline: none;
}

input[type="email"]:disabled {
    background-color: #444;
}

input::placeholder {
    color: #888;
}

.submit-button {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: #aaa;
    border: none;
    border-radius: 4px;
    cursor: not-allowed;
    margin-top: 10px;
}

.submit-button:enabled {
    background-color: #4689f5;
    color: #fff;
    cursor: pointer;
}

.password-requirements {
    text-align: left;
    font-size: 12px;
    color: #888;
    margin-top: 20px;
}

.password-requirements ul {
    padding-left: 20px;
}

.password-requirements li {
    margin-bottom: 5px;
}

.password-requirements .valid {
    color: #4caf50;
    /* Green color for valid requirements */
    font-weight: bold;
}
</style>