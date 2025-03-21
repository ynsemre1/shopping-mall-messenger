export interface GooglePlace {
    place_id: string;
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }