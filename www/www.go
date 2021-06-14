package www

import (
	"embed"
	"net/http"

	"github.com/labstack/echo/v4"
)

//go:embed *
var staticFS embed.FS

func Static(e *echo.Echo) {
	assetHandler := http.FileServer(http.FS(staticFS))
	e.GET("/", echo.WrapHandler(assetHandler))
	e.GET("/*", echo.WrapHandler(assetHandler))
}
