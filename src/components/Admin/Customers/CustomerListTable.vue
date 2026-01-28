<template>
  <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
    <div v-if="loading" class="p-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else-if="customers.length === 0" class="p-12 text-center text-slate-500 font-medium">
      No customers found matching your search.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <th class="py-4 px-6">User</th>
            <th class="py-4 px-6">Email</th>
            <th class="py-4 px-6">Role</th>
            <th class="py-4 px-6">Status</th>
            <th class="py-4 px-6">Joined</th>
            <th class="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="c in customers" :key="c._id" class="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#CBDAAF] text-slate-800 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                  {{ c.firstName?.[0] || '?' }}
                </div>
                <span class="font-bold text-slate-900">{{ c.firstName }} {{ c.lastName }}</span>
              </div>
            </td>
            <td class="py-4 px-6 text-slate-600 font-medium">{{ c.email }}</td>
            <td class="py-4 px-6">
              <span class="px-3 py-1 rounded-full text-xs font-bold border capitalize"
                :class="c.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'">
                {{ c.role }}
              </span>
            </td>
            <td class="py-4 px-6">
              <span class="px-3 py-1 rounded-full text-xs font-bold border"
                :class="c.isBlocked ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'">
                {{ c.isBlocked ? 'Blocked' : 'Active' }}
              </span>
            </td>
            <td class="py-4 px-6 text-slate-500 font-medium">{{ formatDate(c.createdAt) }}</td>
            <td class="py-4 px-6 text-right">
              <div class="flex gap-2 justify-end">
                <button 
                  @click="$emit('open-details', c)"
                  class="text-slate-500 hover:text-slate-700 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition"
                >
                  Details
                </button>
                <button 
                  v-if="c.role !== 'admin'"
                  @click="$emit('toggle-block', c)"
                  class="font-bold text-xs px-3 py-1.5 rounded-lg border transition"
                  :class="c.isBlocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'"
                >
                  {{ c.isBlocked ? 'Unblock' : 'Block' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CustomerListTable',
  props: {
    customers: { type: Array as () => any[], required: true },
    loading: { type: Boolean, default: false }
  },
  emits: ['open-details', 'toggle-block'],
  setup() {
    const formatDate = (iso: string) => {
      if (!iso) return '-';
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return { formatDate };
  }
});
</script>
