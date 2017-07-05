# Backend setup

This directory defines the setup for running backend components.

The setup assumes a Compose-based environment. All server components are Compose containers.

## Requirements

Please make sure you install `docker` and `docker-compose` on the host machine before proceeding.

## Customize the setup

Edit the `.env` file and make sure variables with the `DIR_` prefix are pointing at the correct component directories. The default values assume that the `devops` repo has been checked-out alongside the dirs of the other components, eg. `devops/` and `backend-api/` are next to each other.

## Running the server components

Use Compose commands to deal with the components.

You are advised to create an alias to the `docker-compose` command, such as `alias dc=docker-compose`.

A quick overview of the most typical commands (substitute `dc` for `docker-compose` if you haven't created the alias):

* `dc up -d` will build and start all containers.
* `dc ps` will show their names and status. Their `Status` should be `Up` in a successful setup. See the `Ports` column to find out how to connect to each of them.
* `dc build` will rebuild a container if you change its Dockerfile or the `.yaml` setup.
* `dc logs -f --tail=0` will follow logs.
* `dc down` will stop containers and remove all transient files.
* `dc restart`, `dc start`, `dc stop` will restart/start/stop containers without rebuilding/removing transients.
* `dc exec container-name command` will execute a command inside that container. See `dc ps` for container names (please note that the name for a container such as `backend_node_1` is actually `node`). A typical useful command for exploring inside a container is `/bin/bash`.
* Most commands above can take a container name as further argument, in case you want to only do something about a specific container.

## Files

* `.env`: Defines various environment variables which are used to control and customize the installation.
  * The variables defined here will be passed to both the Compose setup as well as to all the containers. Please see the comments inside the file for further details.
  * Please remember that you need to `dc down` and `dc up -d` containers in order to pick up the updated values.
  * Please keep this file well-documented.
* `docker-compose.yaml`: The main definition for all containers and how they are linked together.
* `Dockerfile-*`: Build instructions for specific environments. See the `.yaml` definition to see which is used by which container.
  * `Dockerfile-node`: defines a common NodeJS environment which is used by all the node-based containers.
