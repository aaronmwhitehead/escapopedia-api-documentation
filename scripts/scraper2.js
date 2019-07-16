const cheerio = require("cheerio");
const axios = require("axios");
const retry = require('axios-retry');
const mongoose = require('mongoose');
const Company = require('../models/company');
const Location = require('../models/location');
const Room = require('../models/room');
const Franchise = require('../models/franchise');
const request = require('request');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

// cloudinary.config({
//     cloud_name: 'dedgerky',
//     api_key: '757979452591623',
//     api_secret: 'LP3rX9cErL2njlRrG8V7tJq-QX4'
// });
cloudinary.config({
    cloud_name: 'sleep',
    api_key: '291156887743347',
    api_secret: 'By_XWijuXcggY5CQwsyHvYyqA-4'
});

const baseUrl = 'https://worldofescapes.com';
retry(axios);
// mongodb+srv://aaronwhitehead4:aaron18237!@escapopedia-hpxpy.mongodb.net/test?retryWrites=true&w=majority
// mongodb://127.0.0.1:23456/escapopedia
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://127.0.0.1:23456/escapopedia', {
    useNewUrlParser: true,
    useCreateIndex: true
});
var image_urls = [];
var image_objs = [];

Room.deleteMany({}).catch((err) => { console.log('Cannot delete Room documents.') });
Company.deleteMany({}).catch((err) => { console.log('Cannot delete Company documents.') });
Location.deleteMany({}).catch((err) => { console.log('Cannot delete Location documents.') });
Franchise.deleteMany({}).catch((err) => { console.log('Cannot delete Franchise documents.') });

