Feature: Get distance between two cities

    Scenario Outline: Getting the distance between two coordinates
        Given two GPS coordinates <lat1>, <lon1> and <lat2>, <lon2>
        When calling the getDistanceFromLatLonInKm function
        Then the distance returned should be <distance> km

        Examples:
            | lat1       | lon1        | lat2      | lon2        | distance |
            | -1.409358  | -37.257104  | -3.456789 | -47.123456  | 1        |
