// +build js,wasm
package main

import (
	"app/server"

	wasmhttp "github.com/nlepage/go-wasm-http-server"
)

func main() {
	e := server.New()
	wasmhttp.Serve(e.Server.Handler)
	select {}
}
