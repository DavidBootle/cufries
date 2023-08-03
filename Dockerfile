# davidbootle/cufries

# This Dockerfile is multistage. It first builds the rust executable in a rust container, then copies the executable into the node container where the app is run.

# Stage 1. Build rust
# Note: This is using the node image instead of the rust image because the rust image is built with a different version of openssl, and once compiled,
# the executable will not run in the node container.
# The workaround is to build the executable in an identical copy of the container it will run it.
# However, everything except the final executable itself is thrown out for the final image.
FROM node:latest AS rustbuilder

# Install rust
WORKDIR /usr/local/rust
RUN curl https://sh.rustup.rs -sSf > rustup
RUN sh rustup -y

# Copy source code into the container and build the executable
WORKDIR /usr/src/rust-app
COPY ./rust .
RUN ${HOME}/.cargo/bin/cargo build --release

# Stage 2. Build node
FROM node:latest AS node

# Copy the package files and install packages
WORKDIR /usr/src/app

COPY ./package*.json .
RUN npm ci

# Copy the executable from the rust container
COPY --from=rustbuilder /usr/src/rust-app/target/release/menuparser ./executable/menuparser
ENV MENUPARSER_EXECUTABLE_PATH=/usr/src/app/executable/menuparser
# Copy the rest of the files from the rust container
COPY . .
# Remove unnecessary directories from the container
RUN rm -rf ./rust

# Build the app
RUN npm run build

EXPOSE 3004

CMD ["npm", "run", "start"]