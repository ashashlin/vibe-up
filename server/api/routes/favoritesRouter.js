import express from "express";
import getUserFromToken from "../../middleware/getUserFromToken.js";
import requireUser from "../../middleware/requireUser.js";
import {
  getEventByEventIdAndUserId,
  getFavoritesByUserId,
} from "../../db/queries/favorites.js";
import { createEvent, getEventById } from "../../db/queries/events.js";
import { createVenue, getVenueById } from "../../db/queries/venues.js";
import {
  createAttraction,
  getAttractionById,
} from "../../db/queries/attractions.js";
import {
  createEventVenue,
  getEventVenueByEventIdAndVenueId,
} from "../../db/queries/eventsVenues.js";
import {
  createEventAttraction,
  getEventAttractionByEventIdAndAttractionId,
} from "../../db/queries/eventsAttractions.js";
import {
  createFavoriteEvent,
  deleteFavoriteEvent,
} from "../../db/queries/favoriteEvents.js";
import { getEventDetailsByEventId } from "../../db/queries/eventDetails.js";

const favoritesRouter = express.Router();

favoritesRouter.use(getUserFromToken);
favoritesRouter.use(requireUser);

favoritesRouter.get("/", async (req, res, next) => {
  try {
    const user = req.user;
    const favorites = await getFavoritesByUserId(user.id);
    res.json({ favorites });
  } catch (error) {
    next(error);
  }
});

favoritesRouter.post("/", async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const event = req.body.event;
    const eventId = event.id;
    const eventName = event.name;
    const eventUrl = event.url;
    const eventImg =
      event.images?.find((img) => img.width > 1000)?.url ||
      event.images?.find((img) => img.width > 600)?.url ||
      event.images?.[0]?.url ||
      null;
    const startLocalDate = event.dates?.start?.localDate;
    const startLocalTime = event.dates?.start?.localTime;

    const favoriteEvent = await getEventByEventIdAndUserId(eventId, userId);
    if (!favoriteEvent) {
      const existingEvent = await getEventById(eventId);
      if (!existingEvent) {
        await createEvent(
          eventId,
          eventName,
          eventUrl,
          eventImg,
          startLocalDate,
          startLocalTime
        );
      }

      const venues = event._embedded?.venues;
      if (venues) {
        const existingVenues = [];
        for (const venue of venues) {
          const existingVenue = await getVenueById(venue.id);
          if (existingVenue) {
            existingVenues.push(venue);
          }
        }
        for (const venue of venues) {
          if (!existingVenues.includes(venue)) {
            const venueId = venue.id;
            const venueName = venue.name;
            const venueImg = venue.images?.[0]?.url;
            const venuePostalCode = venue.postalCode;
            const venueAddress = venue.address?.line1;
            const venueCity = venue.city?.name;
            const venueState = venue.state?.name;
            const venueCountry = venue.country?.name;
            const longitude = venue.location?.longitude;
            const latitude = venue.location?.latitude;

            await createVenue(
              venueId,
              venueName,
              venueImg,
              venuePostalCode,
              venueAddress,
              venueCity,
              venueState,
              venueCountry,
              longitude,
              latitude
            );
          }
        }
      }

      const attractions = event._embedded?.attractions;
      if (attractions) {
        const existingAttractions = [];
        for (const attraction of attractions) {
          const existingAttraction = await getAttractionById(attraction.id);
          if (existingAttraction) {
            existingAttractions.push(attraction);
          }
        }
        for (const attraction of attractions) {
          if (!existingAttractions.includes(attraction)) {
            const attractionId = attraction.id;
            const attractionName = attraction.name;
            const attractionImg =
              attraction.images?.find((img) => img.width > 1000)?.url ||
              event.images?.find((img) => img.width > 600)?.url ||
              event.images?.[0]?.url ||
              null;
            const attractionSegment =
              attraction.classifications?.[0]?.segment?.name;
            const attractionGenre =
              attraction.classifications?.[0]?.genre?.name;
            const attractionSubGenre =
              attraction.classifications?.[0]?.subGenre?.name;

            await createAttraction(
              attractionId,
              attractionName,
              attractionImg,
              attractionSegment,
              attractionGenre,
              attractionSubGenre
            );
          }
        }
      }

      if (venues) {
        for (const venue of venues) {
          const venueId = venue.id;
          const eventVenue = await getEventVenueByEventIdAndVenueId(
            eventId,
            venueId
          );
          if (!eventVenue) {
            await createEventVenue(eventId, venueId);
          }
        }
      }

      if (attractions) {
        for (const attraction of attractions) {
          const attractionId = attraction.id;
          const eventAttraction =
            await getEventAttractionByEventIdAndAttractionId(
              eventId,
              attractionId
            );
          if (!eventAttraction) {
            await createEventAttraction(eventId, attractionId);
          }
        }
      }

      await createFavoriteEvent(eventId, userId);
      return res.sendStatus(201);
    } else {
      await deleteFavoriteEvent(eventId, userId);
      return res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});

favoritesRouter.get("/:eventId", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    // Fetch full event details (joined with venue & attraction)
    const eventDetails = await getEventDetailsByEventId(eventId);
    res.json({ eventDetails });
  } catch (error) {
    next(error);
  }
});

favoritesRouter.delete("/:eventId", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    await deleteFavoriteEvent(eventId, userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default favoritesRouter;
