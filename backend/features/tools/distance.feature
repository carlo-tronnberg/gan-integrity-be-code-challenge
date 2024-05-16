Feature: Get distance between two cities

    Scenario Outline: Getting the distance between two coordinates
        Given two GPS coordinates <lat1>, <lon1> and <lat2>, <lon2>
        When calling the getDistanceFromLatLonInKm function
        Then the distance returned should be <distance> km

        Examples:
            | lat1       | lon1        | lat2      | lon2        | distance |
            | -1.409358  | -37.257104  | -3.456789 | -47.123456  | 1119.43  |
            | 82.231721  | -108.885769 | -1.537027 | 69.81473    | 11042.02 |
            | -11.286233 | 2.2142      | 65.807974 | -164.068787 | 13863.32 |
