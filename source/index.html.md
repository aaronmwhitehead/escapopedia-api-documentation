---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript/axios

toc_footers:
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# Introduction

Welcome to the Escapopedia API! You can use our API to access Escapopedia endpoints, which can get information on Rooms, Companies, Locations, and Franchises across the escape room universe.

We have example requests in JavaScript, which you can view in the dark area on the right side of the page.

Check out the [Enpoints](https://aaronmwhitehead.github.io/escapopedia-api-documentation/#endpoints) section for examples.

## Basics
Each request uses the same request pattern for its body. The four attributes contained in the body are `fields`, `limit`, `offset`, and `query`. The value of these attributes change between endpoints, but a general description is shown below.
### Request Body

Parameter | Default | Description
--------- | ------- | -----------
fields | All | An array of the specific data fields that you want to return.
limit | 10 | The number of results you would like to return.
offset | 0 | The number of results you would like to skip.
query | { } | An object that contains the data you want to search for.

# Endpoints

## Companies

Get information on individual escape room companies.

```javascript
axios({
  url: "https://escapopedia.herokuapp.com/companies",
  method: 'POST',
  headers: {
      'Accept': 'application/json',
  },
  data: {
    'fields': [],
    'query': {},
    'offset': 0, 
    'limit': 1
  }
})
  .then(response => {
      console.log(response.data);
  })
  .catch(err => {
      console.error(err);
  });
```

### Request URL

`http://escapopedia-herokuapp.com/companies`

Field | Type | Description
--------- | ------- | -----------
franchises | Array of reference IDs to Franchise | The Franchises that belong to the company
locations | Array of reference IDs to Location | The Locations where the company has Franchises
name | String | The name of the company
reviews | Array of Strings | Reviews of the company
rooms | Array of reference IDs to Room | The Rooms that belong to the company
slug | string | A url-safe, unique, lower-case version of the name

## Franchises

Get information on individual escape room franchises.

```javascript
axios({
  url: "https://escapopedia.herokuapp.com/franchises",
  method: 'POST',
  headers: {
      'Accept': 'application/json',
  },
  data: {
    'fields': [],
    'query': {},
    'offset': 0, 
    'limit': 1
  }
})
  .then(response => {
      console.log(response.data);
  })
  .catch(err => {
      console.error(err);
  });
```

### Request URL

`http://escapopedia-herokuapp.com/franchises`

Field | Type | Description
--------- | ------- | -----------
address | String | The address of the franchise
company | Reference ID to company | The Company that the franchise belongs to
lat | Number | The latitude of the franchise
lon | Number | The longitude of the franchise
location | Reference ID to Location | The Location that the franchise belongs to 
phone | String | The phone number of the franchise
rooms | Array of reference IDs to Room | The Rooms located at the franchise
website | String | The url leading to the website of the franchise

## Locations

Get information on locations across the US that have escape rooms.

```javascript
axios({
  url: "https://escapopedia.herokuapp.com/locations",
  method: 'POST',
  headers: {
      'Accept': 'application/json',
  },
  data: {
    'fields': [],
    'query': {},
    'offset': 0, 
    'limit': 1
  }
})
  .then(response => {
      console.log(response.data);
  })
  .catch(err => {
      console.error(err);
  });
```

### Request URL

`http://escapopedia-herokuapp.com/locations`

Field | Type | Description
--------- | ------- | -----------
city_name | String | The name of the city or area
companies | Array of reference IDs to Company | The Companies that have a Franchise at the location
country | String | Country of the location
franchises | Reference ID to Franchise | The Franchises that have a Room in the location
rooms | Array of reference IDs to Room | The Rooms that have Companies or Franchises in the location
state | String | The state of the location

## Rooms

Get information on individual escape rooms.

```javascript
axios({
  url: "https://escapopedia.herokuapp.com/rooms",
  method: 'POST',
  headers: {
      'Accept': 'application/json',
  },
  data: {
    'fields': [],
    'query': {},
    'offset': 0, 
    'limit': 1
  }
})
  .then(response => {
      console.log(response.data);
  })
  .catch(err => {
      console.error(err);
  });
```

### Request URL

`http://escapopedia-herokuapp.com/rooms`

Field | Type | Description
--------- | ------- | -----------
company | Reference ID to Company | The Company that the room belongs to
description | String | A short description of the room 
difficulty | Integer | Value on scale from 1-4 representing difficulty of room
franchise | Reference ID to Franchise | The Franchise the the game belongs to
images | Array of image URLs | Promotional images of the room
location | Reference ID to Location | The Location that the room belongs to 
max_players | Integer | The maximum number of players that are allowed to play the room
min_players | Integer | The minimum number of players that are needed to play the room
name | String | The name of the room
reviews | Array of Strings | Reviews of the room
slug | string | A url-safe, unique, lower-case version of the name
tags | Array of Strings | Related entries in the database
time_limit | Integer | Total amount of time given to escape the room

# Reference

## Queries
You can add a query to your request to return only specific data. This query is an object where each key is a field belonging to the route that you are making a request to.

For example, if you want to only query rooms where `max_players` is `7`, the `query` attribute in your request would be

<aside>
  query: { max_players: 7 }
</aside>

Escapopedia also supports all queries referenced in the [MongoDb Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/) page. 