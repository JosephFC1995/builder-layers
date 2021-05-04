export default {
  head: {
    title: "builder",
    htmlAttrs: {
      lang: "es"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ],
    script: []
  },

  css: [
    "@/assets/scss/app.scss"
  ],

  plugins: [
    {
      src: "@/plugins/vue-hammer", mode: "client"
    },
    {
      src: "@/plugins/svg", mode: "client"
    },
    {
      src: "@/plugins/interact", mode: "client"
    }
  ],

  styleResources: {
    scss: ["./assets/scss/*.scss"]
  },

  components: true,

  buildModules: ["@nuxt/typescript-build", "nuxt-windicss"],

  modules: ["@nuxtjs/axios", "@nuxtjs/style-resources"],

  axios: {},

  build: {}
};
