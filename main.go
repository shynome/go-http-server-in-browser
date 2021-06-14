package main

import "app/server"

func main() {
	e := server.New()
	e.Start(":8081")
}
