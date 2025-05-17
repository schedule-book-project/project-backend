import axios from "axios";
import { ApiErrorModel } from '../../../../shared/models/error.model';
import envVars from '../../../../shared/config/env.validation';
import logger from '../../../../shared/logger/logger';

// Use envVars instead of process.env directly
const apiKey = envVars.HERE_API_KEY;

// 📌 Get user location via IP (Option 2)
export const getUserLocationByIP = async (ip: string) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data.status !== 'success') {
          throw new ApiErrorModel(400, 'Could not determine location');
        }

        return {
            lat: response.data.lat,
            lng: response.data.lon,
            city: response.data.city,
            country: response.data.country
        };
    } catch (error) {
        console.error("IP-based Location Error:", error);
        return null;
    }
};

// 📌 Convert Address to Lat/Lng (Option 3)
export const getCoordinatesFromAddress = async (street: string, city: string, state: string, country: string, postalCode?: string, language: string = "en") => {
    try {
      if (!apiKey) throw new ApiErrorModel(500, "HERE API key is missing");
  
      let addressParts = [street, city];
      if (postalCode) addressParts.unshift(postalCode);
      if (state) addressParts.push(state);
      if (country) addressParts.push(country);
  
      let address = addressParts.filter(Boolean).join(", ");
      console.log("Geocoding address:", address);
  
      let apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}&lang=${language}`;
      if (country) apiUrl += `&in=countryCode:${country}`;
  
      let response = await axios.get(apiUrl);
      console.log("HERE Geocode response:", response.data);
  
      if (!response.data.items || response.data.items.length === 0) {
        console.log("No exact match, falling back to city-level");
        // Refactored nested template literal
        address = country ? `${city}, ${country}` : city;
        apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}&lang=${language}`;
        if (country) apiUrl += `&in=countryCode:${country}`;
        response = await axios.get(apiUrl);
  
        if (!response.data.items || response.data.items.length === 0) {
          throw new ApiErrorModel(404, "Address not found, even at city level");
        }
      }
  
      const { lat, lng } = response.data.items[0].position;
  
      return {
        lat: lat,
        lng: lng,
        displayName: response.data.items[0].address.label,
      };
    } catch (error) {
      console.error("Address Geocoding Error:", error);
      logger.error('Error in locations service:', { error });
      throw error;
    }
  };

// 📌 Search Nearby Places using OpenStreetMap (For any method)
export const searchNearbyPlaces = async ( query: string, lat: number, lng: number, language: string = "en") => {
    try {
      const apiUrl = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=${encodeURIComponent(query)}&limit=10&lang=${language}&apiKey=${apiKey}`;
  
      const response = await axios.get(apiUrl);
      console.log("HERE Discover response:", response.data);
  
      if (!response.data.items) return [];
  
      return response.data.items.map((place: any) => ({
        name: place.title,
        lat: place.position.lat,
        lng: place.position.lng,
        type: place.categories?.[0]?.name || place.address?.houseNumber ? "address" : "place"
      }));
    } catch (error) {
      console.error("Error fetching places:", error);
      logger.error('Error in locations service:', { error });
      return [];
    }
  };
