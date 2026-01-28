<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <div class="flex w-full h-screen overflow-hidden relative">
      <!-- Mobile Backdrop -->
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
      ></div>

      <!-- Sidebar Container -->
      <div
        class="fixed inset-y-0 left-0 z-30 w-[260px] bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 shrink-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <SideBar class="w-full h-full" @close="sidebarOpen = false" />
      </div>

      <div class="flex-1 min-w-0 h-full flex flex-col relative w-full">
        <AdminNavigation
          :title="pageTitle"
          :name="userName"
          @search-change="searchText = $event"
          @toggle-sidebar="toggleSidebar"
        />

        <div class="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div class="max-w-7xl mx-auto w-full">
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" :globalSearch="searchText" />
              </transition>
            </RouterView>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SideBar from "@/components/Admin/SideBar.vue";
import AdminNavigation from "@/components/Admin/AdminNavigation.vue";

export default defineComponent({
  name: "AdminLayout",
  components: { SideBar, AdminNavigation },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const searchText = ref("");
    const sidebarOpen = ref(false);

    // Get Real Name
    const userName = computed(() => {
      const u = authStore.user;
      if (!u) return "Admin";
      return `${u.firstName} ${u.lastName}`;
    });

    // Dynamic Title
    const pageTitle = computed(() => {
      const path = route.path;
      if (path.includes("dashboard")) return "Dashboard";
      if (path.includes("products")) return "Inventory";
      if (path.includes("orders")) return "Orders";
      if (path.includes("customers")) return "Customers";
      if (path.includes("promotions")) return "Promotions";
      return "Admin";
    });

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    return { searchText, userName, pageTitle, sidebarOpen, toggleSidebar };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
