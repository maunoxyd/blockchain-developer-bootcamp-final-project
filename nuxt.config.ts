import { Configuration } from '@nuxt/types';
import { VuesionConfig } from '@vuesion/models';

const themeColor = '#0f3191';

const config: Configuration = {
  apollo: {
    clientConfigs: {
      default: '@/plugins/apollo/apollo-client-config.ts',
    },
  },
  auth: {
    cookie: {
      options: {
        expires: 365,
        secure: true,
      },
    },
    localStorage: null,
    redirect: {
      login: '/',
      logout: '/',
      callback: '/',
      home: '/app/gigs',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'accessToken',
          maxAge: 1800,
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken',
          maxAge: 60 * 60 * 24,
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: { url: `${process.env.NUXT_ENV_API}/auth/authenticate`, method: 'post' },
          refresh: { url: `${process.env.NUXT_ENV_API}/auth/refresh`, method: 'post' },
          user: { url: `${process.env.NUXT_ENV_API}/users/me`, method: 'get' },
          logout: false,
        },
        autoLogout: true,
      },
    },
    plugins: ['@/plugins/axios/request-interceptor', '@/plugins/axios/response-interceptor'],
  },
  build: {
    extractCSS: true,
    loaders: {
      cssModules: {
        modules: {
          localIdentName: process.env.NODE_ENV !== 'production' ? '[local]_[hash:base64:4]' : '[hash:base64:4]',
        },
      },
    },
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
    transpile: ['vee-validate/dist/rules', '@vue/apollo-composable'],
  },
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api',
    '@nuxtjs/eslint-module',
    '@nuxtjs/html-validator',
    '@nuxtjs/color-mode',
    '@nuxtjs/moment',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  css: [],
  head: {
    title: process.env.npm_package_name || '',
    link: [
      {
        rel: 'preload',
        as: 'style',
        onload: 'this.onload=null;this.rel="stylesheet"',
        href:
          'https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,800|Lora:300,400,500,600,700,800&display=swap',
      },
    ],
  },
  htmlValidator: {
    usePrettier: false,
    options: {
      extends: ['html-validate:document', 'html-validate:recommended', 'html-validate:standard'],
      rules: {
        'svg-focusable': 'off',
        'no-unknown-elements': 'error',
        'void-style': 'off',
        'no-trailing-whitespace': 'off',
        'require-sri': 'off',
        'attribute-boolean-style': 'off',
        'doctype-style': 'off',
        'no-inline-style': 'off',
        'prefer-native-element': 'off',
      },
    },
  },
  i18n: {
    strategy: 'no_prefix',
    vueI18n: '@/plugins/vue-i18n/vue-i18n',
    locales: VuesionConfig.i18n.locales,
    defaultLocale: VuesionConfig.i18n.defaultLocale,
    lazy: true,
    langDir: '../i18n/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieDomain: null,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: VuesionConfig.i18n.defaultLocale,
    },
    vuex: {
      moduleName: 'i18n',
      syncLocale: true,
      syncMessages: false,
      syncRouteParams: true,
    },
  },
  loading: { color: themeColor, failedColor: '#75140d' },
  loadingIndicator: {
    name: 'circle',
    color: themeColor,
    background: 'transparent',
  },
  modules: [
    '@nuxtjs/apollo',
    'nuxt-i18n',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    'nuxt-winston-log',
    '@nuxtjs/robots',
  ],
  plugins: [
    { src: '@/plugins/apollo/provide-apollo-client' },
    { src: '@/plugins/vee-validate/vee-validate' },
    { src: '@/plugins/vuex-persist/vuex-persist.client' },
    { src: '@/plugins/vuex-persist/vuex-persist.server' },
    { src: '@/plugins/pwa/update.client' },
    { src: '@/plugins/ethereum/ethereum-connect' },
    { src: '@/components/global' },
  ],
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL || 'https://vuesion.herokuapp.com',
    },
    apollo: {
      baseURL: process.env.GRAPHQL_ENDPOINT || 'https://rickandmortyapi.com/graphql',
    },
  },
  privateRuntimeConfig: {},
  pwa: {
    icon: {
      fileName: 'images/vuesion-logo.png',
    },
    manifest: {
      theme_color: themeColor,
    },
    // handled manually with vue-meta in ./src/pages/index.vue
    meta: {
      name: null,
      description: null,
      lang: null,
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
      ogUrl: null,
      twitterCard: null,
      twitterSite: null,
      twitterCreator: null,
    },
  },
  robots: {
    UserAgent: '*',
    Disallow: '/*?*',
    Allow: '/',
  },
  router: {
    middleware: ['auth'],
  },
  srcDir: 'src',
  serverMiddleware: ['@/api/index.ts'],
  telemetry: false,
  winstonLog: {
    logPath: './logs',
    logName: `${process.env.NODE_ENV}.log`,
    autoCreateLogPath: true,
    useDefaultLogger: true,
    skipRequestMiddlewareHandler: false,
    skipErrorMiddlewareHandler: false,
  },
};

export default config;
