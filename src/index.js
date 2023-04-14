/**
 * This script defines a router with two endpoints: one for generating shortened URLs, and one for redirecting to the original URLs.
 * It uses nanoid to generate unique slugs for each shortened URL, and stores them in a Workers KV store.
 * The router uses itty-router to handle incoming requests and dispatch them to the appropriate endpoint.
 */

// Import the required dependencies
import { Router } from 'itty-router';
import { customAlphabet } from 'nanoid';
import { responseStructure, responseRedirectUser } from './util/response/index';

// Create a new router
const router = Router();

// Create a nanoid generator for generating slugs
const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    6,
);

// Define the "generateLink" endpoint for generating shortened URLs
router.post('/generateLink', async (request) => {
    try {
        const bodyContent = await request.json();
        const password = bodyContent.password;
        // eslint-disable-next-line no-undef
        const kv_password = await TOKENs.get('SHORT_URLs_AUTH');
        let slug = nanoid();

        // Check if the user has entered the correct password or not
        if (kv_password !== password) {
            return responseStructure(false, 'Auth Failed', 401);
        }

        // Verify that this slug is not already in use
        const slug_already_exist = async () => {
            // await SHORT_URLs.get(slug) will return null if the slug is new
            // eslint-disable-next-line no-undef
            if (null !== (await SHORT_URLs.get(slug))) {
                slug = nanoid();
                slug_already_exist();
            }
        };
        slug_already_exist();

        if ('url' in bodyContent) {
            // Add the slug to our KV store so it can be retrieved later:
            // eslint-disable-next-line no-undef
            await SHORT_URLs.put(slug, bodyContent.url);
            let shortenedURL = `${new URL(request.url).origin}/${slug}`;
            let responseData = {
                slug,
                shortened: shortenedURL,
            };
            return responseStructure(
                true,
                'Link shortened successfully',
                200,
                responseData,
            );
        } else {
            return responseStructure(false, 'Must provide a valid URL', 400);
        }
    } catch (error) {
        console.log(error);
        return responseStructure(false, 'default error', 500);
    }
});

/**
 * GET endpoint for redirecting to the original URL
 *
 * @param {Object} request - Incoming request object
 * @param {string} request.params.slug - Shortened URL slug to lookup
 *
 * @returns {Object} Response object
 */
router.get('/:slug', async (request) => {
    try {
        // eslint-disable-next-line no-undef
        let originalUrl = await SHORT_URLs.get(request.params.slug);

        if (originalUrl) {
            return responseRedirectUser(originalUrl);
        } else {
            return responseStructure(false, 'Invalid slug key!', 404);
        }
    } catch (error) {
        console.log(error);
        return responseStructure(false, 'default error', 500);
    }
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
*/

/**
 * All unmatched routes endpoint for redirecting to a default URL
 *
 * @returns {Object} Response object
 */
router.all('*', () => responseRedirectUser('https://www.rgpvnotes.in'));

/**
 * Event listener to handle incoming requests and pass them to the router
 */
addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request));
});
