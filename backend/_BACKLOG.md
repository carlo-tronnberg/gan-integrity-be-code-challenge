# Backlog

### ✅ US1 - Get distance between two cities

#### ✅ UAT1.1 - Getting the distance between two coordinates

```
  Given two GPS coordinates <lat1>, <lon1> and <lat2>, <lon2>
  When calling the getDistanceFromLatLonInKm function
  Then the distance returned should be <distance> km
```

### ⚠ US2 - General API features

#### ⚠ UAT2.1 - API Health endpoint

```
  Given an API consumer
  When calling the health endpoint
  Then it should be successful
```
#### ⚠ UAT2.2 - The API <endpoint> is called without authentication token

```
  Given an API consumer
  When calling an endpoint without authentication token
  Then it should return a 401 Unauthorized Access code
```

### ⚠ US3 - Search cities

#### ⚠ UAT3.1 - The API is called with authentication but non-existing tag

```
  Given an API consumer
  And an authentication token
  And a non-existing tag
  When calling the cities_by_tag endpoint with that tag
  Then it should return a 404 Not Found code
```

#### ⚠ UAT3.2 - The API is called with auhtentication and existing tag


```
  Given an API consumer
  And an authentication token
  And an existing tag
  When calling the cities_by_tag endpoint with that tag
  Then it should return a 200 HTTP OK code
  And the corresponding unique JSON entry
```