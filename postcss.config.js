const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],

    safelist: ['active', 'show', 'fade', 'collapse', /^swiper/, 'nav', 'nav-link', 'nav-item', 'tabs-layout', 'property-grid-tabs', /^fa-/]
});
module.exports = {
    // plugins: [purgecss]
    plugins: [...(process.env.NODE_ENV === 'production' ? [purgecss] : [])]
};
