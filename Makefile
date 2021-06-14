build:
	rm -f www/server.wasm
	GOOS=js GOARCH=wasm go build -o server.wasm ./wasm
	mv server.wasm www/
serve:
	caddy file-server -root www -listen :8080
