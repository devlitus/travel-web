import {
  formCache,
  debounce,
} from "../../utils/clientCache";

export interface FormData {
  destination?: string;
  budget?: string;
  duration?: string;
  travelStyle?: string;
  accommodation?: string;
  season?: string;
  activities?: string[];
}

export class FormHandler {
  private form: HTMLFormElement;
  private activityButtons: NodeListOf<HTMLButtonElement>;

  constructor(form: HTMLFormElement, activityButtons: NodeListOf<HTMLButtonElement>) {
    this.form = form;
    this.activityButtons = activityButtons;
  }

  loadFromCache(): void {
    const cachedForm = formCache.get("last-form-data") as FormData | null;
    if (!cachedForm) return;

    // Restaurar campos del formulario
    Object.entries(cachedForm).forEach(([key, value]) => {
      if (key === "activities") return;

      const field = this.form.querySelector(`[name="${key}"]`) as
        | HTMLInputElement
        | HTMLSelectElement;
      if (field) {
        field.value = value as string;
      }
    });

    // Restaurar actividades seleccionadas
    if (cachedForm.activities && Array.isArray(cachedForm.activities)) {
      this.activityButtons.forEach((button) => {
        const buttonText = button.querySelector("span")?.textContent?.trim();
        if (
          buttonText &&
          cachedForm.activities &&
          cachedForm.activities.includes(buttonText)
        ) {
          button.classList.add("active");
        }
      });
    }
  }

  saveToCache = debounce(() => {
    const data = new FormData(this.form);
    const formData = Object.fromEntries(data);

    const selectedActivities = Array.from(this.activityButtons)
      .filter((button) => button.classList.contains("active"))
      .map((button) => button.querySelector("span")?.textContent?.trim())
      .filter(Boolean) as string[];

    const completeFormData: FormData = {
      ...formData,
      activities: selectedActivities,
    };

    formCache.set("last-form-data", completeFormData, 24 * 60 * 60 * 1000);
  }, 1000);

  getFormData(): FormData {
    const data = new FormData(this.form);
    const formData = Object.fromEntries(data);

    const selectedActivities = Array.from(this.activityButtons)
      .filter((button) => button.classList.contains("active"))
      .map((button) => button.querySelector("span")?.textContent?.trim())
      .filter(Boolean) as string[];

    return {
      ...formData,
      activities: selectedActivities,
    };
  }
}
