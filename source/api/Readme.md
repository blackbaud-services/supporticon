# Goals

The aim of this library is to allow us to consistently and easily fetch data from the Supporter API.

# Params

This library aims to provide consistent params for all endpoints, removing small differences in param
names and expected values from one endpoint to the next.

- **campaign** expects a single campaign UID, or an array of campaign UIDs
- **charity** expects a single campaign UID, or an array of charity UIDs
- **group** expects a single group value, or an array of group values
- **type** will take either *team*, *individual* or *all*
