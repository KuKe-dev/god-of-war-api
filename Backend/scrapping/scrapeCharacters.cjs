const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'characters');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CATEGORY_URL = 'https://godofwar.fandom.com/wiki/Category:Characters';

// Helper function to fetch and load HTML content
async function fetchHtml(url) {
    try {
        const response = await axios.get(url);
        return cheerio.load(response.data);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// Function to get subcategories
async function getSubcategories() {
    const $ = await fetchHtml(CATEGORY_URL);
    if (!$) return [];

    const subcategories = [];
    $('a.category-page__member-link').each((i, element) => {
        const title = $(element).attr('title');
        const url = $(element).attr('href');

        if (title.includes('God') && title.includes('Characters')) {
            subcategories.push({
                title,
                url: `https://godofwar.fandom.com${url}`,
            });
        }
    });

    return subcategories;
}

// Function to get the list of characters from a subcategory
async function getCharacterList(subcategoryUrl) {
    const $ = await fetchHtml(subcategoryUrl);
    if (!$) return [];

    const characters = [];
    $('a.category-page__member-link').each((i, element) => {
        const name = $(element).attr('title');
        const url = $(element).attr('href');
        characters.push({ name, url: `https://godofwar.fandom.com${url}` });
    });

    return characters;
}

// Function to extract field data from the character page
function extractFieldData($, selector) {
    const fieldElement = $(selector);
    if (fieldElement.length === 0) return undefined;

    const listElement = fieldElement.children('ul');
    if (listElement.length > 0) {
        const listItems = [];
        listElement.find('li').each((i, element) => {
            listItems.push($(element).text().trim());
        });
        return listItems;
    }

    return fieldElement.text().trim();
}

// Function to get character details
async function getCharacterDetails(character) {
    if (character.name.includes('Characters') || character.name.includes('Category')) {
        return null;
    }

    const $ = await fetchHtml(character.url);
    if (!$) return null;

    const image = $('img.pi-image-thumbnail').attr('src');

    const description = [];
    const answersSection = $('div.mw-parser-output section.trfc161').first() || $('div.mw-body-content section.trfc161').first();
    const tocSection = $('div.mw-parser-output div.toc').first() || $('div.mw-body-content div.toc').first();

    const quote = $('div.mw-parser-output table.cquote').first();
    const infobox = $('div.mw-parser-output aside.portable-infobox').first();

    const getDescription = (startElement, endElement) => {
        startElement.nextUntil(endElement).each((i, element) => {
            description.push($(element).text().trim());
        });
    };
    
    if (answersSection && answersSection.length > 0) { // Verifica si answersSection existe
        if (answersSection.prev().prop('class') === "toc") {
            getDescription(quote.length > 0 ? quote : infobox, tocSection);
        } else {
            getDescription(quote.length > 0 ? quote : infobox, answersSection);
        }
    } else {
        getDescription(quote.length > 0 ? quote : infobox, tocSection);
        // Puedes manejar este caso de otra manera si es necesario
    }

    const fullDescription = description.join('\n');

    const name = extractFieldData($, '.page-header__title');
    const birthplace = extractFieldData($, '[data-source="birthplace"] div.pi-data-value');
    const deathplace = extractFieldData($, '[data-source="deathplace"] div.pi-data-value');
    const location = extractFieldData($, '[data-source="location"] div.pi-data-value');
    const age = extractFieldData($, '[data-source="age"] div.pi-data-value');
    const citizenship = extractFieldData($, '[data-source="citizenship"] div.pi-data-value');
    const nationality = extractFieldData($, '[data-source="nationality"] div.pi-data-value');
    const status = extractFieldData($, '[data-source="status"] div.pi-data-value');

    const race = extractFieldData($, '[data-source="species"] div.pi-data-value');
    const ethnicity = extractFieldData($, '[data-source="ethnicity"] div.pi-data-value');
    const gender = extractFieldData($, '[data-source="gender"] div.pi-data-value');
    const height = extractFieldData($, '[data-source="height"] div.pi-data-value');
    const hair_colour = extractFieldData($, '[data-source="hair colour"] div.pi-data-value');
    const hair_style = extractFieldData($, '[data-source="hair style"] div.pi-data-value');
    const eyebrow_color = extractFieldData($, '[data-source="eyebrow color"] div.pi-data-value');
    const eye_color = extractFieldData($, '[data-source="eye color"] div.pi-data-value');
    const beard_color = extractFieldData($, '[data-source="beard color"] div.pi-data-value');
    const skin_colour = extractFieldData($, '[data-source="skin colour"] div.pi-data-value');

    const biographicalInformation = {
        birthplace, deathplace, location, age, citizenship, nationality, status
    };
    const physicalInformation = {
        race, ethnicity, gender, height, hair_colour, hair_style, eyebrow_color, eye_color, beard_color, skin_colour,
    };

    const characterDetails = {
        name,
        description: fullDescription,
        image,
        biographicalInformation: Object.fromEntries(Object.entries(biographicalInformation).filter(([_, value]) => value)),
        physicalInformation: Object.fromEntries(Object.entries(physicalInformation).filter(([_, value]) => value)),
        wiki: character.url,
    };

    return Object.fromEntries(Object.entries(characterDetails).filter(([_, value]) => value));
}
// Function to save character details to a JSON file
function saveCharacterDetails(details) {
    const fileName = `${details.name.replaceAll(" ", "_")/*.replace(/[^a-zA-Z0-9']/g, '_')*/}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(details, null, 2));
    console.log(`Saved: ${details.name}`);
}

// Main function
async function main() {
    try {
        const subcategories = await getSubcategories();
        for (const subcategory of subcategories) {
            console.log(`Extracting characters from: ${subcategory.title}`);
            const characters = await getCharacterList(subcategory.url);
            for (const character of characters) {
                const details = await getCharacterDetails(character);
                if (details) {
                    saveCharacterDetails(details);
                }
            }
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main();