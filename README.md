# CU Fries
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Find your favorite french fries in Clemson University dining halls. Check out the website at [cufries.com](https://cufries.com).

## Features

- Select favorite types of fries
- View where and when they're being served
- Update your french fry preferences

## Tech Stack

CU Fries uses the Next.js framework, which provides server-side rendering and routing. It allows the front-end and back-end to be combined into a single web server. Front-end routes use jsx and React to render the pages. The back-end paths use a custom format provided by Next.js, but it is similar to the Express.js framework. The fetching and processing of data from CampusDish is done by a custom-build executable written in Rust for performance. The data is cached locally in JSON files to reduce requests to CampusDish.


## Background

This project was built for CUHackIt 2023. We wanted to create simple web application that has wide appeal, and that Clemson students would find useful. We noticed that a staple dish for students at the dining hall was the french fries. Who doesn't love french fries? They serve all different types at the three different dining halls, and everyone has their preference.

## Installation and Local Hosting (Without Docker)
The following are required to run the server:
- Node.js
- npm
- Rust/cargo

1. Clone the respository
2. Run `npm install` in the root directory
3. Run `npm run build` (for production build)
4. Build the rust executable by moving into the `rust` directory and running `cargo build --release`. *(Ignore the release if you are debuggging the rust executable. Note that perfomance is greatly increased by using --release.)*
5. Move back to the root directory and run `npm run start` (for production build) or `npm run dev` (for development build). The server will be hosted on port 3004.

### Local Folders
The following folders will be created and used when the server is run, but are not included with the repository.
- `json` - Contains the information about the menu items. The files in this folder act as a cache for the data from the Clemson University dining website.
