# Development Process (Quick'n' Dirty)
### Requirements
- [Intellij 15 Community Edition](https://www.jetbrains.com/idea/download/)
- [Golang Intellij Plugin](https://plugins.jetbrains.com/plugin/5047?pr=idea)
- [Go SDK](https://golang.org/dl/)
- [Vagrant](https://www.vagrantup.com/downloads.html)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

### Explanation
Because it's easier to have a Linux host running docker, we will spin up a simple Vagrant Box, which acts as host for the docker containers.

Our Go App will run inside a container on that Vagrant Box. The App listens for requests on a specific port (8080).

For easier development, there is a kind of proxy, called [Gin](https://github.com/codegangsta/gin), that will recompiles the Go app inside the docker container, when file changes occur (Normally you would have to do it on your own on every file change).

Inside the docker container Gin listens currently on port 3000 and will proxy requests to the app port 8080.
When starting the docker container, we map the port 80 of the host to port 3000 inside the container.

This makes it possible to access the app, by pointing the browser to [http://192.168.33.10/cool] (The IP is configured in the Vagrantfile)

```sh
  host (80) <--> gin (3000) <--> go app (8080)
|________80|<-->|3000________________________|
vagrant box            docker container
```