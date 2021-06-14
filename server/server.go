package server

import (
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

func New() *echo.Echo {
	e := echo.New()
	e.GET("/api", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello world from go http server in browser!")
	})
	e.GET("/g", func(c echo.Context) error {
		rw := c.Response().Writer
		// 受到跨域限制
		resp, err := http.Get("https://github.com/")
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		io.Copy(rw, resp.Body)
		return nil
	})
	return e
}
