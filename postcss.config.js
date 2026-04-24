const purgecss = require('@fullhuman/postcss-purgecss')({
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],

    safelist: [
        'active',
        'show',
        'fade',
        'collapse',
        'collapsing',
        'modal-open',
        /^react-datepicker/,
        /^date-range-picker/,
        /^country-date-range-picker/,
        /^ck/,
        /^ProseMirror/,
        /^swiper/,
        'nav',
        'nav-link',
        'nav-item',
        'tabs-layout',
        'property-grid-tabs',
        /^image-ribbon/,
        /^fa-/,
        /^info-window-/,
        /^custom-info-window-/,
        /^gm-style/,
        /^gm-ui-/,
        /^alert-/
    ]
});
module.exports = {
    plugins: [...(process.env.NODE_ENV === 'production' ? [purgecss] : [])]
};