const getResults = async (url) => {
    console.log('here')
    const company_urls = [];

    await axios.get('https://worldofescapes.com/map')
        .then(response => {
            return cheerio.load(response.data);
        })
        .then(($) => {
            return $('.city-item');
        })
        .then((response) => {
            response.each(async (index, element) => {
                await Location({ city_name: element.children[1].children[0].data }).save();
            })
        })
        .catch((err) => {
            return console.log(new Error(err));
        })

    await axios.get(url)
        .then(response => {
            return cheerio.load(response.data);
        })
        .then(($) => {
            return $('.item-box-desc');
        })
        .then((companies) => {
            console.log(companies.length, ' companies');
            companies.each((index, company) => {
                const company_name = company.children[0].children[0].children[0].data;
                const company_href = company.children[0].children[0].attribs.href.replace('/companies/', '');
                company_urls.push(company.children[0].children[0].attribs.href);
                Company({ name: company_name, slug: company_href }).save();
            })
        })
        .catch((err) => {
            console.log(`Unable to connect to ${url}`);
        });
    
    company_urls.forEach(async (url, index) => {
        setTimeout(async() => {
            // ================= MAKE REQUEST TO COMPANY URLS
            await axios.get(baseUrl + url)
                .then((response) => {
                    return cheerio.load(response.data);
                })
                .then(($) => {
                    return $('.item-box-desc');
                })
                .then(async (rooms) => {
                    const room_hrefs = [];
                    await rooms.each(async (index, room) => {
                        const room_href = await room.prev.children[0].attribs.href;
                        await room_hrefs.push(room_href);

                        const room_name = await room.children[0].children[0].attribs.title;
                        const room_company = await room.children[2].attribs.title;
                        const room_city = await room.children[4].children[1].children[0].data;
                        var location_id;
                        var company_id;
                        var slug = await room_href.match(/\/quests\/.+/g)[0].replace(/\/quests\//, '').toLowerCase();

                        await Location.findOne(({ city_name: room_city }))
                            .then(async (location) => {
                                location_id = await location._id;
                            });

                        await Company.findOne(({ name: room_company }))
                            .then(async (company) => {
                                company_id = await company._id;
                            });

                        await Room({ name: room_name, location: location_id, company: company_id }).save()
                            .then(async (room) => {
                                await Location.findOneAndUpdate({ city_name: room_city }, { $addToSet: { rooms: room._id } })
                                    .then(async (location) => {
                                        await Company.findOneAndUpdate({ name: room_company }, { $addToSet: { locations: location._id } });
                                    })
                                await Company.findOneAndUpdate({ name: room_company }, { $addToSet: { rooms: room._id } });
                            })
                            .catch((err) => {
                                return console.log(new Error(err));
                            })

                        // Add slug to room document
                        await Room.findOneAndUpdate({ name: room_name, location: location_id, company: company_id }, {
                            slug: slug
                        })
                    })
                    return room_hrefs;
                })
                .then(async (room_hrefs) => {
                    const rooms_length = await room_hrefs.length;

                    await room_hrefs.forEach(async (href, index) => {
                        var $;
                        // =================== MAKE REQUEST TO ROOM URLS
                        await axios.get(`${baseUrl}${href}`)
                            .then(async (response) => {
                                $ = await cheerio.load(response.data);
                            })
                            .then(async () => {
                                // Make the franchise
                                const address_selector = '[data-content="address"]';
                                const phone_selector = '[data-content="phone"]';
                                var franchise_exists;

                                const address = $(address_selector).text().replace('(Show on map)', '').trim();
                                const phone = $(phone_selector).text().replace(' ', '').replace(/\(/g, '').replace(/\)/g, '-').replace(' ', '');

                                await Franchise.findOne({ phone: phone })
                                    .then((franchise) => {
                                        if (!franchise) {
                                            franchise_exists = false;
                                        } else {
                                            franchise_exists = true;
                                        }
                                    })

                                if (await !franchise_exists) {
                                    await Franchise({ address: address, phone: phone }).save();
                                }
                            })
                            .then(async () => {
                                var room_id, franchise_id, company_id, location_id;
                                const address = await $('[data-content="address"]').text().replace('(Show on map)', '').trim();
                                const phone = $('[data-content="phone"]').text().replace(' ', '').replace(/\(/g, '').replace(/\)/g, '-');
                                const city_name = await $('.dropdown-toggle b').text();
                                const company_name = await $('.company b').text();
                                const company_slug = await $('.company b a')[0].attribs.href.replace('/companies/', '');
                                const description = await $('.description').text().replace('Description:', '').trim();
                                const difficulty = await $('.quest-map script')[0].children[0].data.match(/fa-key/g).length;

                                // TODO: Use puppeteer to get fear level
                                const fear_level = await 0;

                                const min_players = await $('[data-content="participants-count"] .td')[0].children[0].data.match(/[0-9]+/g)[0];
                                const max_players = await await $('[data-content="participants-count"] .td')[0].children[0].data.match(/[0-9]+/g)[1];
                                var room_country;
                                const room_name = await $('.product-title').text().replace('Escape game ', '');
                                var room_state;
                                var room_website = $('.contacts script')[0].children[0].data.match(/htt\w+:\/\/\w+.\w+/g)[0].trim();
                                const tags = [];
                                await $('.tags-2 li').each((index, element) => {
                                    tags.push($(element).text().toLowerCase());
                                })
                                const time_limit = await $('[data-content="time"] .td')[0].children[0].data.match(/[0-9]+/g)[0];

                                // Grab lat and lon from script tag
                                const lat_franchise = await $('.quest-map script')[0].children[0].data.match(/latitude:\s+-[0-9]+.[0-9]+|latitude:\s+[0-9]+.[0-9]+/g)[0].replace('latitude:', '').trim();
                                const lon_franchise = await $('.quest-map script')[0].children[0].data.match(/longitude:\s+-[0-9]+.[0-9]+|longitude:\s+[0-9]+.[0-9]+/g)[0].replace('longitude:', '').trim();

                                await states.forEach((state) => {
                                    if (address.includes(state)) {
                                        room_state = state;
                                        room_country = 'United States'
                                    }
                                });

                                // Get franchise_id
                                await Franchise.findOne({ phone: phone })
                                    .then(async (franchise) => {
                                        franchise_id = await franchise._id;
                                    })
                                    .catch((err) => {
                                        return console.log(new Error(err));
                                    })

                                // Get company_id
                                await Company.findOne({ name: company_name, slug: company_slug })
                                    .then(async (company) => {
                                        company_id = await company._id;
                                    })
                                    .catch((err) => {
                                        return console.log(new Error(err));
                                    })

                                // Get location_id
                                await Location.findOne({ city_name: city_name })
                                    .then(async (location) => {
                                        location_id = await location._id;
                                    })
                                    .catch((err) => {
                                        return console.log(new Error(err));
                                    })

                                // Get room_id
                                await Room.findOne({ name: room_name, company: company_id, location: location_id })
                                    .then(async (room) => {
                                        room_id = await room._id;

                                        // Add room to franchise
                                        await Franchise.findOneAndUpdate({ address: address }, { $addToSet: { rooms: room._id } });

                                        // Add franchise to room 
                                        room.franchise = await franchise_id;
                                        await room.save();
                                    })
                                    .catch((err) => {
                                        return console.log(new Error(err));
                                    })

                                await console.log(`\tStarting:     Room: ${href}`)

                                //================== CODE FOR DOWNLOADING IMAGES
                                var imgs = await $('img');

                                await imgs.each(async (index, img) => {
                                    try {
                                        var imgurl = await img.attribs.src;

                                        if (await imgurl.includes('medium')) {
                                            // await console.log(imgurl);

                                            // Save the image in Cloudinary
                                            if (await !image_urls.includes(imgurl)) {
                                                await image_urls.push(imgurl);
                                                await cloudinary.uploader.upload(imgurl, { folder: 'escape' }, (err, result) => {
                                                    if (err) {
                                                        return console.log(JSON.stringify(new Error(err), null, 4));
                                                    }

                                                    // Push the URL of the image into the images field of the room
                                                    Room.findOneAndUpdate({ _id: room_id }, {
                                                        $addToSet: { images: result.url }
                                                    }).catch((err) => {
                                                        return console.log(new Error(err));
                                                    })
                                                });
                                            }
                                        }
                                    } catch (err) {
                                        return console.log(JSON.stringify(new Error(err), null, 4));
                                    }

                                })
                                //==============================================

                                // Update room - DONEish
                                await Room.findOneAndUpdate({ _id: room_id }, {
                                    description: description,
                                    difficulty: difficulty,
                                    franchise: franchise_id,
                                    max_players: max_players,
                                    min_players: min_players,
                                    tags: tags,
                                    time_limit: time_limit,
                                })

                                // Update the company - DONE
                                await Company.findOneAndUpdate({ _id: company_id }, {
                                    $addToSet: { franchises: franchise_id },
                                    rooms_count: rooms_length,
                                    country: room_country,
                                    state: room_state
                                }).catch((err) => {
                                    return console.log(new Error(err));
                                })

                                // Update the location
                                await Location.findOneAndUpdate({ _id: location_id }, {
                                    $addToSet: { franchises: franchise_id },
                                    $addToSet: { companies: company_id },
                                }).catch((err) => {
                                    return console.log(new Error(err));
                                })

                                // Update the franchise - DONE
                                await Franchise.findOneAndUpdate({ _id: franchise_id }, {
                                    company: company_id,
                                    location: location_id,
                                    website: room_website,
                                    lat: lat_franchise,
                                    lon: lon_franchise
                                }).catch((err) => {
                                    return console.log(new Error(err));
                                })

                                await console.log(`\tFinishing:     Room: ${href}`)

                                var result = await {
                                    href: href,
                                    location: location_id,
                                    company: company_id,
                                    room: room_id,
                                    franchise: franchise_id
                                }
                                // console.log(`\t${result}`)


                            })
                            .catch((err) => {
                                return console.log(new Error(err));
                            })
                    })

                })
                .catch((err) => {
                    return console.log(new Error(err));
                })
        }, 4000*index)
    });
};

getResults(baseUrl + '/companies');