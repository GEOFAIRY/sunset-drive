import copy from "rollup-plugin-copy-assets"

module.exports = {
    build: {
      rollupOptions: {
        plugins: [
          copy({
            assets: [
              "./assets"
            ]
          })
        ]
      }
    }
  }