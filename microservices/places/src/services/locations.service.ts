import axios from 'axios';
import { ApiErrorModel } from '../../../../shared/models/error.model';
import envVars from '../../../../shared/config/env.validation';
import logger from '../../../../shared/logger/logger';

// Use envVars instead of process.env directly
const apiKey = envVars.HERE_API_KEY;

// Interface for the items from HERE Discover API
interface HerePlaceItem {
  title: string;
  position: {
    lat: number;
    lng: number;
  };
  categories?: { name: string }[];
  address?: { houseNumber?: string }; // Made houseNumber optional as its existence is checked
}

interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

// 📌 Get user location via IP (Option 2)
export const getUserLocationByIP = async (
  ip: string,
): Promise<UserLocation | null> => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    if (response.data.status !== 'success') {
      throw new ApiErrorModel(400, 'Could not determine location');
    }

    return {
      lat: response.data.lat,
      lng: response.data.lon,
      city: response.data.city,
      country: response.data.country,
    };
  } catch (error) {
    logger.error('IP-based Location Error:', { error });
    return null;
  }
};

// 📌 Convert Address to Lat/Lng (Option 3)
export const getCoordinatesFromAddress = async (
  street: string,
  city: string,
  state: string,
  country: string,
  postalCode?: string,
  language: string = 'en',
): Promise<{ lat: number; lng: number; displayName: string }> => {
  try {
    if (!apiKey) {
      throw new ApiErrorModel(500, 'HERE API key is missing');
    }

    const addressParts = [street, city];
    if (postalCode) {
      addressParts.unshift(postalCode);
    }
    if (state) {
      addressParts.push(state);
    }
    if (country) {
      addressParts.push(country);
    }

    let address = addressParts.filter(Boolean).join(', ');

    let apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}&lang=${language}`;
    if (country) {
      apiUrl += `&in=countryCode:${country}`;
    }

    let response = await axios.get(apiUrl);

    if (!response.data.items || response.data.items.length === 0) {
      // Refactored nested template literal
      address = country ? `${city}, ${country}` : city;
      apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}&lang=${language}`;
      if (country) {
        apiUrl += `&in=countryCode:${country}`;
      }
      response = await axios.get(apiUrl);

      if (!response.data.items || response.data.items.length === 0) {
        throw new ApiErrorModel(404, 'Address not found, even at city level');
      }
    }

    const { lat, lng } = response.data.items[0].position;

    return {
      lat: lat,
      lng: lng,
      displayName: response.data.items[0].address.label,
    };
  } catch (error) {
    logger.error('Address Geocoding Error:', { error });
    throw error;
  }
};

// 📌 Search Nearby Places using OpenStreetMap (For any method)
export const searchNearbyPlaces = async (
  query: string,
  lat: number,
  lng: number,
  language: string = 'en',
): Promise<{ name: string; lat: number; lng: number; type: string }[]> => {
  try {
    const apiUrl = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=${encodeURIComponent(query)}&limit=10&lang=${language}&apiKey=${apiKey}`;

    const response = await axios.get(apiUrl);

    if (!response.data.items) {
      return [];
    }

    return response.data.items.map((place: HerePlaceItem) => ({
      name: place.title,
      lat: place.position.lat,
      lng: place.position.lng,
      type:
        place.categories?.[0]?.name || place.address?.houseNumber
          ? 'address'
          : 'place',
    }));
  } catch (error) {
    logger.error('Error fetching places:', { error });
    return [];
  }
};
