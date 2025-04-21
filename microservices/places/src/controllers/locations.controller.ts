import express from "express";
import { searchNearbyPlaces, getUserLocationByIP, getCoordinatesFromAddress } from "../services/locations.service";

export const getNearbyPlaces = async (req: express.Request, res: express.Response) => {
    try {
      const { query, lat, lng, language } = req.query;
  
      if (!query || !lat || !lng) {
        res.status(400).json({ error: "Missing query, lat, or lng parameters" });
        return;
      }
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
  
      const places = await searchNearbyPlaces(query as string, latitude, longitude, language as string);
      res.status(200).json({ success: true, places });
    } catch (error: any) {
      console.error("GetNearbyPlaces Error:", error.message);
      res.status(500).json({ error: "Failed to fetch nearby places", details: error.message });
    }
  };

export const getPlacesByIP = async (req: express.Request, res: express.Response) => {
    try {
        const ip = req.ip || req.headers["x-forwarded-for"] || "8.8.8.8"; // Default IP for testing
        const location = await getUserLocationByIP(ip as string);
        if (!location) {
            res.status(400).json({ error: "Could not determine location" });
            return;
        }

        const { query } = req.query;
        if (!query) {
            res.status(400).json({ error: "Missing query parameter" });
            return;
        }

        const places = await searchNearbyPlaces(query as string, location.lat, location.lng);
        res.status(200).json({ success: true, location, places });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 3️⃣ Get Places by Address (Convert Address to Lat/Lng)
export const getPlacesByAddress = async (req: express.Request, res: express.Response) => {
    try {
        const { street, city, state, country, postalCode, query, language } = req.body;

        if (!street || !city || !country || !query) {
            res.status(400).json({ error: "Missing address or query parameter" });
            return;
        }

        const coordinates = await getCoordinatesFromAddress(street, city, state, country, postalCode, language);
        
        if (!coordinates) {
            res.status(400).json({ error: "Invalid address" });
            return;
        }

        const places = await searchNearbyPlaces(query as string, coordinates.lat, coordinates.lng, language as string);

        res.status(200).json({
            success: true,
            location: coordinates.displayName,
            coordinates: { lat: coordinates.lat, lng: coordinates.lng },
            results: places
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
