const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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

const url = "https://godofwar.fandom.com/wiki/Category:Abilities_and_Powers"

async function getAbilityList(subcategoryUrl) {
    const $ = await fetchHtml(subcategoryUrl);
    if (!$) return [];

    const abilities = [];
    $('a.category-page__member-link').each((i, element) => {
        const name = $(element).attr('title');
        const url = $(element).attr('href');
        abilities.push({ name, url: `https://godofwar.fandom.com${url}` });
    });

    return abilities;
}

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
async function getAbilityDetails(abilityy) {
    if (abilityy.name.includes('Category')) {
        return null;
    }

    const $ = await fetchHtml(abilityy.url);
    if (!$) return null;

    const name = $('h1.firstHeading').text().trim();
    const image = $('img.pi-image-thumbnail').attr('src');

    const description = [];
    const answersSection = $('div.mw-parser-output section.trfc161').first() || $('div.mw-body-content section.trfc161').first();
    const tocSection = $('div.mw-parser-output div.toc').first() || $('div.mw-body-content div.toc').first();

    const quote = $('div.mw-parser-output table.cquote').first();
    const infobox = $('div.mw-parser-output aside.portable-infobox').first();

    if (true) {
        if (quote.length > 0) {
            quote.nextUntil(tocSection).each((i, element) => {
                description.push($(element).text().trim());
            });
        } else {
            infobox.nextUntil(tocSection).each((i, element) => {
                description.push($(element).text().trim());
            });
        }
    } 

    const ability = {
        name,
        description: description,
        image,
    };
    console.log(ability);
    return ability;
}

getAbilityDetails({ name: 'Army of Hades', url: 'https://godofwar.fandom.com/wiki/Army_of_Hades' });


async function main() {
    try {
        const Abilities = await getAbilityList(url);
        for (const ability of Abilities) {
            const details = await getCharacterDetails(character);
            if (details) {
                saveCharacterDetails(details);
            }
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}