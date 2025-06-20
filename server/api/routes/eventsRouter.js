import express from "express";
import axios from "axios";
import { vibeMappings } from "../../../client/src/data/vibes.js";

const eventsRouter = express.Router();

const url = "https://app.ticketmaster.com";
const apiKey = process.env.API_KEY;

eventsRouter.get("/", async (req, res, next) => {
  try {
    const { cityId, vibe, page } = req.query;
    const vibeFilters = vibe.split(",");

    // Get data of all events for each city
    const response = await axios.get(`${url}/discovery/v2/events`, {
      params: {
        apikey: apiKey,
        marketId: cityId,
        page,
      },
    });
    const data = response.data;

    // Organize events classfications based on user's selected vibes into an array
    let filteredClassifications = [];

    if (vibe !== "all vibes") {
      const vibeMappingsArray = Object.entries(vibeMappings);
      const filteredVibeMappingsArray = vibeMappingsArray.filter(
        (vibeMapping) => vibeFilters.includes(vibeMapping[0].toLowerCase())
      );

      const classifications = [];
      filteredVibeMappingsArray.forEach((vibeMapping) => {
        classifications.push(vibeMapping[1]);
      });

      // Add multi-filters logic
      if (vibeFilters.length > 1) {
        filteredClassifications = classifications[0].filter((classification) =>
          classifications.every((classificationArray) =>
            classificationArray.includes(classification)
          )
        );
      } else {
        filteredClassifications = classifications[0];
      }
    }

    // Save dataset info
    let nextDataset = data._links?.next?.href;

    // Filter events from data based on user's selected vibes, make each page contain at least 20 events
    let filteredEvents = [];

    if (vibe !== "all vibes") {
      const events = data._embedded?.events || [];
      filteredEvents = events.filter((event) => {
        if (!event.classifications) return false;

        const { classifications } = event;

        return classifications.some(
          (classification) =>
            filteredClassifications.includes(classification.segment?.name) ||
            filteredClassifications.includes(classification.genre?.name) ||
            filteredClassifications.includes(classification.subGenre?.name) ||
            filteredClassifications.includes(classification.type?.name) ||
            filteredClassifications.includes(classification.subType?.name)
        );
      });

      // If there is a next dataset, get the next dataset and filter. We are doing 5 loops max here bc it would take too long to filter through every page of events from the api
      let loopCount = 0;
      const maxLoops = 5;

      while (
        nextDataset &&
        filteredEvents.length < 100 &&
        loopCount < maxLoops
      ) {
        const reqUrl = `${url}${nextDataset}&apikey=${apiKey}`;

        const currentResponse = await axios.get(reqUrl);
        const currentData = currentResponse.data;

        const events = currentData._embedded?.events || [];
        const moreFilteredEvents = events.filter((event) => {
          if (!event.classifications) return false;

          const { classifications } = event;

          return classifications.some(
            (classification) =>
              filteredClassifications.includes(classification.segment?.name) ||
              filteredClassifications.includes(classification.genre?.name) ||
              filteredClassifications.includes(classification.subGenre?.name) ||
              filteredClassifications.includes(classification.type?.name) ||
              filteredClassifications.includes(classification.subType?.name)
          );
        });

        filteredEvents.push(...moreFilteredEvents);

        nextDataset = currentData._links?.next?.href;

        loopCount++;
      }
    }

    if (vibe !== "all vibes") return res.json({ data: filteredEvents });

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

eventsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${url}/discovery/v2/events/${id}`, {
      params: {
        apikey: apiKey,
      },
    });
    const data = response.data;

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default eventsRouter;
