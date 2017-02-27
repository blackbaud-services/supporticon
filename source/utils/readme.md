# Goal

Provide some useful utilities for commonly performed patterns when handling data from the Supporter API.

## Available Utils

There are 2 common utils you will likely utilize when using this library.

- [createAction](./actions/readme.md) takes a fetch function and wraps it in a Redux action creator
- [createReducer](./actions/readme.md) creates a simple Redux reducer that will listen to dispatched actions and manage Supporter data
