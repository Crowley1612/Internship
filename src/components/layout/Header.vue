<template>
  <div class="user">
    <b>
      <p class="first-sentence">{{ greeting }} {{ user.email }}</p>
      <p class="second-sentence">
        Phương thức ký: Remote Sign || Mã bút ký: 400196
      </p>
    </b>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import axios from "axios"; // Import axios
import { XMLParser } from 'fast-xml-parser';
import { useStore } from 'vuex';
const store = useStore();

// Props
defineProps({
  documents: {
    type: Array,
    default: () => [],
  },
});
const user = reactive({
    username: '',
});

// Computed property
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng,";
  if (hour < 18) return "Chào buổi chiều,";
  return "Chào buổi tối,";
});
const convertXmlToJson = (xmlData) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    return parser.parse(xmlData);
};
// Methods
const fetchUserData = async () => {
  const username = store.state.username;
  try {
    const soapRequest = `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <Laythongtintaikhoan xmlns="http://tempuri.org/">
            <Email>${username}</Email>
          </Laythongtintaikhoan>
        </soap:Body>
      </soap:Envelope>`;

    const response = await axios({
      baseURL: `https://apiedoc.nacencomm.vn/apiEdoc.asmx`,
      method: "post",
      headers: {
        "Content-Type": "text/xml", // Change this line
      },
      data: soapRequest,
    });

    const dataJson = convertXmlToJson(response.data);
    const userInfo =
      dataJson?.['soap:Envelope']?.['soap:Body']?.['LaythongtintaikhoanResponse']
      ?.['LaythongtintaikhoanResult'];
      console.log('User information:', userInfo);
    if (userInfo) {

      user.email = userInfo.Email || '';
      console.log('User information loaded:', user);
    } else {
      console.warn('No user information found in response.');
    }
  } catch (error) {
    console.error('Error loading user information:', error);
  }
};

onMounted(() => {
  fetchUserData(); 
});
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