import { create } from "zustand";

const useCrmStore = create((set) => ({
  sidebarOpen: true,

  selectedLead: null,

  search: "",

  setSidebarOpen: (sidebarOpen) =>
    set({
      sidebarOpen,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSelectedLead: (lead) =>
    set({
      selectedLead: lead,
    }),

  setSearch: (search) =>
    set({
      search,
    }),
}));

export default useCrmStore;
