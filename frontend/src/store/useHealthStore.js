import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHealthStore = create(
  persist(
    (set) => ({
      // --- Language State ---
      language: 'en', // Default to English
      setLanguage: (lang) => set({ language: lang }),

      // --- Patient Data State ---
      // This stores the data while the doctor is filling the form
      currentPatient: {
        name: '',
        age: '',
        gender: '',
        weight: '',
        vitals: {
          temp: '',
          bp: '',
          hr: '',
          spo2: '',
        },
        symptoms: '',
      },

      // Action to update patient demographics
      setPatientData: (data) => 
        set((state) => ({
          currentPatient: { ...state.currentPatient, ...data }
        })),

      // Action to update specific vitals
      setVitals: (vitalsData) =>
        set((state) => ({
          currentPatient: {
            ...state.currentPatient,
            vitals: { ...state.currentPatient.vitals, ...vitalsData }
          }
        })),

      // Action to reset form after a successful diagnosis
      resetForm: () => set({
        currentPatient: {
          name: '', age: '', gender: '', weight: '',
          vitals: { temp: '', bp: '', hr: '', spo2: '' },
          symptoms: '',
        }
      }),
    }),
    {
      name: 'health-app-storage', // Unique name for LocalStorage
      // This 'persist' block automatically saves your data to the browser
      // so if the doctor refreshes the page or loses internet, the data stays.
    }
  )
);