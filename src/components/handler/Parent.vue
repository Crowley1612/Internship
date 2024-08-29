<template>
    <Step02 @signersSelected="handleSignersSelected" />
    <Step03 :selectedSigners="selectedSigners" />
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Step02 from './Step02.vue';
  import Step03 from './Step03.vue';
  
  const selectedSigners = ref([]);
  
  const handleSignersSelected = (signers) => {
    selectedSigners.value = signers;
  };
  </script>