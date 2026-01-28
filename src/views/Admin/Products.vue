<template>
  <div class="w-full min-h-screen">

    <!-- Header -->
    <AdminPageHeader title="Inventory" description="Manage your products, stock levels, and pricing.">
      <template #actions>
        <button @click="openModal('create')" class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition transform hover:-translate-y-0.5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Product
        </button>
      </template>
    </AdminPageHeader>

    <!-- Filters -->
    <AdminFilterBar
      v-model="filters.search"
      placeholder="Search products..."
      :show-reset="activeFiltersCount > 0"
      @reset="resetFilters"
    >
      <select v-model="filters.category" class="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer">
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Toys">Toys</option>
        <option value="Furniture">Furniture</option>
        <option value="Accessories">Accessories</option>
        <option value="Treats">Treats</option>
      </select>

      <select v-model="filters.stock" class="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer">
        <option value="all">All Stock</option>
        <option value="low">Low Stock (&le; 5)</option>
        <option value="out">Out of Stock</option>
      </select>
    </AdminFilterBar>

    <!-- Content -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="n in 8" :key="n" class="bg-white rounded-[32px] p-4 h-[400px] border border-slate-100 shadow-sm animate-pulse">
        <div class="bg-slate-100 h-48 w-full rounded-2xl mb-4"></div>
        <div class="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      <h3 class="text-lg font-black text-slate-900">No Products Found</h3>
      <p class="text-slate-500 text-sm mt-1">Try adjusting your filters or search query.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
      <AdminProductCard
        v-for="product in filteredProducts"
        :key="product._id"
        :product="product"
        @edit="openModal('edit', product)"
        @delete="confirmDelete(product)"
      />
    </div>

    <!-- Product Modal -->
    <ProductFormModal
      :is-open="modal.open"
      :is-editing="modal.mode === 'edit'"
      :is-saving="isSaving"
      :form="form"
      :preview-image="previewImage"
      @close="closeModal"
      @save="saveProduct"
      @select-file="handleFileSelect"
      @remove-image="removeImage"
    />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product'; // Import Store
import { useToast } from 'vue-toastification';

// Components
import AdminProductCard from '@/components/Admin/AdminProductCard.vue';
import AdminPageHeader from '@/components/Admin/Shared/AdminPageHeader.vue';
import AdminFilterBar from '@/components/Admin/Shared/AdminFilterBar.vue';
import ProductFormModal from '@/components/Admin/Products/ProductFormModal.vue';

export default defineComponent({
  name: "Products",
  components: {
    AdminProductCard,
    AdminPageHeader,
    AdminFilterBar,
    ProductFormModal
  },
  props: ['globalSearch'],
  setup(props) {
    const authStore = useAuthStore();
    const productStore = useProductStore(); // Init Store
    const toast = useToast();

    const isSaving = ref(false); // Keep local for button state

    // --- UPLOAD STATE ---
    const previewImage = ref<string | undefined>(undefined);
    const selectedFile = ref<File | null>(null);

    // --- FILTER STATE ---
    const filters = reactive({
      search: '',
      category: '',
      stock: 'all'
    });

    // Sync search
    watch(() => props.globalSearch, (newVal) => {
      if (newVal !== undefined) filters.search = newVal;
    });

    const modal = reactive({ open: false, mode: 'create', id: '' });

    const form = reactive({
      name: '',
      price: 0,
      category: 'Food',
      stockQuantity: 0,
      description: '',
      brand: 'PetStore+'
    });

    // --- SEARCH / FILTER LOGIC ---
    const filteredProducts = computed(() => {
      return productStore.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory = filters.category ? p.category === filters.category : true;

        // Check different stock fields
        const currentStock = p.stockQuantity !== undefined ? p.stockQuantity : (p.stock || 0);

        let matchesStock = true;
        if (filters.stock === 'low') matchesStock = currentStock <= 5;
        if (filters.stock === 'out') matchesStock = currentStock === 0;

        return matchesSearch && matchesCategory && matchesStock;
      });
    });

    const activeFiltersCount = computed(() => {
      let count = 0;
      if (filters.search) count++;
      if (filters.category) count++;
      if (filters.stock !== 'all') count++;
      return count;
    });

    // --- LIFECYCLE ---
    const route = useRoute();
    onMounted(() => {
      productStore.fetchProducts();
      if (route.query.filter === 'low_stock') {
        filters.stock = 'low';
      }
    });

    const resetFilters = () => {
      filters.search = '';
      filters.category = '';
      filters.stock = 'all';
    };

    // --- MODAL & FORM ---
    const openModal = (mode: string, product: any = null) => {
      modal.mode = mode;
      modal.open = true;
      if (mode === 'edit' && product) {
        modal.id = product._id;
        form.name = product.name;
        form.price = product.price;
        form.category = product.category;
        form.stockQuantity = product.stockQuantity !== undefined ? product.stockQuantity : (product.stock || 0);
        form.description = product.description;
        previewImage.value = product.imageUrl || product.image;
      } else {
        Object.assign(form, {
          name: '',
          price: 0,
          category: 'Food',
          stockQuantity: 0,
          description: ''
        });
        previewImage.value = undefined;
        selectedFile.value = null;
      }
    };

    const closeModal = () => { modal.open = false; };

    const handleFileSelect = (file: File) => {
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => { previewImage.value = e.target?.result as string; };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      selectedFile.value = null;
      previewImage.value = undefined;
    };

    const saveProduct = async (updatedData: any) => {
      isSaving.value = true;
      try {
        const formData = new FormData();
        formData.append('name', updatedData.name);
        formData.append('price', String(updatedData.price));
        formData.append('category', updatedData.category);
        formData.append('stockQuantity', String(updatedData.stockQuantity));
        formData.append('description', updatedData.description);
        formData.append('brand', 'PetStore+');

        if (selectedFile.value) {
          formData.append('image', selectedFile.value);
        }

        // Config is handled in store now

        if (modal.mode === 'create') {
          await productStore.createProduct(formData);
          toast.success("Product Created!");
        } else {
          await productStore.updateProduct(modal.id, formData);
          toast.success("Product Updated!");
        }

        closeModal();
        // fetchProducts(); // Store updates optimistically or we can re-fetch if we want strict sync
        // productStore.createProduct already pushes to list

      } catch (error: any) {
        console.error(error);
        toast.error("Failed to save product. " + (error.response?.data?.message || ''));
      } finally {
        isSaving.value = false;
      }
    };

    const confirmDelete = async (product: any) => {
      if(confirm(`Are you sure you want to delete ${product.name}?`)) {
        try {
          await productStore.deleteProduct(product._id);
          toast.success("Product Deleted");
        } catch(e) { toast.error("Delete Failed"); }
      }
    }

    return {
      productStore, // Expose store
      isLoading: computed(() => productStore.isLoading), // Map loading
      isSaving, modal, form, filters, filteredProducts, activeFiltersCount,
      openModal, closeModal, saveProduct, confirmDelete, resetFilters,
      handleFileSelect, previewImage, removeImage
    };
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>
