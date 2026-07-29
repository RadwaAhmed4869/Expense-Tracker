const STORAGE_KEY = "expense-tracker:tour-seen";

export const loadTourSeen = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Failed to load tour-seen flag from localStorage:", error);
    return false;
  }
};

export const saveTourSeen = () => {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch (error) {
    console.warn("Failed to save tour-seen flag to localStorage:", error);
  }
};
