import { create } from 'zustand';

type State = {
  id: string;
  setId: (id: string) => void;
};

const useConferenceStore = create<State>((set) => ({
  id: '',
  setId: (id) => set({ id })
}));

export default useConferenceStore;
