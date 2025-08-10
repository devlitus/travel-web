import { searchCache, hashString } from "../../utils/clientCache";

export class SearchHandler {
  checkCache(formData: any): any | null {
    const searchKey = hashString(JSON.stringify(formData));
    return searchCache.get(`search-${searchKey}`);
  }

  saveToCache(formData: any, result: any): void {
    const searchKey = hashString(JSON.stringify(formData));
    searchCache.set(`search-${searchKey}`, result, 30 * 60 * 1000);
  }

  async submitSearch(formData: any): Promise<boolean> {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        this.saveToCache(formData, result);
        return true;
      } else {
        console.error("Error en la búsqueda:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  buildRedirectUrl(destination: string, formData: any, activities: string[]): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(formData)) {
      if (value && key !== "destination") {
        params.append(key, value as string);
      }
    }

    activities.forEach((activity) => {
      if (activity) {
        params.append("activities", activity);
      }
    });

    return `/itinerary/${encodeURIComponent(destination)}?${params.toString()}`;
  }
}
